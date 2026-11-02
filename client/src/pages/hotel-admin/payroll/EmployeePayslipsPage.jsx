import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { StatCard, StatsGrid } from '../../../components/ui/StatCard';
import { Modal } from '../../../components/ui/Modal';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';
import {
  FileText,
  Search,
  Filter,
  Download,
  Printer,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  Building,
  User,
  CreditCard,
  Briefcase,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

export const EmployeePayslipsPage = () => {
  const navigate = useNavigate();
  const { payrollRuns = [] } = useERP();
  const { showToast } = useToast();

  // Initial mock payslips enriched with realistic luxury hotel staff
  const [payslips, setPayslips] = useState([
    {
      id: 'SLIP-2026-10-001',
      employeeId: 'STF-001',
      employeeName: 'Julian St. Clair',
      department: 'Executive Administration',
      designation: 'General Manager',
      month: 'October',
      year: '2026',
      period: 'October 2026',
      basicSalary: 8500,
      allowances: 2500,
      housingAllowance: 1200,
      transportAllowance: 400,
      overtime: 0,
      taxDeductions: 2420,
      pensionDeduction: 680,
      healthInsurance: 350,
      totalDeductions: 3450,
      netSalary: 9150,
      status: 'Paid',
      disbursementDate: '2026-10-28',
      bankName: 'UBS Switzerland AG',
      ibanMasked: 'CH93 •••• •••• •••• 4892'
    },
    {
      id: 'SLIP-2026-10-002',
      employeeId: 'STF-004',
      employeeName: 'Chef Jean-Luc Moreau',
      department: 'Culinary & Michelin Dining',
      designation: 'Executive Head Chef',
      month: 'October',
      year: '2026',
      period: 'October 2026',
      basicSalary: 6800,
      allowances: 1800,
      housingAllowance: 800,
      transportAllowance: 300,
      overtime: 450,
      taxDeductions: 1950,
      pensionDeduction: 540,
      healthInsurance: 300,
      totalDeductions: 2790,
      netSalary: 7360,
      status: 'Paid',
      disbursementDate: '2026-10-28',
      bankName: 'Credit Suisse',
      ibanMasked: 'CH12 •••• •••• •••• 1928'
    },
    {
      id: 'SLIP-2026-10-003',
      employeeId: 'STF-008',
      employeeName: 'Elena Rostova',
      department: 'Guest Relations & Concierge',
      designation: 'Chief Concierge (Les Clefs d\'Or)',
      month: 'October',
      year: '2026',
      period: 'October 2026',
      basicSalary: 4800,
      allowances: 1200,
      housingAllowance: 600,
      transportAllowance: 250,
      overtime: 320,
      taxDeductions: 1320,
      pensionDeduction: 380,
      healthInsurance: 260,
      totalDeductions: 1960,
      netSalary: 5210,
      status: 'Paid',
      disbursementDate: '2026-10-28',
      bankName: 'Banque Cantonale de Genève',
      ibanMasked: 'CH44 •••• •••• •••• 8821'
    },
    {
      id: 'SLIP-2026-10-004',
      employeeId: 'STF-012',
      employeeName: 'Marco Bellini',
      department: 'Engineering & Maintenance',
      designation: 'Chief Facilities Engineer',
      month: 'October',
      year: '2026',
      period: 'October 2026',
      basicSalary: 4500,
      allowances: 900,
      housingAllowance: 500,
      transportAllowance: 250,
      overtime: 580,
      taxDeductions: 1240,
      pensionDeduction: 360,
      healthInsurance: 250,
      totalDeductions: 1850,
      netSalary: 4880,
      status: 'Paid',
      disbursementDate: '2026-10-28',
      bankName: 'PostFinance',
      ibanMasked: 'CH80 •••• •••• •••• 7731'
    },
    {
      id: 'SLIP-2026-11-001',
      employeeId: 'STF-001',
      employeeName: 'Julian St. Clair',
      department: 'Executive Administration',
      designation: 'General Manager',
      month: 'November',
      year: '2026',
      period: 'November 2026',
      basicSalary: 8500,
      allowances: 2500,
      housingAllowance: 1200,
      transportAllowance: 400,
      overtime: 0,
      taxDeductions: 2420,
      pensionDeduction: 680,
      healthInsurance: 350,
      totalDeductions: 3450,
      netSalary: 9150,
      status: 'Pending',
      disbursementDate: 'Scheduled 2026-11-28',
      bankName: 'UBS Switzerland AG',
      ibanMasked: 'CH93 •••• •••• •••• 4892'
    },
    {
      id: 'SLIP-2026-11-002',
      employeeId: 'STF-015',
      employeeName: 'Svetlana Ivanova',
      department: 'Housekeeping & Valet',
      designation: 'Executive Head Housekeeper',
      month: 'November',
      year: '2026',
      period: 'November 2026',
      basicSalary: 3800,
      allowances: 700,
      housingAllowance: 450,
      transportAllowance: 200,
      overtime: 280,
      taxDeductions: 980,
      pensionDeduction: 300,
      healthInsurance: 220,
      totalDeductions: 1500,
      netSalary: 3930,
      status: 'Pending',
      disbursementDate: 'Scheduled 2026-11-28',
      bankName: 'Raiffeisen Switzerland',
      ibanMasked: 'CH56 •••• •••• •••• 9904'
    }
  ]);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('ALL');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Selected payslip for modal
  const [activeSlip, setActiveSlip] = useState(null);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);

  // Filtered payslips
  const filteredPayslips = useMemo(() => {
    return payslips.filter(ps => {
      const matchSearch =
        searchTerm === '' ||
        ps.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ps.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ps.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ps.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchMonth = selectedMonth === 'ALL' || ps.month === selectedMonth;
      const matchYear = selectedYear === 'ALL' || ps.year === selectedYear;
      const matchDept = selectedDept === 'ALL' || ps.department === selectedDept;
      const matchStatus = selectedStatus === 'ALL' || ps.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchSearch && matchMonth && matchYear && matchDept && matchStatus;
    });
  }, [payslips, searchTerm, selectedMonth, selectedYear, selectedDept, selectedStatus]);

  // KPI calculations
  const kpis = useMemo(() => {
    const totalCount = payslips.length;
    const paidCount = payslips.filter(p => p.status.toLowerCase() === 'paid').length;
    const pendingCount = payslips.filter(p => p.status.toLowerCase() === 'pending').length;
    const totalDisbursed = payslips
      .filter(p => p.status.toLowerCase() === 'paid')
      .reduce((sum, p) => sum + (p.netSalary || 0), 0);

    return { totalCount, paidCount, pendingCount, totalDisbursed };
  }, [payslips]);

  // Departments list for dropdown
  const departments = useMemo(() => {
    return Array.from(new Set(payslips.map(p => p.department)));
  }, [payslips]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadSlip = (slip) => {
    showToast('Payslip Downloaded', `PDF salary voucher for ${slip.employeeName} (${slip.period}) generated.`, 'success');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <PageHeader
        title="Employee Salary Slips & Disbursement Records"
        description="Official individual compensation vouchers, audited statutory tax withholdings, and electronic disbursement histories."
        badge="Executive Human Capital"
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/hotel-admin/payroll/runs')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl btn-secondary-3d text-xs font-semibold text-charcoal dark:text-gray-200"
            >
              <Calendar className="w-4 h-4 text-accent" />
              Manage Payroll Runs
            </button>
            <button
              onClick={() => {
                showToast('Batch Export', 'All employee payslip registers exported.', 'info');
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl gold-gradient-bg text-primary-900 font-bold text-xs shadow-gold btn-3d"
            >
              <Download className="w-4 h-4" />
              Download Batch Archive
            </button>
          </div>
        }
      />

      {/* Summary KPI Cards */}
      <StatsGrid columns={4}>
        <StatCard
          title="Total Payslips Issued"
          value={kpis.totalCount}
          change="Across Current Periods"
          isPositive={true}
          iconName="FileText"
          subtitle="All Enrolled Staff"
        />
        <StatCard
          title="Disbursed Payslips"
          value={kpis.paidCount}
          change="Bank Transfers Cleared"
          isPositive={true}
          iconName="CheckCircle"
          subtitle="Settled to Employee IBAN"
        />
        <StatCard
          title="Pending Authorization"
          value={kpis.pendingCount}
          change="Awaiting Cycle Closure"
          isPositive={false}
          iconName="Clock"
          subtitle="Next scheduled wire"
        />
        <StatCard
          title="Total Disbursed"
          value={`€${kpis.totalDisbursed.toLocaleString()}`}
          change="UBS Private Wealth Batch"
          isPositive={true}
          iconName="Wallet"
          subtitle="Direct bank transfers"
        />
      </StatsGrid>

      {/* Filter and Search Bar */}
      <div className="p-5 rounded-2xl glass-card border border-primary-500/15 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Search box */}
          <div className="relative flex-1 min-w-[260px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-muted" />
            <input
              type="text"
              placeholder="Search by staff name, ID, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-charcoal border border-primary-500/20 text-xs text-primary dark:text-white placeholder:text-charcoal-muted focus:outline-none focus:border-accent"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Month Filter */}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white dark:bg-charcoal border border-primary-500/20 text-xs text-primary dark:text-white font-medium focus:outline-none focus:border-accent"
            >
              <option value="ALL">All Months</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>

            {/* Department Filter */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white dark:bg-charcoal border border-primary-500/20 text-xs text-primary dark:text-white font-medium focus:outline-none focus:border-accent"
            >
              <option value="ALL">All Departments</option>
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white dark:bg-charcoal border border-primary-500/20 text-xs text-primary dark:text-white font-medium focus:outline-none focus:border-accent"
            >
              <option value="ALL">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>

            {(searchTerm || selectedMonth !== 'ALL' || selectedDept !== 'ALL' || selectedStatus !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedMonth('ALL');
                  setSelectedDept('ALL');
                  setSelectedStatus('ALL');
                }}
                className="px-3 py-2 rounded-xl btn-secondary-3d text-xs text-rose-500 hover:text-rose-600 font-medium"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Payslips Data Table */}
      <div className="rounded-2xl glass-card border border-primary-500/15 overflow-hidden shadow-luxury">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-base text-primary dark:text-white">
              Disbursed & Pending Payslips
            </h3>
            <p className="text-xs text-charcoal-muted">
              Audited compensation details and individual net salary lines
            </p>
          </div>
          <span className="text-xs font-mono text-accent">
            {filteredPayslips.length} Records Found
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-[11px] font-semibold text-charcoal-muted uppercase tracking-wider">
                <th className="py-3.5 px-4">Payslip ID</th>
                <th className="py-3.5 px-4">Staff Member</th>
                <th className="py-3.5 px-4">Department & Role</th>
                <th className="py-3.5 px-4">Period</th>
                <th className="py-3.5 px-4">Basic Pay</th>
                <th className="py-3.5 px-4">Allowances</th>
                <th className="py-3.5 px-4">Deductions</th>
                <th className="py-3.5 px-4">Net Salary</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {filteredPayslips.length === 0 ? (
                <tr>
                  <td colSpan="10" className="py-8 text-center text-charcoal-muted">
                    No payslip records matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredPayslips.map((ps) => (
                  <tr
                    key={ps.id}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-accent">
                      {ps.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center text-accent font-bold text-[11px]">
                          {ps.employeeName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-primary dark:text-white">
                            {ps.employeeName}
                          </p>
                          <span className="font-mono text-[10px] text-charcoal-muted">
                            {ps.employeeId}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-primary dark:text-gray-200 font-medium">
                        {ps.designation}
                      </p>
                      <span className="text-[11px] text-charcoal-muted">
                        {ps.department}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      {ps.period}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium">
                      €{(ps.basicSalary || 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                      +€{(ps.allowances || 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-rose-500 font-medium">
                      -€{(ps.totalDeductions || 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-accent text-sm">
                      €{(ps.netSalary || 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          ps.status.toLowerCase() === 'paid'
                            ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                        }`}
                      >
                        {ps.status.toLowerCase() === 'paid' ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 animate-pulse" />
                        )}
                        {ps.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setActiveSlip(ps);
                            setIsVoucherModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg btn-secondary-3d text-charcoal-muted hover:text-accent"
                          title="View Official Salary Slip"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadSlip(ps)}
                          className="p-1.5 rounded-lg btn-secondary-3d text-charcoal-muted hover:text-blue-500"
                          title="Download PDF Voucher"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Luxury Salary Voucher Modal */}
      {activeSlip && (
        <Modal
          isOpen={isVoucherModalOpen}
          onClose={() => setIsVoucherModalOpen(false)}
          title="Official Lazfort Salary Voucher"
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6 print:p-8" id="printable-payslip">
            {/* Voucher Insignia Header */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-charcoal/40 via-charcoal/20 to-transparent border border-accent/30 relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" />
                    <span className="font-serif font-bold text-lg text-white tracking-wider">
                      LAZFORT PALACE & RESORT
                    </span>
                  </div>
                  <p className="text-[11px] text-accent tracking-widest uppercase font-mono mt-0.5">
                    Executive Compensation Statement
                  </p>
                  <p className="text-xs text-charcoal-muted mt-2">
                    Period: <strong className="text-white">{activeSlip.period}</strong> • Pay Date: <strong className="text-white">{activeSlip.disbursementDate}</strong>
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-accent px-3 py-1 rounded-xl bg-accent/15 border border-accent/40">
                    {activeSlip.id}
                  </span>
                  <p className="text-[10px] text-charcoal-muted font-mono mt-2">
                    Disbursement: {activeSlip.status}
                  </p>
                </div>
              </div>
            </div>

            {/* Employee Information Card */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-white/5 border border-white/10 text-xs">
              <div>
                <span className="text-charcoal-muted text-[11px] block">Staff Beneficiary:</span>
                <p className="font-bold text-sm text-primary dark:text-white mt-0.5">{activeSlip.employeeName}</p>
                <p className="text-charcoal-muted font-mono text-[11px]">{activeSlip.employeeId} • {activeSlip.designation}</p>
              </div>

              <div>
                <span className="text-charcoal-muted text-[11px] block">Disbursement Destination:</span>
                <p className="font-semibold text-primary dark:text-white mt-0.5">{activeSlip.bankName}</p>
                <p className="text-charcoal-muted font-mono text-[11px]">{activeSlip.ibanMasked}</p>
              </div>
            </div>

            {/* Breakdown Tables (Earnings vs Deductions) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Earnings */}
              <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-500 border-b border-emerald-500/20 pb-1.5 flex items-center justify-between">
                  <span>Gross Earnings</span>
                  <span className="font-mono">Amount (€)</span>
                </h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-charcoal-muted">Basic Contract Salary</span>
                    <span className="font-mono font-medium">€{(activeSlip.basicSalary || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal-muted">Executive Allowance</span>
                    <span className="font-mono font-medium">€{(activeSlip.allowances || 0).toLocaleString()}</span>
                  </div>
                  {activeSlip.housingAllowance > 0 && (
                    <div className="flex justify-between">
                      <span className="text-charcoal-muted">Housing Subvention</span>
                      <span className="font-mono font-medium">€{activeSlip.housingAllowance.toLocaleString()}</span>
                    </div>
                  )}
                  {activeSlip.overtime > 0 && (
                    <div className="flex justify-between">
                      <span className="text-charcoal-muted">Overtime Compensation</span>
                      <span className="font-mono font-medium">€{activeSlip.overtime.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Deductions */}
              <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-500 border-b border-rose-500/20 pb-1.5 flex items-center justify-between">
                  <span>Withholdings & Deductions</span>
                  <span className="font-mono">Amount (€)</span>
                </h4>
                <div className="space-y-1.5 text-xs text-rose-500">
                  <div className="flex justify-between">
                    <span>Statutory Income Tax</span>
                    <span className="font-mono font-medium">-€{(activeSlip.taxDeductions || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pension & Retirement Fund</span>
                    <span className="font-mono font-medium">-€{(activeSlip.pensionDeduction || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Health & Group Insurance</span>
                    <span className="font-mono font-medium">-€{(activeSlip.healthInsurance || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Amount Banner */}
            <div className="p-4 rounded-2xl gold-gradient-bg text-primary-900 flex items-center justify-between shadow-gold">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary-900/80">
                  Total Net Disbursed Compensation
                </span>
                <p className="text-xs font-medium text-primary-900/90">
                  Direct Bank Transfer • Tax Reconciled
                </p>
              </div>
              <span className="font-serif font-black text-2xl tracking-tight">
                €{(activeSlip.netSalary || 0).toLocaleString()}
              </span>
            </div>

            {/* Actions Bar */}
            <div className="flex justify-between items-center pt-4 border-t border-white/10">
              <span className="text-[11px] text-charcoal-muted font-mono">
                Lazfort Human Capital Management System
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl btn-secondary-3d text-xs font-semibold text-charcoal dark:text-gray-200"
                >
                  <Printer className="w-3.5 h-3.5 text-accent" />
                  Print Voucher
                </button>
                <button
                  onClick={() => handleDownloadSlip(activeSlip)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl gold-gradient-bg text-primary-900 font-bold text-xs btn-3d shadow-gold"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Slip (PDF)
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EmployeePayslipsPage;

