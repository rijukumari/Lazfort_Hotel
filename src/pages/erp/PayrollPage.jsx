import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { StatCard, StatsGrid } from '../../components/ui/StatCard';
import { DataTable } from '../../components/data-display/DataTable';
import { Tabs } from '../../components/ui/Tabs';
import { Modal } from '../../components/ui/Modal';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import {
  CheckCircle,
  FileText,
  Download,
} from 'lucide-react';

export const PayrollPage = () => {
  const { payrollRuns = [], approvePayrollRun } = useERP();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('runs');
  const [selectedPayslip, setSelectedPayslip] = useState(null);

  const activeRun = payrollRuns[0];
  const allPayslips = payrollRuns.flatMap(r => r.payslips || []);

  const handleApprovePayroll = (runId, period) => {
    const res = approvePayrollRun(runId);
    if (res?.success) {
      showToast('Payroll Disbursed', res.message, 'success');
    }
  };

  // Columns for Payroll Runs
  const runColumns = [
    {
      key: 'period',
      header: 'Payroll Period',
      sortable: true,
      render: r => <span className="font-serif font-bold text-sm text-primary dark:text-white">{r.period}</span>,
    },
    {
      key: 'totalEmployees',
      header: 'Active Staff Headcount',
      render: r => <span className="font-mono text-xs">{r.totalEmployees} Employees</span>,
    },
    {
      key: 'totalGrossPay',
      header: 'Total Gross Pay',
      render: r => <span className="font-mono text-xs font-semibold">€{(r.totalGrossPay || 0).toLocaleString()}</span>,
    },
    {
      key: 'totalDeductions',
      header: 'Withheld Deductions (Tax & PF)',
      render: r => <span className="font-mono text-xs text-rose-500 font-semibold">-€{(r.totalDeductions || 0).toLocaleString()}</span>,
    },
    {
      key: 'totalNetPay',
      header: 'Net Disbursed Pay',
      render: r => <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">€{(r.totalNetPay || 0).toLocaleString()}</span>,
    },
    {
      key: 'status',
      header: 'Approval Status',
      render: r => (
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-xl ${
          r.status === 'approved' || r.status === 'disbursed'
            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
            : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
        }`}>
          {r.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Disbursement Action',
      render: r => (
        <div>
          {r.status !== 'approved' && r.status !== 'disbursed' ? (
            <button
              onClick={() => handleApprovePayroll(r.id, r.period)}
              className="px-3 py-1.5 rounded-xl gold-gradient-bg text-primary-900 font-bold text-xs btn-3d"
            >
              Approve & Disburse
            </button>
          ) : (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle className="w-4 h-4" />
              Ledger Posted
            </span>
          )}
        </div>
      ),
    },
  ];

  // Columns for Individual Payslips
  const payslipColumns = [
    {
      key: 'employeeName',
      header: 'Staff Member',
      render: ps => (
        <div>
          <p className="font-semibold text-primary dark:text-white text-xs">{ps.employeeName}</p>
          <span className="text-[11px] text-charcoal-muted">{ps.position} • {ps.department}</span>
        </div>
      ),
    },
    {
      key: 'baseSalary',
      header: 'Base Salary',
      render: ps => <span className="font-mono text-xs">€{(ps.baseSalary || 0).toLocaleString()}</span>,
    },
    {
      key: 'allowances',
      header: 'Executive Allowance',
      render: ps => <span className="font-mono text-xs text-accent">+€{(ps.allowances || 0).toLocaleString()}</span>,
    },
    {
      key: 'overtimePay',
      header: 'Overtime',
      render: ps => <span className="font-mono text-xs">+€{(ps.overtimePay || 0).toLocaleString()}</span>,
    },
    {
      key: 'taxDeductions',
      header: 'Statutory Tax',
      render: ps => <span className="font-mono text-xs text-rose-500">-€{(ps.taxDeductions || 0).toLocaleString()}</span>,
    },
    {
      key: 'netPay',
      header: 'Net Bank Transfer',
      render: ps => <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">€{(ps.netPay || 0).toLocaleString()}</span>,
    },
    {
      key: 'actions',
      header: 'View Slip',
      render: ps => (
        <button
          onClick={() => setSelectedPayslip(ps)}
          className="p-1.5 rounded-lg btn-secondary-3d text-charcoal-muted hover:text-accent"
          title="View Payslip"
        >
          <FileText className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Human Capital & Executive Payroll Command"
        description="Lazfort ERP — Automated compensation calculations, executive allowances, tax withholdings, and one-click general ledger disbursement."
        badge="Module I & J: HR & Payroll"
        actions={
          <button
            onClick={() => showToast('Payroll Export', 'Monthly salary register and bank wire list exported.', 'info')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl btn-secondary-3d text-xs font-semibold text-charcoal dark:text-gray-200"
          >
            <Download className="w-4 h-4 text-accent" />
            Export Payroll Register
          </button>
        }
      />

      {/* KPI Grid */}
      <StatsGrid columns={4}>
        <StatCard
          title="Active Staff On Payroll"
          value={activeRun?.totalEmployees || 48}
          change="All Departments Staffed"
          isPositive={true}
          iconName="Users"
          subtitle="Monaco Grand Palace"
        />
        <StatCard
          title="Gross Payroll Liability"
          value={`€${activeRun?.totalGrossPay ? activeRun.totalGrossPay.toLocaleString() : '184,500'}`}
          change="Executive & Line Staff"
          isPositive={true}
          iconName="Wallet"
          subtitle="Current Month Run"
        />
        <StatCard
          title="Net Take-Home Disbursed"
          value={`€${activeRun?.totalNetPay ? activeRun.totalNetPay.toLocaleString() : '147,600'}`}
          change="UBS Bank Wire Executed"
          isPositive={true}
          iconName="ShieldCheck"
          subtitle="Direct Bank Transfer"
        />
        <StatCard
          title="Total Statutory Deductions"
          value={`€${activeRun?.totalDeductions ? activeRun.totalDeductions.toLocaleString() : '36,900'}`}
          change="Tax & Pension Remitted"
          isPositive={true}
          iconName="Building2"
          subtitle="Monaco Social Funds"
        />
      </StatsGrid>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'runs', label: 'Executive Payroll Runs', count: payrollRuns.length },
          { id: 'payslips', label: 'Employee Payslips', count: allPayslips.length },
        ]}
        activeTab={activeTab}
        onChange={tabId => setActiveTab(tabId)}
      />

      {activeTab === 'runs' && (
        <DataTable
          data={payrollRuns}
          columns={runColumns}
          keyExtractor={r => r.id}
          searchPlaceholder="Search payroll periods..."
        />
      )}

      {activeTab === 'payslips' && (
        <DataTable
          data={allPayslips}
          columns={payslipColumns}
          keyExtractor={ps => ps.id}
          searchPlaceholder="Search payslips by employee name or department..."
        />
      )}

      {/* Payslip View Modal */}
      {selectedPayslip && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedPayslip(null)}
          title={`Executive Payslip — ${selectedPayslip.employeeName}`}
          subtitle={`${selectedPayslip.position} • ${selectedPayslip.department}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4 p-2 text-xs">
            <div className="p-4 rounded-2xl bg-ivory dark:bg-black/40 border border-border dark:border-white/10 space-y-2">
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Base Salary:</span>
                <span className="font-mono font-semibold">€{(selectedPayslip.baseSalary || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Executive Allowance:</span>
                <span className="font-mono text-accent font-semibold">+€{(selectedPayslip.allowances || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Overtime Compensation:</span>
                <span className="font-mono font-semibold">+€{(selectedPayslip.overtimePay || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t border-border/60">
                <span>Total Gross Earnings:</span>
                <span className="font-mono text-primary dark:text-white">€{(selectedPayslip.grossPay || 0).toLocaleString()}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-2">
              <div className="flex justify-between text-rose-600 dark:text-rose-400">
                <span>Income Withholding Tax:</span>
                <span className="font-mono">-€{(selectedPayslip.taxDeductions || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-rose-600 dark:text-rose-400">
                <span>Provident Retirement Fund:</span>
                <span className="font-mono">-€{(selectedPayslip.providentFund || 0).toLocaleString()}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex justify-between items-center text-sm font-bold text-emerald-600 dark:text-emerald-400">
              <span>Net Wire Transfer:</span>
              <span className="font-mono text-base">€{(selectedPayslip.netPay || 0).toLocaleString()}</span>
            </div>

            <div className="text-center pt-2 text-[11px] text-charcoal-muted">
              Remitted via {selectedPayslip.paymentMethod} • Sovereign Payroll Reference #AUR-PAY-MC
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PayrollPage;

