import { Category } from './types';

export const APP_NAME = "Qasimaha";
export const CURRENCY_SYMBOL = "﷼";
export const CURRENCY_CODE = "SAR";

// Logo URL - using the local Qasimha logo
export const LOGO_URL = "/assets/QasimhaLogo.png";

export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.FOOD]: '#ef4444', // Red
  [Category.TRANSPORT]: '#3b82f6', // Blue
  [Category.ACCOMMODATION]: '#8b5cf6', // Purple
  [Category.ACTIVITIES]: '#f59e0b', // Amber
  [Category.SHOPPING]: '#ec4899', // Pink
  [Category.OTHER]: '#6b7280', // Gray
  [Category.SUBSCRIPTION]: '#10b981', // Emerald
};

export const MOCK_CONTACTS = [
  { id: 'c1', name: 'Faisal Al-Otaibi', avatar: 'https://i.pravatar.cc/150?u=c1' },
  { id: 'c2', name: 'Nourah Al-Saud', avatar: 'https://i.pravatar.cc/150?u=c2' },
  { id: 'c3', name: 'Khalid Salem', avatar: 'https://i.pravatar.cc/150?u=c3' },
  { id: 'c4', name: 'Sarah Ahmed', avatar: 'https://i.pravatar.cc/150?u=c4' },
  { id: 'c5', name: 'Omar Aziz', avatar: 'https://i.pravatar.cc/150?u=c5' },
  { id: 'c6', name: 'Hessa Al-Jaber', avatar: 'https://i.pravatar.cc/150?u=c6' },
];

export const SERVICES = [
  { id: 's1', name: 'Netflix', icon: 'N', color: 'bg-red-600', defaultPrice: 45 },
  { id: 's2', name: 'Spotify', icon: 'S', color: 'bg-green-500', defaultPrice: 24 },
  { id: 's3', name: 'Shahid', icon: 'Sh', color: 'bg-blue-600', defaultPrice: 39 },
  { id: 's4', name: 'YouTube', icon: 'Y', color: 'bg-red-500', defaultPrice: 30 },
];
