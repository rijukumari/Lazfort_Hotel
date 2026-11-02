import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wrench,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  Plus,
  BedDouble,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Flame,
  FileText
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';
import {
  MaintenanceStatCard,
  MaintenanceStatusBadge,
  PriorityBadge,
  MaintenanceNavTabs,
  RaiseTicketModal,
  AddAssetModal,
  UpdateTicketModal
} from '../../../components/maintenance';

export const MaintenanceDashboardPage = () => {
  const navigate = useNavigate();
  const {
    maintenanceTickets = [],
    fixedAssets = [],
    rooms = [],
    getActiveMaintenanceCount
  } = useERP();
  const { showToast } = useToast();

  const [isRaiseModalOpen, setIsRaiseModalOpen] = useState(false);
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  // Key KPI Computations
  const activeTickets = maintenanceTickets.filter(
    (t) => t.status === 'open' || t.status === 'assigned' || t.status === 'in_progress'
  );
  const criticalTickets = activeTickets.filter(
    (t) => t.priority === 'critical' || t.priority === 'high'
  );
  const roomsInMaintenance = rooms.filter((r) => r.status === 'maintenance');

  // Asset Valuation Computations
  const now = new Date();
  const totalValuation = fixedAssets.reduce((sum, a) => {
    const cost = Number(a.purchaseCost || a.cost || 0);
    const salvage = Number(a.salvageValue || 0);
    const usefulLife = Number(a.usefulLifeYears || 10);
    const purchaseDate = new Date(a.purchaseDate || Date.now());
    const ageYears = Math.max(0, (now - purchaseDate) / (1000 * 60 * 60 * 24 * 365.25));
    const annualDepr = usefulLife > 0 ? (cost - salvage) / usefulLife : 0;
    const accumDepr = Math.min(cost - salvage, ageYears * annualDepr);
    const bookVal = Math.max(salvage, cost - accumDepr);
    return sum + bookVal;
  }, 0);

  // Condition breakdown
  const conditionCounts = {
    Excellent: fixedAssets.filter((a) => (a.condition || 'Excellent') === 'Excellent').length,
    Good: fixedAssets.filter((a) => a.condition === 'Good').length,
    Fair: fixedAssets.filter((a) => a.condition === 'Fair').length,
    Poor: fixedAssets.filter((a) => a.condition === 'Poor').length
  };

  const recentTickets = [...maintenanceTickets]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 6);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header with Title and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/80 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shadow-gold">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl text-primary dark:text-white">
                Engineering, Maintenance & Asset Command
              </h1>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                Lazfort Palace Grand Infrastructure, Work Orders & Fixed Capital Valuation
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-nowrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsAddAssetOpen(true)}
            className="px-4 py-2.5 rounded-xl border border-border dark:border-white/15 text-xs font-semibold text-charcoal dark:text-gray-300 hover:bg-ivory dark:hover:bg-primary-800 transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
          >
            <Building2 className="w-4 h-4 text-accent shrink-0" />
            <span>Register Fixed Asset</span>
          </button>
          <button
            type="button"
            onClick={() => setIsRaiseModalOpen(true)}
            className="px-5 py-2.5 rounded-xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Raise Work Order</span>
          </button>
        </div>
      </div>



      {/* Critical Alert Banner if high/critical tickets exist */}
      {criticalTickets.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between gap-4 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-500 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <p className="font-serif font-bold text-sm text-rose-600 dark:text-rose-400">
                High Priority Infrastructure Alert
              </p>
              <p className="text-xs text-charcoal-muted dark:text-gray-300">
                {criticalTickets.length} urgent ticket(s) require engineering intervention. Guest comfort or safety affected.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/hotel-admin/maintenance/tickets')}
            className="px-3.5 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-semibold hover:bg-rose-600 transition-colors shrink-0"
          >
            Resolve Tickets →
          </button>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MaintenanceStatCard
          title="Active Maintenance Tickets"
          value={activeTickets.length}
          subtitle={`${maintenanceTickets.filter((t) => t.status === 'completed').length} Resolved this month`}
          icon={Wrench}
          color="gold"
          onClick={() => navigate('/hotel-admin/maintenance/tickets')}
        />
        <MaintenanceStatCard
          title="Chambers Under Maintenance"
          value={roomsInMaintenance.length}
          subtitle={`${rooms.length} Total Suites in Portfolio`}
          icon={BedDouble}
          color={roomsInMaintenance.length > 0 ? 'rose' : 'emerald'}
          onClick={() => navigate('/hotel-admin/rooms/maintenance')}
        />
        <MaintenanceStatCard
          title="Fixed Capital Assets"
          value={fixedAssets.length}
          subtitle="Machinery & Property Equipment"
          icon={Building2}
          color="blue"
          onClick={() => navigate('/hotel-admin/maintenance/assets')}
        />
        <MaintenanceStatCard
          title="Asset Book Valuation"
          value={`$${Math.round(totalValuation).toLocaleString()}`}
          subtitle="IAS-16 Net Book Value"
          icon={DollarSign}
          color="emerald"
          onClick={() => navigate('/hotel-admin/maintenance/assets')}
        />
      </div>

      {/* Analytics & Priority Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket Priority Breakdown */}
        <div className="p-5 rounded-3xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-accent" />
              <span>Ticket Priority Breakdown</span>
            </h3>
            <span className="text-xs text-charcoal-muted font-mono">{activeTickets.length} Active</span>
          </div>

          <div className="space-y-3">
            {[
              {
                label: 'Critical / Blocking',
                count: activeTickets.filter((t) => t.priority === 'critical').length,
                color: 'bg-rose-500',
                textColor: 'text-rose-500'
              },
              {
                label: 'High Priority',
                count: activeTickets.filter((t) => t.priority === 'high').length,
                color: 'bg-amber-500',
                textColor: 'text-amber-500'
              },
              {
                label: 'Medium Routine',
                count: activeTickets.filter((t) => t.priority === 'medium').length,
                color: 'bg-blue-500',
                textColor: 'text-blue-500'
              },
              {
                label: 'Low / Preventative',
                count: activeTickets.filter((t) => t.priority === 'low').length,
                color: 'bg-emerald-500',
                textColor: 'text-emerald-500'
              }
            ].map((p, idx) => {
              const pct = activeTickets.length > 0 ? (p.count / activeTickets.length) * 100 : 0;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-charcoal dark:text-gray-300">{p.label}</span>
                    <span className={`font-mono font-bold ${p.textColor}`}>{p.count}</span>
                  </div>
                  <div className="w-full bg-border dark:bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${p.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => navigate('/hotel-admin/maintenance/tickets')}
            className="w-full mt-2 py-2 rounded-xl border border-border dark:border-white/10 text-xs font-semibold text-charcoal-muted hover:text-accent hover:border-accent/40 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>View All Tickets Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Capital Asset Operating Health */}
        <div className="p-5 rounded-3xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-accent" />
              <span>Asset Physical Condition</span>
            </h3>
            <span className="text-xs text-charcoal-muted font-mono">{fixedAssets.length} Assets</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <p className="text-2xl font-serif font-bold text-emerald-600 dark:text-emerald-400">
                {conditionCounts.Excellent}
              </p>
              <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 mt-1">
                Excellent Condition
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center">
              <p className="text-2xl font-serif font-bold text-blue-600 dark:text-blue-400">
                {conditionCounts.Good}
              </p>
              <p className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 mt-1">
                Good Standing
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
              <p className="text-2xl font-serif font-bold text-amber-600 dark:text-amber-400">
                {conditionCounts.Fair}
              </p>
              <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 mt-1">
                Fair / Minor Wear
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center">
              <p className="text-2xl font-serif font-bold text-rose-600 dark:text-rose-400">
                {conditionCounts.Poor}
              </p>
              <p className="text-[11px] font-semibold text-rose-700 dark:text-rose-300 mt-1">
                Needs Immediate Attention
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/hotel-admin/maintenance/assets')}
            className="w-full mt-2 py-2 rounded-xl border border-border dark:border-white/10 text-xs font-semibold text-charcoal-muted hover:text-accent hover:border-accent/40 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Open Asset Register</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Preventative Schedule & Dispatch Card */}
        <div className="p-5 rounded-3xl border border-accent/40 bg-gradient-to-br from-accent/10 via-transparent to-transparent shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" />
              <span>Routine Maintenance Plan</span>
            </h3>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-accent/20 text-accent font-bold">
              Automated
            </span>
          </div>

          <p className="text-xs text-charcoal-muted dark:text-gray-300 leading-relaxed">
            Preventative maintenance rounds are automatically cycled across central HVAC chiller towers, high-speed Otis elevators, and Michelin culinary refrigeration.
          </p>

          <div className="space-y-2 pt-1 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-ivory/60 dark:bg-primary-950/40 border border-border/80 dark:border-white/10">
              <span className="font-medium text-primary dark:text-white">Central Chiller Inspection</span>
              <span className="text-accent font-mono font-semibold">Today 14:00</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-ivory/60 dark:bg-primary-950/40 border border-border/80 dark:border-white/10">
              <span className="font-medium text-primary dark:text-white">Penthouse Elevator Cable Test</span>
              <span className="text-accent font-mono font-semibold">Tomorrow 09:30</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-ivory/60 dark:bg-primary-950/40 border border-border/80 dark:border-white/10">
              <span className="font-medium text-primary dark:text-white">Royal Spa Pool Chlorination</span>
              <span className="text-emerald-500 dark:text-emerald-400 font-mono font-semibold">Completed</span>
            </div>
          </div>

          <button
            onClick={() => setIsRaiseModalOpen(true)}
            className="w-full py-2.5 rounded-xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold"
          >
            Dispatch Quick Work Order
          </button>
        </div>
      </div>

      {/* Recent Work Orders Table */}
      <div className="p-6 rounded-3xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
              Recent Engineering Work Orders
            </h3>
            <p className="text-xs text-charcoal-muted dark:text-gray-400">
              Live maintenance telemetry, dispatch assignments and resolution timeline
            </p>
          </div>

          <button
            onClick={() => navigate('/hotel-admin/maintenance/tickets')}
            className="px-3.5 py-1.5 rounded-xl border border-accent/40 text-accent text-xs font-semibold hover:bg-accent/15 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>View All Tickets ({maintenanceTickets.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentTickets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-primary-800/40 text-[11px] uppercase tracking-wider text-charcoal-muted dark:text-gray-400">
                <tr>
                  <th className="py-3 px-4">Ticket ID</th>
                  <th className="py-3 px-4">Issue Description</th>
                  <th className="py-3 px-4">Location / Chamber</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Assigned Engineer</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 dark:divide-white/5">
                {recentTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-ivory/40 dark:hover:bg-primary-800/30 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-accent">
                      {ticket.id}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-primary dark:text-white">
                        {ticket.title || ticket.issue}
                      </p>
                      <p className="text-[11px] text-charcoal-muted truncate max-w-xs">
                        {ticket.category || 'General Repair'}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-primary dark:text-white">
                        {ticket.roomNumber ? `Suite ${ticket.roomNumber}` : ticket.location || 'Facility Wide'}
                      </span>
                      {ticket.blocksRoom && (
                        <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-500 font-bold border border-rose-500/30">
                          Chamber Blocked
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <PriorityBadge priority={ticket.priority} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-charcoal dark:text-gray-300">
                      {ticket.assignedTo || 'Unassigned'}
                    </td>
                    <td className="py-3 px-4">
                      <MaintenanceStatusBadge status={ticket.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setIsUpdateModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-accent/15 text-accent text-xs font-semibold hover:bg-accent/25 transition-colors"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-charcoal-muted dark:text-gray-400">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
            <p className="font-serif font-bold text-sm text-primary dark:text-white">
              No Outstanding Maintenance Tickets
            </p>
            <p className="text-xs">All palace facilities operating at optimal parameters.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <RaiseTicketModal
        isOpen={isRaiseModalOpen}
        onClose={() => setIsRaiseModalOpen(false)}
        onSuccess={() => {
          showToast('Ticket Raised', 'Maintenance work order has been logged successfully.', 'success');
        }}
      />

      <AddAssetModal
        isOpen={isAddAssetOpen}
        onClose={() => setIsAddAssetOpen(false)}
        onSuccess={() => {
          showToast('Asset Registered', 'Fixed capital asset has been recorded in IAS-16 register.', 'success');
        }}
      />

      <UpdateTicketModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        ticket={selectedTicket}
        onSuccess={() => {
          showToast('Ticket Updated', 'Work order parameters and status updated.', 'success');
        }}
      />
    </div>
  );
};

export default MaintenanceDashboardPage;

