// Database entity types for Garage Sale Application

// User entity
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  emailVerified: boolean;
  profileImageUrl?: string;
  
  // Location preferences
  preferredLocation?: string;
  preferredRadiusKm: number;
  
  // Notification preferences
  emailNotifications: boolean;
  pushNotifications: boolean;
  
  // Subscription information
  subscriptionTier: 'anonymous' | 'registered' | 'premium' | 'business';
  subscriptionExpiresAt?: Date;
  monthlySalesLimit: number;
}

// User creation/update DTOs
export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  preferredLocation?: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  preferredLocation?: string;
  preferredRadiusKm?: number;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
}

// Garage Sale entity
export interface GarageSale {
  id: number;
  userId: number;
  title: string;
  description?: string;
  
  // Location
  address: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  province?: string;
  postalCode?: string;
  
  // Date and time
  startDate: Date;
  endDate: Date;
  startTime: string; // HH:MM format
  endTime: string;   // HH:MM format
  
  // Status and settings
  status: 'draft' | 'published' | 'active' | 'completed' | 'cancelled';
  isMultiFamily: boolean;
  cashOnly: boolean;
  earlyBirdsWelcome: boolean;
  
  // Contact preferences
  contactPhone?: string;
  contactEmail?: string;
  contactMethod: 'phone' | 'email' | 'both';
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  viewsCount: number;
  
  // Relations (loaded when needed)
  user?: User;
  categories?: Category[];
  items?: Item[];
  images?: Image[];
  isFavorited?: boolean; // For current user
}

// Garage Sale DTOs
export interface CreateGarageSaleDto {
  title: string;
  description?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  province?: string;
  postalCode?: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;
  startTime: string; // HH:MM
  endTime: string;
  isMultiFamily?: boolean;
  cashOnly?: boolean;
  earlyBirdsWelcome?: boolean;
  contactPhone?: string;
  contactEmail?: string;
  contactMethod?: 'phone' | 'email' | 'both';
  categoryIds: number[];
}

export interface UpdateGarageSaleDto {
  title?: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  province?: string;
  postalCode?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  status?: 'draft' | 'published' | 'active' | 'completed' | 'cancelled';
  isMultiFamily?: boolean;
  cashOnly?: boolean;
  earlyBirdsWelcome?: boolean;
  contactPhone?: string;
  contactEmail?: string;
  contactMethod?: 'phone' | 'email' | 'both';
  categoryIds?: number[];
}

// Category entity
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  sortOrder: number;
}

// Item entity
export interface Item {
  id: number;
  garageSaleId: number;
  categoryId?: number;
  name: string;
  description?: string;
  price?: number;
  isNegotiable: boolean;
  conditionRating: 'excellent' | 'good' | 'fair' | 'poor';
  isSold: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  category?: Category;
  images?: Image[];
}

// Item DTOs
export interface CreateItemDto {
  garageSaleId: number;
  categoryId?: number;
  name: string;
  description?: string;
  price?: number;
  isNegotiable?: boolean;
  conditionRating?: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface UpdateItemDto {
  name?: string;
  description?: string;
  price?: number;
  isNegotiable?: boolean;
  conditionRating?: 'excellent' | 'good' | 'fair' | 'poor';
  isSold?: boolean;
}

// Image entity
export interface Image {
  id: number;
  garageSaleId?: number;
  itemId?: number;
  imageUrl: string;
  altText?: string;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: Date;
}

// Image DTOs
export interface CreateImageDto {
  garageSaleId?: number;
  itemId?: number;
  imageUrl: string;
  altText?: string;
  isPrimary?: boolean;
  sortOrder?: number;
}

// Search and filtering
export interface SearchFilters {
  keywords?: string;
  location?: string;
  radiusKm?: number;
  categoryIds?: number[];
  startDate?: string;
  endDate?: string;
  priceMin?: number;
  priceMax?: number;
  sortBy?: 'date' | 'distance' | 'title' | 'created_at';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface SearchResult {
  garageSales: GarageSale[];
  totalCount: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

// User favorites
export interface UserFavorite {
  userId: number;
  garageSaleId: number;
  createdAt: Date;
}

// User routes
export interface UserRoute {
  id: number;
  userId: number;
  routeName: string;
  routeDate: Date;
  garageSaleIds: number[];
  estimatedDistanceKm?: number;
  estimatedDurationMinutes?: number;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  garageSales?: GarageSale[];
}

// Route DTOs
export interface CreateRouteDto {
  routeName: string;
  routeDate: string; // YYYY-MM-DD
  garageSaleIds: number[];
}

export interface UpdateRouteDto {
  routeName?: string;
  routeDate?: string;
  garageSaleIds?: number[];
}

// Search history
export interface SearchHistory {
  id: number;
  userId?: number;
  searchQuery?: string;
  searchLocation?: string;
  searchRadiusKm?: number;
  categoryFilters?: number[];
  resultsCount: number;
  createdAt: Date;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// Location-based search
export interface LocationSearchResult extends GarageSale {
  distanceKm: number;
}

// Statistics
export interface GarageSaleStats {
  totalSales: number;
  activeSales: number;
  totalViews: number;
  avgViewsPerSale: number;
  topCategories: Array<{
    category: Category;
    count: number;
  }>;
}

// User dashboard data
export interface UserDashboard {
  user: User;
  mySales: GarageSale[];
  favorites: GarageSale[];
  routes: UserRoute[];
  recentSearches: SearchHistory[];
  stats: {
    totalSales: number;
    totalViews: number;
    totalFavorites: number;
  };
}
