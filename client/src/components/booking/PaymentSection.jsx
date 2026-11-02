import React from 'react';
import { CreditCard, Building2, Banknote, ShieldCheck, AlertCircle, Lock } from 'lucide-react';

export const PaymentSection = ({
  selectedMethod,
  onChangeMethod,
  cardData,
  onChangeCardData,
  errors = {},
}) => {
  return (
    <div className="bg-white/90 dark:bg-surface-dark/95 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-border dark:border-white/10 shadow-lg space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border/70 dark:border-white/10">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent">
            Step 2 of 3
          </span>
          <h3 className="font-serif text-xl font-bold text-primary dark:text-white mt-0.5">
            Payment Preference & Settlement
          </h3>
        </div>
        <div className="w-8 h-8 rounded-xl bg-accent/15 flex items-center justify-center text-accent">
          <CreditCard className="w-4 h-4" />
        </div>
      </div>

      {/* Payment Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Option 1: Pay at Hotel */}
        <button
          type="button"
          onClick={() => onChangeMethod('pay_at_hotel')}
          className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
            selectedMethod === 'pay_at_hotel'
              ? 'border-accent bg-accent/10 shadow-gold ring-1 ring-accent'
              : 'border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-900/40 hover:border-accent/50'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-3">
            <div className="w-8 h-8 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
              <Banknote className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              Recommended
            </span>
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-primary dark:text-white">
              Pay at Hotel
            </h4>
            <p className="text-[11px] text-charcoal-muted dark:text-gray-400 mt-1 leading-snug">
              Guaranteed reservation. Settle your folio in Monte-Carlo upon check-in.
            </p>
          </div>
        </button>

        {/* Option 2: Credit / Debit Card */}
        <button
          type="button"
          onClick={() => onChangeMethod('credit_card')}
          className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
            selectedMethod === 'credit_card'
              ? 'border-accent bg-accent/10 shadow-gold ring-1 ring-accent'
              : 'border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-900/40 hover:border-accent/50'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-3">
            <div className="w-8 h-8 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
              <CreditCard className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/20 text-accent">
              Demo Gateway
            </span>
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-primary dark:text-white">
              Card Guarantee
            </h4>
            <p className="text-[11px] text-charcoal-muted dark:text-gray-400 mt-1 leading-snug">
              Pre-authorize or settle deposit securely via verified payment gateway.
            </p>
          </div>
        </button>

        {/* Option 3: Bank / Wire Transfer */}
        <button
          type="button"
          onClick={() => onChangeMethod('wire_transfer')}
          className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
            selectedMethod === 'wire_transfer'
              ? 'border-accent bg-accent/10 shadow-gold ring-1 ring-accent'
              : 'border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-900/40 hover:border-accent/50'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-3">
            <div className="w-8 h-8 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
              <Building2 className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-500 dark:text-slate-300">
              Proforma
            </span>
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-primary dark:text-white">
              Sovereign Wire
            </h4>
            <p className="text-[11px] text-charcoal-muted dark:text-gray-400 mt-1 leading-snug">
              Official IBAN / SWIFT invoice generated for private banking settlement.
            </p>
          </div>
        </button>
      </div>

      {/* Dynamic Payment Details Area */}
      {selectedMethod === 'pay_at_hotel' && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-2">
          <div className="flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span>Guaranteed Zero-Deposit Reservation</span>
          </div>
          <p className="text-charcoal-muted dark:text-gray-300 text-[11px] leading-relaxed">
            Your suite is locked immediately in the Lazfort ERP Central Inventory. Payment status will be recorded as{' '}
            <strong className="text-emerald-600 dark:text-emerald-400 font-mono">Pending (Pay upon Check-in)</strong>.
            You may settle via Visa, Mastercard, American Express, or Cash at the Concierge Desk.
          </p>
        </div>
      )}

      {selectedMethod === 'credit_card' && (
        <div className="space-y-4 pt-2">
          {/* Transparent Demo Gateway Notice */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1">
            <div className="flex items-center gap-2 font-semibold text-amber-700 dark:text-amber-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Simulated Payment Gateway (Demo Environment)</span>
            </div>
            <p className="text-charcoal-muted dark:text-gray-400 text-[11px]">
              No live card charge will be made. The system simulates verification and registers this reservation as{' '}
              <strong className="text-accent font-mono font-bold">Paid in Full</strong> in the ERP database.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-accent" />
                Card Number
              </label>
              <input
                type="text"
                placeholder="4242 •••• •••• 4242"
                value={cardData.cardNumber}
                onChange={e => onChangeCardData({ cardNumber: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-mono font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                Cardholder Name
              </label>
              <input
                type="text"
                placeholder="A. Kensington"
                value={cardData.cardHolder}
                onChange={e => onChangeCardData({ cardHolder: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                  Expiry (MM/YY)
                </label>
                <input
                  type="text"
                  placeholder="12/28"
                  value={cardData.expiry}
                  onChange={e => onChangeCardData({ expiry: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-mono text-primary dark:text-white focus:outline-none focus:border-accent"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                  CVV / CVC
                </label>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="•••"
                  value={cardData.cvv}
                  onChange={e => onChangeCardData({ cvv: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-mono text-primary dark:text-white focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedMethod === 'wire_transfer' && (
        <div className="p-4 rounded-2xl bg-ivory/80 dark:bg-primary-900/50 border border-border/80 dark:border-white/10 text-xs space-y-2">
          <div className="flex items-center gap-2 font-semibold text-accent">
            <Lock className="w-4 h-4 flex-shrink-0" />
            <span>Monaco Sovereign Bank Account Details</span>
          </div>
          <p className="text-charcoal-muted dark:text-gray-300 text-[11px] leading-relaxed">
            A Proforma Invoice with IBAN <code className="font-mono text-accent">MC58 3000 2005 5000 0012 3456 789</code> and SWIFT <code className="font-mono text-accent">MONAMCXX</code> will be issued immediately. Your stay status will be recorded as <strong className="text-amber-500 font-mono">Pending Bank Clearance</strong>.
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentSection;

