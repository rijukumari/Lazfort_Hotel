import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatusBadge, Button, ConfirmDialog } from '../../components/ui';
import { StatCard, StatsGrid } from '../../components/ui/StatCard';
import {
  Image as ImageIcon,
  Plus,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  LayoutGrid,
  List,
  Star,
  CheckCircle,
  Upload,
  BedDouble,
  X,
  Save,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';

const initialGalleryImages = [
  {
    id: 'img-01',
    url: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
    title: 'The Imperial Monarch Penthouse Living Salon',
    roomId: 'room-101',
    roomNumber: 'PH-1201',
    category: 'Presidential Suite',
    isFeatured: true,
    resolution: '3840 x 2160 (4K UHD)',
    fileSize: '4.2 MB',
    uploadedAt: '2026-10-18',
  },
  {
    id: 'img-02',
    url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    title: 'Private Infinity Pool & Sunset Riviera Deck',
    roomId: 'room-101',
    roomNumber: 'PH-1201',
    category: 'Presidential Suite',
    isFeatured: false,
    resolution: '4096 x 2304 (DCI 4K)',
    fileSize: '5.1 MB',
    uploadedAt: '2026-10-19',
  },
  {
    id: 'img-03',
    url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
    title: 'Royal Sapphire Master Bedroom with Carrara Fireplace',
    roomId: 'room-102',
    roomNumber: 'ST-804',
    category: 'Royal Penthouse',
    isFeatured: true,
    resolution: '3840 x 2160 (4K UHD)',
    fileSize: '3.8 MB',
    uploadedAt: '2026-10-20',
  },
  {
    id: 'img-04',
    url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    title: 'Deluxe Ocean Villa Beachfront Veranda',
    roomId: 'room-103',
    roomNumber: 'VL-301',
    category: 'Deluxe Ocean Villa',
    isFeatured: true,
    resolution: '3840 x 2160 (4K UHD)',
    fileSize: '4.5 MB',
    uploadedAt: '2026-10-21',
  },
  {
    id: 'img-05',
    url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
    title: 'Executive Dignitary Suite Marble Bath & Spa',
    roomId: 'room-104',
    roomNumber: 'EX-502',
    category: 'Executive Suite',
    isFeatured: false,
    resolution: '3840 x 2160 (4K UHD)',
    fileSize: '3.6 MB',
    uploadedAt: '2026-10-22',
  },
  {
    id: 'img-06',
    url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
    title: 'Sovereign Imperial Residence Private Dining Salon',
    roomId: 'room-105',
    roomNumber: 'PR-1001',
    category: 'Sovereign Residence',
    isFeatured: true,
    resolution: '4096 x 2304 (DCI 4K)',
    fileSize: '6.0 MB',
    uploadedAt: '2026-10-23',
  },
];

export const RoomImagesPage = () => {
  const navigate = useNavigate();
  const { rooms } = useERP();
  const { showToast } = useToast();

  const [images, setImages] = useState(() => {
    try {
      const stored = localStorage.getItem('lazfort_room_images');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse room images', e);
    }
    return initialGalleryImages;
  });

  const persistImages = (list) => {
    setImages(list);
    try {
      localStorage.setItem('lazfort_room_images', JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to persist room images', e);
    }
  };

  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [roomFilter, setRoomFilter] = useState('all');
  const [deleteId, setDeleteId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Modal State for Add / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    roomId: rooms[0]?.id || 'room-101',
    isFeatured: false,
  });

  const filteredImages = useMemo(() => {
    return images.filter(img => {
      const matchesSearch =
        img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        img.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        img.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRoom = roomFilter === 'all' || img.roomId === roomFilter;

      return matchesSearch && matchesRoom;
    });
  }, [images, searchQuery, roomFilter]);

  const featuredCount = images.filter(i => i.isFeatured).length;

  const handleOpenAdd = () => {
    setEditingImage(null);
    setFormData({
      title: '',
      url: '',
      roomId: rooms[0]?.id || 'room-101',
      isFeatured: false,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (img) => {
    setEditingImage(img);
    setFormData({
      title: img.title,
      url: img.url,
      roomId: img.roomId,
      isFeatured: img.isFeatured,
    });
    setModalOpen(true);
  };

  const handleToggleFeatured = (id) => {
    const updated = images.map(img => {
      if (img.id === id) {
        return { ...img, isFeatured: !img.isFeatured };
      }
      return img;
    });
    persistImages(updated);
    showToast('Featured Status Updated', 'Updated primary showcase image for suite.', 'info');
  };

  const handleSaveImage = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.url.trim()) {
      showToast('Validation Error', 'Image title and valid media URL are required.', 'error');
      return;
    }

    const targetRoom = rooms.find(r => r.id === formData.roomId) || rooms[0];

    if (editingImage) {
      const updated = images.map(img => {
        if (img.id === editingImage.id) {
          return {
            ...img,
            title: formData.title.trim(),
            url: formData.url.trim(),
            roomId: targetRoom?.id || img.roomId,
            roomNumber: targetRoom?.roomNumber || img.roomNumber,
            category: targetRoom?.type || img.category,
            isFeatured: formData.isFeatured,
          };
        }
        return img;
      });
      persistImages(updated);
      showToast('Image Details Saved', 'Suite imagery updated.', 'success');
    } else {
      const newImg = {
        id: `img-${Date.now()}`,
        title: formData.title.trim(),
        url: formData.url.trim(),
        roomId: targetRoom?.id || 'room-101',
        roomNumber: targetRoom?.roomNumber || 'PH-1201',
        category: targetRoom?.type || 'Suite',
        isFeatured: formData.isFeatured,
        resolution: '3840 x 2160 (4K UHD)',
        fileSize: '4.0 MB',
        uploadedAt: new Date().toISOString().split('T')[0],
      };
      persistImages([newImg, ...images]);
      showToast('Image Uploaded', 'New visual asset linked to room portfolio.', 'success');
    }

    setModalOpen(false);
  };

  const handleDeleteImage = () => {
    if (!deleteId) return;
    const updated = images.filter(img => img.id !== deleteId);
    persistImages(updated);
    setDeleteId(null);
    showToast('Image Deleted', 'Visual asset permanently removed.', 'info');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      <PageHeader
        title="Room Visual Gallery & Media Assets"
        description="Curate high-resolution 4K photographic assets, assign showcase pictures to suites, and establish featured banner imagery."
        badge={`${images.length} Media Assets`}
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white/90 dark:bg-primary-900/90 border border-border/80 dark:border-accent/25 rounded-2xl p-1 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl transition-all ${
                  viewMode === 'grid'
                    ? 'gold-gradient-bg text-primary-900 font-bold shadow-sm'
                    : 'text-charcoal-muted hover:text-accent'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-xl transition-all ${
                  viewMode === 'list'
                    ? 'gold-gradient-bg text-primary-900 font-bold shadow-sm'
                    : 'text-charcoal-muted hover:text-accent'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <Button
              variant="gold"
              icon={Plus}
              onClick={handleOpenAdd}
            >
              Upload New Image
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <StatsGrid cols={4}>
        <StatCard
          title="Total Photographs"
          value={images.length}
          subtitle="4K high-res assets"
          icon={<ImageIcon className="w-5 h-5 text-accent" />}
        />
        <StatCard
          title="Featured Showcase Images"
          value={featuredCount}
          subtitle="primary room covers"
          icon={<Star className="w-5 h-5 text-amber-500 fill-amber-500" />}
        />
        <StatCard
          title="Suites with Imagery"
          value={rooms.length}
          subtitle="100% portfolio covered"
          icon={<BedDouble className="w-5 h-5 text-emerald-500" />}
        />
        <StatCard
          title="CDN Asset Delivery"
          value="Optimal"
          subtitle="fast edge caching"
          icon={<CheckCircle className="w-5 h-5 text-emerald-500" />}
        />
      </StatsGrid>

      {/* Filter and Search Bar */}
      <div className="card-luxury p-6 rounded-2xl border border-border/80 dark:border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by caption, room number, or category..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input-luxury pl-10 text-xs w-full"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-4 h-4 text-accent" />
            <select
              value={roomFilter}
              onChange={e => setRoomFilter(e.target.value)}
              className="input-luxury text-xs py-1.5 px-3 min-w-[170px]"
            >
              <option value="all">All Rooms & Suites</option>
              {rooms.map(r => (
                <option key={r.id} value={r.id}>Suite {r.roomNumber} - {r.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* View Mode: Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {filteredImages.map(img => (
              <div
                key={img.id}
                className="card-luxury-3d rounded-2xl overflow-hidden group flex flex-col justify-between border border-border/80 dark:border-white/10"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                    onClick={() => setPreviewImage(img)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-black/60 text-white backdrop-blur-md border border-white/20">
                      Suite {img.roomNumber}
                    </span>
                    {img.isFeatured && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold gold-gradient-bg text-primary-950 shadow-sm flex items-center gap-1">
                        <Star className="w-3 h-3 fill-primary-950" />
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold block">
                      {img.category}
                    </span>
                    <h4 className="font-serif font-bold text-sm leading-snug line-clamp-1">
                      {img.title}
                    </h4>
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between text-xs border-t border-border/60 dark:border-white/10 bg-ivory/40 dark:bg-black/20">
                  <span className="font-mono text-[11px] text-charcoal-muted">
                    {img.resolution}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleFeatured(img.id)}
                      className={`p-1.5 rounded-lg border text-xs transition-colors ${
                        img.isFeatured
                          ? 'border-accent bg-accent/15 text-accent'
                          : 'border-border dark:border-white/10 text-charcoal-muted hover:text-accent'
                      }`}
                      title={img.isFeatured ? 'Featured Image' : 'Set as Featured'}
                    >
                      <Star className={`w-3.5 h-3.5 ${img.isFeatured ? 'fill-accent' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(img)}
                      className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors"
                      title="Edit Details"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteId(img.id)}
                      className="p-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors"
                      title="Delete Image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* View Mode: List */
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border/80 dark:border-white/10 text-charcoal-muted font-mono uppercase text-[10px]">
                  <th className="py-3 px-4">Preview</th>
                  <th className="py-3 px-4">Image Caption</th>
                  <th className="py-3 px-4">Assigned Room</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 dark:divide-white/5">
                {filteredImages.map(img => (
                  <tr key={img.id} className="hover:bg-ivory/50 dark:hover:bg-white/[0.02]">
                    <td className="py-3 px-4">
                      <img
                        src={img.url}
                        alt={img.title}
                        className="w-14 h-10 rounded-lg object-cover ring-1 ring-border shadow-sm cursor-pointer"
                        onClick={() => setPreviewImage(img)}
                      />
                    </td>
                    <td className="py-3 px-4 font-semibold text-primary dark:text-white">
                      {img.title}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-accent">
                      Suite {img.roomNumber}
                    </td>
                    <td className="py-3 px-4 text-charcoal-muted">
                      {img.category}
                    </td>
                    <td className="py-3 px-4">
                      {img.isFeatured ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-accent">
                          <Star className="w-3 h-3 fill-accent" /> Featured
                        </span>
                      ) : (
                        <span className="text-charcoal-muted text-[11px]">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleToggleFeatured(img.id)}
                          className="p-1.5 rounded-lg border border-border dark:border-white/10 text-charcoal-muted hover:text-accent"
                          title="Toggle Featured"
                        >
                          <Star className={`w-3.5 h-3.5 ${img.isFeatured ? 'fill-accent text-accent' : ''}`} />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(img)}
                          className="p-1.5 rounded-lg border border-border dark:border-white/10 text-charcoal-muted hover:text-accent"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(img.id)}
                          className="p-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Image Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="card-luxury w-full max-w-lg p-6 sm:p-7 rounded-2xl border border-accent/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-white/10">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-accent" />
                <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                  {editingImage ? 'Edit Image Details' : 'Link & Upload Room Image'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-charcoal-muted hover:text-primary dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveImage} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-primary dark:text-white mb-1">
                  Image Title / Caption *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Bedroom Sea View Terrace"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="input-luxury text-xs w-full"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-primary dark:text-white mb-1">
                  Image URL (HTTPS link to high-res photograph) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={formData.url}
                  onChange={e => setFormData({ ...formData, url: e.target.value })}
                  className="input-luxury text-xs w-full font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-primary dark:text-white mb-1">
                  Assign to Suite *
                </label>
                <select
                  value={formData.roomId}
                  onChange={e => setFormData({ ...formData, roomId: e.target.value })}
                  className="input-luxury text-xs w-full"
                >
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>Suite {r.roomNumber} - {r.name} ({r.type})</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featuredCheckbox"
                  checked={formData.isFeatured}
                  onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded border-accent text-accent focus:ring-accent"
                />
                <label htmlFor="featuredCheckbox" className="text-xs font-semibold text-primary dark:text-white cursor-pointer">
                  Set as primary featured banner photograph for this suite
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/80 dark:border-white/10">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="gold"
                  type="submit"
                  icon={Save}
                >
                  {editingImage ? 'Save Changes' : 'Upload Asset'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Full Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <div className="max-w-4xl w-full space-y-3" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between text-white">
              <div>
                <h3 className="font-serif font-bold text-lg">{previewImage.title}</h3>
                <p className="text-xs text-accent font-mono">Suite {previewImage.roomNumber} • {previewImage.category}</p>
              </div>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={previewImage.url}
              alt={previewImage.title}
              className="w-full max-h-[75vh] object-cover rounded-2xl shadow-2xl border border-white/10"
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDeleteImage}
          title="Delete Photographic Asset?"
          message="Are you sure you wish to delete this photograph from the suite portfolio?"
          confirmText="Confirm Deletion"
          variant="danger"
        />
      )}
    </div>
  );
};

export default RoomImagesPage;

