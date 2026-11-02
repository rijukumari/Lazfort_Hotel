import React from 'react';
import { Edit2, Trash2, Eye, Layers, Sparkles } from 'lucide-react';

export const MenuCategoryCard = ({
  category,
  onEdit,
  onDelete,
  onView,
  onToggleStatus,
}) => {
  const isActive = category.status === 'Active';

  return (
    <div className="card-luxury-3d rounded-2xl overflow-hidden group hover:border-accent/50 transition-all duration-300 flex flex-col">
      <div className="relative h-40 overflow-hidden bg-primary-950">
        <img
          src={category.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider ${
              isActive
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}
          >
            {category.status}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-accent bg-black/60 backdrop-blur-sm border border-accent/30 font-semibold">
            {category.totalItems || 0} Items
          </span>
        </div>

        <div className="absolute bottom-3 left-3 right-3">
          <h4 className="font-serif font-bold text-lg text-white leading-tight">
            {category.name}
          </h4>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <p className="text-xs text-charcoal-muted dark:text-gray-300 line-clamp-2 leading-relaxed">
          {category.description || 'Artisanal dishes and sommelier selections curated by Michelin culinary masters.'}
        </p>

        <div className="pt-2 border-t border-border/70 dark:border-white/10 flex items-center justify-between">
          <button
            onClick={() => onToggleStatus?.(category.id)}
            className={`text-[11px] font-semibold transition-colors cursor-pointer ${
              isActive ? 'text-amber-500 hover:text-amber-600' : 'text-emerald-500 hover:text-emerald-600'
            }`}
          >
            {isActive ? 'Deactivate' : 'Activate'}
          </button>

          <div className="flex items-center gap-1.5">
            {onView && (
              <button
                onClick={() => onView(category)}
                className="p-1.5 rounded-lg border border-border/80 dark:border-white/10 text-charcoal-muted hover:text-accent hover:border-accent/40 transition-colors"
                title="View Category"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(category)}
                className="p-1.5 rounded-lg border border-border/80 dark:border-white/10 text-charcoal-muted hover:text-accent hover:border-accent/40 transition-colors"
                title="Edit Category"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(category.id)}
                className="p-1.5 rounded-lg border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 transition-colors"
                title="Delete Category"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const MenuItemCard = ({
  item,
  onEdit,
  onDelete,
  onView,
  onToggleAvailability,
}) => {
  const isVeg = item.foodType === 'Vegetarian';

  return (
    <div className="card-luxury-3d rounded-2xl overflow-hidden group hover:border-accent/50 transition-all duration-300 flex flex-col">
      <div className="relative h-44 overflow-hidden bg-primary-950">
        <img
          src={item.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold flex items-center gap-1 ${
              isVeg
                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                : 'bg-rose-950/80 text-rose-400 border border-rose-500/40'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isVeg ? 'bg-emerald-400' : 'bg-rose-400'}`} />
            {item.foodType || 'Non-Veg'}
          </span>
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
              item.isAvailable
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
            }`}
          >
            {item.isAvailable ? 'Available' : 'Unavailable'}
          </span>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
          <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-semibold">
            {item.categoryName}
          </span>
          <span className="font-serif font-bold text-xl text-accent">
            ${Number(item.price).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h4 className="font-serif font-bold text-base text-primary dark:text-white leading-snug">
            {item.name}
          </h4>
          <p className="text-xs text-charcoal-muted dark:text-gray-300 line-clamp-2 mt-1 leading-relaxed">
            {item.description}
          </p>
        </div>

        {item.ingredients && (
          <div className="pt-2 text-[11px] text-charcoal-muted dark:text-gray-400 border-t border-border/70 dark:border-white/10">
            <span className="font-semibold text-primary dark:text-white">Ingredients: </span>
            <span className="italic">{item.ingredients}</span>
          </div>
        )}

        <div className="pt-2 border-t border-border/70 dark:border-white/10 flex items-center justify-between">
          <span className="font-mono text-[11px] text-charcoal-muted">
            ⏱ {item.preparationTime || '15 mins'}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onToggleAvailability?.(item.id)}
              className={`p-1.5 rounded-lg border text-xs font-semibold ${
                item.isAvailable
                  ? 'border-amber-500/30 text-amber-500 hover:bg-amber-500/10'
                  : 'border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10'
              }`}
              title={item.isAvailable ? 'Mark Out of Stock' : 'Mark Available'}
            >
              {item.isAvailable ? 'Disable' : 'Enable'}
            </button>
            {onView && (
              <button
                onClick={() => onView(item)}
                className="p-1.5 rounded-lg border border-border/80 dark:border-white/10 text-charcoal-muted hover:text-accent hover:border-accent/40 transition-colors"
                title="View Item"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(item)}
                className="p-1.5 rounded-lg border border-border/80 dark:border-white/10 text-charcoal-muted hover:text-accent hover:border-accent/40 transition-colors"
                title="Edit Item"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(item.id)}
                className="p-1.5 rounded-lg border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 transition-colors"
                title="Delete Item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuCategoryCard;

