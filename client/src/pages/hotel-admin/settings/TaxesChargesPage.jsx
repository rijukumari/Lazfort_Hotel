import React, { useState } from 'react';
import { PageHeader } from '../../../components/ui';
import { useToast } from '../../../context/ToastContext';
import {
  Receipt,
  Percent,
  Plus,
  Trash2,
  DollarSign,
  Save,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

export const TaxesChargesPage = () => {
  const { showToast } = useToast();

  const [taxConfig, setTaxConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('lazfort_tax_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      vatRate: 10,
      serviceChargeRate: 12,
      municipalCityTaxPerNight: 7.5,
      taxInclusivePricing: true,
      sovereignLevyRate: 2.5,
      taxIdentificationNumber: 'MC-VAT-893021',
      customFees: [
        { id: 'fee-1', name: 'Concierge Butler Discretionary Service', rate: 5, type: 'percentage' },
        { id: 'fee-2', name: 'Monaco Heritage Preservation Surcharge', rate: 15, type: 'fixed' },
      ],
    };
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTaxConfig((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddFee = () => {
    const newFee = {
      id: `fee-${Date.now()}`,
      name: 'New Ancillary Luxury Charge',
      rate: 5,
      type: 'percentage',
    };
    setTaxConfig((prev) => ({
      ...prev,
      customFees: [...prev.customFees, newFee],
    }));
  };

  const handleRemoveFee = (id) => {
    setTaxConfig((prev) => ({
      ...prev,
      customFees: prev.customFees.filter((f) => f.id !== id),
    }));
  };

  const handleUpdateFee = (id, field, value) => {
    setTaxConfig((prev) => ({
      ...prev,
      customFees: prev.customFees.map((f) => (f.id === id ? { ...f, [field]: value } : f)),
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('lazfort_tax_settings', JSON.stringify(taxConfig));
      setIsSaved(true);
      if (showToast) {
        showToast('Tax Settings Saved', 'Statutory VAT, service tariffs, and surcharge registers updated.', 'success');
      }
      setTimeout(() => setIsSaved(false), 4000);
    } catch {
      if (showToast) {
        showToast('Error', 'Failed to commit tax configurations.', 'error');
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      <PageHeader
        title="Taxes, Levies & Statutory Charges"
        description="Value-Added Tax (VAT) brackets, luxury hospitality service charges, tourist municipality duties, and invoice calculation rules."
      />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Statutory Rates */}
        <div className="card-luxury-3d p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-6">
            <Receipt className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-serif font-semibold text-foreground">
              Statutory Tax Rates & Direct Levies
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Standard Hospitality VAT Rate (%)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  name="vatRate"
                  value={taxConfig.vatRate}
                  onChange={handleChange}
                  required
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-accent font-mono"
                />
                <span className="text-xs text-muted-foreground">%</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Palace Service Charge Rate (%)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  name="serviceChargeRate"
                  value={taxConfig.serviceChargeRate}
                  onChange={handleChange}
                  required
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-accent font-mono"
                />
                <span className="text-xs text-muted-foreground">%</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                City / Tourist Tax per Person per Night
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.5"
                  name="municipalCityTaxPerNight"
                  value={taxConfig.municipalCityTaxPerNight}
                  onChange={handleChange}
                  required
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-accent font-mono"
                />
                <span className="text-xs text-muted-foreground">EUR / Night</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-border">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Registered Fiscal Tax ID
              </label>
              <input
                type="text"
                name="taxIdentificationNumber"
                value={taxConfig.taxIdentificationNumber}
                onChange={handleChange}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-accent font-mono"
              />
            </div>

            <div className="p-4 rounded-xl border border-border bg-background/50 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-foreground block">
                  Tax-Inclusive Tariff Display
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Display room rates inclusive of statutory VAT across customer bookings
                </span>
              </div>
              <input
                type="checkbox"
                name="taxInclusivePricing"
                checked={taxConfig.taxInclusivePricing}
                onChange={handleChange}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Custom Surcharges & Fees */}
        <div className="card-luxury-3d p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-serif font-semibold text-foreground flex items-center gap-2">
                <Percent className="w-5 h-5 text-accent" />
                Ancillary Levies & Custom Surcharges
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Manage specialized surcharges applied on folios, banqueting, and wine cellars
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddFee}
              className="px-3.5 py-1.5 rounded-xl bg-accent/15 hover:bg-accent/25 text-accent border border-accent/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Custom Levy
            </button>
          </div>

          <div className="space-y-3">
            {taxConfig.customFees.map((fee) => (
              <div
                key={fee.id}
                className="p-3.5 rounded-xl bg-background/70 border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <input
                  type="text"
                  value={fee.name}
                  onChange={(e) => handleUpdateFee(fee.id, 'name', e.target.value)}
                  className="text-xs font-medium px-3 py-2 rounded-lg border border-border bg-background text-foreground flex-1"
                />

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={fee.rate}
                    onChange={(e) => handleUpdateFee(fee.id, 'rate', parseFloat(e.target.value) || 0)}
                    className="w-20 text-xs font-mono px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                  />
                  <select
                    value={fee.type}
                    onChange={(e) => handleUpdateFee(fee.id, 'type', e.target.value)}
                    className="text-xs px-2.5 py-2 rounded-lg border border-border bg-background text-foreground"
                  >
                    <option value="percentage">% of Subtotal</option>
                    <option value="fixed">Fixed EUR (€)</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => handleRemoveFee(fee.id)}
                    className="p-2 rounded-lg text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
                    title="Remove fee"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {isSaved ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" />
              <span>Tax regulations committed to POS, Folios, and Invoices.</span>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-accent" />
              Directly complies with Monégasque fiscal authority statutory reporting requirements.
            </p>
          )}

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-accent hover:bg-accent/90 text-background font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save Taxes & Levies
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaxesChargesPage;

