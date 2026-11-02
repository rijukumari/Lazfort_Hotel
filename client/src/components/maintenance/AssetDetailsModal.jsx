import React, { useState } from 'react';
import {
  X,
  Building2,
  DollarSign,
  Calendar,
  ShieldCheck,
  Wrench,
  Tag,
  MapPin,
  Clock,
  TrendingDown,
  Edit2,
  AlertTriangle,
  CheckCircle,
  FileText
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const AssetDetailsModal = ({
  isOpen,
  onClose,
  asset = null,
  onEdit,
  onRaiseTicket
}) => {
  const { updateAssetCondition } = useERP();
  const [selectedCondition, setSelectedCondition] = useState(asset?.condition || 'Excellent');

  if (!isOpen || !asset) return null;

  // Depreciation calculations
  const cost = Number(asset.purchaseCost || asset.cost || 0);
  const salvage = Number(asset.salvageValue || 0);
  const usefulLife = Number(asset.usefulLifeYears || 10);
  const purchaseDate = new Date(asset.purchaseDate || Date.now());
  const now = new Date();
  const ageYears = Math.max(0, (now - purchaseDate) / (1000 * 60 * 60 * 24 * 365.25));

  const annualDepreciation = usefulLife > 0 ? (cost - salvage) / usefulLife : 0;
  const accumulatedDepreciation = Math.min(cost - salvage, ageYears * annualDepreciation);
  const netBookValue = Math.max(salvage, cost - accumulatedDepreciation);
  const depreciationPercent = cost > 0 ? Math.min(100, (accumulatedDepreciation / cost) * 100) : 0;

  // Warranty status
  const isWarrantyActive = asset.warrantyExpiry ? new Date(asset.warrantyExpiry) > now : false;

  const handleConditionChange = (newCond) => {
    setSelectedCondition(newCond);
    updateAssetCondition(asset.id, newCond);
  };

  const conditionColors = {
    Excellent: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
    Good: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
    Fair: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
    Poor: 'text-rose-500 bg-rose-500/10 border-rose-500/30'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white dark:bg-primary-900 border border-accent/40 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border/80 dark:border-white/10 flex items-center justify-between bg-ivory/50 dark:bg-primary-800/40">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shadow-gold">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
                  {asset.name}
                </h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-accent/15 text-accent border border-accent/30 font-semibold">
                  {asset.tag || asset.id}
                </span>
              </div>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                {asset.category} • {asset.location}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(asset)}
                className="px-3 py-1.5 rounded-xl border border-accent/40 text-accent text-xs font-semibold hover:bg-accent/15 transition-colors flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-charcoal-muted hover:text-accent hover:bg-white dark:hover:bg-primary-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Key Capital Valuation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl border border-border/80 dark:border-white/10 bg-ivory/30 dark:bg-primary-950/40">
              <div className="flex items-center justify-between text-xs text-charcoal-muted dark:text-gray-400 mb-1">
                <span>Original Capital Cost</span>
                <DollarSign className="w-4 h-4 text-accent" />
              </div>
              <p className="text-xl font-serif font-bold text-primary dark:text-white">
                ${cost.toLocaleString()}
              </p>
              <p className="text-[10px] text-charcoal-muted font-mono mt-1">
                Purchased {asset.purchaseDate || 'N/A'}
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-accent/40 bg-accent/10 dark:bg-accent/5">
              <div className="flex items-center justify-between text-xs text-accent font-semibold mb-1">
                <span>Net Book Value</span>
                <ShieldCheck className="w-4 h-4 text-accent" />
              </div>
              <p className="text-xl font-serif font-bold text-accent">
                ${Math.round(netBookValue).toLocaleString()}
              </p>
              <p className="text-[10px] text-accent/80 font-mono mt-1">
                Salvage Residual: ${salvage.toLocaleString()}
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-border/80 dark:border-white/10 bg-ivory/30 dark:bg-primary-950/40">
              <div className="flex items-center justify-between text-xs text-charcoal-muted dark:text-gray-400 mb-1">
                <span>Accumulated Depreciation</span>
                <TrendingDown className="w-4 h-4 text-rose-500" />
              </div>
              <p className="text-xl font-serif font-bold text-rose-600 dark:text-rose-400">
                -${Math.round(accumulatedDepreciation).toLocaleString()}
              </p>
              <div className="mt-1.5 w-full bg-border dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-rose-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${depreciationPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Asset Condition & Quick Update */}
          <div className="p-4 rounded-2xl border border-border/80 dark:border-white/10 bg-ivory/40 dark:bg-primary-950/40">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-400 mb-3">
              Operational Condition & Service Readiness
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['Excellent', 'Good', 'Fair', 'Poor'].map((cond) => {
                const isActive = (selectedCondition || asset.condition) === cond;
                return (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => handleConditionChange(cond)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-center flex items-center justify-center gap-1.5 ${
                      isActive
                        ? conditionColors[cond] + ' ring-2 ring-accent/30 font-bold'
                        : 'border-border dark:border-white/10 bg-white/60 dark:bg-white/5 text-charcoal-muted dark:text-gray-400 hover:border-accent/30'
                    }`}
                  >
                    {isActive && <CheckCircle className="w-3 h-3" />}
                    <span>{cond}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Technical Dossier Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-border/80 dark:border-white/10 bg-ivory/20 dark:bg-primary-950/30 space-y-2.5">
              <h4 className="text-xs font-bold text-primary dark:text-white uppercase tracking-wider mb-2">
                Capital Engineering Specs
              </h4>
              <div className="flex justify-between text-xs py-1 border-b border-border/40 dark:border-white/5">
                <span className="text-charcoal-muted dark:text-gray-400">Tag / Serial Number:</span>
                <span className="font-mono font-semibold text-primary dark:text-white">
                  {asset.serialNumber || asset.tag || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between text-xs py-1 border-b border-border/40 dark:border-white/5">
                <span className="text-charcoal-muted dark:text-gray-400">Depreciation Model:</span>
                <span className="font-medium text-primary dark:text-white">
                  {asset.depreciationMethod || 'Straight-Line (IAS-16)'}
                </span>
              </div>
              <div className="flex justify-between text-xs py-1 border-b border-border/40 dark:border-white/5">
                <span className="text-charcoal-muted dark:text-gray-400">Useful Lifetime:</span>
                <span className="font-semibold text-primary dark:text-white">
                  {usefulLife} Years ({Math.max(0, usefulLife - Math.round(ageYears))} years remaining)
                </span>
              </div>
              <div className="flex justify-between text-xs py-1">
                <span className="text-charcoal-muted dark:text-gray-400">Asset Age:</span>
                <span className="font-semibold text-primary dark:text-white">
                  {ageYears.toFixed(1)} Years in Service
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-border/80 dark:border-white/10 bg-ivory/20 dark:bg-primary-950/30 space-y-2.5">
              <h4 className="text-xs font-bold text-primary dark:text-white uppercase tracking-wider mb-2">
                Vendor & Warranty Governance
              </h4>
              <div className="flex justify-between text-xs py-1 border-b border-border/40 dark:border-white/5">
                <span className="text-charcoal-muted dark:text-gray-400">Authorized Supplier:</span>
                <span className="font-semibold text-primary dark:text-white">
                  {asset.supplier || 'Carrier International Monaco'}
                </span>
              </div>
              <div className="flex justify-between text-xs py-1 border-b border-border/40 dark:border-white/5">
                <span className="text-charcoal-muted dark:text-gray-400">Warranty Expiry:</span>
                <span className="font-medium text-primary dark:text-white">
                  {asset.warrantyExpiry || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between text-xs py-1 border-b border-border/40 dark:border-white/5">
                <span className="text-charcoal-muted dark:text-gray-400">Warranty Standing:</span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    isWarrantyActive
                      ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                      : 'bg-charcoal/10 text-charcoal-muted border border-border'
                  }`}
                >
                  {isWarrantyActive ? 'Active Full Warranty' : 'Expired / Standard Maintenance'}
                </span>
              </div>
              <div className="flex justify-between text-xs py-1">
                <span className="text-charcoal-muted dark:text-gray-400">Operational Status:</span>
                <span className="text-emerald-500 font-bold uppercase text-[11px] tracking-wider">
                  {asset.status || 'Active in Service'}
                </span>
              </div>
            </div>
          </div>

          {/* Maintenance History Log */}
          <div className="p-4 rounded-2xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-950/30">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-primary dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Wrench className="w-4 h-4 text-accent" />
                <span>Service & Overhaul History Log</span>
              </h4>
              {onRaiseTicket && (
                <button
                  onClick={() => onRaiseTicket(asset)}
                  className="px-2.5 py-1 rounded-lg bg-accent/15 text-accent text-xs font-semibold hover:bg-accent/25 transition-colors"
                >
                  + Raise Service Ticket
                </button>
              )}
            </div>

            {asset.maintenanceHistory && asset.maintenanceHistory.length > 0 ? (
              <div className="space-y-2">
                {asset.maintenanceHistory.map((h, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl border border-border/60 dark:border-white/5 bg-ivory/30 dark:bg-primary-900/40 text-xs flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-primary dark:text-white">{h.task || h.action}</p>
                      <p className="text-[11px] text-charcoal-muted dark:text-gray-400">
                        Technician: {h.technician || 'Engineering Corps'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-[10px] text-accent font-semibold">{h.date}</span>
                      <p className="text-[10px] text-emerald-500 font-semibold">{h.status || 'Verified'}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-charcoal-muted dark:text-gray-400 italic py-2">
                No major overhaul recorded. Asset operating under routine preventative cycle.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border/80 dark:border-white/10 flex items-center justify-between bg-ivory/50 dark:bg-primary-800/40">
          <p className="text-xs text-charcoal-muted dark:text-gray-400">
            Lazfort Fixed Asset Register • Asset ID #{asset.id}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssetDetailsModal;

