import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSuperAdminUsers } from '../../../context/SuperAdminUserContext';
import { useToast } from '../../../context/ToastContext';
import { FormField, Input, Select, Button, Card } from '../../../components/ui';
import {
  ArrowLeft,
  UserCheck,
  Save,
  ShieldCheck,
  Building2,
  Mail,
  Phone,
} from 'lucide-react';

export const EditUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { users, updateUser } = useSuperAdminUsers();
  const { showToast } = useToast();

  const user = users.find(u => u.id === id || String(u.db_id) === String(id)) || null;

  const [formName, setFormName] = useState(user?.name || '');
  const [formPhone, setFormPhone] = useState(user?.phone || '');
  const [formRole, setFormRole] = useState(user?.role || 'Hotel Admin (GM)');
  const [formHotel, setFormHotel] = useState(user?.hotel || 'Lazfort Grand Palace Monaco');
  const [hotelOptions, setHotelOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    hotelApi.getHotels()
      .then(hotels => {
        if (isMounted && Array.isArray(hotels) && hotels.length > 0) {
          setHotelOptions(hotels);
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (user) {
      setFormName(user.name);
      setFormPhone(user.phone || '+377 98 00 12 00');
      setFormRole(user.role);
      setFormHotel(user.hotel || (Array.isArray(user.hotelAccess) ? user.hotelAccess[0] : user.hotelAccess) || 'All Properties');
    }
  }, [user]);

  if (!user) {
    return (
      <div className="space-y-6 p-6">
        <Link to="/super-admin/users" className="text-xs text-charcoal-muted hover:text-accent">
          ← Back to Users
        </Link>
        <p className="text-sm">User record not found.</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateUser(user.id, {
        name: formName,
        phone: formPhone,
        role: formRole,
        hotel: formHotel,
        hotelAccess: [formHotel],
      });

      showToast('User Updated', `${formName}'s permissions and profile modified successfully in MySQL.`, 'success');
      navigate('/super-admin/users');
    } catch {
      showToast('Error', 'Failed to update user profile in MySQL database.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-5">
        <div className="space-y-1">
          <Link
            to="/super-admin/users"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-accent transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-accent" />
            <span>Return to User Directory</span>
          </Link>
          <div className="flex items-center gap-2 pt-1">
            <span className="p-1.5 rounded-lg bg-accent/15 border border-accent/30 text-accent">
              <UserCheck className="w-4 h-4" />
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
              Edit User Account: {user.name}
            </h1>
          </div>
          <p className="text-xs text-charcoal-muted">
            User ID: <span className="font-mono font-bold text-accent">{user.id}</span> • Account Email: {user.email}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white/90 dark:bg-surface-dark/95 backdrop-blur-2xl rounded-3xl border border-accent/30 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Full Name" required>
                <Input
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Email Address">
                <Input
                  disabled
                  value={user.email}
                  className="opacity-70 cursor-not-allowed bg-ivory dark:bg-primary-950/60"
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Contact Phone">
                <Input
                  value={formPhone}
                  onChange={e => setFormPhone(e.target.value)}
                />
              </FormField>

              <FormField label="Assigned System Role (RBAC)" required>
                <Select value={formRole} onChange={e => setFormRole(e.target.value)}>
                  <option value="Super Admin">Super Admin (Universal Console)</option>
                  <option value="Hotel Admin (GM)">Hotel Admin (General Manager)</option>
                  <option value="Front Desk Manager">Front Desk Manager / Receptionist</option>
                  <option value="Chief Financial Officer">Chief Financial Officer (Finance)</option>
                  <option value="Executive Housekeeper">Executive Housekeeper</option>
                  <option value="Staff Specialist">Staff Specialist</option>
                </Select>
              </FormField>
            </div>

            <FormField label="Assigned Hotel Property" required>
              <Select value={formHotel} onChange={e => setFormHotel(e.target.value)}>
                {hotelOptions.length > 0 ? (
                  <>
                    {hotelOptions.map(h => (
                      <option key={h.id} value={h.name}>{h.name}</option>
                    ))}
                    <option value="All Properties (Global Console)">All Properties (Global Console)</option>
                  </>
                ) : (
                  <>
                    <option value="Lazfort Grand Palace Monaco">Lazfort Grand Palace Monaco</option>
                    <option value="Alpine Luxury Sanctuary St. Moritz">Alpine Luxury Sanctuary St. Moritz</option>
                    <option value="All Properties (Global Console)">All Properties (Global Console)</option>
                  </>
                )}
              </Select>
            </FormField>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/90 dark:bg-surface-dark/95 backdrop-blur-2xl rounded-3xl border border-accent/30 p-6 shadow-xl space-y-5 sticky top-24">
            <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold block">
              Updated Clearance Summary
            </span>

            <div className="flex items-center gap-3">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt="Avatar"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-accent/30"
              />
              <div className="truncate">
                <h4 className="font-serif font-bold text-base text-primary dark:text-white truncate">
                  {formName}
                </h4>
                <p className="text-xs text-charcoal-muted truncate">{user.email}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-ivory dark:bg-primary-900/50 border border-border/80 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Role Clearance:</span>
                <span className="font-semibold text-accent">{formRole}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Assigned Property:</span>
                <span className="font-medium text-primary dark:text-white truncate max-w-[150px]">{formHotel}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate('/super-admin/users')}
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
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditUserPage;

