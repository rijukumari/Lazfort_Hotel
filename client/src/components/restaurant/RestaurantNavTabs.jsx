import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderTree,
  UtensilsCrossed,
  ChefHat,
  Grid,
  Receipt,
} from 'lucide-react';

const RESTAURANT_TABS = [
  {
    id: 'dashboard',
    label: 'Overview Dashboard',
    path: '/hotel-admin/restaurant',
    icon: LayoutDashboard,
  },
  {
    id: 'categories',
    label: 'Menu Categories',
    path: '/hotel-admin/restaurant/categories',
    icon: FolderTree,
  },
  {
    id: 'menu-items',
    label: 'Menu Catalog',
    path: '/hotel-admin/restaurant/menu-items',
    icon: UtensilsCrossed,
  },
  {
    id: 'orders',
    label: 'Food Orders',
    path: '/hotel-admin/restaurant/orders',
    icon: ChefHat,
  },
  {
    id: 'tables',
    label: 'Floor Tables',
    path: '/hotel-admin/restaurant/tables',
    icon: Grid,
  },
  {
    id: 'billing',
    label: 'Restaurant Billing',
    path: '/hotel-admin/restaurant/billing',
    icon: Receipt,
  },
];

export const RestaurantNavTabs = () => {
  return null;
};

export default RestaurantNavTabs;

