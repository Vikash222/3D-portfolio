<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileUploadController extends Controller
{
    /**
     * Upload an image, snap, or document (PDF/Resume).
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|max:51200', // max 50MB
        ]);

        $file = $request->file('file');
        $extension = strtolower($file->getClientOriginalExtension() ?: 'jpg');
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'avif', 'jfif', 'heic', 'pdf', 'doc', 'docx'];

        if (!in_array($extension, $allowedExtensions)) {
            return response()->json([
                'message' => 'Invalid file format. Allowed types: ' . implode(', ', $allowedExtensions),
            ], 422);
        }

        // Generate safe unique filename
        $safeName = Str::random(24) . '.' . $extension;
        $path = $file->storeAs('uploads', $safeName, 'public');

        $url = asset('storage/' . $path);
        // Also provide relative path for proxy portability
        $relativePath = '/storage/' . $path;

        return response()->json([
            'success' => true,
            'url' => $relativePath,
            'full_url' => $url,
            'filename' => $safeName,
            'original_name' => $file->getClientOriginalName(),
            'size' => $file->getSize(),
            'message' => 'File uploaded successfully.',
        ]);
    }
}
