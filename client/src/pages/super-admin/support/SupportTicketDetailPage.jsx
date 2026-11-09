import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { StatusBadge, Button, Card, FormField, Textarea, Select } from '../../../components/ui';
import { useToast } from '../../../context/ToastContext';
import { hotelApi } from '../../../services/hotelApi';
import {
  ArrowLeft,
  LifeBuoy,
  Clock,
  Send,
  UserCheck,
  ShieldCheck,
  Building2,
  Calendar,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';

export const SupportTicketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [assignedAgent, setAssignedAgent] = useState('Alexander Cross (Senior Fintech Engineer)');
  const [ticketStatus, setTicketStatus] = useState('in_progress');
  const [isSending, setIsSending] = useState(false);
  const [isUpdatingClearance, setIsUpdatingClearance] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchTicket = async () => {
      try {
        setIsLoading(true);
        const data = await hotelApi.getSupportTickets();
        if (isMounted && Array.isArray(data)) {
          const matched = data.find(t => String(t.id) === String(id) || String(t.ticket_id || t.ticketId) === String(id));
          if (matched) {
            setTicket(matched);
            setAssignedAgent(matched.assigned_agent || matched.assignedAgent || 'Alexander Cross (Senior Fintech Engineer)');
            setTicketStatus(matched.status || 'in_progress');
            return;
          }
        }
      } catch (err) {
        console.warn('Could not fetch ticket from MySQL:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchTicket();
    return () => { isMounted = false; };
  }, [id]);

  if (isLoading && !ticket) {
    return (
      <div className="space-y-6 p-8 text-center text-xs text-charcoal-muted">
        <p className="animate-pulse">Loading support ticket details from database...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="space-y-6 p-6">
        <Link to="/super-admin/support/tickets" className="text-xs text-charcoal-muted hover:text-accent">
          ← Back to Support Desk
        </Link>
        <p className="text-sm">Ticket record not found.</p>
      </div>
    );
  }

  const clientName = ticket.client_name || ticket.clientName || 'Guest';
  const ticketId = ticket.ticket_id || ticket.ticketId || id;
  const hotelName = ticket.hotel_name || ticket.hotelName || 'Property';
  const createdAt = ticket.created_at || ticket.createdAt || new Date().toISOString().slice(0, 10);
  const repliesList = Array.isArray(ticket.replies) ? ticket.replies : [];

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setIsSending(true);
    try {
      const newReply = {
        sender: 'Super Admin Support Desk',
        role: 'Platform Operations',
        message: replyText.trim(),
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      };
      const updatedReplies = [...repliesList, newReply];
      const newCount = (ticket.replies_count || ticket.repliesCount || 0) + 1;

      await hotelApi.updateSupportTicket(ticket.id, {
        status: ticketStatus,
        replies: updatedReplies,
        replies_count: newCount,
      });

      setTicket(prev => ({
        ...prev,
        status: ticketStatus,
        replies: updatedReplies,
        replies_count: newCount,
        repliesCount: newCount,
      }));

      showToast('Dispatch Transmitted', `Official response sent to ${clientName}.`, 'success');
      setReplyText('');
    } catch (err) {
      console.error('Failed to submit reply:', err);
      showToast('Dispatch Failed', err.message || 'Unable to submit reply to MySQL.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const handleUpdateAssignment = async () => {
    setIsUpdatingClearance(true);
    try {
      await hotelApi.updateSupportTicket(ticket.id, {
        assigned_agent: assignedAgent,
        status: ticketStatus,
      });

      setTicket(prev => ({
        ...prev,
        assigned_agent: assignedAgent,
        assignedAgent: assignedAgent,
        status: ticketStatus,
      }));

      showToast('Assignment Committed', `Ticket reassigned to ${assignedAgent} and status updated to ${ticketStatus}.`, 'success');
    } catch (err) {
      console.error('Failed to update ticket clearance:', err);
      showToast('Update Failed', err.message || 'Unable to update status in database.', 'error');
    } finally {
      setIsUpdatingClearance(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-5">
        <div className="space-y-1">
          <Link
            to="/super-admin/support/tickets"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-accent transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-accent" />
            <span>Return to Support Inquiries</span>
          </Link>
          <div className="flex items-center gap-3 pt-1">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
              {ticketId}: {ticket.subject}
            </h1>
            <StatusBadge status={ticketStatus} />
          </div>
          <p className="text-xs text-charcoal-muted">
            Originator: <strong className="text-primary dark:text-white">{clientName}</strong> • {hotelName} • Raised: {createdAt}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate('/super-admin/support/tickets')}>
            Back to Queue
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          {/* Main Inquiry Thread */}
          <div className="bg-white/90 dark:bg-surface-dark/95 backdrop-blur-2xl rounded-3xl border border-accent/30 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border/70 dark:border-white/10">
              <span className="text-xs font-mono font-bold text-accent">ORIGINAL CLIENT STATEMENT</span>
              <span className="text-xs font-mono text-charcoal-muted">{createdAt}</span>
            </div>

            <div className="p-5 rounded-2xl bg-ivory/80 dark:bg-primary-950/60 border border-border/70 dark:border-white/10 text-xs sm:text-sm leading-relaxed text-charcoal dark:text-gray-200">
              {ticket.description || 'Client has lodged a priority SLA request requiring technical resolution and executive response.'}
            </div>

            {/* Conversation Timeline */}
            <div className="space-y-4 pt-4 border-t border-border/70 dark:border-white/10">
              <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold block">
                Executive Response Thread ({repliesList.length})
              </span>

              {repliesList.length > 0 ? (
                repliesList.map((r, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-accent/10 border border-accent/25 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-accent font-semibold text-[11px]">
                      <span>{r.sender || 'Executive Support Agent'} ({r.role || 'Staff'})</span>
                      <span className="font-mono text-charcoal-muted">{r.timestamp || 'Recent'}</span>
                    </div>
                    <p className="text-charcoal dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                      {r.message}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-2xl bg-accent/5 border border-dashed border-accent/20 text-center text-xs text-charcoal-muted">
                  No replies recorded yet. Use the form below to dispatch the initial resolution.
                </div>
              )}
            </div>

            {/* Reply Input Form */}
            <form onSubmit={handleSendReply} className="space-y-4 pt-4 border-t border-border/70 dark:border-white/10">
              <span className="text-xs font-bold text-primary dark:text-white block">
                Transmit Official Executive Clearance Reply:
              </span>
              <textarea
                rows={4}
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Type your official platform dispatch resolution..."
                className="w-full p-4 rounded-2xl border border-border dark:border-white/10 bg-ivory/60 dark:bg-primary-950/50 text-xs text-charcoal dark:text-white focus:outline-none focus:border-accent"
                required
              />
              <div className="flex justify-end">
                <Button variant="gold" icon={Send} loading={isSending} type="submit">
                  Dispatch Resolution
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Sidebar Control Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/90 dark:bg-surface-dark/95 backdrop-blur-2xl rounded-3xl border border-accent/30 p-6 shadow-xl space-y-5 sticky top-24">
            <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold block">
              Dossier Metadata
            </span>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-border/60 dark:border-white/10">
                <span className="text-charcoal-muted">Severity Priority:</span>
                <span className="font-bold text-rose-600 dark:text-rose-400 capitalize">{ticket.priority || 'Medium'} Severity</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/60 dark:border-white/10">
                <span className="text-charcoal-muted">Department Category:</span>
                <span className="font-semibold text-accent">{ticket.category || 'General Operations'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/60 dark:border-white/10">
                <span className="text-charcoal-muted">Client Account:</span>
                <span className="font-medium text-primary dark:text-white">{clientName}</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <FormField label="Assigned Specialist">
                <Select value={assignedAgent} onChange={e => setAssignedAgent(e.target.value)}>
                  <option value="Alexander Cross (Senior Fintech Engineer)">Alexander Cross (Senior Fintech Engineer)</option>
                  <option value="Vivienne Laurent (PMS & Reservations Specialist)">Vivienne Laurent (PMS Specialist)</option>
                  <option value="Julian Vane (IoT & Access Infrastructure)">Julian Vane (IoT & Access Infrastructure)</option>
                  <option value="Elena Rostova (Compliance & Audit Director)">Elena Rostova (Compliance Director)</option>
                </Select>
              </FormField>

              <FormField label="Ticket State">
                <Select value={ticketStatus} onChange={e => setTicketStatus(e.target.value)}>
                  <option value="open">Open (Awaiting Dispatch)</option>
                  <option value="in_progress">In Progress (Active SLA)</option>
                  <option value="resolved">Resolved & Closed</option>
                </Select>
              </FormField>

              <Button
                variant="outline"
                className="w-full"
                loading={isUpdatingClearance}
                onClick={handleUpdateAssignment}
              >
                Update Clearance
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportTicketDetailPage;

