import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
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
  ArrowDownRight,
  ArrowUpRight,
  AlertTriangle,
} from 'lucide-react';

export const RecordMovementPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { inventoryItems = [], recordStockMovement } = useERP();
  const { showToast } = useToast();

  const initialItemId = searchParams.get('itemId') || inventoryItems[0]?.id || '';
  const initialType = searchParams.get('type') || 'receipt';

  const [selectedItemId, setSelectedItemId] = useState(initialItemId);
  const [movementType, setMovementType] = useState(initialType);
  const [quantity, setQuantity] = useState(10);
  const [reason, setReason] = useState(
    initialType === 'receipt' ? 'Supplier shipment restock' : 'Internal departmental issue'
  );
  const [performedBy, setPerformedBy] = useState('Central Storekeeper');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedItem = inventoryItems.find(i => i.id === selectedItemId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItem || quantity <= 0) {
      showToast('Validation Error', 'Please select an item and a valid quantity.', 'error');
      return;
    }

    if (movementType === 'issue' && quantity > (selectedItem.currentStock || 0)) {
      showToast('Insufficient Stock', `Cannot issue ${quantity} units. Current stock is ${selectedItem.currentStock}.`, 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 450));
      if (recordStockMovement) {
        recordStockMovement({
          itemId: selectedItem.id,
          itemName: selectedItem.name,
          sku: selectedItem.sku,
          type: movementType,
          quantity: Number(quantity),
          reason: reason.trim(),
          performedBy: performedBy.trim(),
        });
      }

      showToast(
        'Stock Movement Logged',
        `Recorded ${movementType === 'receipt' ? '+' : '-'}${quantity} units for "${selectedItem.name}".`,
        'success'
      );
      navigate('/hotel-admin/inventory');
    } catch {
      showToast('Error', 'Failed to record stock movement.', 'error');
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
              Record Stock Movement
            </h1>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
              movementType === 'receipt'
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
            }`}>
              {movementType === 'receipt' ? 'Receipt (Inbound)' : 'Issue (Outbound)'}
            </span>
          </div>
          <p className="text-xs text-charcoal-muted dark:text-gray-400">
            Log physical movement of inventory into or out of central hotel stores with audit traceability.
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
            Post Movement
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-8 space-y-6">
          <Card variant="luxury" className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-border/70 dark:border-white/10">
              <div className="w-10 h-10 rounded-2xl bg-accent/15 text-accent flex items-center justify-center font-bold">
                <Boxes className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                  Stock Ledger Movement Details
                </h3>
                <p className="text-xs text-charcoal-muted dark:text-gray-400">
                  Select item, movement classification, and quantity transacted.
                </p>
              </div>
            </div>

            <FormField label="Inventory Item / SKU" required hint="Select item to adjust">
              <Select
                value={selectedItemId}
                onChange={e => setSelectedItemId(e.target.value)}
              >
                {inventoryItems.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.sku}) • In Stock: {item.currentStock} {item.unitOfMeasure}
                  </option>
                ))}
              </Select>
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Movement Type" required hint="Inbound vs Outbound">
                <Select
                  value={movementType}
                  onChange={e => {
                    setMovementType(e.target.value);
                    setReason(e.target.value === 'receipt' ? 'Supplier shipment restock' : 'Internal departmental issue');
                  }}
                >
                  <option value="receipt">Stock Receipt (+ Increase Inbound)</option>
                  <option value="issue">Stock Issue (- Department Distribution)</option>
                  <option value="wastage">Spoilage / Wastage Write-Off</option>
                  <option value="adjustment">Stocktake Audit Adjustment</option>
                </Select>
              </FormField>

              <FormField label="Quantity Transacted" required hint={`Units: ${selectedItem?.unitOfMeasure || 'Units'}`}>
                <Input
                  type="number"
                  min="1"
                  max={movementType === 'issue' ? selectedItem?.currentStock || 99999 : 99999}
                  value={quantity}
                  onChange={e => setQuantity(Number(e.target.value))}
                  required
                />
              </FormField>
            </div>

            <FormField label="Reference / Reason Narrative" required hint="e.g. PO Number or Requisition Form">
              <Input
                type="text"
                placeholder="e.g. PO-2026-8911 Petrossian Paris Caviar Delivery"
                value={reason}
                onChange={e => setReason(e.target.value)}
                required
              />
            </FormField>

            <FormField label="Responsible Storekeeper / Operator" required hint="Authorized signature">
              <Input
                type="text"
                value={performedBy}
                onChange={e => setPerformedBy(e.target.value)}
                required
              />
            </FormField>
          </Card>
        </div>

        {/* Right Column: Item Information & Stock Preview */}
        <div className="lg:col-span-4 space-y-6">
          <Card variant="luxury" className="p-6 space-y-4">
            <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold block">
              Item Stock Preview
            </span>

            {selectedItem && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-ivory/80 dark:bg-primary-950/70 border border-border/80 dark:border-white/10 space-y-2">
                  <span className="text-[10px] font-mono text-accent font-bold block">
                    {selectedItem.sku}
                  </span>
                  <h4 className="font-serif font-bold text-sm text-primary dark:text-white">
                    {selectedItem.name}
                  </h4>
                  <p className="text-xs text-charcoal-muted">
                    {selectedItem.department} • {selectedItem.location}
                  </p>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-border/60 dark:border-white/10">
                    <span className="text-charcoal-muted">Current On-Hand:</span>
                    <span className="font-mono font-bold text-primary dark:text-white">
                      {selectedItem.currentStock} {selectedItem.unitOfMeasure}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border/60 dark:border-white/10">
                    <span className="text-charcoal-muted">Transacting:</span>
                    <span className={`font-mono font-bold ${
                      movementType === 'receipt' ? 'text-emerald-500' : 'text-rose-500'
                    }`}>
                      {movementType === 'receipt' ? '+' : '-'}{quantity} {selectedItem.unitOfMeasure}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border/60 dark:border-white/10">
                    <span className="text-charcoal-muted">Projected Stock:</span>
                    <span className="font-mono font-bold text-accent text-sm">
                      {movementType === 'receipt'
                        ? (selectedItem.currentStock || 0) + Number(quantity)
                        : Math.max(0, (selectedItem.currentStock || 0) - Number(quantity))}{' '}
                      {selectedItem.unitOfMeasure}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border/60 dark:border-white/10">
                    <span className="text-charcoal-muted">Reorder Par Level:</span>
                    <span className="font-mono text-amber-500 font-semibold">
                      {selectedItem.minimumStock} {selectedItem.unitOfMeasure}
                    </span>
                  </div>
                </div>
              </div>
            )}
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
              Confirm Log
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RecordMovementPage;

