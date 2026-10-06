import React, { useState, useEffect } from 'react';
import {
  Inbox, Star, Bell, Search, Mail, Reply, Trash2, CheckCircle2,
  Download, Filter, ChevronRight, Eye, Phone, Clock, Globe, Shield
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getMessages, markMessageRead, updateMessageStatus, replyMessage, deleteMessage, exportMessages,
  adminGetTestimonials, adminToggleApproveTestimonial, adminToggleFeatureTestimonial, adminDeleteTestimonial,
  getNotifications, markNotificationRead, markAllNotificationsRead
} from '@/api/adminApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';

export default function CommunicationView({ section = 'inbox' }) {
  const [messages, setMessages] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMessage, setActiveMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyModalOpen, setReplyModalOpen] = useState(false);

  // Reviews
  const [reviews, setReviews] = useState([]);

  // Notifications
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadData();
  }, [section, statusFilter]);

  const loadData = async () => {
    try {
      if (section === 'inbox') {
        const res = await getMessages({ status: statusFilter, search: searchQuery });
        if (res.data?.data) {
          setMessages(res.data.data.data || res.data.data || []);
        }
      } else if (section === 'reviews') {
        const res = await adminGetTestimonials();
        if (res.data?.data) setReviews(res.data.data);
      } else if (section === 'notifications') {
        const res = await getNotifications();
        if (res.data?.data) {
          setNotifications(res.data.data.notifications || []);
          setUnreadCount(res.data.data.unread_count || 0);
        }
      }
    } catch (e) {
      toast.error('Failed to load communication data');
    }
  };

  const handleReply = async () => {
    if (!activeMessage || !replyText.trim()) return;
    try {
      await replyMessage(activeMessage.id, replyText);
      toast.success('Reply saved and message marked as replied');
      setReplyModalOpen(false);
      setReplyText('');
      loadData();
    } catch (e) {
      toast.error('Failed to send reply');
    }
  };

  const handleOpenGmail = async () => {
    if (!activeMessage) return;
    const content = replyText.trim() || `Hi ${activeMessage.name},\n\nThank you for reaching out through my portfolio website.\n\nBest regards,\nVikash Kumar`;
    const subject = `Re: ${activeMessage.subject || 'Portfolio Inquiry'} - Vikash Kumar`;

    try {
      await replyMessage(activeMessage.id, content);
      toast.success('Reply saved & opening Gmail...');
      loadData();
    } catch (e) {
      console.error(e);
    }

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(activeMessage.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(content)}`;
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    setReplyModalOpen(false);
  };

  const handleExport = async () => {
    try {
      const res = await exportMessages();
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(res.data?.data || []));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', 'portfolio-messages.json');
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success('Messages exported');
    } catch (e) {
      toast.error('Failed to export');
    }
  };

  return (
    <div className="space-y-6">
      {/* ===================== INBOX ===================== */}
      {section === 'inbox' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Inbox className="w-5 h-5 text-emerald-400" />
                Contact Messages & Inquiries
              </h2>
              <p className="text-xs text-slate-400">Manage all messages received from the public portfolio contact form</p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleExport} size="sm" variant="outline">
                <Download className="w-3.5 h-3.5" /> Export JSON
              </Button>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {['all', 'new', 'read', 'replied', 'archived', 'spam'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                    statusFilter === st ? 'bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="w-full sm:w-64">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') loadData(); }}
                placeholder="Search by name, email, query..."
                className="h-8 text-xs"
              />
            </div>
          </div>

          {/* Message List */}
          <div className="space-y-3">
            {messages.length === 0 ? (
              <Card className="p-8 text-center text-slate-500 text-xs">
                No messages found under "{statusFilter}" status.
              </Card>
            ) : (
              messages.map((msg) => (
                <Card
                  key={msg.id}
                  className={`p-4 transition-colors ${
                    msg.status === 'new' ? 'border-emerald-500/40 bg-slate-900/90' : 'bg-slate-900/40'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white text-sm">{msg.name}</span>
                        <span className="text-xs text-slate-400 font-mono">({msg.email})</span>
                        {msg.phone && (
                          <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                            <Phone className="w-3 h-3 text-emerald-400" /> {msg.phone}
                          </span>
                        )}
                        <Badge
                          variant={
                            msg.status === 'new' ? 'warning' :
                            msg.status === 'replied' ? 'default' :
                            msg.status === 'spam' ? 'danger' : 'secondary'
                          }
                        >
                          {msg.status.toUpperCase()}
                        </Badge>
                      </div>

                      {msg.subject && (
                        <h4 className="text-xs font-semibold text-emerald-400">{msg.subject}</h4>
                      )}

                      <p className="text-xs text-slate-200 leading-relaxed pt-1 bg-slate-950/40 p-3 rounded-lg border border-slate-800/80">
                        {msg.message}
                      </p>

                      {msg.reply_content && (
                        <div className="text-xs text-emerald-300 bg-emerald-950/20 border-l-2 border-emerald-400 p-2.5 rounded-r-lg mt-2">
                          <span className="font-semibold block text-[10px] uppercase font-mono text-emerald-400">
                            Reply Recorded ({msg.replied_at ? new Date(msg.replied_at).toLocaleDateString() : 'Sent'}):
                          </span>
                          {msg.reply_content}
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-[10px] text-slate-500 font-mono pt-1">
                        <span>Submitted: {new Date(msg.created_at).toLocaleString()}</span>
                        {msg.ip_address && <span>IP: {msg.ip_address}</span>}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 self-end md:self-start">
                      <Button
                        onClick={() => {
                          setActiveMessage(msg);
                          setReplyText(
                            msg.reply_content ||
                            `Hi ${msg.name},\n\nThank you for reaching out through my portfolio website regarding "${msg.subject || 'your inquiry'}".\n\n\n\nBest regards,\nVikash Kumar`
                          );
                          setReplyModalOpen(true);
                        }}
                        size="sm"
                        variant="default"
                      >
                        <Reply className="w-3 h-3" /> Reply
                      </Button>

                      <select
                        value={msg.status}
                        onChange={async (e) => {
                          await updateMessageStatus(msg.id, e.target.value);
                          toast.success('Status updated');
                          loadData();
                        }}
                        className="bg-slate-800 text-slate-300 text-xs rounded-lg px-2 py-1.5 border border-slate-700"
                      >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                        <option value="archived">Archived</option>
                        <option value="spam">Spam</option>
                      </select>

                      <button
                        onClick={async () => {
                          if (confirm('Delete this message?')) {
                            await deleteMessage(msg.id);
                            toast.success('Deleted');
                            loadData();
                          }
                        }}
                        className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* ===================== REVIEWS / TESTIMONIALS ===================== */}
      {section === 'reviews' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                Reviews & Visitor Endorsements
              </h2>
              <p className="text-xs text-slate-400">Public submissions remain pending until approved here</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <Card key={rev.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-bold text-white text-sm">{rev.name}</span>
                    <span className="text-xs text-slate-400 block">{rev.designation} &middot; {rev.company}</span>
                    <div className="flex items-center gap-1 text-yellow-400 mt-1">
                      {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400" />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={async () => {
                        await adminToggleApproveTestimonial(rev.id);
                        toast.success('Approval status updated');
                        loadData();
                      }}
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        rev.is_approved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {rev.is_approved ? '✓ Approved' : '⏳ Pending'}
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm('Delete review?')) {
                          await adminDeleteTestimonial(rev.id);
                          loadData();
                        }
                      }}
                      className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-300 italic bg-slate-950/40 p-3 rounded-lg border border-slate-800">
                  "{rev.content}"
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ===================== NOTIFICATIONS CENTER ===================== */}
      {section === 'notifications' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-emerald-400" />
                Notification Center ({unreadCount} Unread)
              </h2>
              <p className="text-xs text-slate-400">Automated event alerts for new inquiries, review submissions, and security milestones</p>
            </div>
            {unreadCount > 0 && (
              <Button onClick={async () => { await markAllNotificationsRead(); loadData(); }} size="sm" variant="outline">
                Mark All as Read
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {notifications.length === 0 ? (
              <Card className="p-8 text-center text-slate-500 text-xs">No notifications logged yet.</Card>
            ) : (
              notifications.map((notif) => (
                <Card
                  key={notif.id}
                  className={`p-4 flex items-center justify-between gap-4 ${
                    notif.is_read ? 'bg-slate-900/40' : 'bg-slate-900 border-emerald-500/30'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{notif.title}</span>
                      <Badge variant={notif.type === 'message' ? 'primary' : notif.type === 'review' ? 'warning' : 'default'}>
                        {notif.type}
                      </Badge>
                      {!notif.is_read && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                    </div>
                    <p className="text-xs text-slate-300">{notif.message}</p>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      {new Date(notif.created_at).toLocaleString()}
                    </span>
                  </div>

                  {!notif.is_read && (
                    <Button
                      onClick={async () => {
                        await markNotificationRead(notif.id);
                        loadData();
                      }}
                      size="sm"
                      variant="ghost"
                    >
                      Mark Read
                    </Button>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* Reply Dialog */}
      <Dialog
        open={replyModalOpen}
        onClose={() => setReplyModalOpen(false)}
        title={`Reply to ${activeMessage?.name}`}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs bg-slate-900 border border-slate-800 p-2.5 rounded-lg">
            <span className="text-slate-400 font-mono">Visitor Email:</span>
            <span className="font-semibold text-emerald-400 font-mono">{activeMessage?.email}</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs space-y-1">
            <span className="text-slate-400 block font-mono text-[10px] uppercase">Original Message:</span>
            <p className="text-slate-200 text-xs leading-relaxed">{activeMessage?.message}</p>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Your Reply</label>
            <Textarea
              rows={6}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Hi there, thank you for reaching out..."
              className="font-sans text-xs leading-relaxed"
            />
          </div>

          <p className="text-[11px] text-slate-400 bg-blue-950/20 border border-blue-500/20 p-2.5 rounded-lg leading-relaxed">
            💡 <strong>Reply Delivery:</strong> Type your reply above. Clicking <strong>"Open in Gmail (Pre-filled)"</strong> will auto-save your reply and open Gmail with recipient, subject, and this exact message pre-filled.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-3 border-t border-slate-800/80">
            <Button
              type="button"
              onClick={handleOpenGmail}
              className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-rose-950/40 cursor-pointer"
              title="Opens Gmail in browser with recipient, subject, and this exact message pre-filled!"
            >
              <Mail className="w-3.5 h-3.5" /> Open in Gmail (Pre-filled)
            </Button>

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setReplyModalOpen(false)}>Cancel</Button>
              <Button variant="default" onClick={handleReply}>Save & Record Reply</Button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
