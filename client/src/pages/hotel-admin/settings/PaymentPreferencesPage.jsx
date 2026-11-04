import React, { useState } from 'react';
import { PageHeader } from '../../../components/ui';
import { useToast } from '../../../context/ToastContext';
import {
  CreditCard,
  DollarSign,
  Lock,
  Wallet,
  CheckCircle2,
  Save,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export const PaymentPreferencesPage = () => {
  const { showToast } = useToast();

  const [paymentConfig, setPaymentConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('lazfort_payment_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      primarySettlementCurrency: 'EUR (€)',
      supportedCurrencies: ['EUR (€)', 'USD ($)', 'GBP (£)', 'CHF (CHF)', 'AED (AED)'],
      enableStripeGateway: true,
      stripeMode: 'live',
      stripePublicKey: 'pk_live_51LzF0RtS0vErEiGn98021',
      enableWireTransfer: true,
      bankIban: 'MC58 3000 6000 0100 2003 4005 600',
      bankBicSwift: 'LAZPMC22XXX',
      bankBeneficiary: 'Lazfort Resorts International S.A.',
      enableAmexCenturionDirect: true,
      enableCryptoSovereignSettlement: true,
      autoCaptureDeposits: true,
      batchSettlementCycle: '23:30 (CET Daily)',
    };
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentConfig((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('lazfort_payment_settings', JSON.stringify(paymentConfig));
      setIsSaved(true);
      if (showToast) {
        showToast('Payment Gateways Updated', 'Settlement currencies, merchant keys, and payment rails committed.', 'success');
      }
      setTimeout(() => setIsSaved(false), 4000);
    } catch {
      if (showToast) {
        showToast('Error', 'Unable to commit payment gateway preferences.', 'error');
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      <PageHeader
        title="Payment Gateways & Settlement Preferences"
        description="Configure merchant settlement accounts, credit card rails, banking IBAN details, and sovereign currency matrices."
      />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Currencies & Settlement Rules */}
        <div className="card-luxury-3d p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-6">
            <DollarSign className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-serif font-semibold text-foreground">
              Primary Currency & Settlement Matrix
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Base Operating Currency
              </label>
              <select
                name="primarySettlementCurrency"
                value={paymentConfig.primarySettlementCurrency}
                onChange={handleChange}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-accent"
              >
                <option value="EUR (€)">EUR (€) - Sovereign Monégasque Euro</option>
                <option value="USD ($)">USD ($) - United States Dollar</option>
                <option value="GBP (£)">GBP (£) - British Pound Sterling</option>
                <option value="CHF (CHF)">CHF - Swiss Franc</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Daily Batch Settlement Window
              </label>
              <input
                type="text"
                name="batchSettlementCycle"
                value={paymentConfig.batchSettlementCycle}
                onChange={handleChange}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-accent font-mono"
              />
            </div>

            <div className="p-4 rounded-xl border border-border bg-background/50 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-foreground block">
                  Auto-Capture Folio Deposits
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Instantly capture 100% deposit on check-in
                </span>
              </div>
              <input
                type="checkbox"
                name="autoCaptureDeposits"
                checked={paymentConfig.autoCaptureDeposits}
                onChange={handleChange}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Online Payment Gateway (Stripe / Adyen) */}
        <div className="card-luxury-3d p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-serif font-semibold text-foreground">
                Digital Merchant Gateway (Stripe / Adyen Luxury)
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Enable Gateway</span>
              <input
                type="checkbox"
                name="enableStripeGateway"
                checked={paymentConfig.enableStripeGateway}
                onChange={handleChange}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Gateway Environment
              </label>
              <select
                name="stripeMode"
                value={paymentConfig.stripeMode}
                onChange={handleChange}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-accent"
              >
                <option value="live">Live Sovereign Production (PCI-DSS Level 1)</option>
                <option value="sandbox">Sandbox Test Environment</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Merchant Public API Key
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="stripePublicKey"
                  value={paymentConfig.stripePublicKey}
                  onChange={handleChange}
                  className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-accent font-mono"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-4 border-t border-border">
            <div className="p-3.5 rounded-xl border border-border bg-background/50 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-foreground block">
                  American Express Centurion Direct API
                </span>
                <span className="text-[11px] text-muted-foreground">Zero-limit Black Card clearance</span>
              </div>
              <input
                type="checkbox"
                name="enableAmexCenturionDirect"
                checked={paymentConfig.enableAmexCenturionDirect}
                onChange={handleChange}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-background/50 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-foreground block">
                  Sovereign Digital Asset Custody (USDC / Bitcoin)
                </span>
                <span className="text-[11px] text-muted-foreground">Regulated crypto institutional settlement</span>
              </div>
              <input
                type="checkbox"
                name="enableCryptoSovereignSettlement"
                checked={paymentConfig.enableCryptoSovereignSettlement}
                onChange={handleChange}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Banking Wire Information */}
        <div className="card-luxury-3d p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-6">
            <Wallet className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-serif font-semibold text-foreground">
              Official Treasury Banking & SWIFT Wire Coordinates
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Beneficiary Name
              </label>
              <input
                type="text"
                name="bankBeneficiary"
                value={paymentConfig.bankBeneficiary}
                onChange={handleChange}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                International Bank Account Number (IBAN)
              </label>
              <input
                type="text"
                name="bankIban"
                value={paymentConfig.bankIban}
                onChange={handleChange}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-accent font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Bank Identifier Code (BIC / SWIFT)
              </label>
              <input
                type="text"
                name="bankBicSwift"
                value={paymentConfig.bankBicSwift}
                onChange={handleChange}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-accent font-mono uppercase"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {isSaved ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" />
              <span>Payment rails and treasury banking coordinates updated.</span>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-accent" />
              Directly connected to guest checkouts, invoice PDF generation, and bank reconciliation.
            </p>
          )}

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-accent hover:bg-accent/90 text-background font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save Payment Preferences
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentPreferencesPage;

