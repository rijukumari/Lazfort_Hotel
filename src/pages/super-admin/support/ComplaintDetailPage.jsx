import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { initialComplaints } from '../../../data/mockSuperAdminModules';
import { Button, Card, StatusBadge, Textarea } from '../../../components/ui';
import { useToast } from '../../../context/ToastContext';
import {
  ArrowLeft,
  AlertTriangle,
  User,
  Building2,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle,
  MessageSquare,
  Send,
  XCircle,
} from 'lucide-react';

export const ComplaintDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const getStoredComplaints = () => {
    try {
      const stored = localStorage.getItem('lazfort_complaints');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse complaints', e);
    }
    return initialComplaints || [];
  };

  const storedList = getStoredComplaints();
  const complaint = storedList.find(c => c.id === id || c.complaintId === id) || storedList[0];

  const [notes, setNotes] = useState(complaint?.notes || []);
  const [newNote, setNewNote] = useState('');
  const [resolutionSummary, setResolutionSummary] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const [status, setStatus] = useState(complaint?.status || 'pending');

  if (!complaint) {
    return (
      <div className="space-y-6 p-6">
        <Link to="/super-admin/support/complaints" className="text-xs text-charcoal-muted hover:text-accent">
          ← Back to Complaints
        </Link>
        <p className="text-sm">Complaint record not found.</p>
      </div>
    );
  }

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    const time = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const updatedNotes = [`[${time}] ${newNote.trim()}`, ...notes];
    setNotes(updatedNotes);
    setNewNote('');

    const updatedComplaints = storedList.map(c =>
      c.id === complaint.id ? { ...c, notes: updatedNotes } : c
    );
    localStorage.setItem('lazfort_complaints', JSON.stringify(updatedComplaints));
    showToast('Investigation Note Logged', 'Confidential audit note appended and saved.', 'success');
  };

  const handleResolve = (e) => {
    e.preventDefault();
    if (!resolutionSummary.trim()) return;
    setStatus('resolved');

    const updatedComplaints = storedList.map(c =>
      c.id === complaint.id
        ? {
            ...c,
            status: 'resolved',
            resolutionSummary: resolutionSummary.trim(),
            notes: [`[${new Date().toISOString().slice(0, 16).replace('T', ' ')}] RESOLVED: ${resolutionSummary.trim()}`, ...notes],
          }
        : c
    );
    localStorage.setItem('lazfort_complaints', JSON.stringify(updatedComplaints));
    showToast('Grievance Resolved', `Settlement finalized and saved for ${complaint.customerName}.`, 'success');
    navigate('/super-admin/support/complaints');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-5">
        <div className="space-y-1">
          <Link
            to="/super-admin/support/complaints"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-accent transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-accent" />
            <span>Return to Guest Grievances</span>
          </Link>
          <div className="flex items-center gap-3 pt-1">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
              Grievance Dossier: {complaint.complaintId}
            </h1>
            <StatusBadge status={status} />
          </div>
          <p className="text-xs text-charcoal-muted dark:text-gray-400">
            Escalated VIP grievance audit, settlement negotiations, and internal investigation log.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate('/super-admin/support/complaints')}
          >
            Back to Queue
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Complaint Details */}
        <div className="lg:col-span-8 space-y-6">
          <Card variant="luxury" className="p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-border/70 dark:border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center font-bold">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-bold">
                  {complaint.category} • Priority: {complaint.priority}
                </span>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-primary dark:text-white">
                  {complaint.title}
                </h2>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs uppercase font-mono font-bold text-charcoal-muted tracking-wider">
                Guest Narrative Statement
              </h4>
              <div className="p-5 rounded-2xl bg-ivory/60 dark:bg-primary-950/60 border border-border/80 dark:border-white/10 leading-relaxed text-sm text-charcoal dark:text-gray-200">
                {complaint.description}
              </div>
            </div>

            {/* Investigation Log */}
            <div className="space-y-4 pt-4 border-t border-border/70 dark:border-white/10">
              <h4 className="text-xs uppercase font-mono font-bold text-charcoal-muted tracking-wider">
                Internal Investigation Audit Trail
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {notes.map((n, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/40 dark:bg-white/5 border border-border/60 dark:border-white/10 text-xs">
                    {n}
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Append confidential investigation note..."
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  className="input-luxury flex-1 text-xs"
                />
                <Button variant="outline" type="submit">
                  Post Note
                </Button>
              </form>
            </div>

            {/* Resolve Form */}
            <div className="space-y-3 pt-4 border-t border-border/70 dark:border-white/10">
              <h4 className="text-xs uppercase font-mono font-bold text-accent tracking-wider">
                Official Settlement & Resolution
              </h4>
              <form onSubmit={handleResolve} className="space-y-3">
                <textarea
                  rows={3}
                  value={resolutionSummary}
                  onChange={e => setResolutionSummary(e.target.value)}
                  placeholder="Record formal settlement terms (e.g. Authorized $500 spa credit, complimentary suite upgrade for return stay, executive GM call)..."
                  className="input-luxury w-full text-xs"
                  required
                />
                <div className="flex justify-end">
                  <Button variant="gold" icon={CheckCircle} type="submit">
                    Authorize & Finalize Resolution
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>

        {/* Right Sidebar Metadata */}
        <div className="lg:col-span-4 space-y-6">
          <Card variant="luxury" className="p-6 space-y-4">
            <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold block">
              Grievance Metadata
            </span>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-border/60 dark:border-white/10">
                <span className="text-charcoal-muted">Guest Entity:</span>
                <span className="font-semibold text-primary dark:text-white">{complaint.customerName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/60 dark:border-white/10">
                <span className="text-charcoal-muted">Property Node:</span>
                <span className="font-semibold text-primary dark:text-white truncate block max-w-[150px]">{complaint.hotelName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/60 dark:border-white/10">
                <span className="text-charcoal-muted">Filing Date:</span>
                <span className="font-mono text-primary dark:text-white">{complaint.filedDate || '2026-10-27'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/60 dark:border-white/10">
                <span className="text-charcoal-muted">Priority:</span>
                <span className="font-bold text-rose-500 uppercase">{complaint.priority}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailPage;

