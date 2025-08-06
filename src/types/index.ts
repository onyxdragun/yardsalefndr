export interface GarageSale {
  id: string;
  title: string;
  address: string;
  latitude: number;
  longitude: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  description?: string;
  categories: ItemCategory[];
  contactInfo: ContactInfo;
  createdAt: string;
  updatedAt: string;
}

export interface ContactInfo {
  name: string;
  email?: string;
  phone?: string;
}

export interface ItemCategory {
  id: string;
  name: string;
  description?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface MapPin {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  category: string;
  startDate: string;
  endDate: string;
}

export interface SearchFilters {
  categories: string[];
  dateRange: {
    start: string;
    end: string;
  };
  location: {
    latitude: number;
    longitude: number;
    radius: number; // in kilometers
  };
  keywords: string;
}

export interface Route {
  id: string;
  name: string;
  garageSaleIds: string[];
  optimizedOrder: string[];
  totalDistance: number;
  estimatedTime: number;
  createdAt: string;
}

// Pre-defined item categories
export const ITEM_CATEGORIES: ItemCategory[] = [
  { id: 'electronics', name: 'Electronics', description: 'TV, computers, phones, etc.' },
  { id: 'clothing', name: 'Clothing', description: 'Shirts, pants, shoes, accessories' },
  { id: 'toys', name: 'Toys & Games', description: 'Kids toys, board games, puzzles' },
  { id: 'books', name: 'Books & Media', description: 'Books, CDs, DVDs, records' },
  { id: 'furniture', name: 'Furniture', description: 'Chairs, tables, dressers, etc.' },
  { id: 'appliances', name: 'Small Appliances', description: 'Kitchen appliances, tools' },
  { id: 'home-decor', name: 'Home & Decor', description: 'Pictures, vases, decorations' },
  { id: 'sports', name: 'Sports & Outdoors', description: 'Exercise equipment, camping gear' },
  { id: 'tools', name: 'Tools & Hardware', description: 'Hand tools, garden tools' },
  { id: 'collectibles', name: 'Collectibles & Antiques', description: 'Vintage items, collections' },
  { id: 'baby-kids', name: 'Baby & Kids', description: 'Strollers, car seats, baby clothes' },
  { id: 'miscellaneous', name: 'Miscellaneous', description: 'Everything else' }
];
