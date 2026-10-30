import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { DataTable } from '../../components/data-display/DataTable';
import { Tabs } from '../../components/ui/Tabs';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import { mockOrganization, mockBranches } from '../../data/mockERPData';
import {
  Building2,
  RotateCcw,
  Sliders,
} from 'lucide-react';

export const SettingsPage = () => {
  const { auditLogs = [], resetToSeedData } = useERP();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('profile');

  // Policy Settings state
  const [checkInTime, setCheckInTime] = useState(() => {
    try {
      const stored = localStorage.getItem('lazfort_hotel_settings');
      if (stored) return JSON.parse(stored).checkInTime || '15:00';
    } catch {}
    return '15:00';
  });
  const [checkOutTime, setCheckOutTime] = useState(() => {
    try {
      const stored = localStorage.getItem('lazfort_hotel_settings');
      if (stored) return JSON.parse(stored).checkOutTime || '12:00';
    } catch {}
    return '12:00';
  });
  const [vatRate, setVatRate] = useState(() => {
    try {
      const stored = localStorage.getItem('lazfort_hotel_settings');
      if (stored) return JSON.parse(stored).vatRate || 10;
    } catch {}
    return 10;
  });
  const [currency, setCurrency] = useState(() => {
    try {
      const stored = localStorage.getItem('lazfort_hotel_settings');
      if (stored) return JSON.parse(stored).currency || 'EUR (€)';
    } catch {}
    return 'EUR (€)';
  });

  const handleSavePolicies = e => {
    e.preventDefault();
    try {
      localStorage.setItem('lazfort_hotel_settings', JSON.stringify({
        checkInTime,
        checkOutTime,
        vatRate,
        currency,
        updatedAt: new Date().toISOString(),
      }));
      showToast('Policies Saved', 'Hotel operational policies and statutory VAT rates updated.', 'success');
    } catch {
      showToast('Error', 'Failed to save settings.', 'error');
    }
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to re-seed all ERP database tables to initial luxury benchmarks?')) {
      if (resetToSeedData) resetToSeedData();
      showToast('Database Reset', 'ERP database tables restored to initial luxury master seeds.', 'info');
    }
  };

  // Columns for Audit Logs
  const auditColumns = [
    {
      key: 'timestamp',
      header: 'Audit Timestamp',
      sortable: true,
      render: log => <span className="font-mono text-xs">{log.timestamp?.slice(0, 19).replace('T', ' ')}</span>,
    },
    {
      key: 'action',
      header: 'Operation',
      render: log => {
        const colors = {
          CREATE: 'bg-emerald-500/15 text-emerald-500',
          UPDATE: 'bg-blue-500/15 text-blue-500',
          CHECK_IN: 'bg-accent/20 text-accent font-bold',
          CHECK_OUT: 'bg-purple-500/15 text-purple-500',
          POST_CHARGE: 'bg-amber-500/15 text-amber-500',
          DISBURSE_PAYROLL: 'bg-emerald-600/20 text-emerald-600',
          RECEIVE_STOCK: 'bg-teal-500/15 text-teal-500',
        };
        return (
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg ${colors[log.action] || 'bg-gray-500/15'}`}>
            {log.action}
          </span>
        );
      },
    },
    {
      key: 'module',
      header: 'ERP Module',
      render: log => (
        <span className="text-xs font-semibold text-primary dark:text-gray-200">
          {log.module}
        </span>
      ),
    },
    {
      key: 'description',
      header: 'Event Description',
      render: log => (
        <div>
          <p className="text-xs text-charcoal/90 dark:text-gray-300 leading-tight">{log.description}</p>
          <span className="text-[10px] text-charcoal-muted">Target Ref: {log.recordId}</span>
        </div>
      ),
    },
    {
      key: 'userName',
      header: 'Operator & IP',
      render: log => (
        <div>
          <p className="text-xs font-semibold text-primary dark:text-white leading-tight">{log.userName}</p>
          <span className="text-[10px] font-mono text-accent">{log.role} • {log.ipAddress}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Hotel ERP Configuration & Audit Governance"
        description="Lazfort ERP — Enterprise organization parameters, multi-property branch management, fiscal policy rules, and immutable audit logs."
        badge="Module N: Global Settings"
        actions={
          <button
            onClick={handleResetData}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl btn-secondary-3d text-xs font-semibold text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/10"
          >
            <RotateCcw className="w-4 h-4 text-rose-500" />
            Reset Master Seeds
          </button>
        }
      />

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'profile', label: 'Organization & Profile', count: 1 },
          { id: 'branches', label: 'Hotel Properties / Branches', count: mockBranches.length },
          { id: 'policies', label: 'Operating Policies & VAT', count: 4 },
          { id: 'audit', label: 'Immutable Audit Trail', count: auditLogs.length },
        ]}
        activeTab={activeTab}
        onChange={tabId => setActiveTab(tabId)}
      />

      {/* Tab 1: Organization Profile */}
      {activeTab === 'profile' && (
        <div className="card-luxury-3d p-6 sm:p-8 space-y-6 max-w-4xl">
          <div className="flex items-center gap-4 pb-6 border-b border-border/80 dark:border-white/10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/30 via-accent/15 to-transparent border border-accent/60 flex items-center justify-center text-accent shadow-gold">
              <Building2 className="w-8 h-8 text-accent" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-2xl text-primary dark:text-white">
                {mockOrganization.name}
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-0.5">
                {mockOrganization.legalEntity} • Tax ID: {mockOrganization.taxId}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="space-y-1">
              <span className="text-charcoal-muted uppercase font-semibold">Headquarters Address</span>
              <p className="font-semibold text-primary dark:text-white">{mockOrganization.headquarters}</p>
            </div>
            <div className="space-y-1">
              <span className="text-charcoal-muted uppercase font-semibold">Directorate Contact</span>
              <p className="font-semibold text-primary dark:text-white">{mockOrganization.contactEmail}</p>
            </div>
            <div className="space-y-1">
              <span className="text-charcoal-muted uppercase font-semibold">Operating Currency</span>
              <p className="font-semibold text-accent font-mono">{mockOrganization.currency}</p>
            </div>
            <div className="space-y-1">
              <span className="text-charcoal-muted uppercase font-semibold">Active Hotel Portfolios</span>
              <p className="font-semibold text-primary dark:text-white">{mockOrganization.totalProperties} Sovereign Properties Worldwide</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Branches */}
      {activeTab === 'branches' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockBranches.map(branch => (
            <div key={branch.id} className="card-luxury-3d p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-wider">{branch.code}</span>
                  <h4 className="font-serif font-bold text-lg text-primary dark:text-white">{branch.name}</h4>
                  <p className="text-xs text-charcoal-muted">{branch.address}, {branch.city} {branch.country}</p>
                </div>
                <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-500">
                  {branch.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-border/60">
                <div>
                  <span className="text-charcoal-muted">General Manager:</span>
                  <p className="font-semibold text-primary dark:text-white">{branch.generalManager}</p>
                </div>
                <div>
                  <span className="text-charcoal-muted">Suite Capacity:</span>
                  <p className="font-mono font-semibold">{branch.totalRooms} Luxury Suites</p>
                </div>
                <div>
                  <span className="text-charcoal-muted">Check-In / Out:</span>
                  <p className="font-mono">{branch.checkInTime} / {branch.checkOutTime}</p>
                </div>
                <div>
                  <span className="text-charcoal-muted">Local Currency:</span>
                  <p className="font-mono text-accent">{branch.currency}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Operating Policies */}
      {activeTab === 'policies' && (
        <div className="card-luxury-3d p-6 sm:p-8 max-w-2xl">
          <form onSubmit={handleSavePolicies} className="space-y-5">
            <h3 className="font-serif font-bold text-xl text-primary dark:text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-accent" />
              Hotel Operational & Fiscal Rules
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase text-charcoal-muted">
                  Default Check-In Time
                </label>
                <input
                  type="time"
                  value={checkInTime}
                  onChange={e => setCheckInTime(e.target.value)}
                  className="w-full px-3 py-2 bg-ivory dark:bg-black/40 border border-border dark:border-white/10 rounded-xl text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase text-charcoal-muted">
                  Default Check-Out Time
                </label>
                <input
                  type="time"
                  value={checkOutTime}
                  onChange={e => setCheckOutTime(e.target.value)}
                  className="w-full px-3 py-2 bg-ivory dark:bg-black/40 border border-border dark:border-white/10 rounded-xl text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase text-charcoal-muted">
                  Statutory Hospitality VAT (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={vatRate}
                  onChange={e => setVatRate(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-ivory dark:bg-black/40 border border-border dark:border-white/10 rounded-xl text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase text-charcoal-muted">
                  Primary Ledger Currency
                </label>
                <select
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 bg-ivory dark:bg-black/40 border border-border dark:border-white/10 rounded-xl text-xs font-mono"
                >
                  <option value="EUR (€)">EUR (€) — Eurozone / Monaco</option>
                  <option value="USD ($)">USD ($) — US Dollar</option>
                  <option value="GBP (£)">GBP (£) — British Pound</option>
                  <option value="CHF">CHF — Swiss Franc</option>
                </select>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl gold-gradient-bg text-primary-900 font-bold text-xs btn-3d"
              >
                Save Operational Policies
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 4: Immutable Audit Trail */}
      {activeTab === 'audit' && (
        <DataTable
          data={auditLogs}
          columns={auditColumns}
          keyExtractor={l => l.id}
          searchPlaceholder="Search audit trail by operation, operator, or record ref..."
        />
      )}
    </div>
  );
};

export default SettingsPage;

