import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSuperAdminUsers } from '../../../context/SuperAdminUserContext';
import { useToast } from '../../../context/ToastContext';
import { FormField, Input, Select, Button, Card } from '../../../components/ui';
import { AddHotelModal } from '../../../components/hotel/AddHotelModal';
import { hotelApi } from '../../../services/hotelApi';
import {
  ArrowLeft,
  UserPlus,
  Save,
  ShieldCheck,
  Building2,
  Mail,
  Phone,
  Plus,
  Camera,
  UploadCloud,
  X,
  Image as ImageIcon,
} from 'lucide-react';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

export const AddUserPage = () => {
  const navigate = useNavigate();
  const { addUser } = useSuperAdminUsers();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('+377 98 00 12 00');
  const [formRole, setFormRole] = useState('Hotel Admin (GM)');
  const [formHotel, setFormHotel] = useState('');
  const [hotelOptions, setHotelOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddHotelModalOpen, setIsAddHotelModalOpen] = useState(false);
  const [errors, setErrors] = useState({});

  // Profile Picture States
  const [avatarPreview, setAvatarPreview] = useState(DEFAULT_AVATAR);
  const [avatarFile, setAvatarFile] = useState(null);
  const [hasCustomAvatar, setHasCustomAvatar] = useState(false);

  // Fetch real hotels and admin provisioning data from backend MySQL database
  const loadHotels = async () => {
    try {
      const [hotels, addData] = await Promise.allSettled([
        hotelApi.getHotels({ skipCache: true }),
        hotelApi.getHotelAdminAddData({ skipCache: true }),
      ]);

      const hotelList = hotels.status === 'fulfilled' && Array.isArray(hotels.value) ? hotels.value : [];
      if (hotelList.length > 0) {
        setHotelOptions(hotelList);
        if (!formHotel) {
          setFormHotel(hotelList[0]?.name || 'All Properties (Global Console)');
        }
      }
    } catch (err) {
      console.warn('Could not load hotels:', err);
    }
  };

  useEffect(() => {
    loadHotels();
  }, []);

  const handleHotelCreated = (newHotel) => {
    loadHotels();
    if (newHotel?.name) {
      setFormHotel(newHotel.name);
    }
  };

  // Image validation and selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type: JPG, JPEG, PNG, WebP
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      showToast('Invalid File Type', 'Please upload a JPG, JPEG, PNG, or WebP image.', 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate size: max 5MB
    if (file.size > 5 * 1024 * 1024) {
      showToast('File Too Large', 'Profile picture size must not exceed 5MB.', 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setAvatarFile(file);
    setHasCustomAvatar(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatarPreview(event.target?.result);
    };
    reader.readAsDataURL(file);
    showToast('Photo Attached', 'Profile image selected. It will be saved with the user profile.', 'success');
  };

  const handleRemovePhoto = () => {
    setAvatarFile(null);
    setAvatarPreview(DEFAULT_AVATAR);
    setHasCustomAvatar(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast('Photo Removed', 'Reverted to default palace security identity avatar.', 'info');
  };

  const validate = () => {
    const errs = {};
    if (!formName.trim()) errs.name = 'Full name is required';
    if (!formEmail.trim()) errs.email = 'Valid operational email is required';
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
      await addUser({
        name: formName.trim(),
        email: formEmail.trim(),
        phone: formPhone.trim(),
        role: formRole,
        hotel: formHotel,
        status: 'active',
        avatar: hasCustomAvatar ? avatarPreview : DEFAULT_AVATAR,
        avatarFile: avatarFile,
      });

      showToast(
        'User Provisioned',
        `New user "${formName}" has been created with profile image and saved to MySQL database.`,
        'success'
      );
      navigate('/super-admin/users');
    } catch {
      showToast('Error', 'Failed to provision user.', 'error');
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
              <UserPlus className="w-4 h-4" />
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
              Provision New Enterprise User
            </h1>
          </div>
          <p className="text-xs text-charcoal-muted">
            Configure system identity, assign role clearance (RBAC), and link hotel property clearance.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white/90 dark:bg-surface-dark/95 backdrop-blur-2xl rounded-3xl border border-accent/30 p-6 sm:p-8 shadow-xl space-y-6">
            
            {/* Profile Picture Upload Section */}
            <div className="p-4 sm:p-5 rounded-2xl bg-ivory dark:bg-primary-900/40 border border-accent/20 flex flex-col sm:flex-row items-center gap-5">
              <div className="relative group shrink-0">
                <img
                  src={avatarPreview}
                  alt="Profile Avatar"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-2 ring-accent/50 shadow-md"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-medium gap-1 cursor-pointer"
                  title="Upload / Change Photo"
                >
                  <Camera className="w-5 h-5 text-accent" />
                  <span>Change</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              <div className="flex-1 text-center sm:text-left space-y-2">
                <div className="space-y-0.5">
                  <h3 className="font-serif font-bold text-sm text-primary dark:text-white flex items-center justify-center sm:justify-start gap-2">
                    <span>Identity Profile Picture</span>
                    {hasCustomAvatar && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                        Custom Image Attached
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-charcoal-muted">
                    Supports JPG, JPEG, PNG, or WebP. Maximum file size: 5MB.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs px-3 py-1.5 border-accent/40 text-accent hover:bg-accent/10"
                  >
                    <UploadCloud className="w-3.5 h-3.5 mr-1.5" />
                    {hasCustomAvatar ? 'Change Photo' : 'Upload Photo'}
                  </Button>

                  {hasCustomAvatar && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleRemovePhoto}
                      className="text-xs px-2.5 py-1.5 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600"
                    >
                      <X className="w-3.5 h-3.5 mr-1" />
                      Remove Photo
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Full Name" required error={errors.name}>
                <Input
                  placeholder="e.g. Baroness Camille Beaumont"
                  value={formName}
                  onChange={e => {
                    setFormName(e.target.value);
                    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                  }}
                  required
                />
              </FormField>

              <FormField label="Work Email Address" required error={errors.email}>
                <Input
                  type="email"
                  placeholder="e.g. c.beaumont@lazfort-palace.mc"
                  value={formEmail}
                  onChange={e => {
                    setFormEmail(e.target.value);
                    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  required
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Contact Direct Phone" required>
                <Input
                  placeholder="+377 98 00 12 00"
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

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-accent" />
                  <span>Assigned Hotel Property</span>
                  <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsAddHotelModalOpen(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-accent hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Hotel</span>
                </button>
              </div>

              <div className="flex gap-2">
                <Select
                  value={formHotel}
                  onChange={e => {
                    if (e.target.value === '__ADD_NEW__') {
                      setIsAddHotelModalOpen(true);
                    } else {
                      setFormHotel(e.target.value);
                    }
                  }}
                  className="flex-1"
                >
                  <option value="__ADD_NEW__">➕ Add New Hotel...</option>
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

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddHotelModalOpen(true)}
                  className="shrink-0 text-xs px-3 py-2 border-accent/40 text-accent hover:bg-accent/10"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Hotel
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/90 dark:bg-surface-dark/95 backdrop-blur-2xl rounded-3xl border border-accent/30 p-6 shadow-xl space-y-5 sticky top-24">
            <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold block">
              Identity Card Preview
            </span>

            <div className="flex items-center gap-3">
              <img
                src={avatarPreview}
                alt="Avatar"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-accent/30 shadow"
              />
              <div className="truncate">
                <h4 className="font-serif font-bold text-base text-primary dark:text-white truncate">
                  {formName || 'New User Identity'}
                </h4>
                <p className="text-xs text-charcoal-muted truncate">{formEmail || 'user@lazfort-palace.mc'}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-ivory dark:bg-primary-900/50 border border-border/80 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Clearance Level:</span>
                <span className="font-semibold text-accent">{formRole}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Assigned Property:</span>
                <span className="font-medium text-primary dark:text-white truncate max-w-[150px]">{formHotel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Account Status:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Active Instant</span>
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
                Provision
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Add New Hotel Modal */}
      <AddHotelModal
        isOpen={isAddHotelModalOpen}
        onClose={() => setIsAddHotelModalOpen(false)}
        onHotelCreated={handleHotelCreated}
      />
    </div>
  );
};

export default AddUserPage;

