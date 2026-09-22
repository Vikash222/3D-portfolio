import React, { useState, useEffect, useRef } from 'react';
import {
  Mail,
  Search,
  CheckCircle2,
  Trash2,
  Reply,
  Phone,
  Clock,
  Globe,
  X,
  RefreshCw,
  AlertCircle,
  Check,
  MessageSquare,
  Briefcase,
  Send,
  User,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Layers,
  CreditCard,
  Eye,
  Filter,
  Sparkles,
  Calendar,
  DollarSign,
  MessageCircle,
} from 'lucide-react';
import {
  getMessages,
  toggleMessageRead,
  deleteMessage,
  getMessage,
  getAdminConversations,
  getAdminConversation,
  sendAdminConversationMessage,
  replyToInquiry,
  getAdminProjectRequests,
  updateAdminProjectRequest,
  deleteAdminProjectRequest,
  approveAdminPayment,
  rejectAdminPayment,
} from '../../services/api';

export default function MessagesView({ initialSelectedMessage = null }) {
  // Tab: 'inquiries' | 'live-chats' | 'project-requests'
  const [activeTab, setActiveTab] = useState('inquiries');

  // Contact Inquiries State
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(initialSelectedMessage);
  const [error, setError] = useState('');

  // Dual-Reply Modal State
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [replyMode, setReplyMode] = useState('account'); // 'account' | 'email'
  const [replyText, setReplyText] = useState('');
  const [replySubject, setReplySubject] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [replyStatusMsg, setReplyStatusMsg] = useState(null);

  // Live Client Chats State
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversationMessages, setConversationMessages] = useState([]);
  const [chatReplyInput, setChatReplyInput] = useState('');
  const [isSendingChatMsg, setIsSendingChatMsg] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const chatBottomRef = useRef(null);

  // Project Requests State & Enhanced Filters
  const [projectRequests, setProjectRequests] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [projectFilter, setProjectFilter] = useState('all'); // 'all' | 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'paid'
  const [projectSearch, setProjectSearch] = useState('');
  const [selectedProjectModal, setSelectedProjectModal] = useState(null);
  const [projectActionMsg, setProjectActionMsg] = useState('');

  // Fetch Public Contact Inquiries
  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const data = await getMessages(filter, search);
      setMessages(data.messages || []);
    } catch (err) {
      setError('Failed to fetch contact messages.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Live Client Conversations
  const fetchConversationsList = async (isSilent = false) => {
    try {
      if (!isSilent) setLoadingConversations(true);
      const res = await getAdminConversations();
      setConversations(res.conversations || []);

      // If a conversation is selected, refresh its messages
      if (selectedConversation) {
        const convRes = await getAdminConversation(selectedConversation.id);
        setConversationMessages(convRes.messages || []);
      }
    } catch (err) {
      console.error('Failed fetching conversations:', err);
    } finally {
      if (!isSilent) setLoadingConversations(false);
    }
  };

  // Fetch Client Project Requests
  const fetchProjectRequestsList = async () => {
    try {
      setLoadingProjects(true);
      const res = await getAdminProjectRequests();
      setProjectRequests(res.project_requests || []);
    } catch (err) {
      console.error('Failed fetching project requests:', err);
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'inquiries') {
      fetchInquiries();
    } else if (activeTab === 'live-chats') {
      fetchConversationsList();
      const interval = setInterval(() => fetchConversationsList(true), 5000);
      return () => clearInterval(interval);
    } else if (activeTab === 'project-requests') {
      fetchProjectRequestsList();
    }
  }, [activeTab, filter, search]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages]);

  const handleOpenMessage = async (msg) => {
    try {
      const res = await getMessage(msg.id);
      setSelectedMessage(res.message);
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, is_read: true, status: 'read' } : m))
      );
    } catch (err) {
      setSelectedMessage(msg);
    }
  };

  const handleToggleRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      const res = await toggleMessageRead(id);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_read: res.is_read } : m))
      );
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage((prev) => ({ ...prev, is_read: res.is_read }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      await deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(null);
      }
    } catch (err) {
      alert('Failed to delete message.');
    }
  };

  // Open Dual-Reply Modal for an inquiry
  const handleOpenReplyModal = (msg) => {
    setReplySubject(`Re: ${msg.subject || 'Portfolio Inquiry'}`);
    setReplyText(`Hi ${msg.name},\n\nThank you for reaching out regarding "${msg.subject}".\n\nI have reviewed your message and would be happy to collaborate on this.`);
    setReplyStatusMsg(null);
    setIsReplyModalOpen(true);
  };

  // Submit Dual-Reply
  const handleSubmitDualReply = async (e) => {
    e.preventDefault();
    if (!selectedMessage || !replyText.trim()) return;

    setIsSendingReply(true);
    setReplyStatusMsg(null);

    try {
      const payload = {
        inquiry_id: selectedMessage.id,
        recipient_email: selectedMessage.email,
        reply_mode: replyMode,
        subject: replySubject,
        message: replyText,
      };

      const res = await replyToInquiry(payload);

      setReplyStatusMsg({
        success: true,
        message: res.message || 'Reply dispatched successfully!',
      });

      // Update message state locally
      setSelectedMessage((prev) => (prev ? { ...prev, status: 'replied' } : null));
      setMessages((prev) =>
        prev.map((m) => (m.id === selectedMessage.id ? { ...m, status: 'replied' } : m))
      );

      // If replied via email and fallback mailto is returned
      if (replyMode === 'email' && res.mailto_url) {
        window.open(res.mailto_url, '_blank');
      }

      setTimeout(() => {
        setIsReplyModalOpen(false);
      }, 2000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to deliver reply.';
      setReplyStatusMsg({ success: false, message: msg });
    } finally {
      setIsSendingReply(false);
    }
  };

  // Select a live conversation
  const handleSelectConversation = async (conv) => {
    setSelectedConversation(conv);
    try {
      const res = await getAdminConversation(conv.id);
      setConversationMessages(res.messages || []);
      // Reset unread count locally
      setConversations((prev) =>
        prev.map((c) => (c.id === conv.id ? { ...c, unread_client_messages_count: 0 } : c))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Admin Send Live Chat Message
  const handleSendChatMsg = async (e) => {
    e.preventDefault();
    if (!selectedConversation || !chatReplyInput.trim() || isSendingChatMsg) return;

    const text = chatReplyInput.trim();
    setChatReplyInput('');
    setIsSendingChatMsg(true);

    try {
      const res = await sendAdminConversationMessage(selectedConversation.id, {
        message: text,
      });

      if (res.message) {
        setConversationMessages((prev) => [...prev, res.message]);
      }
    } catch (err) {
      console.error('Failed to send admin message:', err);
      alert('Failed to send message to client.');
    } finally {
      setIsSendingChatMsg(false);
    }
  };

  // Update Project Request Fields (status, payment_status)
  const handleUpdateReqFields = async (reqId, updateData) => {
    try {
      await updateAdminProjectRequest(reqId, updateData);
      setProjectRequests((prev) =>
        prev.map((r) => (r.id === reqId ? { ...r, ...updateData } : r))
      );
      if (selectedProjectModal && selectedProjectModal.id === reqId) {
        setSelectedProjectModal((prev) => ({ ...prev, ...updateData }));
      }
      setProjectActionMsg('Project status updated successfully!');
      setTimeout(() => setProjectActionMsg(''), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to update project status.');
    }
  };

  // Delete Project Request
  const handleDeleteProjectRequest = async (reqId, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this project request? This action cannot be undone.')) return;
    try {
      await deleteAdminProjectRequest(reqId);
      setProjectRequests((prev) => prev.filter((r) => r.id !== reqId));
      if (selectedProjectModal && selectedProjectModal.id === reqId) {
        setSelectedProjectModal(null);
      }
      setProjectActionMsg('Project request deleted successfully.');
      setTimeout(() => setProjectActionMsg(''), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to delete project request.');
    }
  };

  const [verifyingPaymentId, setVerifyingPaymentId] = useState(null);

  // Approve Client UTR Payment
  const handleApprovePayment = async (paymentId) => {
    try {
      setVerifyingPaymentId(paymentId);
      const res = await approveAdminPayment(paymentId);
      setProjectActionMsg(res?.message || 'Payment successfully verified and approved! Project marked as paid.');
      setTimeout(() => setProjectActionMsg(''), 5000);
      const updatedReqs = await getAdminProjectRequests();
      setProjectRequests(updatedReqs.project_requests || []);
      if (selectedProjectModal) {
        const found = (updatedReqs.project_requests || []).find((r) => r.id === selectedProjectModal.id);
        if (found) setSelectedProjectModal(found);
      }
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || err?.message || 'Failed to approve payment');
    } finally {
      setVerifyingPaymentId(null);
    }
  };

  // Reject Client UTR Payment
  const handleRejectPayment = async (paymentId) => {
    const reason = window.prompt(
      'Enter reason for rejecting this UTR / Payment (will be sent to client in live chat):',
      'UTR reference was not found in our Razorpay / Bank records. Please recheck and submit your valid 12-digit UTR.'
    );
    if (reason === null) return;
    try {
      setVerifyingPaymentId(paymentId);
      const res = await rejectAdminPayment(paymentId, reason);
      setProjectActionMsg(res?.message || 'Payment UTR marked as rejected and client notified in chat.');
      setTimeout(() => setProjectActionMsg(''), 5000);
      const updatedReqs = await getAdminProjectRequests();
      setProjectRequests(updatedReqs.project_requests || []);
      if (selectedProjectModal) {
        const found = (updatedReqs.project_requests || []).find((r) => r.id === selectedProjectModal.id);
        if (found) setSelectedProjectModal(found);
      }
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || err?.message || 'Failed to reject payment');
    } finally {
      setVerifyingPaymentId(null);
    }
  };

  // Open Direct Live Chat with the Client from a Project Request
  const handleOpenClientChatFromRequest = async (userObj) => {
    if (!userObj?.id) return;
    const userId = userObj.id;
    const userEmail = userObj.email;
    setActiveTab('live-chats');

    const existing = conversations.find(
      (c) => c.user_id === userId || c.user?.id === userId || c.user?.email === userEmail
    );
    if (existing) {
      setSelectedConversation(existing);
      try {
        const convRes = await getAdminConversation(existing.id);
        setConversationMessages(convRes.messages || []);
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        const res = await getAdminConversations();
        const convs = res.conversations || [];
        setConversations(convs);
        const found = convs.find(
          (c) => c.user_id === userId || c.user?.id === userId || c.user?.email === userEmail
        );
        if (found) {
          setSelectedConversation(found);
          const convRes = await getAdminConversation(found.id);
          setConversationMessages(convRes.messages || []);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;
  const unreadChatsCount = conversations.reduce(
    (sum, c) => sum + (c.unread_client_messages_count || 0),
    0
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">Client Communication &amp; Inquiries</h2>
            {(unreadCount > 0 || unreadChatsCount > 0) && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500 text-black">
                {unreadCount + unreadChatsCount} Actionable
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Manage contact form submissions, live 1-on-1 client chat channels, and freelance project builder requests.
          </p>
        </div>

        {/* Global Refresh */}
        <button
          onClick={() => {
            if (activeTab === 'inquiries') fetchInquiries();
            if (activeTab === 'live-chats') fetchConversationsList();
            if (activeTab === 'project-requests') fetchProjectRequestsList();
          }}
          className="self-start sm:self-center inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading || loadingConversations ? 'animate-spin text-cyan-400' : ''}`} />
          <span>Sync Feed</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs Selector */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0b101e] border border-white/10 overflow-x-auto">
        <button
          onClick={() => setActiveTab('inquiries')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'inquiries'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Contact Inquiries</span>
          {unreadCount > 0 && (
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${activeTab === 'inquiries' ? 'bg-black/20 text-black' : 'bg-cyan-500/20 text-cyan-300'}`}>
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('live-chats')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'live-chats'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Client Live 1-on-1 Chats</span>
          {unreadChatsCount > 0 && (
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${activeTab === 'live-chats' ? 'bg-black/20 text-black' : 'bg-cyan-500/20 text-cyan-300'}`}>
              {unreadChatsCount} new
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('project-requests')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'project-requests'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Project Builder Requests</span>
          {projectRequests.length > 0 && (
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${activeTab === 'project-requests' ? 'bg-black/20 text-black' : 'bg-white/10 text-slate-300'}`}>
              {projectRequests.length}
            </span>
          )}
        </button>
      </div>

      {/* =========================================================================
          TAB 1: CONTACT INQUIRIES & DUAL-REPLY
          ========================================================================= */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          {/* Filters and Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 admin-card p-4 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {['all', 'unread', 'read'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors cursor-pointer ${
                    filter === f
                      ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by sender, email, or keywords..."
                className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-black/40 border border-white/10 focus:border-cyan-400 focus:outline-none text-xs text-white placeholder-slate-500"
              />
            </div>
          </div>

          {/* Messages List Table */}
          <div className="admin-card rounded-2xl border border-white/10 overflow-hidden">
            {loading ? (
              <div className="py-16 text-center text-slate-500 text-sm flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                <span>Loading inbox inquiries...</span>
              </div>
            ) : messages.length === 0 ? (
              <div className="py-16 text-center text-slate-500 text-sm">
                <Mail className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                <span>No messages found matching your criteria.</span>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => handleOpenMessage(msg)}
                    className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-all cursor-pointer ${
                      !msg.is_read ? 'bg-cyan-950/25 border-l-4 border-cyan-400' : ''
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center font-bold text-sm text-cyan-300 shrink-0">
                        {msg.name?.charAt(0) || 'U'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white text-sm">{msg.name}</span>
                          <span className="text-xs text-slate-400">&bull; {msg.email}</span>
                          {msg.phone && (
                            <a
                              href={`tel:${msg.phone}`}
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-md hover:bg-emerald-900/50 transition-colors"
                              title="Call Client"
                            >
                              <Phone className="w-3 h-3" />
                              {msg.phone}
                            </a>
                          )}
                          {!msg.is_read && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                              UNREAD
                            </span>
                          )}
                          {msg.status === 'replied' && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              REPLIED
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-medium text-slate-300 mt-1 truncate">
                          {msg.subject || 'No subject'}
                        </p>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{msg.message}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                      <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(msg.created_at).toLocaleDateString()}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMessage(msg);
                          handleOpenReplyModal(msg);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30 flex items-center gap-1.5 transition-all"
                        title="Dual-Mode Reply"
                      >
                        <Reply className="w-3.5 h-3.5" />
                        <span>Reply</span>
                      </button>

                      <button
                        onClick={(e) => handleToggleRead(msg.id, e)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-cyan-300 transition-colors"
                        title={msg.is_read ? 'Mark Unread' : 'Mark Read'}
                      >
                        <CheckCircle2 className={`w-4 h-4 ${msg.is_read ? 'text-emerald-400' : ''}`} />
                      </button>

                      <button
                        onClick={(e) => handleDelete(msg.id, e)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                        title="Delete Message"
                      >
                        <Trash2 className="w-4 h-4" />
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
          TAB 2: CLIENT LIVE 1-ON-1 CHATS
          ========================================================================= */}
      {activeTab === 'live-chats' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[650px]">
          {/* Left: Conversations List */}
          <div className="admin-card rounded-2xl border border-white/10 p-4 flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>Client Conversations</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">{conversations.length}</span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-white/5 mt-2">
              {loadingConversations && conversations.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">Loading chats...</div>
              ) : conversations.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  No active client chats yet. When clients register and send a message, it appears here live.
                </div>
              ) : (
                conversations.map((c) => {
                  const isSelected = selectedConversation?.id === c.id;
                  const unread = c.unread_client_messages_count || 0;
                  return (
                    <div
                      key={c.id}
                      onClick={() => handleSelectConversation(c)}
                      className={`p-3 rounded-xl cursor-pointer transition-all my-1 ${
                        isSelected
                          ? 'bg-cyan-500/15 border border-cyan-400/40 text-white'
                          : 'hover:bg-white/5 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs truncate max-w-[150px]">
                          {c.user?.name || 'Client'}
                        </span>
                        {unread > 0 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500 text-black">
                            {unread} new
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">{c.user?.email}</p>
                      {c.user?.phone && (
                        <p className="text-[10px] text-emerald-400 truncate mt-0.5 font-mono flex items-center gap-1">
                          <Phone className="w-2.5 h-2.5" />
                          {c.user.phone}
                        </p>
                      )}
                      <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                        {c.last_message_at ? new Date(c.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right: Selected Chat Thread & Input */}
          <div className="md:col-span-2 admin-card rounded-2xl border border-white/10 flex flex-col h-full overflow-hidden bg-slate-950/60">
            {selectedConversation ? (
              <>
                {/* Chat Topbar */}
                <div className="p-4 bg-slate-900/80 border-b border-white/10 flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-white text-sm">
                        {selectedConversation.user?.name || 'Client'}
                      </h4>
                      {selectedConversation.user?.phone && (
                        <div className="flex items-center gap-1.5">
                          <a
                            href={`tel:${selectedConversation.user.phone}`}
                            className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full hover:bg-emerald-900 transition-colors"
                            title="Call Client"
                          >
                            <Phone className="w-3 h-3" />
                            {selectedConversation.user.phone}
                          </a>
                          <a
                            href={`https://wa.me/${selectedConversation.user.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full hover:bg-emerald-900 transition-colors"
                            title="WhatsApp Client"
                          >
                            <MessageCircle className="w-3 h-3" />
                            WhatsApp
                          </a>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-mono">{selectedConversation.user?.email}</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
                    Live Portal Connected
                  </span>
                </div>

                {/* Message Stream */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {conversationMessages.length === 0 ? (
                    <div className="py-16 text-center text-xs text-slate-500">
                      No messages in this conversation yet. Send a greeting to start chatting!
                    </div>
                  ) : (
                    conversationMessages.map((msg) => {
                      const isAdmin = msg.sender_type === 'admin';
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'} space-y-1`}
                        >
                          <span className="text-[10px] font-mono text-slate-500 px-1">
                            {isAdmin ? 'You (Vikash)' : selectedConversation.user?.name || 'Client'} •{' '}
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <div
                            className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                              isAdmin
                                ? 'bg-cyan-600 text-white rounded-tr-none'
                                : 'bg-slate-800 text-slate-100 border border-white/10 rounded-tl-none'
                            }`}
                          >
                            {msg.message}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={chatBottomRef} />
                </div>

                {/* Admin Chat Input */}
                <form onSubmit={handleSendChatMsg} className="p-3 bg-slate-900 border-t border-white/10 flex items-center gap-2">
                  <input
                    type="text"
                    value={chatReplyInput}
                    onChange={(e) => setChatReplyInput(e.target.value)}
                    placeholder={`Reply directly to ${selectedConversation.user?.name || 'client'}...`}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    disabled={!chatReplyInput.trim() || isSendingChatMsg}
                    className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-3">
                <MessageSquare className="w-10 h-10 text-slate-700" />
                <p className="text-sm font-semibold text-slate-400">Select a Client Conversation</p>
                <p className="text-xs max-w-xs">
                  Pick any client from the left column to view their live conversation history and respond in real-time.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: INCOMING PROJECT BUILDER REQUESTS (FULLY FEATURED)
          ========================================================================= */}
      {activeTab === 'project-requests' && (
        <div className="space-y-5">
          {/* Action toast feedback */}
          {projectActionMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{projectActionMsg}</span>
              </div>
              <button
                onClick={() => setProjectActionMsg('')}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Top Control Bar: Search & Status Filters */}
          <div className="admin-card rounded-2xl border border-white/10 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-cyan-400" />
                  <span>Client Freelance Project Requests</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage custom project specifications, token advances, deliverable status, and client chat handoffs.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchProjectRequestsList}
                  disabled={loadingProjects}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Refresh list"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingProjects ? 'animate-spin text-cyan-400' : ''}`} />
                  <span>Refresh</span>
                </button>
                <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                  {projectRequests.length} Total Requests
                </span>
              </div>
            </div>

            {/* Filter Tabs & Search Row */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-2 border-t border-white/5">
              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'all', label: 'All Requests' },
                  { id: 'pending_verification', label: '⏳ Pending UTR' },
                  { id: 'paid', label: 'Paid Token' },
                  { id: 'pending', label: 'Pending Spec' },
                  { id: 'in_progress', label: 'In Progress' },
                  { id: 'completed', label: 'Completed' },
                  { id: 'cancelled', label: 'Cancelled' },
                ].map((tab) => {
                  const isActive = projectFilter === tab.id;
                  const count =
                    tab.id === 'all'
                      ? projectRequests.length
                      : tab.id === 'pending_verification'
                      ? projectRequests.filter(
                          (r) =>
                            r.payment_status === 'pending_verification' ||
                            (r.payments || []).some((p) => p.status === 'pending_verification')
                        ).length
                      : tab.id === 'paid'
                      ? projectRequests.filter((r) => r.payment_status === 'paid').length
                      : projectRequests.filter((r) => r.status === tab.id).length;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setProjectFilter(tab.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/25'
                          : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                          isActive ? 'bg-black/20 text-black' : 'bg-white/10 text-slate-300'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search Bar */}
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  placeholder="Search client, title, category..."
                  className="w-full pl-9 pr-3.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                />
                {projectSearch && (
                  <button
                    onClick={() => setProjectSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* List of Requests */}
          {loadingProjects ? (
            <div className="admin-card rounded-2xl border border-white/10 p-12 text-center text-xs text-slate-400">
              <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin mx-auto mb-2" />
              <span>Fetching project builder requests...</span>
            </div>
          ) : (() => {
            const filtered = projectRequests.filter((req) => {
              if (projectFilter === 'pending_verification') {
                const hasPending =
                  req.payment_status === 'pending_verification' ||
                  (req.payments || []).some((p) => p.status === 'pending_verification');
                if (!hasPending) return false;
              }
              if (projectFilter === 'pending' && req.status !== 'pending') return false;
              if (projectFilter === 'in_progress' && req.status !== 'in_progress') return false;
              if (projectFilter === 'completed' && req.status !== 'completed') return false;
              if (projectFilter === 'cancelled' && req.status !== 'cancelled') return false;
              if (projectFilter === 'paid' && req.payment_status !== 'paid') return false;

              if (projectSearch.trim()) {
                const q = projectSearch.toLowerCase();
                const matchTitle = (req.title || '').toLowerCase().includes(q);
                const matchCat = (req.category || '').toLowerCase().includes(q);
                const matchClient = (req.user?.name || '').toLowerCase().includes(q);
                const matchEmail = (req.user?.email || '').toLowerCase().includes(q);
                const matchDesc = (req.description || '').toLowerCase().includes(q);
                if (!matchTitle && !matchCat && !matchClient && !matchEmail && !matchDesc) {
                  return false;
                }
              }
              return true;
            });

            if (filtered.length === 0) {
              return (
                <div className="admin-card rounded-2xl border border-white/10 p-12 text-center text-xs text-slate-400 space-y-2">
                  <Briefcase className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="font-semibold text-white">No project builder requests found</p>
                  <p className="text-slate-500">
                    {projectSearch
                      ? `No requests match "${projectSearch}". Try clearing the search query.`
                      : 'Client orders and custom specs will show up here.'}
                  </p>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filtered.map((req) => {
                  const features = Array.isArray(req.features_json)
                    ? req.features_json
                    : typeof req.features_json === 'string'
                    ? JSON.parse(req.features_json || '[]')
                    : [];

                  const paymentsCount = req.payments?.length || 0;
                  const totalPaid = (req.payments || [])
                    .filter((p) => p.status === 'paid' || p.status === 'captured')
                    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

                  return (
                    <div
                      key={req.id}
                      className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
                    >
                      {/* Top Header */}
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 font-bold">
                                {req.category || 'General'}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                #{req.id} &bull; {new Date(req.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <h4 className="text-base font-bold text-white leading-snug">
                              {req.title}
                            </h4>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Project Status Pill */}
                            <span
                              className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-xl border ${
                                req.status === 'completed'
                                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                  : req.status === 'in_progress'
                                  ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                                  : req.status === 'cancelled'
                                  ? 'bg-slate-700/30 text-slate-400 border-slate-700'
                                  : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                              }`}
                            >
                              {req.status === 'in_progress' ? 'In Progress' : req.status}
                            </span>
                          </div>
                        </div>

                        {/* Client details snippet */}
                        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300">
                          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs shrink-0">
                            {req.user?.name ? req.user.name.charAt(0) : 'C'}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <strong className="text-white block truncate">{req.user?.name || 'Client'}</strong>
                              {req.user?.phone && (
                                <a
                                  href={`tel:${req.user.phone}`}
                                  className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded-md hover:bg-emerald-900 transition-colors"
                                  title="Call Client"
                                >
                                  <Phone className="w-2.5 h-2.5" />
                                  {req.user.phone}
                                </a>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono truncate block">
                              {req.user?.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {req.user?.phone && (
                              <a
                                href={`https://wa.me/${req.user.phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-400/30 text-[11px] font-bold flex items-center gap-1 transition-colors"
                                title="WhatsApp Client"
                              >
                                <MessageCircle className="w-3 h-3" />
                                <span>WA</span>
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => handleOpenClientChatFromRequest(req.user)}
                              className="px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                              title="Open 1-on-1 Live Chat with this client"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Chat</span>
                            </button>
                          </div>
                        </div>

                        {/* Chosen Template preview (if attached) */}
                        {req.template_project && (
                          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs">
                            {req.template_project.image_url ? (
                              <img
                                src={req.template_project.image_url}
                                alt={req.template_project.title}
                                className="w-10 h-8 rounded-lg object-cover shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">
                                <Layers className="w-4 h-4" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1 text-[11px]">
                              <span className="text-slate-400 block font-mono">Base Template:</span>
                              <strong className="text-cyan-300 truncate block">
                                {req.template_project.title}
                              </strong>
                            </div>
                          </div>
                        )}

                        {/* Description Preview */}
                        <p className="text-xs text-slate-300 leading-relaxed bg-black/20 p-3 rounded-xl border border-white/5 line-clamp-3">
                          {req.description}
                        </p>

                        {/* Features chips snippet */}
                        {features.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {features.slice(0, 4).map((f, fIdx) => (
                              <span
                                key={fIdx}
                                className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/10"
                              >
                                &check; {f}
                              </span>
                            ))}
                            {features.length > 4 && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-slate-400">
                                +{features.length - 4} more
                              </span>
                            )}
                          </div>
                        )}

                        {/* PENDING UTR VERIFICATION BANNER */}
                        {(() => {
                          const pendingPayment =
                            (req.payments || []).find((p) => p.status === 'pending_verification') ||
                            (req.payment_status === 'pending_verification'
                              ? req.payments?.[0] || { id: null, amount: 0, transaction_ref: 'Submitted via Link' }
                              : null);

                          if (!pendingPayment && req.payment_status !== 'pending_verification') return null;

                          return (
                            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2.5 mt-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 font-bold text-amber-300">
                                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
                                  <span>Client Submitted Payment UTR (Pending Verification)</span>
                                </div>
                                <span className="font-mono text-[11px] font-bold bg-amber-500/20 px-2 py-0.5 rounded text-amber-300 border border-amber-500/30">
                                  ₹{Number(pendingPayment?.amount || 0).toLocaleString()}
                                </span>
                              </div>

                              <div className="flex items-center justify-between bg-black/60 p-2.5 rounded-lg border border-amber-500/20 text-xs font-mono">
                                <div className="truncate mr-2">
                                  <span className="text-slate-400 text-[10px] block">Submitted Bank UTR / UPI Ref:</span>
                                  <strong className="text-white select-all text-xs tracking-wider">
                                    {pendingPayment?.transaction_ref || pendingPayment?.razorpay_payment_id || 'Reference provided'}
                                  </strong>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(pendingPayment?.transaction_ref || pendingPayment?.razorpay_payment_id || '');
                                    setProjectActionMsg('UTR copied to clipboard!');
                                    setTimeout(() => setProjectActionMsg(''), 2500);
                                  }}
                                  className="text-[10px] text-cyan-400 hover:text-cyan-300 underline shrink-0 cursor-pointer font-sans"
                                >
                                  Copy UTR
                                </button>
                              </div>

                              <div className="flex items-center gap-2 pt-1">
                                {pendingPayment?.id ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleApprovePayment(pendingPayment.id)}
                                      disabled={verifyingPaymentId === pendingPayment.id}
                                      className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                      <span>{verifyingPaymentId === pendingPayment.id ? 'Approving...' : '✓ Verify & Approve'}</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRejectPayment(pendingPayment.id)}
                                      disabled={verifyingPaymentId === pendingPayment.id}
                                      className="py-1.5 px-3 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                      <span>Reject</span>
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateReqFields(req.id, { payment_status: 'paid' })}
                                    className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Mark as Paid</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Bottom Metrics & Actions */}
                      <div className="space-y-3 pt-3 border-t border-white/10">
                        {/* Scope & Payment Summary */}
                        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                          <div className="flex items-center gap-3 text-slate-400">
                            <span>Budget: <strong className="text-white">{req.budget_range}</strong></span>
                            <span>&bull;</span>
                            <span>Timeline: <strong className="text-white">{req.timeline}</strong></span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-400">Payment:</span>
                            <span
                              className={`font-bold px-2 py-0.5 rounded-md border ${
                                req.payment_status === 'paid'
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                  : req.payment_status === 'pending_verification'
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                                  : req.payment_status === 'partial'
                                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                                  : req.payment_status === 'refunded'
                                  ? 'bg-slate-700 text-slate-300 border-slate-600'
                                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                              }`}
                            >
                              {req.payment_status === 'pending_verification' ? 'Pending UTR' : (req.payment_status || 'unpaid')}
                            </span>
                            {totalPaid > 0 && (
                              <span className="text-emerald-400 font-bold">
                                (₹{totalPaid.toLocaleString()})
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Status Selectors & Action Buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                          <div className="flex items-center gap-2">
                            {/* Project Status Selector */}
                            <select
                              value={req.status}
                              onChange={(e) => handleUpdateReqFields(req.id, { status: e.target.value })}
                              className="text-[11px] font-mono font-semibold px-2.5 py-1.5 rounded-xl bg-slate-900 border border-white/20 text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                              title="Update Project Deliverable Status"
                            >
                              <option value="pending">Status: Pending</option>
                              <option value="in_progress">Status: In Progress</option>
                              <option value="completed">Status: Completed</option>
                              <option value="cancelled">Status: Cancelled</option>
                            </select>

                            {/* Payment Status Selector */}
                            <select
                              value={req.payment_status || 'unpaid'}
                              onChange={(e) => handleUpdateReqFields(req.id, { payment_status: e.target.value })}
                              className="text-[11px] font-mono font-semibold px-2.5 py-1.5 rounded-xl bg-slate-900 border border-white/20 text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                              title="Update Razorpay Payment Status"
                            >
                              <option value="unpaid">Pay: Unpaid</option>
                              <option value="pending_verification">Pay: Pending UTR</option>
                              <option value="partial">Pay: Partial</option>
                              <option value="paid">Pay: Paid Full</option>
                              <option value="refunded">Pay: Refunded</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Full Scope Modal Trigger */}
                            <button
                              type="button"
                              onClick={() => setSelectedProjectModal(req)}
                              className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                              title="View Full Scope & Payment Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Details</span>
                            </button>

                            {/* Delete Request Button */}
                            <button
                              type="button"
                              onClick={(e) => handleDeleteProjectRequest(req.id, e)}
                              className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/25 text-red-400 border border-red-500/25 text-xs font-semibold cursor-pointer transition-colors"
                              title="Delete this project request"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {/* =========================================================================
          FULL SCOPE & PAYMENT DETAILS MODAL FOR PROJECT REQUEST
          ========================================================================= */}
      {selectedProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="admin-card border border-white/20 rounded-2xl max-w-3xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative space-y-6">
            <button
              onClick={() => setSelectedProjectModal(null)}
              className="absolute top-5 right-5 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title & Meta */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  REQUEST #{selectedProjectModal.id}
                </span>
                <span className="text-xs font-mono uppercase px-2 py-0.5 rounded-md bg-white/10 text-slate-300">
                  {selectedProjectModal.category}
                </span>
              </div>
              <h3 className="text-2xl font-black text-white">
                {selectedProjectModal.title}
              </h3>
              <p className="text-xs font-mono text-slate-400">
                Submitted on {new Date(selectedProjectModal.created_at).toLocaleString()}
              </p>
            </div>

            {/* Client Info Card */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-bold text-base flex items-center justify-center shrink-0 shadow-md">
                  {selectedProjectModal.user?.name ? selectedProjectModal.user.name.charAt(0) : 'C'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {selectedProjectModal.user?.name || 'Registered Client'}
                  </h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={`mailto:${selectedProjectModal.user?.email}`}
                      className="text-xs text-cyan-400 hover:underline font-mono"
                    >
                      {selectedProjectModal.user?.email}
                    </a>
                    {selectedProjectModal.user?.phone && (
                      <>
                        <span className="text-xs text-slate-500 font-mono">&bull;</span>
                        <a
                          href={`tel:${selectedProjectModal.user.phone}`}
                          className="text-xs text-emerald-400 hover:underline font-mono inline-flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          {selectedProjectModal.user.phone}
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {selectedProjectModal.user?.phone && (
                  <>
                    <a
                      href={`tel:${selectedProjectModal.user.phone}`}
                      className="px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                      title="Call Client Phone"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </a>
                    <a
                      href={`https://wa.me/${selectedProjectModal.user.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-400/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                      title="Chat on WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => {
                    const u = selectedProjectModal.user;
                    setSelectedProjectModal(null);
                    handleOpenClientChatFromRequest(u);
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Open 1-on-1 Chat</span>
                </button>
              </div>
            </div>

            {/* Template Chosen Card (if any) */}
            {selectedProjectModal.template_project && (
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
                <span className="text-[11px] font-mono uppercase text-cyan-300 font-bold block">
                  Chosen Base Showcase Template
                </span>
                <div className="flex items-center gap-3">
                  {selectedProjectModal.template_project.image_url && (
                    <img
                      src={selectedProjectModal.template_project.image_url}
                      alt={selectedProjectModal.template_project.title}
                      className="w-16 h-12 rounded-lg object-cover border border-white/10"
                    />
                  )}
                  <div>
                    <h5 className="text-sm font-bold text-white">
                      {selectedProjectModal.template_project.title}
                    </h5>
                    <span className="text-xs text-slate-400 font-mono">
                      Category: {selectedProjectModal.template_project.category}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Scope & Description */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-2">
                Full Project Specification / Client Requirements
              </h4>
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                {selectedProjectModal.description}
              </div>
            </div>

            {/* Features Requested Checklist */}
            {(() => {
              const feats = Array.isArray(selectedProjectModal.features_json)
                ? selectedProjectModal.features_json
                : typeof selectedProjectModal.features_json === 'string'
                ? JSON.parse(selectedProjectModal.features_json || '[]')
                : [];

              if (feats.length === 0) return null;

              return (
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-2">
                    Selected Architectural Features & Modules ({feats.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {feats.map((feat, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200 flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Budget, Timeline & Payments Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[11px] font-mono text-slate-400 block">Budget Range</span>
                <input
                  type="text"
                  value={selectedProjectModal.budget_range || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedProjectModal((prev) => ({ ...prev, budget_range: val }));
                  }}
                  onBlur={(e) =>
                    handleUpdateReqFields(selectedProjectModal.id, { budget_range: e.target.value })
                  }
                  placeholder="₹15,000 - ₹35,000"
                  className="w-full text-sm text-white font-mono mt-1 px-2.5 py-1 rounded-lg bg-black/50 border border-white/10 focus:border-cyan-400 focus:outline-none"
                  title="Click to edit budget range"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[11px] font-mono text-slate-400 block">Target Timeline</span>
                <input
                  type="text"
                  value={selectedProjectModal.timeline || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedProjectModal((prev) => ({ ...prev, timeline: val }));
                  }}
                  onBlur={(e) =>
                    handleUpdateReqFields(selectedProjectModal.id, { timeline: e.target.value })
                  }
                  placeholder="2 - 3 Weeks"
                  className="w-full text-sm text-white font-mono mt-1 px-2.5 py-1 rounded-lg bg-black/50 border border-white/10 focus:border-cyan-400 focus:outline-none"
                  title="Click to edit timeline"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[11px] font-mono text-slate-400 block">Payment Status</span>
                <strong
                  className={`text-base font-mono mt-0.5 block ${
                    selectedProjectModal.payment_status === 'paid'
                      ? 'text-emerald-400'
                      : selectedProjectModal.payment_status === 'pending_verification'
                      ? 'text-amber-400 animate-pulse'
                      : selectedProjectModal.payment_status === 'partial'
                      ? 'text-blue-400'
                      : 'text-rose-400'
                  }`}
                >
                  {selectedProjectModal.payment_status === 'pending_verification'
                    ? 'Pending UTR Verification'
                    : (selectedProjectModal.payment_status || 'unpaid')}
                </strong>
              </div>
            </div>

            {/* Razorpay Payments History Table */}
            {selectedProjectModal.payments && selectedProjectModal.payments.length > 0 && (
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-2 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Razorpay Payment Transactions ({selectedProjectModal.payments.length})</span>
                </h4>
                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/5 text-slate-400 font-mono text-[11px]">
                      <tr>
                        <th className="p-3">Payment ID / Bank UTR</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Status & Action</th>
                        <th className="p-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {selectedProjectModal.payments.map((p) => (
                        <tr key={p.id}>
                          <td className="p-3 font-mono text-cyan-300">
                            <div>{p.razorpay_payment_id || 'Manual / Token'}</div>
                            {p.transaction_ref && (
                              <div className="text-[10px] text-amber-300 font-bold select-all">UTR: {p.transaction_ref}</div>
                            )}
                            {p.razorpay_order_id && (
                              <div className="text-[10px] text-slate-500">{p.razorpay_order_id}</div>
                            )}
                          </td>
                          <td className="p-3 font-mono font-bold text-white">
                            ₹{Number(p.amount).toLocaleString()} {p.currency || 'INR'}
                          </td>
                          <td className="p-3">
                            <div className="space-y-1">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block ${
                                  p.status === 'paid' || p.status === 'captured'
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                    : p.status === 'pending_verification'
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse'
                                    : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                                }`}
                              >
                                {p.status === 'pending_verification' ? 'Pending UTR Verification' : p.status}
                              </span>
                              {p.status === 'pending_verification' && (
                                <div className="flex items-center gap-1.5 pt-1">
                                  <button
                                    type="button"
                                    onClick={() => handleApprovePayment(p.id)}
                                    disabled={verifyingPaymentId === p.id}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1 shadow-sm"
                                  >
                                    <Check className="w-3 h-3" />
                                    <span>Approve</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRejectPayment(p.id)}
                                    disabled={verifyingPaymentId === p.id}
                                    className="px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1"
                                  >
                                    <X className="w-3 h-3" />
                                    <span>Reject</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-3 font-mono text-slate-400 text-[11px]">
                            {new Date(p.created_at).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* In-Modal Controls */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">
                    Deliverable Status
                  </label>
                  <select
                    value={selectedProjectModal.status}
                    onChange={(e) =>
                      handleUpdateReqFields(selectedProjectModal.id, { status: e.target.value })
                    }
                    className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-slate-900 border border-white/20 text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">
                    Payment Status
                  </label>
                  <select
                    value={selectedProjectModal.payment_status || 'unpaid'}
                    onChange={(e) =>
                      handleUpdateReqFields(selectedProjectModal.id, { payment_status: e.target.value })
                    }
                    className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-slate-900 border border-white/20 text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="pending_verification">Pending UTR Verification</option>
                    <option value="partial">Partial</option>
                    <option value="paid">Paid</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {selectedProjectModal.user && (
                  <button
                    type="button"
                    onClick={() => {
                      const clientUser = selectedProjectModal.user;
                      setSelectedProjectModal(null);
                      handleOpenClientChatFromRequest(clientUser);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                    title="Open live chat with client"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Chat with Client</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={(e) => handleDeleteProjectRequest(selectedProjectModal.id, e)}
                  className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/25 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Request</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedProjectModal(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MESSAGE READER & DUAL-REPLY MODAL
          ========================================================================= */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="admin-card border border-white/20 rounded-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-5 right-5 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                INQUIRY #{selectedMessage.id}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {new Date(selectedMessage.created_at).toLocaleString()}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              {selectedMessage.subject || 'Portfolio Inquiry'}
            </h3>

            {/* Sender details card */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/5 space-y-2 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div>
                  <span className="text-slate-400">Sender: </span>
                  <strong className="text-white">{selectedMessage.name}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Email: </span>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-cyan-400 hover:underline font-medium"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
              </div>
              {selectedMessage.phone && (
                <div className="text-xs text-slate-300 flex items-center gap-2 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Phone:</span>
                    <a
                      href={`tel:${selectedMessage.phone}`}
                      className="text-emerald-400 font-mono hover:underline font-semibold"
                    >
                      {selectedMessage.phone}
                    </a>
                  </span>
                  <a
                    href={`tel:${selectedMessage.phone}`}
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md hover:bg-emerald-900 transition-colors"
                  >
                    Call
                  </a>
                  <a
                    href={`https://wa.me/${selectedMessage.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md hover:bg-emerald-900 transition-colors"
                  >
                    <MessageCircle className="w-3 h-3" />
                    WhatsApp
                  </a>
                </div>
              )}
              {selectedMessage.ip_address && (
                <div className="text-xs text-slate-500 font-mono flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  <span>IP: {selectedMessage.ip_address}</span>
                </div>
              )}
            </div>

            {/* Message Body */}
            <div className="mb-6">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                Inquiry Content
              </h4>
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                {selectedMessage.message}
              </div>
            </div>

            {/* Dual Reply Action Card */}
            <div className="p-5 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Reply className="w-4 h-4" />
                  <span>Choose Reply Delivery Channel</span>
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">Vikash's Dual-Channel Reply</span>
              </div>

              {/* Reply Mode Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setReplyMode('account')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    replyMode === 'account'
                      ? 'bg-cyan-500/20 border-cyan-400 text-white'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Option 1: Client Account</span>
                    </span>
                    {replyMode === 'account' && <Check className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Send directly into their 1-on-1 Client Portal live chat.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setReplyMode('email')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    replyMode === 'email'
                      ? 'bg-cyan-500/20 border-cyan-400 text-white'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Option 2: Direct Email</span>
                    </span>
                    {replyMode === 'email' && <Check className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Send email to {selectedMessage.email}.
                  </p>
                </button>
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSubmitDualReply} className="space-y-3 pt-2">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Subject</label>
                  <input
                    type="text"
                    value={replySubject}
                    onChange={(e) => setReplySubject(e.target.value)}
                    placeholder="Subject line..."
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Reply Message</label>
                  <textarea
                    rows={3}
                    required
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply to the client..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                  ></textarea>
                </div>

                {replyStatusMsg && (
                  <div
                    className={`p-3 rounded-xl text-xs ${
                      replyStatusMsg.success
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}
                  >
                    {replyStatusMsg.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSendingReply}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs shadow-lg shadow-cyan-500/25 inline-flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {isSendingReply
                      ? 'Transmitting Reply...'
                      : replyMode === 'account'
                      ? 'Deliver to Client Live Account'
                      : 'Send via Direct Email'}
                  </span>
                </button>
              </form>
            </div>

            {/* Bottom Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleRead(selectedMessage.id)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>{selectedMessage.is_read ? 'Mark Unread' : 'Mark Read'}</span>
                </button>
              </div>

              <button
                onClick={() => handleDelete(selectedMessage.id)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold border border-red-500/20 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
