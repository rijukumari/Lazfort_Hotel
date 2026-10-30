import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { StatCard, StatsGrid } from '../../components/ui/StatCard';
import { CheckCircle2, RefreshCw, ArrowLeft } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const GenericDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  // Extract page title from route path
  const segments = location.pathname.split('/').filter(Boolean);
  const rawTitle = segments[segments.length - 1] || 'Dashboard Detail';
  const pageTitle = rawTitle
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());

  const sectionCategory = segments[1]
    ? segments[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    : 'Hotel Operations';

  const handleAction = () => {
    showToast(
      'Operation Executed',
      `Changes saved for ${pageTitle} configuration.`,
      'success'
    );
  };

  const mockRecords = [
    {
      id: 'REC-01',
      title: `${pageTitle} Standard Protocol Specification`,
      category: sectionCategory,
      updated: '10 mins ago',
      status: 'Active & Verified',
    },
    {
      id: 'REC-02',
      title: `${pageTitle} Sovereign Quality Standard Audit`,
      category: 'Compliance',
      updated: '2 hours ago',
      status: 'Passed (100%)',
    },
    {
      id: 'REC-03',
      title: `${pageTitle} Executive Escalation Matrix`,
      category: 'Governance',
      updated: 'Yesterday',
      status: 'Enabled',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title={pageTitle}
        description={`Dedicated luxury control panel for ${pageTitle.toLowerCase()} under the ${sectionCategory} division.`}
        badge="Live System Endpoint"
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl btn-secondary-3d text-xs font-semibold text-charcoal dark:text-gray-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
            <button
              onClick={handleAction}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d"
            >
              <CheckCircle2 className="w-4 h-4" />
              Save Configuration
            </button>
          </div>
        }
      />

      <StatsGrid columns={3}>
        <StatCard
          title="Operational Status"
          value="Optimal"
          change="Real-time telemetry"
          isPositive={true}
          iconName="Sparkles"
        />
        <StatCard
          title="Active Records"
          value="12 Entries"
          change="Synced with PMS"
          isPositive={true}
          iconName="Sliders"
        />
        <StatCard
          title="Last Synchronized"
          value="Just now"
          change="Automated Backup"
          isPositive={true}
          iconName="Clock"
        />
      </StatsGrid>

      {/* Configuration & Records Box */}
      <div className="card-luxury-3d p-6 sm:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/70 dark:border-white/10">
          <div>
            <h3 className="font-serif font-bold text-lg sm:text-xl text-primary dark:text-white">
              {pageTitle} Specifications & Records
            </h3>
            <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-0.5">
              Configure parameters, rules, and view audit records for this module.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Filter items..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="px-3 py-1.5 text-xs bg-ivory dark:bg-primary-800 border border-border dark:border-border-dark rounded-xl text-charcoal dark:text-white focus:outline-none focus:border-accent"
            />
            <button
              onClick={() => showToast('Refreshed', 'Telemetry reloaded.', 'info')}
              className="p-1.5 rounded-xl border border-border dark:border-border-dark hover:bg-ivory dark:hover:bg-primary-800 text-charcoal-muted hover:text-charcoal dark:hover:text-white transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {mockRecords
            .filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(record => (
              <div
                key={record.id}
                className="p-4 rounded-xl bg-ivory/50 dark:bg-primary-900/40 border border-border/60 dark:border-border-dark/60 flex items-center justify-between gap-4 hover:border-accent/30 transition-colors"
              >
                <div>
                  <span className="font-mono text-[10px] text-accent font-bold uppercase">
                    {record.id} • {record.category}
                  </span>
                  <h4 className="font-semibold text-xs sm:text-sm text-primary dark:text-white mt-0.5">
                    {record.title}
                  </h4>
                  <p className="text-[11px] text-charcoal-muted mt-0.5">
                    Last modified {record.updated} by General Management
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold whitespace-nowrap">
                    {record.status}
                  </span>
                  <button
                    onClick={handleAction}
                    className="text-xs text-accent hover:underline font-semibold"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default GenericDetailPage;

