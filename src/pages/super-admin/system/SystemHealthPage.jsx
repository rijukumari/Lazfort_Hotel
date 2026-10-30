import React, { useState } from 'react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { StatCard, StatsGrid } from '../../../components/ui/StatCard';
import { useToast } from '../../../context/ToastContext';
import {
  Activity,
  CheckCircle2,
  Server,
  Database,
  RefreshCw,
  ShieldCheck,
  Zap,
  Globe,
} from 'lucide-react';

export const SystemHealthPage = () => {
  const { showToast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastCheck, setLastCheck] = useState('Just now (2026-10-28 20:30 UTC)');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastCheck(new Date().toLocaleTimeString() + ' (Diagnostics Healthy)');
      showToast('Diagnostics Completed', 'All 18 platform microservices and database shards operating within optimal parameters.', 'success');
    }, 700);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="System Health & Infrastructure Telemetry"
        subtitle="Realtime service status, database query latency, memory utilization, and global CDN edge performance"
        breadcrumbs={[
          { label: 'Super Admin', path: '/super-admin/dashboard' },
          { label: 'System & Security', path: '/super-admin/system' },
          { label: 'System Health' },
        ]}
        actions={
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="btn-luxury-primary inline-flex items-center gap-2 text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Run Diagnostics
          </button>
        }
      />

      {/* Main SLA Cards */}
      <StatsGrid cols={4}>
        <StatCard
          title="Overall Platform SLA"
          value="99.98%"
          change={{ value: 0.02, isPositive: true }}
          period="last 365 days"
          icon={<Activity className="w-5 h-5 text-emerald-500" />}
        />
        <StatCard
          title="Avg API Latency"
          value="48 ms"
          period="sub-second response"
          icon={<Zap className="w-5 h-5 text-accent" />}
        />
        <StatCard
          title="Database Query Response"
          value="2.4 ms"
          period="replicated cluster"
          icon={<Database className="w-5 h-5 text-accent" />}
        />
        <StatCard
          title="Uncaught Exception Rate"
          value="0.01%"
          period="zero data loss incidents"
          icon={<ShieldCheck className="w-5 h-5 text-emerald-500" />}
        />
      </StatsGrid>

      {/* Infrastructure Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-luxury p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Server className="w-5 h-5 text-accent" />
              <h3 className="font-serif font-bold text-sm text-primary dark:text-white">
                Core Application Kernel
              </h3>
            </div>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-mono text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              ONLINE
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-border/60 dark:border-white/5">
              <span className="text-charcoal-muted">Runtime:</span>
              <span className="font-mono text-primary dark:text-white font-medium">Node.js 22 LTS / Vite 6</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/60 dark:border-white/5">
              <span className="text-charcoal-muted">Container Uptime:</span>
              <span className="font-mono text-emerald-600 font-medium">48 days, 14 hrs</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-charcoal-muted">CPU Load:</span>
              <span className="font-mono text-primary dark:text-white font-medium">12.4% (8 vCPU)</span>
            </div>
          </div>
        </div>

        <div className="card-luxury p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Database className="w-5 h-5 text-accent" />
              <h3 className="font-serif font-bold text-sm text-primary dark:text-white">
                Central Sovereign DB Cluster
              </h3>
            </div>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-mono text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              SYNCHRONIZED
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-border/60 dark:border-white/5">
              <span className="text-charcoal-muted">Active Connections:</span>
              <span className="font-mono text-primary dark:text-white font-medium">42 / 200 Pool</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/60 dark:border-white/5">
              <span className="text-charcoal-muted">Read Replication Lag:</span>
              <span className="font-mono text-emerald-600 font-medium">&lt; 0.8 ms</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-charcoal-muted">Storage Consumed:</span>
              <span className="font-mono text-primary dark:text-white font-medium">128.4 GB (NVMe)</span>
            </div>
          </div>
        </div>

        <div className="card-luxury p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Globe className="w-5 h-5 text-accent" />
              <h3 className="font-serif font-bold text-sm text-primary dark:text-white">
                Global Anycast CDN Mesh
              </h3>
            </div>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-mono text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              ACCELERATED
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-border/60 dark:border-white/5">
              <span className="text-charcoal-muted">Global POPs Active:</span>
              <span className="font-mono text-primary dark:text-white font-medium">285 Edge Locations</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/60 dark:border-white/5">
              <span className="text-charcoal-muted">Cache Hit Ratio:</span>
              <span className="font-mono text-emerald-600 font-medium">97.6% Hit Rate</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-charcoal-muted">DDoS Scrubbing:</span>
              <span className="font-mono text-primary dark:text-white font-medium">Zero mitigations active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subsystem Health Matrix */}
      <div className="card-luxury p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border dark:border-white/10">
          <h3 className="font-serif font-bold text-base text-primary dark:text-white">
            Operational Microservices Telemetry
          </h3>
          <span className="text-xs text-charcoal-muted font-mono">{lastCheck}</span>
        </div>

        <div className="divide-y divide-border/60 dark:divide-white/5 text-xs">
          {[
            { name: 'Sovereign Guest Booking Switch', latency: '32ms', status: 'Operational', uptime: '99.99%' },
            { name: 'SWIFT & Central Bank Wire Settlement', latency: '54ms', status: 'Operational', uptime: '99.95%' },
            { name: 'In-Suite IoT Smart Room Controller Gateway', latency: '18ms', status: 'Operational', uptime: '99.98%' },
            { name: 'Michelin POS & Cellar Ledger Service', latency: '24ms', status: 'Operational', uptime: '100%' },
            { name: 'Passport & Visa Biometric OCR Engine', latency: '86ms', status: 'Operational', uptime: '99.92%' },
            { name: 'Automated Night Audit & GL Balance Sync', latency: '12ms', status: 'Operational', uptime: '100%' },
          ].map(svc => (
            <div key={svc.name} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span className="font-medium text-primary dark:text-white">{svc.name}</span>
              </div>
              <div className="flex items-center gap-6 font-mono text-xs">
                <span className="text-charcoal-muted">Response: {svc.latency}</span>
                <span className="text-emerald-600 font-semibold">{svc.uptime} SLA</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">
                  {svc.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemHealthPage;

