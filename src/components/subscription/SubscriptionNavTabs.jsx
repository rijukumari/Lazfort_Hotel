import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, CheckCircle2, AlertOctagon, Sliders } from 'lucide-react';

export const SubscriptionNavTabs = ({
  activeTab,
  plansCount = 4,
  activeCount = 6,
  expiredCount = 4,
  featuresCount = 13,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2 border-b border-border/80 dark:border-border-dark/80 pb-3 overflow-x-auto custom-scrollbar">
      <button
        onClick={() => navigate('/super-admin/subscriptions')}
        className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
          activeTab === 'plans'
            ? 'bg-accent/15 text-accent dark:text-accent-hover font-bold border border-accent/30'
            : 'text-charcoal-muted hover:text-charcoal dark:hover:text-white'
        }`}
      >
        <Crown className="w-3.5 h-3.5" />
        <span>Subscription Plans</span>
        <span className="text-[10px] font-mono opacity-80">({plansCount})</span>
      </button>

      <button
        onClick={() => navigate('/super-admin/subscriptions/active')}
        className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
          activeTab === 'active'
            ? 'bg-accent/15 text-accent dark:text-accent-hover font-bold border border-accent/30'
            : 'text-charcoal-muted hover:text-charcoal dark:hover:text-white'
        }`}
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
        <span>Active Subscriptions</span>
        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold flex items-center justify-center font-mono">
          {activeCount}
        </span>
      </button>

      <button
        onClick={() => navigate('/super-admin/subscriptions/expired')}
        className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
          activeTab === 'expired'
            ? 'bg-accent/15 text-accent dark:text-accent-hover font-bold border border-accent/30'
            : 'text-charcoal-muted hover:text-charcoal dark:hover:text-white'
        }`}
      >
        <AlertOctagon className="w-3.5 h-3.5 text-rose-500" />
        <span>Expired Subscriptions</span>
        <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400 text-[10px] font-bold flex items-center justify-center font-mono">
          {expiredCount}
        </span>
      </button>

      <button
        onClick={() => navigate('/super-admin/subscriptions/features')}
        className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
          activeTab === 'features'
            ? 'bg-accent/15 text-accent dark:text-accent-hover font-bold border border-accent/30'
            : 'text-charcoal-muted hover:text-charcoal dark:hover:text-white'
        }`}
      >
        <Sliders className="w-3.5 h-3.5 text-accent" />
        <span>Plan Features</span>
        <span className="text-[10px] font-mono opacity-80">({featuresCount})</span>
      </button>
    </div>
  );
};

export default SubscriptionNavTabs;

