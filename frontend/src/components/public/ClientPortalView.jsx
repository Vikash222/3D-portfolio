import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Mail,
  Clock,
  CheckCircle2,
  ArrowLeft,
  LogOut,
  Send,
  RefreshCw,
  MessageSquare,
  Briefcase,
  CreditCard,
  Receipt,
  Sparkles,
  Check,
  ChevronRight,
  ShieldCheck,
  Download,
  ExternalLink,
  Code2,
  AlertCircle,
  Layers,
  Terminal,
  Calendar,
  IndianRupee,
  X,
} from 'lucide-react';
import {
  getClientInquiries,
  getClientConversation,
  sendClientMessage,
  markClientConversationRead,
  getClientProjectRequests,
  createClientProjectRequest,
  getPricingPackages,
  createPaymentOrder,
  verifyPayment,
  getClientPayments,
  getPortfolioData,
  getPublicProjectTemplates,
} from '../../services/api';

// Dynamically load official Razorpay Checkout script when needed
const loadRazorpaySdk = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function ClientPortalView({
  clientUser,
  onBackToPortfolio,
  onLogout,
  projects: initialProjects = [],
  profile = null,
}) {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'builder' | 'pricing' | 'receipts'

  // Chat State
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [chatLoading, setChatLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Project Builder State
  const [projectRequests, setProjectRequests] = useState([]);
  const [projectsList, setProjectsList] = useState(initialProjects);
  const [builderTemplates, setBuilderTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [builderForm, setBuilderForm] = useState({
    title: '',
    category: 'Full-Stack Web App',
    budget_range: '₹15,000 - ₹35,000',
    timeline: '1-2 Weeks',
    description: '',
    features_json: ['User Authentication', 'Responsive UI', 'REST API Backend'],
  });
  const [featureInput, setFeatureInput] = useState('');
  const [isSubmittingProject, setIsSubmittingProject] = useState(false);
  const [projectSuccessMsg, setProjectSuccessMsg] = useState('');

  // Pricing & Razorpay State
  const [pricingPackages, setPricingPackages] = useState([]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState('');
  const [paymentModal, setPaymentModal] = useState(null);
  const [utrValidationError, setUtrValidationError] = useState('');
  const [selectedProjectForBooking, setSelectedProjectForBooking] = useState(null);
  const [advanceAmount, setAdvanceAmount] = useState(2500);

  // Inquiries & Receipts State
  const [inquiries, setInquiries] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch Chat Conversation
  const fetchChat = async (isPolling = false) => {
    try {
      if (!isPolling) setChatLoading(true);
      const res = await getClientConversation();
      setConversation(res.conversation);
      setMessages(res.messages || []);
      // Mark read
      markClientConversationRead().catch(() => {});
    } catch (err) {
      console.error('Failed to fetch conversation:', err);
    } finally {
      if (!isPolling) setChatLoading(false);
    }
  };

  // Fetch Project Requests & Packages
  const fetchPortalData = async () => {
    try {
      setLoadingData(true);
      const [reqRes, pkgRes, payRes, inqRes, tmplRes] = await Promise.all([
        getClientProjectRequests().catch(() => ({ project_requests: [] })),
        getPricingPackages().catch(() => ({ pricing_packages: [] })),
        getClientPayments().catch(() => ({ payments: [] })),
        getClientInquiries().catch(() => ({ inquiries: [] })),
        getPublicProjectTemplates().catch(() => ({ project_templates: [] })),
      ]);

      setProjectRequests(reqRes.project_requests || []);
      setPricingPackages(pkgRes.pricing_packages || []);
      setPayments(payRes.payments || []);
      setInquiries(inqRes.inquiries || []);
      setBuilderTemplates(tmplRes.project_templates || []);

      if (projectsList.length === 0) {
        const portData = await getPortfolioData().catch(() => null);
        if (portData?.projects) {
          setProjectsList(portData.projects);
        }
      }
    } catch (err) {
      console.error('Failed loading portal data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchChat();
    fetchPortalData();

    // Auto-poll conversation every 5 seconds for live messaging
    const pollInterval = setInterval(() => {
      fetchChat(true);
    }, 5000);

    return () => clearInterval(pollInterval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle Send Chat Message
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isSendingChat) return;

    const text = chatInput.trim();
    setChatInput('');
    setIsSendingChat(true);

    try {
      const res = await sendClientMessage(text);
      if (res.message) {
        setMessages((prev) => [...prev, res.message]);
        scrollToBottom();
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      alert('Failed to transmit message. Please check your network.');
    } finally {
      setIsSendingChat(false);
    }
  };

  // Select Template & autofill Project Builder
  const handleSelectTemplate = (template) => {
    if (!template) {
      setSelectedTemplateId('');
      setBuilderForm((prev) => ({
        ...prev,
        title: '',
        description: '',
      }));
      return;
    }

    setSelectedTemplateId(template.id);
    const templateFeatures = Array.isArray(template.features) && template.features.length > 0
      ? template.features
      : (Array.isArray(template.tech_stack) && template.tech_stack.length > 0 ? template.tech_stack : null);

    setBuilderForm((prev) => ({
      ...prev,
      title: `Custom Solution based on: ${template.title}`,
      category: template.category || 'Full-Stack Web App',
      budget_range: template.budget_range || prev.budget_range,
      timeline: template.timeline || prev.timeline,
      description: template.description || template.short_description
        ? `${template.description || template.short_description}\n\n[Customization Scope: Tailored to our brand specifications and custom integrations.]`
        : `I would like a custom project built based on Vikash's '${template.title}' architecture. Please provide a technical proposal and quote for customization.`,
      features_json: templateFeatures || prev.features_json,
    }));
  };

  // Add a feature tag
  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    if (!builderForm.features_json.includes(featureInput.trim())) {
      setBuilderForm((prev) => ({
        ...prev,
        features_json: [...prev.features_json, featureInput.trim()],
      }));
    }
    setFeatureInput('');
  };

  const handleRemoveFeature = (idx) => {
    setBuilderForm((prev) => ({
      ...prev,
      features_json: prev.features_json.filter((_, i) => i !== idx),
    }));
  };

  // Submit Project Request (can proceed directly to Razorpay booking)
  const handleSubmitProject = async (e, proceedToPayment = false) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!builderForm.title.trim() || !builderForm.description.trim()) {
      alert('Please fill in both the project title and detailed description.');
      return;
    }

    setIsSubmittingProject(true);
    setProjectSuccessMsg('');

    try {
      const payload = {
        title: builderForm.title,
        category: builderForm.category,
        template_project_id: selectedTemplateId || null,
        budget_range: builderForm.budget_range,
        timeline: builderForm.timeline,
        description: builderForm.description,
        features_json: builderForm.features_json,
      };

      const res = await createClientProjectRequest(payload);
      const createdProject = res.project_request || {
        ...payload,
        id: Date.now(),
        created_at: new Date().toISOString(),
        status: 'pending',
      };

      // Refresh requests & conversation
      fetchPortalData();
      fetchChat(true);

      if (proceedToPayment) {
        setSelectedProjectForBooking(createdProject);
        setActiveTab('pricing');
        setPaymentSuccessMsg(`Project '${createdProject.title}' submitted! Please select your payment package or token advance below to complete booking.`);
      } else {
        setProjectSuccessMsg('Your project requirement has been submitted to Vikash Kumar! Check the Live Chat for instant updates, or switch to Pricing & Booking to pay advance.');
      }

      // Reset form
      setBuilderForm({
        title: '',
        category: 'Full-Stack Web App',
        budget_range: '₹15,000 - ₹35,000',
        timeline: '1-2 Weeks',
        description: '',
        features_json: ['User Authentication', 'Responsive UI', 'REST API Backend'],
      });
      setSelectedTemplateId('');
    } catch (err) {
      console.error('Error submitting project request:', err);
      alert('Failed to submit project request. Please try again.');
    } finally {
      setIsSubmittingProject(false);
    }
  };

  // Initiate Razorpay Checkout (supports package OR custom advance, linked with selectedProject)
  const handleInitiatePayment = async (pkg, customAmount = null, targetProject = null) => {
    setIsProcessingPayment(true);
    setPaymentSuccessMsg('');

    const projectToBook = targetProject || selectedProjectForBooking;
    const paymentAmount = customAmount || pkg?.price_inr || 4999;
    const packageName = projectToBook
      ? `${projectToBook.title} (${pkg?.title || 'Project Booking'})`
      : (pkg?.title || 'Custom Engineering Package');

    try {
      const orderRes = await createPaymentOrder({
        amount: paymentAmount,
        package_name: packageName,
        project_request_id: projectToBook?.id || null,
        notes: {
          package_slug: pkg?.slug || 'project_booking',
          delivery_days: String(pkg?.delivery_days || 7),
          project_id: projectToBook?.id ? String(projectToBook.id) : '',
          project_title: projectToBook?.title || '',
          project_category: projectToBook?.category || '',
        },
      }).catch(() => ({
        mode: 'link',
        payment_link: 'https://razorpay.me/@vikashkumar2049',
        order_id: 'rzp_link_' + Date.now(),
      }));

      // MODE 1: In-Page Razorpay Checkout Popup (Real API Order)
      if (orderRes?.mode === 'api' && orderRes?.key_id && orderRes?.order_id?.startsWith('order_')) {
        const isLoaded = await loadRazorpaySdk();
        if (isLoaded && window.Razorpay) {
          const options = {
            key: orderRes.key_id,
            amount: orderRes.amount,
            currency: orderRes.currency || 'INR',
            name: 'Vikash Kumar - Freelance Engineering',
            description: packageName,
            order_id: orderRes.order_id,
            prefill: {
              name: clientUser?.name || '',
              email: clientUser?.email || '',
            },
            theme: {
              color: '#06b6d4',
            },
            handler: async (response) => {
              try {
                setIsProcessingPayment(true);
                await verifyPayment({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  payment_id: orderRes.payment_id,
                  project_request_id: projectToBook?.id || null,
                  notes: `Verified for project: ${packageName}`,
                });
                setPaymentSuccessMsg(`🎉 Payment of ₹${Number(paymentAmount).toLocaleString()} verified successfully via Razorpay! Payment ID: ${response.razorpay_payment_id}`);
                fetchPortalData();
                fetchChat(true);
                setActiveTab('receipts');
              } catch (verErr) {
                console.error('Verification error:', verErr);
                setPaymentSuccessMsg(`🎉 Payment recorded for ₹${Number(paymentAmount).toLocaleString()}!`);
                fetchPortalData();
                fetchChat(true);
                setActiveTab('receipts');
              } finally {
                setIsProcessingPayment(false);
              }
            },
            modal: {
              ondismiss: () => {
                setIsProcessingPayment(false);
              },
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', function (resp) {
            alert('Payment Failed: ' + (resp.error?.description || 'Transaction cancelled'));
            setIsProcessingPayment(false);
          });
          rzp.open();
          setIsProcessingPayment(false);
          return;
        }
      }

      // MODE 2: Fallback to Direct Razorpay Payment Link (razorpay.me)
      const link = orderRes?.payment_link || 'https://razorpay.me/@vikashkumar2049';
      window.open(link, '_blank');

      setPaymentModal({
        order: orderRes,
        package: pkg || { title: packageName, price_inr: paymentAmount },
        project: projectToBook,
        paymentLink: link,
        transactionRef: '',
        amount: paymentAmount,
      });
    } catch (err) {
      console.error('Payment checkout error:', err);
      window.open('https://razorpay.me/@vikashkumar2049', '_blank');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Confirm Payment Completed via Razorpay Link
  const handleConfirmLinkPayment = async () => {
    if (!paymentModal) return;

    const trimmedUtr = (paymentModal.transactionRef || '').trim();
    if (!trimmedUtr || trimmedUtr.length < 6) {
      setUtrValidationError('Please enter your 12-digit UTR / UPI Transaction Reference number (minimum 6 characters).');
      return;
    }

    setUtrValidationError('');
    setIsProcessingPayment(true);

    try {
      const { order, package: pkg, project, amount } = paymentModal;

      const res = await verifyPayment({
        payment_id: order?.payment_id,
        project_request_id: project?.id || order?.project_request_id || null,
        razorpay_order_id: order?.order_id,
        transaction_ref: trimmedUtr,
        notes: `Submitted payment UTR: ${trimmedUtr} for ${project ? project.title + ' • ' : ''}${pkg.title}`,
      });

      setPaymentSuccessMsg(
        res?.message ||
        `⏳ UTR "${trimmedUtr}" submitted for ₹${Number(amount || pkg.price_inr).toLocaleString()}! Status: Pending Admin Verification.`
      );
      setPaymentModal(null);
      await fetchPortalData();
      await fetchChat(true);
      setActiveTab('receipts');
    } catch (err) {
      console.error('Verification error:', err);
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to submit UTR. Please ensure it is a valid transaction reference.';
      setUtrValidationError(errMsg);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070305] text-slate-100 p-3 sm:p-6 lg:p-8 selection:bg-red-600 selection:text-white">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Navbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToPortfolio}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-red-400 transition-colors cursor-pointer bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/10"
            >
              <ArrowLeft className="w-4 h-4 text-red-400" />
              <span>Back to Public Portfolio</span>
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Vikash Kumar • Available for Freelance</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white">{clientUser?.name || 'Client'}</p>
              <p className="text-[11px] text-slate-400 font-mono">{clientUser?.email}</p>
            </div>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-xs font-semibold text-red-300 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Client Welcome & Profile Banner */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-white/10 bg-gradient-to-r from-[#12060b] via-[#1a0a10] to-[#250914] shadow-2xl backdrop-blur-xl">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-red-500 text-white flex items-center justify-center font-bold text-2xl shadow-xl shadow-red-600/25 border border-red-400/30">
                {clientUser?.name?.charAt(0).toUpperCase() || 'C'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-white tracking-tight">
                    {clientUser?.name || 'Client Portal'}
                  </h1>
                  <ShieldCheck className="w-5 h-5 text-red-400" />
                </div>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  1-on-1 Direct Workspace with <span className="text-red-300 font-semibold">Vikash Kumar</span> (Full-Stack Engineer)
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-300 border border-red-500/30 font-semibold font-mono">
                    End-to-End Client Portal
                  </span>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10 font-mono">
                    Secure Razorpay Enabled
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats / Action Pill */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-center min-w-[100px]">
                <p className="text-[11px] text-slate-400 font-mono uppercase">Submitted Projects</p>
                <p className="text-lg font-bold text-white">{projectRequests.length}</p>
              </div>
              <div className="px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-center min-w-[100px]">
                <p className="text-[11px] text-slate-400 font-mono uppercase">Verified Payments</p>
                <p className="text-lg font-bold text-emerald-400">
                  ₹{payments.filter((p) => p.status === 'captured').reduce((acc, p) => acc + Number(p.amount), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Global Notifications */}
        {paymentSuccessMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{paymentSuccessMsg}</span>
            </div>
            <button
              onClick={() => setPaymentSuccessMsg('')}
              className="text-xs text-emerald-400 hover:text-emerald-200 cursor-pointer font-bold px-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-white/10 overflow-x-auto">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>1-on-1 Live Chat</span>
            {messages.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${activeTab === 'chat' ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-300'}`}>
                {messages.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('builder')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'builder'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Project Builder &amp; Templates</span>
            {projectRequests.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${activeTab === 'builder' ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-300'}`}>
                {projectRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'pricing'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Pricing &amp; Booking</span>
          </button>

          <button
            onClick={() => setActiveTab('receipts')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'receipts'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Receipts &amp; Inquiries</span>
            {payments.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${activeTab === 'receipts' ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-300'}`}>
                {payments.length}
              </span>
            )}
          </button>
        </div>

        {/* =========================================================================
            TAB 1: LIVE 1-ON-1 CHAT WITH VIKASH
            ========================================================================= */}
        {activeTab === 'chat' && (
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 shadow-2xl overflow-hidden flex flex-col h-[650px] relative backdrop-blur-xl">
            {/* Chat Header */}
            <div className="p-4 sm:px-6 bg-slate-950/80 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 via-rose-600 to-red-500 flex items-center justify-center font-bold text-white shadow-md">
                    VK
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950"></span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-sm">Vikash Kumar</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-300 font-mono font-semibold border border-red-500/20">
                      Software Engineer
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Direct End-to-End Client Conversation • Active</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchChat()}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-red-400 transition-all cursor-pointer"
                  title="Refresh Conversation"
                >
                  <RefreshCw className={`w-4 h-4 ${chatLoading ? 'animate-spin text-red-400' : ''}`} />
                </button>
              </div>
            </div>

            {/* Chat Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {chatLoading && messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                  Connecting to secure channel...
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
                  <MessageSquare className="w-12 h-12 text-red-500/30" />
                  <p className="text-sm font-semibold text-slate-300">No messages yet</p>
                  <p className="text-xs max-w-sm">
                    Say hello or describe the software application you want Vikash to build. He will reply directly to your account!
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isClient = msg.sender_type === 'client';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isClient ? 'items-end' : 'items-start'} space-y-1`}
                    >
                      <div className="flex items-center gap-2 px-1 text-[11px] font-mono text-slate-400">
                        <span>{isClient ? 'You' : 'Vikash Kumar'}</span>
                        <span>•</span>
                        <span>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div
                        className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap shadow-lg ${
                          isClient
                            ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-500 text-white rounded-tr-none'
                            : 'bg-slate-800/90 text-slate-100 border border-white/10 rounded-tl-none'
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Pre-fill Prompt Chips */}
            <div className="px-4 py-2 bg-slate-950/60 border-t border-white/5 flex items-center gap-2 overflow-x-auto text-[11px]">
              <span className="text-slate-500 whitespace-nowrap">Suggested:</span>
              <button
                onClick={() => setChatInput('Hi Vikash, could you share an estimate for an MVP?')}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-red-300 whitespace-nowrap cursor-pointer transition-all border border-white/5"
              >
                Estimate for an MVP?
              </button>
              <button
                onClick={() => setChatInput('What tech stack would you recommend for my SaaS platform?')}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-red-300 whitespace-nowrap cursor-pointer transition-all border border-white/5"
              >
                Tech stack recommendation?
              </button>
              <button
                onClick={() => setChatInput('I have submitted a new project requirement in the builder.')}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-red-300 whitespace-nowrap cursor-pointer transition-all border border-white/5"
              >
                Project requirement submitted
              </button>
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSendMessage} className="p-4 bg-slate-950/90 border-t border-white/10 flex items-center gap-3">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your message to Vikash..."
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 placeholder:text-slate-500 transition-all"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isSendingChat}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-600/20 inline-flex items-center gap-2 cursor-pointer transition-all"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>
        )}

        {/* =========================================================================
            TAB 2: PROJECT BUILDER & TEMPLATE SELECTOR
            ========================================================================= */}
        {activeTab === 'builder' && (
          <div className="space-y-8">
            {/* Builder Form Card */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-red-400" />
                  <span>Interactive Freelance Project Builder</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Submit your custom product specifications or choose one of Vikash's proven showcase templates as a foundation.
                </p>
              </div>

              {projectSuccessMsg && (
                <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs sm:text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-red-400 shrink-0" />
                  <span>{projectSuccessMsg}</span>
                </div>
              )}

              {/* Template Chooser Carousel / Cards */}
              <div className="space-y-3">
                <label className="text-xs font-mono uppercase text-slate-300 flex items-center gap-1.5 font-bold">
                  <Layers className="w-4 h-4 text-red-400" />
                  <span>Option 1: Base this Project on Vikash's Showcase Templates (Optional)</span>
                </label>
                <p className="text-[11px] text-slate-400">
                  Select an existing project built by Vikash to pre-fill architecture, database models, and design patterns:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div
                    onClick={() => handleSelectTemplate(null)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      selectedTemplateId === ''
                        ? 'bg-red-500/10 border-red-400 text-white shadow-lg shadow-red-500/10'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold text-red-400">Blank Canvas</span>
                        {selectedTemplateId === '' && <Check className="w-4 h-4 text-red-400" />}
                      </div>
                      <h4 className="text-sm font-bold text-white mt-1">100% Custom Architecture</h4>
                      <p className="text-[11px] text-slate-400 mt-1">Build from scratch tailored to your exact custom specifications.</p>
                    </div>
                  </div>

                  {(builderTemplates.length > 0 ? builderTemplates : projectsList.slice(0, 7)).map((tmpl) => {
                    const isSelected = selectedTemplateId === tmpl.id;
                    return (
                      <div
                        key={tmpl.id}
                        onClick={() => handleSelectTemplate(tmpl)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-red-500/10 border-red-400 text-white shadow-lg shadow-red-500/10'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-red-400 truncate max-w-[120px]">{tmpl.category || 'Template'}</span>
                            {isSelected && <Check className="w-4 h-4 text-red-400" />}
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-white mt-1 line-clamp-1">{tmpl.title}</h4>
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{tmpl.short_description || tmpl.description || tmpl.long_description}</p>
                          {tmpl.budget_range && (
                            <div className="mt-1.5 inline-block text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              {tmpl.budget_range}
                            </div>
                          )}
                        </div>
                        <span className="mt-2 text-[10px] font-mono text-red-300/80">Click to autofill →</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Requirement Input Form */}
              <form onSubmit={handleSubmitProject} className="space-y-4 pt-4 border-t border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                      Project / App Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={builderForm.title}
                      onChange={(e) => setBuilderForm({ ...builderForm, title: e.target.value })}
                      placeholder="e.g. Smart Logistics Tracking Portal"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-red-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                      Category
                    </label>
                    <select
                      value={builderForm.category}
                      onChange={(e) => setBuilderForm({ ...builderForm, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-red-400"
                    >
                      {!["Full-Stack Web App", "AI SaaS & LLM Integration", "Mobile App (Cross-Platform)", "Campus Automation & Smart Systems", "REST APIs & Database Architecture", "High-Converting UI/UX Landing Page"].includes(builderForm.category) && builderForm.category && (
                        <option value={builderForm.category}>{builderForm.category}</option>
                      )}
                      <option value="Full-Stack Web App">Full-Stack Web App (React + Laravel/Node)</option>
                      <option value="AI SaaS & LLM Integration">AI SaaS & LLM Integration (Gemini/OpenAI)</option>
                      <option value="Mobile App (Cross-Platform)">Mobile App (Flutter / React Native)</option>
                      <option value="Campus Automation & Smart Systems">Campus Automation & Smart Systems</option>
                      <option value="REST APIs & Database Architecture">REST APIs & Relational Database Architecture</option>
                      <option value="High-Converting UI/UX Landing Page">High-Converting UI/UX Landing Page</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                      Estimated Budget Range
                    </label>
                    <select
                      value={builderForm.budget_range}
                      onChange={(e) => setBuilderForm({ ...builderForm, budget_range: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-red-400 font-mono"
                    >
                      {!["₹5,000 - ₹10,000", "₹15,000 - ₹35,000", "₹35,000 - ₹75,000", "₹75,000+"].includes(builderForm.budget_range) && builderForm.budget_range && (
                        <option value={builderForm.budget_range}>{builderForm.budget_range} (Template Scope)</option>
                      )}
                      <option value="₹5,000 - ₹10,000">₹5,000 - ₹10,000 (Starter / MVP Prototype)</option>
                      <option value="₹15,000 - ₹35,000">₹15,000 - ₹35,000 (Production Full-Stack Web App)</option>
                      <option value="₹35,000 - ₹75,000">₹35,000 - ₹75,000 (Complex Enterprise / AI SaaS)</option>
                      <option value="₹75,000+">₹75,000+ (Large Scale System / Custom Retainer)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                      Desired Delivery Timeline
                    </label>
                    <select
                      value={builderForm.timeline}
                      onChange={(e) => setBuilderForm({ ...builderForm, timeline: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-red-400 font-mono"
                    >
                      {!["3-5 Days", "1-2 Weeks", "3-4 Weeks", "Flexible / Long-Term"].includes(builderForm.timeline) && builderForm.timeline && (
                        <option value={builderForm.timeline}>{builderForm.timeline} (Template Target)</option>
                      )}
                      <option value="3-5 Days">3 - 5 Days (Fast Sprint)</option>
                      <option value="1-2 Weeks">1 - 2 Weeks (Standard Sprint)</option>
                      <option value="3-4 Weeks">3 - 4 Weeks (Comprehensive Solution)</option>
                      <option value="Flexible / Long-Term">Flexible / Long-Term Milestone</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                    Key Features / Desired Capabilities
                  </label>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddFeature();
                        }
                      }}
                      placeholder="e.g. Razorpay Payment Gateway, Admin Dashboard, Export to PDF"
                      className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-red-400"
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer"
                    >
                      Add Feature
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {builderForm.features_json.map((feat, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-300 border border-red-500/30 text-xs font-mono"
                      >
                        <span>{feat}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(idx)}
                          className="hover:text-red-400 font-bold ml-1 cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                    Detailed Project Scope &amp; Deliverables *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={builderForm.description}
                    onChange={(e) => setBuilderForm({ ...builderForm, description: e.target.value })}
                    placeholder="Describe your user flows, business logic, integrations, or specific problem you need Vikash to solve..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-red-400 placeholder:text-slate-500"
                  ></textarea>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSubmittingProject}
                    className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/15 inline-flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmittingProject ? 'Submitting...' : 'Submit Requirement Only'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleSubmitProject(e, true)}
                    disabled={isSubmittingProject}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-red-600/25 inline-flex items-center gap-2 cursor-pointer transition-all hover:scale-102 active:scale-95 disabled:opacity-50"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Save &amp; Proceed to Razorpay Booking ➔</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Submitted Project Requests List */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-red-400" />
                  <span>Your Submitted Project Requests</span>
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  {projectRequests.length} {projectRequests.length === 1 ? 'Project' : 'Projects'}
                </span>
              </div>

              {projectRequests.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs sm:text-sm">
                  You haven't submitted any custom project requirements yet. Use the form above to get started!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projectRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 hover:border-red-500/30 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-mono uppercase text-red-400 font-semibold">{req.category}</span>
                            <h4 className="text-base font-bold text-white mt-0.5">{req.title}</h4>
                          </div>
                          <span
                            className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full capitalize ${
                              req.status === 'completed'
                                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                                : req.status === 'in_progress'
                                ? 'bg-red-500/10 text-red-300 border border-red-500/30'
                                : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {req.status}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 bg-black/20 p-3 rounded-xl border border-white/5">
                          {req.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400 pt-1">
                          <span>Budget: <strong className="text-white">{req.budget_range}</strong></span>
                          <span>•</span>
                          <span>Timeline: <strong className="text-white">{req.timeline}</strong></span>
                        </div>

                        {req.template_project && (
                          <p className="text-[11px] text-red-300/90 font-mono">
                            Template: {req.template_project.title}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/5">
                        <span
                          className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-lg border ${
                            req.payment_status === 'paid'
                              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                              : req.payment_status === 'pending_verification'
                              ? 'text-amber-400 bg-amber-500/10 border-amber-500/30 animate-pulse'
                              : 'text-slate-400 bg-white/5 border-white/10'
                          }`}
                        >
                          Payment:{' '}
                          {req.payment_status === 'paid'
                            ? '✓ Advance Paid'
                            : req.payment_status === 'pending_verification'
                            ? '⏳ UTR Pending Verification'
                            : 'Awaiting Advance'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedProjectForBooking(req);
                            setActiveTab('pricing');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-300 hover:text-white border border-red-500/30 text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 shadow-sm"
                        >
                          <CreditCard className="w-3.5 h-3.5 text-red-400" />
                          <span>{req.payment_status === 'paid' ? 'Add Milestone Payment ➔' : 'Book with Razorpay ➔'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: FREELANCE PRICING & RAZORPAY BOOKING
            ========================================================================= */}
        {activeTab === 'pricing' && (
          <div className="space-y-8">
            {/* DEDICATED CONCEPT: SELECTED PROJECT SCOPE FOR RAZORPAY BOOKING */}
            {selectedProjectForBooking ? (
              <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-red-950/70 via-slate-900/95 to-rose-950/70 border-2 border-red-500 shadow-2xl shadow-red-600/25 backdrop-blur-2xl space-y-5">
                {/* Header with Project Title & Switch Button */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-400/50 text-red-300 flex items-center justify-center shadow-lg shadow-red-500/20 shrink-0">
                      <Briefcase className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-black font-mono px-2.5 py-0.5 rounded-full bg-red-500 text-white uppercase tracking-wide">
                          Project Selected for Booking
                        </span>
                        <span className="text-xs text-red-300/80 font-mono">
                          {selectedProjectForBooking.category || 'Custom Software'}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-2xl font-black text-white mt-1">
                        {selectedProjectForBooking.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('builder')}
                      className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white border border-white/15 text-xs font-semibold cursor-pointer transition-all"
                    >
                      Switch / Edit Requirement
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedProjectForBooking(null)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-300 border border-white/10 transition-all cursor-pointer"
                      title="Clear Selection"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Scope Specs & Payment Status */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-slate-400 block text-[10px] uppercase">Estimated Budget Scope:</span>
                    <span className="text-emerald-400 font-bold text-sm">{selectedProjectForBooking.budget_range || 'Custom Scope'}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-slate-400 block text-[10px] uppercase">Target Delivery:</span>
                    <span className="text-red-300 font-bold text-sm">{selectedProjectForBooking.timeline || 'Standard Sprint'}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-slate-400 block text-[10px] uppercase">Booking Status:</span>
                    <span className={`font-bold text-sm ${selectedProjectForBooking.payment_status === 'paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {selectedProjectForBooking.payment_status === 'paid' ? '✓ Advance Paid (In Progress)' : 'Awaiting Kick-Off Payment'}
                    </span>
                  </div>
                </div>

                {/* Features Tags */}
                {Array.isArray(selectedProjectForBooking.features_json) && selectedProjectForBooking.features_json.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] font-mono text-slate-400 mr-1">Scope Features:</span>
                    {selectedProjectForBooking.features_json.map((f, i) => (
                      <span key={i} className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-300 border border-red-500/20">
                        {f}
                      </span>
                    ))}
                  </div>
                )}

                {/* Dedicated Concept 1: Instant Kick-Off Advance / Token Booking */}
                <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-red-500/40 shadow-inner flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-red-400 animate-pulse" />
                      <h4 className="text-sm font-bold text-white">Concept 1: Pay Kick-Off Token Advance</h4>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">Fastest Sprint Start</span>
                    </div>
                    <p className="text-xs text-slate-400 max-w-xl">
                      Pay a token advance directly to book Vikash&apos;s development schedule today. Remaining milestone balance paid after feature deliverables review.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                    {[1000, 2500, 5000, 10000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleInitiatePayment({ title: `Token Advance`, price_inr: amt, delivery_days: 3 }, amt, selectedProjectForBooking)}
                        disabled={isProcessingPayment}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-400/50 text-red-300 text-xs font-mono font-bold transition-all cursor-pointer hover:scale-105 active:scale-95"
                      >
                        ₹{amt.toLocaleString()}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleInitiatePayment({ title: `Token Advance`, price_inr: advanceAmount, delivery_days: 7 }, advanceAmount, selectedProjectForBooking)}
                      disabled={isProcessingPayment}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold transition-all shadow-lg shadow-red-600/30 cursor-pointer hover:scale-105 active:scale-95 whitespace-nowrap flex items-center gap-1.5"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Pay ₹{Number(advanceAmount).toLocaleString()} Advance</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Helper Prompt if No Project Selected Yet */
              <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Have a specific project requirement to book?</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {projectRequests.length > 0
                        ? 'Select one of your submitted project requests below to link this Razorpay payment directly.'
                        : 'You can configure your project in the Project Builder or book a standard package directly.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {projectRequests.length > 0 && (
                    <select
                      onChange={(e) => {
                        const found = projectRequests.find((p) => String(p.id) === e.target.value);
                        if (found) setSelectedProjectForBooking(found);
                      }}
                      value=""
                      className="px-3.5 py-2 rounded-xl bg-slate-950 border border-red-500/40 text-xs text-red-300 font-mono focus:outline-none cursor-pointer"
                    >
                      <option value="">Link a Project Request...</option>
                      {projectRequests.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} ({p.budget_range})
                        </option>
                      ))}
                    </select>
                  )}
                  <button
                    type="button"
                    onClick={() => setActiveTab('builder')}
                    className="px-4 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                  >
                    Open Project Builder ➔
                  </button>
                </div>
              </div>
            )}

            {/* SECTION: SELECT A PACKAGE & BOOK WITH SECURE RAZORPAY */}
            <div className="text-center max-w-2xl mx-auto space-y-2 pt-2">
              <span className="text-xs font-mono uppercase text-red-400 tracking-wider font-semibold">
                Transparent Freelance Packages
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Select a Package &amp; Book with Secure Razorpay
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                All tiers include 1-on-1 code reviews, clean repository handover, and post-delivery support.
              </p>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pricingPackages.map((pkg) => {
                const isPopular = pkg.is_popular;
                return (
                  <div
                    key={pkg.id}
                    className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between border transition-all duration-300 ${
                      isPopular
                        ? 'bg-gradient-to-b from-slate-900 via-slate-900/90 to-red-950/40 border-red-500 shadow-2xl shadow-red-600/15 md:-translate-y-2'
                        : 'bg-slate-900/70 border-white/10 hover:border-white/25 shadow-xl'
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-500 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                        Most Popular Choice
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">{pkg.title}</h3>
                        <p className="text-xs text-slate-400 mt-1 min-h-[36px]">{pkg.tagline}</p>
                      </div>

                      <div className="flex items-baseline gap-1 py-2 border-y border-white/10">
                        <span className="text-3xl sm:text-4xl font-black text-white">
                          ₹{Number(pkg.price_inr).toLocaleString()}
                        </span>
                        <span className="text-xs font-mono text-slate-400">/ project</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-mono text-red-300">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Delivery within {pkg.delivery_days} days</span>
                      </div>

                      <div className="space-y-2.5 pt-2">
                        <p className="text-[11px] font-mono uppercase text-slate-400 font-semibold">Included Deliverables:</p>
                        <ul className="space-y-2">
                          {(pkg.features || []).map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                              <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-white/10">
                      <button
                        onClick={() => handleInitiatePayment(pkg, null, selectedProjectForBooking)}
                        disabled={isProcessingPayment}
                        className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                          isPopular
                            ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-500 text-white shadow-red-600/25 hover:scale-102 active:scale-95'
                            : 'bg-white/10 hover:bg-white/20 text-white hover:border-white/30 border border-white/10 hover:scale-102 active:scale-95'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>
                          {selectedProjectForBooking
                            ? `Book '${selectedProjectForBooking.title.slice(0, 16)}...' (₹${Number(pkg.price_inr).toLocaleString()}) ➔`
                            : `Book ${pkg.title} (₹${Number(pkg.price_inr).toLocaleString()}) ➔`}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Payment Security Assurance */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                <span>Secure Razorpay Gateway • Supports UPI (GPay, PhonePe, Paytm, QR), Credit/Debit Cards, NetBanking</span>
              </div>
              <span className="text-red-400 font-semibold">100% Code Handover &amp; Post-Delivery Support Guarantee</span>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: RECEIPTS & INVOICES
            ========================================================================= */}
        {activeTab === 'receipts' && (
          <div className="space-y-8">
            {/* Payment Receipts Card */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-bold text-white">Payment Receipts &amp; Milestones</h3>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {payments.length} {payments.length === 1 ? 'Transaction' : 'Transactions'}
                </span>
              </div>

              {payments.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs sm:text-sm space-y-3">
                  <CreditCard className="w-10 h-10 text-slate-600 mx-auto" />
                  <p>No transactions recorded yet.</p>
                  <button
                    onClick={() => setActiveTab('pricing')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-bold cursor-pointer hover:from-red-500 hover:to-rose-500 shadow-md shadow-red-600/25"
                  >
                    Browse Freelance Packages
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 font-mono uppercase text-[10px]">
                        <th className="py-3 px-3">Date</th>
                        <th className="py-3 px-3">Package / Scope</th>
                        <th className="py-3 px-3">Amount</th>
                        <th className="py-3 px-3">Transaction ID</th>
                        <th className="py-3 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {payments.map((p) => (
                        <tr key={p.id} className="hover:bg-white/5">
                          <td className="py-3.5 px-3 text-slate-400 font-mono">
                            {new Date(p.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3.5 px-3 font-semibold text-white">
                            {p.package_name || 'Freelance Order'}
                          </td>
                          <td className="py-3.5 px-3 font-bold text-emerald-400 font-mono">
                            ₹{Number(p.amount).toLocaleString()}
                          </td>
                          <td className="py-3.5 px-3 font-mono text-slate-400 text-[11px]">
                            <div className="text-white font-mono">{p.razorpay_payment_id || p.razorpay_order_id}</div>
                            {p.transaction_ref && (
                              <div className="text-[10px] text-red-300 font-mono">UTR: {p.transaction_ref}</div>
                            )}
                          </td>
                          <td className="py-3.5 px-3">
                            <span
                              className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize font-mono inline-flex items-center gap-1 ${
                                p.status === 'captured'
                                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                  : p.status === 'pending_verification'
                                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse'
                                  : p.status === 'failed'
                                  ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                                  : 'bg-white/10 text-slate-300 border border-white/10'
                              }`}
                            >
                              {p.status === 'pending_verification'
                                ? '⏳ Pending Verification'
                                : p.status === 'captured'
                                ? '✓ Verified & Captured'
                                : p.status === 'failed'
                                ? '✗ Rejected'
                                : p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Past Transmitted Inquiries */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-red-400" />
                  <h3 className="text-lg font-bold text-white">Transmitted Contact Inquiries</h3>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {inquiries.length} {inquiries.length === 1 ? 'Record' : 'Records'}
                </span>
              </div>

              {inquiries.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No public inquiries on record.
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {inquiries.map((inq) => (
                    <div key={inq.id} className="py-3.5 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="font-bold text-white text-xs sm:text-sm">{inq.subject || 'Inquiry'}</h4>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize font-mono ${
                              inq.status === 'replied'
                                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                                : inq.status === 'read'
                                ? 'bg-red-500/10 text-red-300 border border-red-500/30'
                                : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            Status: {inq.status || 'Pending'}
                          </span>
                          <span className="text-xs font-mono text-slate-400">
                            {new Date(inq.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5 leading-relaxed">
                        {inq.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Direct Razorpay.me Payment Modal */}
        {paymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-red-500/30 p-6 sm:p-8 space-y-5 shadow-2xl text-slate-100 relative">
              <button
                onClick={() => setPaymentModal(null)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Payment via Razorpay</h3>
                  <p className="text-xs text-red-400 font-mono">
                    razorpay.me/@vikashkumar2049
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2.5 text-xs font-mono">
                {paymentModal.project && (
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-slate-400">Target Project:</span>
                    <span className="text-red-300 font-bold">{paymentModal.project.title}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Package / Scope:</span>
                  <span className="text-white font-semibold">{paymentModal.package.title}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Payable Amount:</span>
                  <span className="text-emerald-400 text-base font-bold">
                    ₹{Number(paymentModal.amount || paymentModal.package.price_inr).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Payment Modes:</span>
                  <span className="text-slate-300">UPI (GPay / PhonePe / Paytm), Cards, NetBanking</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-slate-300">
                  Click below if the payment page didn&apos;t open automatically:
                </p>
                <a
                  href={paymentModal.paymentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/25 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Razorpay Page (₹{Number(paymentModal.amount || paymentModal.package.price_inr).toLocaleString()}) ➔</span>
                </a>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="block text-xs font-mono uppercase text-red-300 font-bold">
                  * 12-Digit Bank UTR / UPI Ref ID (Mandatory)
                </label>
                <input
                  type="text"
                  value={paymentModal.transactionRef || ''}
                  onChange={(e) => {
                    setPaymentModal({ ...paymentModal, transactionRef: e.target.value });
                    if (utrValidationError) setUtrValidationError('');
                  }}
                  placeholder="e.g. 423589123456 (12-digit UTR from GPay / PhonePe / Paytm / Bank)"
                  className={`w-full px-4 py-2.5 rounded-xl bg-black/50 border text-white text-xs font-mono focus:outline-none ${
                    utrValidationError ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/10 focus:border-red-400'
                  }`}
                />
                {utrValidationError ? (
                  <p className="text-[11px] text-rose-400 font-semibold flex items-center gap-1.5 animate-in fade-in">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{utrValidationError}</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-400">
                    After paying on the Razorpay link/QR, enter your 12-digit UPI / Bank UTR number above to submit for admin verification.
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentModal(null);
                    setUtrValidationError('');
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleConfirmLinkPayment}
                  disabled={isProcessingPayment}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold shadow-lg shadow-emerald-500/20 cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  {isProcessingPayment ? 'Submitting UTR...' : 'Submit UTR for Verification'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
