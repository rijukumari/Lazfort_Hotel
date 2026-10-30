import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageHeader, FormField, Input, Select, Button } from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import {
  Layers,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export const AddRoomCategoryPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [catName, setCatName] = useState('');
  const [catBasePrice, setCatBasePrice] = useState(1800);
  const [catBedType, setCatBedType] = useState('Super King');
  const [catCapacity, setCatCapacity] = useState(2);
  const [catPerks, setCatPerks] = useState('Bulgari Amenities, Butler Service, Ocean View');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!catName.trim()) {
      showToast('Validation Error', 'Category name is required.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 400));
      showToast(
        'Category Provisioned',
        `Room category "${catName}" has been provisioned at base rate $${catBasePrice}/night.`,
        'success'
      );
      navigate('/hotel-admin/rooms');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      <div className="space-y-4">
        <Link
          to="/hotel-admin/rooms"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-accent transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-accent" />
          <span>Back to Suites & Inventory</span>
        </Link>

        <PageHeader
          title="Configure Room Category"
          description="Define a luxury suite classification, base nightly tariffs, and included sovereign privileges."
          badge="Classification Master"
          actions={
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/hotel-admin/rooms')}
              >
                Cancel
              </Button>
              <Button
                variant="gold"
                icon={Sparkles}
                type="submit"
                form="add-category-form"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving Category...' : 'Save Category'}
              </Button>
            </div>
          }
        />
      </div>

      <form id="add-category-form" onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="bg-white/95 dark:bg-surface-dark/95 backdrop-blur-2xl rounded-3xl border border-accent/30 p-6 sm:p-8 shadow-xl relative">
          <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent" />

          <div className="flex items-center gap-3 pb-6 border-b border-border dark:border-white/10 mb-6">
            <div className="p-2.5 rounded-2xl bg-accent/15 border border-accent/30 text-accent">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
                Category Classification & Privileges
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-0.5">
                Set category nomenclature, base price floor, and guest privileges.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <FormField label="Category Name" required hint="Royal Penthouse, Ocean Villa, etc.">
              <Input
                required
                placeholder="e.g. Sovereign Sky Villa"
                value={catName}
                onChange={e => setCatName(e.target.value)}
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Base Rate ($ USD / Night)" required>
                <Input
                  type="number"
                  min="200"
                  value={catBasePrice}
                  onChange={e => setCatBasePrice(Number(e.target.value))}
                />
              </FormField>

              <FormField label="Standard Guest Capacity">
                <Input
                  type="number"
                  min="1"
                  max="12"
                  value={catCapacity}
                  onChange={e => setCatCapacity(Number(e.target.value))}
                />
              </FormField>
            </div>

            <FormField label="Default Bed Configuration">
              <Select
                value={catBedType}
                onChange={e => setCatBedType(e.target.value)}
              >
                <option value="Super King">Super King</option>
                <option value="King">King</option>
                <option value="Twin">Twin</option>
                <option value="Queen">Queen</option>
              </Select>
            </FormField>

            <FormField label="Included Sovereign Privileges & Perks" hint="Separated by commas">
              <Input
                placeholder="e.g. Bulgari Toiletries, Chauffeur, Dom Pérignon on Arrival"
                value={catPerks}
                onChange={e => setCatPerks(e.target.value)}
              />
            </FormField>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-border dark:border-white/10 mt-6">
            <Button
              variant="outline"
              onClick={() => navigate('/hotel-admin/rooms')}
            >
              Cancel
            </Button>
            <Button
              variant="gold"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving Category...' : 'Confirm & Save Category'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddRoomCategoryPage;

