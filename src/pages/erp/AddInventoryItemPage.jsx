import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import { FormField, Input, Select, Button, Card } from '../../components/ui';
import {
  ArrowLeft,
  Boxes,
  Plus,
  Save,
  ShieldCheck,
  Building,
} from 'lucide-react';

export const AddInventoryItemPage = () => {
  const navigate = useNavigate();
  const { addInventoryItem } = useERP();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [sku, setSku] = useState(`INV-${Math.floor(1000 + Math.random() * 9000)}-LX`);
  const [category, setCategory] = useState('Guest Amenities');
  const [department, setDepartment] = useState('Housekeeping');
  const [uom, setUom] = useState('Units');
  const [currentStock, setCurrentStock] = useState(50);
  const [minStock, setMinStock] = useState(20);
  const [unitCost, setUnitCost] = useState(45);
  const [supplier, setSupplier] = useState('Petrossian Paris');
  const [location, setLocation] = useState('Main Store Room Wing A');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Validation Error', 'Item name is required.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 450));
      if (addInventoryItem) {
        addInventoryItem({
          name: name.trim(),
          sku: sku.trim(),
          category,
          department,
          unitOfMeasure: uom,
          currentStock: Number(currentStock),
          minimumStock: Number(minStock),
          unitCost: Number(unitCost),
          supplierName: supplier,
          location: location.trim(),
        });
      }
      showToast('Inventory Item Registered', `${name} registered to hotel stores catalog.`, 'success');
      navigate('/hotel-admin/inventory');
    } catch {
      showToast('Error', 'Failed to register inventory item.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-5">
        <div className="space-y-1">
          <Link
            to="/hotel-admin/inventory"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-accent transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-accent" />
            <span>Return to Inventory Catalog</span>
          </Link>
          <div className="flex items-center gap-2 pt-1">
            <span className="p-1.5 rounded-lg bg-accent/15 border border-accent/30 text-accent">
              <Boxes className="w-4 h-4" />
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
              Provision New Inventory Stock Item
            </h1>
          </div>
          <p className="text-xs text-charcoal-muted">
            Configure luxury amenity stock, housekeeping supplies, safety thresholds, and preferred purveyors.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white/90 dark:bg-surface-dark/95 backdrop-blur-2xl rounded-3xl border border-accent/30 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Item Name / Title" required>
                <Input
                  placeholder="e.g. Bvlgari White Tea Eau de Parfum (100ml)"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </FormField>

              <FormField label="SKU / Barcode" required>
                <Input
                  value={sku}
                  onChange={e => setSku(e.target.value)}
                  required
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <FormField label="Category" required>
                <Select value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="Guest Amenities">Guest Amenities</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Housekeeping Linens">Housekeeping Linens</option>
                  <option value="Engineering & Spare Parts">Engineering & Spares</option>
                  <option value="Operating Supplies">Operating Supplies</option>
                </Select>
              </FormField>

              <FormField label="Department" required>
                <Select value={department} onChange={e => setDepartment(e.target.value)}>
                  <option value="Housekeeping">Housekeeping</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Front Desk">Front Desk</option>
                  <option value="Engineering">Engineering & Facilities</option>
                </Select>
              </FormField>

              <FormField label="Unit of Measure" required>
                <Select value={uom} onChange={e => setUom(e.target.value)}>
                  <option value="Units">Units / Bottles</option>
                  <option value="Sets">Sets</option>
                  <option value="Cases">Cases / Boxes</option>
                  <option value="Kg">Kilograms (kg)</option>
                  <option value="Liters">Liters (L)</option>
                </Select>
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <FormField label="Initial Physical Stock" required>
                <Input
                  type="number"
                  min={0}
                  value={currentStock}
                  onChange={e => setCurrentStock(Number(e.target.value))}
                  required
                />
              </FormField>

              <FormField label="Safety Reorder Threshold" required>
                <Input
                  type="number"
                  min={0}
                  value={minStock}
                  onChange={e => setMinStock(Number(e.target.value))}
                  required
                />
              </FormField>

              <FormField label="Unit Cost ($ USD)" required>
                <Input
                  type="number"
                  min={1}
                  value={unitCost}
                  onChange={e => setUnitCost(Number(e.target.value))}
                  required
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Storage Physical Location" required>
                <Input
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Main Store Room Wing A"
                  required
                />
              </FormField>

              <FormField label="Primary Luxury Purveyor" required>
                <Input
                  value={supplier}
                  onChange={e => setSupplier(e.target.value)}
                  placeholder="e.g. Petrossian Paris"
                  required
                />
              </FormField>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/90 dark:bg-surface-dark/95 backdrop-blur-2xl rounded-3xl border border-accent/30 p-6 shadow-xl space-y-5 sticky top-24">
            <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold block">
              Stock Valuation Summary
            </span>

            <div className="p-4 rounded-2xl bg-ivory dark:bg-primary-900/50 border border-border/80 text-center">
              <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Total Batch Worth</span>
              <p className="font-serif font-bold text-2xl text-accent mt-1">
                ${(currentStock * unitCost).toLocaleString()}
                <span className="text-xs font-sans text-charcoal-muted font-normal"> USD</span>
              </p>
              <span className="inline-block mt-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                {currentStock} {uom} @ ${unitCost}/ea
              </span>
            </div>

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
                Register
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddInventoryItemPage;

