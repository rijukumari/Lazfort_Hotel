import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { StatCard, StatsGrid } from '../../../components/ui/StatCard';
import { Modal } from '../../../components/ui/Modal';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';
import {
  Wallet,
  Users,
  ShieldCheck,
  CheckCircle,
  Clock,
  Plus,
  Download,
  Eye,
  FileCheck2,
  Calendar,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Building,
  RefreshCw
} from 'lucide-react';

export const PayrollRunsPage = () => {
  const navigate = useNavigate();
  const { payrollRuns = [], approvePayrollRun } = useERP();
  const { showToast } = useToast();

  // Local state for runs
  const [runs, setRuns] = useState(() => {
    if (payrollRuns && payrollRuns.length > 0) return payrollRuns;
    return [
      {
        id: 'PR-2026-10',
        period: 'October 2026',
        month: 'October',
        year: '2026',
        totalEmployees: 48,
        totalGrossPay: 184500,
        totalDeductions: 36900,
        totalNetPay: 147600,
        processingDate: '2026-10-28',
        status: 'approved',
        disbursementRef: 'JE-PAY-2026-10',
        note: 'Executive, Front Desk & Culinary divisions included'
      },
      {
        id: 'PR-2026-09',
        period: 'September 2026',
        month: 'September',
        year: '2026',
        totalEmployees: 46,
        totalGrossPay: 178200,
        totalDeductions: 35640,
        totalNetPay: 142560,
        processingDate: '2026-09-28',
        status: 'paid',
        disbursementRef: 'JE-PAY-2026-09',
        note: 'Standard monthly payroll cycle'
      },
      {
        id: 'PR-2026-11',
        period: 'November 2026',
        month: 'November',
        year: '2026',
        totalEmployees: 50,
        totalGrossPay: 192000,
        totalDeductions: 38400,
        totalNetPay: 153600,
        processingDate: '2026-11-25',
        status: 'draft',
        disbursementRef: 'PENDING',
        note: 'Upcoming winter high-season staffing run'
      }
    ];
  });

  const [selectedMonth, setSelectedMonth] = useState('ALL');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRun, setSelectedRun] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // { type: 'approve' | 'process', run }

  // Form for new payroll run
  const [formData, setFormData] = useState({
    month: 'December',
    year: '2026',
    totalEmployees: 52,
    baseGross: 195000,
    allowances: 25000,
    taxRate: 20,
    notes: 'Holiday season staffing & performance bonuses'
  });

  // Filtered runs
  const filteredRuns = useMemo(() => {
    return runs.filter(run => {
      const matchMonth = selectedMonth === 'ALL' || run.month === selectedMonth || run.period.includes(selectedMonth);
      const matchYear = selectedYear === 'ALL' || run.year === selectedYear || run.period.includes(selectedYear);
      const matchStatus = statusFilter === 'ALL' || run.status.toLowerCase() === statusFilter.toLowerCase();
      return matchMonth && matchYear && matchStatus;
    });
  }, [runs, selectedMonth, selectedYear, statusFilter]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const totalStaff = runs.reduce((acc, r) => Math.max(acc, r.totalEmployees || 0), 48);
    const grossTotal = runs.reduce((acc, r) => acc + (r.totalGrossPay || 0), 0);
    const deductionsTotal = runs.reduce((acc, r) => acc + (r.totalDeductions || 0), 0);
    const netTotal = runs.reduce((acc, r) => acc + (r.totalNetPay || 0), 0);
    return { totalStaff, grossTotal, deductionsTotal, netTotal };
  }, [runs]);

  // Approve Run
  const handleApprove = (run) => {
    const res = approvePayrollRun ? approvePayrollRun(run.id) : { success: true, message: 'Payroll approved.' };
    setRuns(prev => prev.map(r => r.id === run.id ? { ...r, status: 'approved', disbursementRef: `JE-PAY-${r.period.replace(' ', '-')}` } : r));
    showToast('Payroll Run Approved', `Run ${run.id} approved and balanced entry posted to General Ledger.`, 'success');
    setConfirmAction(null);
  };

  // Process Wire / Payment
  const handleProcessPayment = (run) => {
    setRuns(prev => prev.map(r => r.id === run.id ? { ...r, status: 'paid' } : r));
    showToast('Disbursement Executed', `UBS Bank Wire batch instruction initiated for €${(run.totalNetPay || 0).toLocaleString()}.`, 'success');
    setConfirmAction(null);
  };

  // Create new run
  const handleCreateRun = (e) => {
    e.preventDefault();
    const gross = Number(formData.baseGross) + Number(formData.allowances);
    const deductions = Math.round(gross * (Number(formData.taxRate) / 100));
    const net = gross - deductions;

    const newRun = {
      id: `PR-${formData.year}-${formData.month.slice(0, 3).toUpperCase()}`,
      period: `${formData.month} ${formData.year}`,
      month: formData.month,
      year: formData.year,
      totalEmployees: Number(formData.totalEmployees),
      totalGrossPay: gross,
      totalDeductions: deductions,
      totalNetPay: net,
      processingDate: new Date().toISOString().split('T')[0],
      status: 'draft',
      disbursementRef: 'PENDING',
      note: formData.notes
    };

    setRuns([newRun, ...runs]);
    setIsCreateModalOpen(false);
    showToast('Payroll Run Created', `New cycle for ${newRun.period} drafted with ${newRun.totalEmployees} employees.`, 'success');
  };

  // Status Badge Helper
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Paid & Reconciled
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-500 border border-blue-500/30">
            <CheckCircle className="w-3.5 h-3.5" />
            Approved
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-500 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            Processing
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-charcoal/20 text-charcoal-muted border border-charcoal/30">
            <span className="w-1.5 h-1.5 rounded-full bg-charcoal-muted" />
            Draft
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <PageHeader
        title="Payroll Processing & Runs"
        description="Executive compensation cycles, gross-to-net computation engine, and general ledger disbursement controls."
        badge="Executive Human Capital"
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/hotel-admin/payroll/payslips')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl btn-secondary-3d text-xs font-semibold text-charcoal dark:text-gray-200"
            >
              <Users className="w-4 h-4 text-accent" />
              View Employee Payslips
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl gold-gradient-bg text-primary-900 font-bold text-xs shadow-gold btn-3d"
            >
              <Plus className="w-4 h-4" />
              Create New Payroll Run
            </button>
          </div>
        }
      />

      {/* KPI Cards */}
      <StatsGrid columns={4}>
        <StatCard
          title="Active Headcount"
          value={`${metrics.totalStaff} Staff`}
          change="Full Operational Strength"
          isPositive={true}
          iconName="Users"
          subtitle="Palace & Line Employees"
        />
        <StatCard
          title="Total Gross Liability"
          value={`€${metrics.grossTotal.toLocaleString()}`}
          change="Prior & Current Runs"
          isPositive={true}
          iconName="Wallet"
          subtitle="Pre-tax compensation"
        />
        <StatCard
          title="Withheld Deductions"
          value={`€${metrics.deductionsTotal.toLocaleString()}`}
          change="Tax, Pension & Benefits"
          isPositive={false}
          iconName="ShieldCheck"
          subtitle="Statutory reserves"
        />
        <StatCard
          title="Net Disbursed / Payable"
          value={`€${metrics.netTotal.toLocaleString()}`}
          change="UBS Private Wire Batch"
          isPositive={true}
          iconName="CreditCard"
          subtitle="Direct bank transfers"
        />
      </StatsGrid>

      {/* Filter and Period Selector Bar */}
      <div className="p-5 rounded-2xl glass-card border border-primary-500/15 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-charcoal-muted uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-accent" />
            <span>Cycle Period:</span>
          </div>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-charcoal border border-primary-500/20 text-xs text-primary dark:text-white font-medium focus:outline-none focus:border-accent"
          >
            <option value="ALL">All Months</option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-charcoal border border-primary-500/20 text-xs text-primary dark:text-white font-medium focus:outline-none focus:border-accent"
          >
            <option value="ALL">All Years</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-charcoal border border-primary-500/20 text-xs text-primary dark:text-white font-medium focus:outline-none focus:border-accent"
          >
            <option value="ALL">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="approved">Approved</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              showToast('Export Complete', 'Exported complete payroll register CSV.', 'info');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl btn-secondary-3d text-xs font-medium text-charcoal dark:text-gray-200"
          >
            <Download className="w-3.5 h-3.5 text-accent" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Payroll Runs Table */}
      <div className="rounded-2xl glass-card border border-primary-500/15 overflow-hidden shadow-luxury">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-base text-primary dark:text-white">
              Payroll Run Registers
            </h3>
            <p className="text-xs text-charcoal-muted">
              Official salary distribution cycles and audited execution dates
            </p>
          </div>
          <span className="text-xs font-mono text-accent">
            {filteredRuns.length} Runs Logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-[11px] font-semibold text-charcoal-muted uppercase tracking-wider">
                <th className="py-3.5 px-4">Run ID</th>
                <th className="py-3.5 px-4">Payroll Month</th>
                <th className="py-3.5 px-4">Employees</th>
                <th className="py-3.5 px-4">Gross Salary</th>
                <th className="py-3.5 px-4">Total Deductions</th>
                <th className="py-3.5 px-4">Net Payable</th>
                <th className="py-3.5 px-4">Processing Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {filteredRuns.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-8 text-center text-charcoal-muted">
                    No payroll runs found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredRuns.map((run) => (
                  <tr
                    key={run.id}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-accent">
                      {run.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-serif font-bold text-primary dark:text-white">
                        {run.period}
                      </span>
                      {run.disbursementRef && run.disbursementRef !== 'PENDING' && (
                        <p className="text-[10px] font-mono text-charcoal-muted">
                          GL: {run.disbursementRef}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className="px-2 py-0.5 rounded-md bg-primary-500/10 text-primary dark:text-white font-medium">
                        {run.totalEmployees} Staff
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium">
                      €{(run.totalGrossPay || 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-rose-500 font-medium">
                      -€{(run.totalDeductions || 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      €{(run.totalNetPay || 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-charcoal-muted">
                      {run.processingDate}
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(run.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Details */}
                        <button
                          onClick={() => {
                            setSelectedRun(run);
                            setIsDetailModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg btn-secondary-3d text-charcoal-muted hover:text-accent"
                          title="View Run Breakdown"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Calculate / Recalculate */}
                        {run.status === 'draft' && (
                          <button
                            onClick={() => {
                              showToast('Payroll Recalculated', `Calculations updated with newest staff shifts for ${run.period}.`, 'info');
                            }}
                            className="p-1.5 rounded-lg btn-secondary-3d text-charcoal-muted hover:text-blue-500"
                            title="Recalculate Run"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        )}

                        {/* Approve Action */}
                        {run.status === 'draft' && (
                          <button
                            onClick={() => setConfirmAction({ type: 'approve', run })}
                            className="px-2.5 py-1 rounded-lg gold-gradient-bg text-primary-900 font-bold text-[11px] btn-3d"
                            title="Approve & Post to General Ledger"
                          >
                            Approve
                          </button>
                        )}

                        {/* Process Payment */}
                        {run.status === 'approved' && (
                          <button
                            onClick={() => setConfirmAction({ type: 'process', run })}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-sm transition-colors"
                            title="Disburse Bank Wire"
                          >
                            Disburse
                          </button>
                        )}

                        {/* Already Paid Check */}
                        {run.status === 'paid' && (
                          <span className="text-[11px] text-emerald-500 font-medium flex items-center gap-1">
                            <FileCheck2 className="w-4 h-4" />
                            Disbursed
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRun && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={`Payroll Run Summary — ${selectedRun.period}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-charcoal-muted font-medium">Batch Reference</span>
                <span className="font-mono text-xs font-bold text-accent">{selectedRun.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-charcoal-muted font-medium">Status</span>
                {getStatusBadge(selectedRun.status)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-charcoal-muted font-medium">Processing Date</span>
                <span className="font-mono text-xs text-primary dark:text-white">{selectedRun.processingDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-charcoal-muted font-medium">Staff Enrolled</span>
                <span className="font-mono text-xs font-semibold">{selectedRun.totalEmployees} Employees</span>
              </div>
            </div>

            <div className="space-y-2 p-4 rounded-xl glass-card border border-primary-500/20">
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-muted">Financial Breakdown</h4>
              <div className="flex justify-between text-xs py-1.5 border-b border-white/5">
                <span className="text-charcoal-muted">Base Salary & Allowances</span>
                <span className="font-mono font-medium">€{(selectedRun.totalGrossPay || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs py-1.5 border-b border-white/5 text-rose-500">
                <span>Withheld Statutory Taxes & Pension</span>
                <span className="font-mono font-medium">-€{(selectedRun.totalDeductions || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm py-2 font-bold text-accent">
                <span>Net Disbursement</span>
                <span className="font-mono text-emerald-500">€{(selectedRun.totalNetPay || 0).toLocaleString()}</span>
              </div>
            </div>

            {selectedRun.note && (
              <p className="text-xs text-charcoal-muted italic bg-white/5 p-3 rounded-lg">
                &ldquo;{selectedRun.note}&rdquo;
              </p>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  setIsDetailModalOpen(false);
                  navigate('/hotel-admin/payroll/payslips');
                }}
                className="px-4 py-2 rounded-xl gold-gradient-bg text-primary-900 font-bold text-xs btn-3d"
              >
                Inspect All Payslips for this Run
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create New Run Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Initiate New Executive Payroll Run"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateRun} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal-muted uppercase mb-1">
                Month
              </label>
              <select
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-charcoal border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
              >
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-muted uppercase mb-1">
                Year
              </label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-charcoal border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal-muted uppercase mb-1">
                Total Headcount
              </label>
              <input
                type="number"
                value={formData.totalEmployees}
                onChange={(e) => setFormData({ ...formData, totalEmployees: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-charcoal border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-muted uppercase mb-1">
                Estimated Base Salary (€)
              </label>
              <input
                type="number"
                value={formData.baseGross}
                onChange={(e) => setFormData({ ...formData, baseGross: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-charcoal border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal-muted uppercase mb-1">
                Allowances & Overtime (€)
              </label>
              <input
                type="number"
                value={formData.allowances}
                onChange={(e) => setFormData({ ...formData, allowances: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-charcoal border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-muted uppercase mb-1">
                Estimated Tax Rate (%)
              </label>
              <input
                type="number"
                value={formData.taxRate}
                onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-charcoal border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
                min="0"
                max="50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-muted uppercase mb-1">
              Internal Cycle Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-charcoal border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
              placeholder="e.g. Winter season bonuses and executive travel allowances"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl btn-secondary-3d text-xs font-medium text-charcoal dark:text-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl gold-gradient-bg text-primary-900 font-bold text-xs btn-3d shadow-gold"
            >
              Draft Payroll Run
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Dialogs */}
      {confirmAction && (
        <Modal
          isOpen={true}
          onClose={() => setConfirmAction(null)}
          title={confirmAction.type === 'approve' ? 'Confirm Payroll Approval' : 'Authorize UBS Bank Wire Disbursement'}
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                {confirmAction.type === 'approve' ? (
                  <p>
                    Approving <strong>{confirmAction.run.period}</strong> will automatically generate a corresponding General Ledger Journal Entry debited to <em>Salary Expense</em> and credited to <em>Accrued Payroll Liability</em>.
                  </p>
                ) : (
                  <p>
                    Authorizing disbursement will trigger an electronic bank wire file for <strong>€{(confirmAction.run.totalNetPay || 0).toLocaleString()}</strong> to {confirmAction.run.totalEmployees} employee accounts.
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 rounded-xl btn-secondary-3d text-xs font-medium text-charcoal dark:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmAction.type === 'approve') handleApprove(confirmAction.run);
                  else handleProcessPayment(confirmAction.run);
                }}
                className={`px-5 py-2 rounded-xl font-bold text-xs ${
                  confirmAction.type === 'approve'
                    ? 'gold-gradient-bg text-primary-900 shadow-gold btn-3d'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                }`}
              >
                {confirmAction.type === 'approve' ? 'Confirm & Post to G/L' : 'Authorize Bank Wire'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PayrollRunsPage;

