import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import { FormField, Input, Select, Button, Card } from '../../components/ui';
import {
  ArrowLeft,
  Building,
  Plus,
  Save,
  ShieldCheck,
  Mail,
  Phone,
  Clock,
  Sparkles,
  CreditCard,
} from 'lucide-react';

export const AddSupplierPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [code, setCode] = useState(`SUP-${Math.floor(100 + Math.random() * 900)}`);
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+377 98 00 14 00');
  const [leadTimeDays, setLeadTimeDays] = useState(3);
  const [paymentTerms, setPaymentTerms] = useState('Net 30');
  const [category, setCategory] = useState('Food & Beverage Purveyor');
  const [address, setAddress] = useState('Port Hercule Marine Quai, 98000 Monaco');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Supplier/Purveyor name is required';
    if (!email.trim()) errs.email = 'Operational order email is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Validation Error', 'Please complete all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 450));
      showToast('Purveyor Registered', `Vendor "${name}" onboarded into supply chain.`, 'success');
      navigate('/hotel-admin/inventory');
    } catch {
      showToast('Error', 'Failed to register purveyor.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-5">
        <div className="space-y-1">
          <Link
            to="/hotel-admin/inventory"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-accent transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-accent" />
            <span>Return to Inventory Depot</span>
          </Link>
          <div className="flex items-center gap-3 pt-1">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
              Onboard Approved Purveyor
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-accent/15 text-accent border border-accent/30">
              Verified Partner
            </span>
          </div>
          <p className="text-xs text-charcoal-muted dark:text-gray-400">
            Register new luxury purveyors, amenities vendors, and certified service suppliers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            type="button"
            onClick={() => navigate('/hotel-admin/inventory')}
          >
            Cancel
          </Button>
          <Button
            variant="gold"
            type="button"
            loading={isSubmitting}
            icon={Save}
            onClick={handleSubmit}
          >
            Save Purveyor
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <Card variant="luxury" className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-border/70 dark:border-white/10">
              <div className="w-10 h-10 rounded-2xl bg-accent/15 text-accent flex items-center justify-center font-bold">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                  Purveyor Corporate Details
                </h3>
                <p className="text-xs text-charcoal-muted dark:text-gray-400">
                  Legal entity name, vendor identification code, and procurement category.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <FormField label="Purveyor / Vendor Name" required error={errors.name}>
                  <Input
                    type="text"
                    placeholder="e.g. Petrossian Paris S.A."
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </FormField>
              </div>

              <div>
                <FormField label="Vendor Code" required hint="ERP Reference">
                  <Input
                    type="text"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    required
                  />
                </FormField>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Procurement Category" required>
                <Select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  <option value="Food & Beverage Purveyor">Food & Beverage Purveyor (Caviar/Wine/Meat)</option>
                  <option value="Guest Amenities Vendor">Guest Amenities & Spa Cosmetics</option>
                  <option value="Linens & Textiles">Luxury Linens & Textiles</option>
                  <option value="Engineering & Facilities">Engineering & Facilities Hardware</option>
                  <option value="Operating Supplies">General Operating Supplies & Valet</option>
                </Select>
              </FormField>

              <FormField label="Lead Time (Business Days)" required hint="Standard SLA">
                <Input
                  type="number"
                  min="1"
                  max="60"
                  value={leadTimeDays}
                  onChange={e => setLeadTimeDays(Number(e.target.value))}
                  required
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Primary Contact Executive" hint="Account Manager">
                <Input
                  type="text"
                  placeholder="e.g. Jean-Paul Moreau"
                  value={contactPerson}
                  onChange={e => setContactPerson(e.target.value)}
                />
              </FormField>

              <FormField label="Order Dispatch Email" required error={errors.email}>
                <Input
                  type="email"
                  placeholder="orders@petrossian-paris.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Telephone Support">
                <Input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </FormField>

              <FormField label="Commercial Payment Terms" required>
                <Select
                  value={paymentTerms}
                  onChange={e => setPaymentTerms(e.target.value)}
                >
                  <option value="Net 15">Net 15 Days</option>
                  <option value="Net 30">Net 30 Days (Standard Commercial)</option>
                  <option value="Net 60">Net 60 Days</option>
                  <option value="Immediate / Prepayment">Immediate Bank Wire Prepayment</option>
                </Select>
              </FormField>
            </div>

            <FormField label="HQ Physical / Logistics Address">
              <Input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            </FormField>
          </Card>
        </div>

        {/* Right Column: Policy & Summary */}
        <div className="lg:col-span-4 space-y-6">
          <Card variant="luxury" className="p-6 space-y-4">
            <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold block">
              Contract Terms Overview
            </span>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-border/60 dark:border-white/10">
                <span className="text-charcoal-muted">Vendor Code:</span>
                <span className="font-mono text-accent font-bold">{code}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/60 dark:border-white/10">
                <span className="text-charcoal-muted">Payment Terms:</span>
                <span className="font-semibold text-primary dark:text-white">{paymentTerms}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/60 dark:border-white/10">
                <span className="text-charcoal-muted">Delivery SLA:</span>
                <span className="font-mono text-emerald-500 font-semibold">{leadTimeDays} Days</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/60 dark:border-white/10">
                <span className="text-charcoal-muted">Clearance:</span>
                <span className="text-accent font-medium">Grand Luxe Authorized</span>
              </div>
            </div>

            <div className="pt-2">
              <div className="p-3 rounded-xl bg-ivory dark:bg-primary-950/60 border border-border/80 dark:border-white/10 text-[11px] text-charcoal-muted dark:text-gray-400">
                Once onboarded, this purveyor will immediately be accessible in PO dispatch and automated threshold re-ordering.
              </div>
            </div>
          </Card>

          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate('/hotel-admin/inventory')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="gold"
              type="submit"
              loading={isSubmitting}
              icon={Save}
              className="flex-1"
            >
              Commit Purveyor
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddSupplierPage;

