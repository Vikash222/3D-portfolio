<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\ClientMessage;
use App\Models\Conversation;
use App\Models\Payment;
use App\Models\ProfileSetting;
use App\Models\ProjectRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class RazorpayPaymentController extends Controller
{
    /**
     * Create a new Razorpay payment record.
     * Uses real Razorpay API order when valid API credentials are present; otherwise uses direct payment link.
     */
    public function createOrder(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'amount' => 'required|numeric|min:1',
            'package_name' => 'nullable|string|max:150',
            'project_request_id' => 'nullable|exists:project_requests,id',
            'notes' => 'nullable|array',
        ]);

        $profile = ProfileSetting::first();
        $paymentLink = $profile?->razorpay_payment_link ?: 'https://razorpay.me/@vikashkumar2049';
        $keyId = trim($profile?->razorpay_key_id ?? '');
        $keySecret = trim($profile?->razorpay_key_secret ?? '');

        $hasValidKeys = !empty($keyId) && !empty($keySecret) && !str_contains($keySecret, '***');

        $receipt = 'rcpt_' . time() . '_' . $user->id;
        $orderId = null;
        $isRealRzpOrder = false;
        $apiError = null;

        if ($hasValidKeys) {
            try {
                $amountSubunits = (int) round($validated['amount'] * 100);
                $rzpResponse = \Illuminate\Support\Facades\Http::withBasicAuth($keyId, $keySecret)
                    ->timeout(8)
                    ->post('https://api.razorpay.com/v1/orders', [
                        'amount' => $amountSubunits,
                        'currency' => 'INR',
                        'receipt' => $receipt,
                        'notes' => array_merge([
                            'package' => $validated['package_name'] ?? 'Freelance Package',
                            'client' => $user->name,
                        ], $validated['notes'] ?? []),
                    ]);

                if ($rzpResponse->successful()) {
                    $rzpData = $rzpResponse->json();
                    $orderId = $rzpData['id'] ?? null;
                    $isRealRzpOrder = true;
                } else {
                    $errorData = $rzpResponse->json();
                    $apiError = $errorData['error']['description'] ?? 'Authentication or Request failed';
                    \Log::warning('Razorpay Order API error: ' . json_encode($errorData));
                }
            } catch (\Exception $e) {
                $apiError = $e->getMessage();
                \Log::error('Razorpay API exception: ' . $e->getMessage());
            }
        }

        if (!$orderId) {
            $orderId = 'rzp_link_' . Str::random(12);
        }

        $projectRequestId = $validated['project_request_id'] ?? null;
        if (!$projectRequestId) {
            $packageName = $validated['package_name'] ?: 'Freelance Package Booking';
            $projectRequest = ProjectRequest::create([
                'user_id' => $user->id,
                'title' => $packageName,
                'category' => 'Freelance Package / Token Booking',
                'budget_range' => '₹' . number_format($validated['amount'], 2),
                'timeline' => 'Standard Sprint',
                'description' => "Client initiated direct booking for {$packageName} (Amount: ₹" . number_format($validated['amount'], 2) . ").",
                'status' => 'submitted',
                'payment_status' => 'unpaid',
            ]);
            $projectRequestId = $projectRequest->id;
        }

        $payment = Payment::create([
            'user_id' => $user->id,
            'project_request_id' => $projectRequestId,
            'razorpay_order_id' => $orderId,
            'amount' => $validated['amount'],
            'currency' => 'INR',
            'status' => 'created',
            'package_name' => $validated['package_name'] ?? 'Custom Freelance Order',
            'receipt' => $receipt,
            'notes' => array_merge([
                'payment_link' => $paymentLink,
                'is_real_api' => $isRealRzpOrder,
            ], $validated['notes'] ?? []),
        ]);

        return response()->json([
            'success' => true,
            'mode' => $isRealRzpOrder ? 'api' : 'link',
            'key_id' => $isRealRzpOrder ? $keyId : null,
            'order_id' => $orderId,
            'payment_id' => $payment->id,
            'project_request_id' => $projectRequestId,
            'payment_link' => $paymentLink,
            'amount' => (int) round($validated['amount'] * 100),
            'amount_inr' => $validated['amount'],
            'currency' => 'INR',
            'package_name' => $payment->package_name,
            'api_error' => $apiError,
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    /**
     * Confirm / Verify payment completed via Razorpay Checkout or Razorpay.me link.
     */
    public function verifyPayment(Request $request): JsonResponse
    {
        $user = $request->user();
        $profile = ProfileSetting::first();

        $validated = $request->validate([
            'payment_id' => 'nullable|integer',
            'project_request_id' => 'nullable|integer',
            'razorpay_order_id' => 'nullable|string',
            'razorpay_payment_id' => 'nullable|string',
            'razorpay_signature' => 'nullable|string',
            'transaction_ref' => 'nullable|string|max:100',
            'notes' => 'nullable|string|max:500',
        ]);

        $payment = null;
        if (!empty($validated['payment_id'])) {
            $payment = Payment::find($validated['payment_id']);
        }
        if (!$payment && !empty($validated['razorpay_order_id'])) {
            $payment = Payment::where('razorpay_order_id', $validated['razorpay_order_id'])
                ->where('user_id', $user->id)
                ->first();
        }

        if (!$payment) {
            $payment = Payment::create([
                'user_id' => $user->id,
                'project_request_id' => $validated['project_request_id'] ?? null,
                'razorpay_order_id' => $validated['razorpay_order_id'] ?? ('rzp_link_' . Str::random(12)),
                'amount' => 4999.00,
                'currency' => 'INR',
                'status' => 'created',
                'package_name' => 'Direct Freelance Advance',
                'receipt' => 'rcpt_' . time() . '_' . $user->id,
            ]);
        } elseif (!empty($validated['project_request_id']) && !$payment->project_request_id) {
            $payment->update(['project_request_id' => $validated['project_request_id']]);
        }

        // Verify cryptographic signature if available
        $signatureVerified = false;
        if (!empty($validated['razorpay_signature']) && !empty($validated['razorpay_order_id']) && !empty($validated['razorpay_payment_id'])) {
            $keySecret = trim($profile?->razorpay_key_secret ?? '');
            if (!empty($keySecret) && !str_contains($keySecret, '***')) {
                $expectedSignature = hash_hmac('sha256', $validated['razorpay_order_id'] . '|' . $validated['razorpay_payment_id'], $keySecret);
                if (hash_equals($expectedSignature, $validated['razorpay_signature'])) {
                    $signatureVerified = true;
                }
            }
        }

        // If NOT cryptographically verified via Razorpay API checkout popup,
        // a valid UTR / Transaction Reference Number is STRICTLY MANDATORY!
        $rawUtr = trim($validated['transaction_ref'] ?? '');
        if (!$signatureVerified && (empty($rawUtr) || strlen($rawUtr) < 6)) {
            return response()->json([
                'success' => false,
                'message' => 'UTR / UPI Transaction Reference Number is strictly required. Please enter the 12-digit UTR from your payment app (Google Pay, PhonePe, Paytm, or Bank).',
            ], 422);
        }

        $transId = $signatureVerified
            ? $validated['razorpay_payment_id']
            : ('UTR: ' . $rawUtr);

        $paymentStatus = $signatureVerified ? 'captured' : 'pending_verification';

        $payment->update([
            'razorpay_payment_id' => $transId,
            'razorpay_signature' => $signatureVerified ? $validated['razorpay_signature'] : 'pending_admin_approval',
            'status' => $paymentStatus,
            'notes' => array_merge($payment->notes ?? [], [
                'submitted_at' => now()->toIso8601String(),
                'signature_verified' => $signatureVerified,
                'client_note' => $validated['notes'] ?? 'Payment submitted by client',
                'utr' => $rawUtr,
            ]),
        ]);

        if ($payment->project_request_id) {
            ProjectRequest::where('id', $payment->project_request_id)->update([
                'payment_status' => $signatureVerified ? 'paid' : 'pending_verification',
                'status' => $signatureVerified ? 'in_progress' : 'pending',
            ]);
        } else {
            $packageName = $payment->package_name ?: 'Freelance Package Booking';
            $pr = ProjectRequest::create([
                'user_id' => $user->id,
                'title' => $packageName,
                'category' => 'Freelance Package / Token Booking',
                'budget_range' => '₹' . number_format($payment->amount, 2),
                'timeline' => 'Standard Sprint',
                'description' => "Client initiated direct booking for {$packageName} (₹" . number_format($payment->amount, 2) . ")." . ($rawUtr ? " • Submitted UTR: {$rawUtr}" : ''),
                'status' => $signatureVerified ? 'in_progress' : 'pending',
                'payment_status' => $signatureVerified ? 'paid' : 'pending_verification',
            ]);
            $payment->update(['project_request_id' => $pr->id]);
        }

        // Post receipt to 1-on-1 Live Conversation with Vikash
        $conversation = Conversation::firstOrCreate(
            ['user_id' => $user->id],
            [
                'subject' => 'Discussion with Vikash Kumar',
                'status' => 'active',
                'last_message_at' => now(),
            ]
        );

        $formattedAmount = number_format($payment->amount, 2);
        if ($signatureVerified) {
            $msgText = "💳 [Razorpay Secure Verified] Amount: ₹{$formattedAmount} for '{$payment->package_name}'.\nPayment ID: {$payment->razorpay_payment_id}\nStatus: Captured & Confirmed";
        } else {
            $msgText = "⏳ [UPI Payment Verification Request] Amount: ₹{$formattedAmount} for '{$payment->package_name}'.\nSubmitted UTR Number: {$transId}\nStatus: Under Review by Vikash Kumar. Once verified against bank records, this order will be activated.";
        }

        ClientMessage::create([
            'conversation_id' => $conversation->id,
            'sender_type' => 'client',
            'sender_id' => $user->id,
            'message' => $msgText,
            'is_read' => false,
        ]);

        $conversation->update(['last_message_at' => now()]);

        return response()->json([
            'success' => true,
            'status' => $paymentStatus,
            'message' => $signatureVerified
                ? 'Payment verified successfully via Razorpay! Vikash has been notified in your live chat.'
                : 'Payment UTR submitted successfully! Status is Pending Verification. Vikash will verify the transaction against bank records and approve your project shortly.',
            'payment' => $payment->fresh(),
            'signature_verified' => $signatureVerified,
        ]);
    }

    /**
     * Admin: Verify & Approve a client's submitted payment (UTR or manual).
     */
    public function approvePayment(Payment $payment): JsonResponse
    {
        $payment->update([
            'status' => 'captured',
            'notes' => array_merge($payment->notes ?? [], [
                'approved_at' => now()->toIso8601String(),
                'approved_by_admin' => true,
            ]),
        ]);

        if ($payment->project_request_id) {
            ProjectRequest::where('id', $payment->project_request_id)->update([
                'payment_status' => 'paid',
                'status' => 'in_progress',
            ]);
        }

        // Post confirmation message to Client's 1-on-1 chat
        $conversation = Conversation::firstOrCreate(
            ['user_id' => $payment->user_id],
            [
                'subject' => 'Discussion with Vikash Kumar',
                'status' => 'active',
                'last_message_at' => now(),
            ]
        );

        $formattedAmount = number_format($payment->amount, 2);
        ClientMessage::create([
            'conversation_id' => $conversation->id,
            'sender_type' => 'admin',
            'sender_id' => request()->user()?->id,
            'message' => "✅ [Payment Verified & Approved] Your payment of ₹{$formattedAmount} for '{$payment->package_name}' (Reference: {$payment->razorpay_payment_id}) has been verified in our bank statement! Your project is now in active progress.",
            'is_read' => false,
        ]);
        $conversation->update(['last_message_at' => now()]);

        return response()->json([
            'success' => true,
            'message' => 'Payment verified and approved successfully!',
            'payment' => $payment->fresh(),
        ]);
    }

    /**
     * Admin: Reject an invalid or fake UTR submitted by a client.
     */
    public function rejectPayment(Request $request, Payment $payment): JsonResponse
    {
        $reason = $request->input('reason', 'Transaction reference / UTR not found in bank statement.');

        $payment->update([
            'status' => 'failed',
            'notes' => array_merge($payment->notes ?? [], [
                'rejected_at' => now()->toIso8601String(),
                'rejection_reason' => $reason,
            ]),
        ]);

        if ($payment->project_request_id) {
            ProjectRequest::where('id', $payment->project_request_id)->update([
                'payment_status' => 'unpaid',
            ]);
        }

        // Post rejection notification to Client's 1-on-1 chat
        $conversation = Conversation::firstOrCreate(
            ['user_id' => $payment->user_id],
            [
                'subject' => 'Discussion with Vikash Kumar',
                'status' => 'active',
                'last_message_at' => now(),
            ]
        );

        ClientMessage::create([
            'conversation_id' => $conversation->id,
            'sender_type' => 'admin',
            'sender_id' => request()->user()?->id,
            'message' => "⚠️ [Payment Verification Issue] Reference '{$payment->razorpay_payment_id}' for '{$payment->package_name}' could not be verified: {$reason}. Please check your payment app receipt and re-submit the correct 12-digit UTR.",
            'is_read' => false,
        ]);
        $conversation->update(['last_message_at' => now()]);

        return response()->json([
            'success' => true,
            'message' => 'Payment rejected and client notified in chat.',
            'payment' => $payment->fresh(),
        ]);
    }

    /**
     * Admin tool to test Razorpay API credentials.
     */
    public function testConnection(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'key_id' => 'required|string',
            'key_secret' => 'required|string',
        ]);

        $keyId = trim($validated['key_id']);
        $keySecret = trim($validated['key_secret']);

        if (str_contains($keySecret, '***')) {
            return response()->json([
                'success' => false,
                'message' => 'Secret Key contains asterisks (***). Please paste the exact secret key generated from Razorpay dashboard.',
            ], 422);
        }

        try {
            $res = \Illuminate\Support\Facades\Http::withBasicAuth($keyId, $keySecret)
                ->timeout(6)
                ->get('https://api.razorpay.com/v1/payments?count=1');

            if ($res->successful()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Razorpay API credentials verified successfully! Live/Test in-page checkout is active.',
                ]);
            }

            $body = $res->json();
            $msg = $body['error']['description'] ?? 'Authentication failed. Please verify your Key ID and Secret.';
            return response()->json([
                'success' => false,
                'message' => 'Razorpay rejected credentials: ' . $msg,
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Connection to Razorpay failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get all payments made by this client.
     */
    public function myPayments(Request $request): JsonResponse
    {
        $user = $request->user();

        $payments = Payment::with('projectRequest')
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'payments' => $payments,
        ]);
    }
}
