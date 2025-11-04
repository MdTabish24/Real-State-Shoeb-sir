// Property Types
export interface Property {
  id: number | string;
  title: string;
  location: string;
  city?: string;
  price: number | string;
  image: string;
  images?: string[];
  beds: number;
  baths: number;
  area: number | string;
  type: 'apartment' | 'villa' | 'flat' | 'penthouse';
  description?: string;
  amenities?: string[];
  builder?: string;
  possession?: string;
  status?: 'active' | 'pending' | 'sold';
  createdAt?: Date | string;
}

// Lead Types
export interface Lead {
  id: number | string;
  name: string;
  phone: string;
  email: string;
  propertyId?: number | string;
  propertyTitle?: string;
  message?: string;
  status: 'new' | 'contacted' | 'site-visit' | 'negotiation' | 'closed' | 'lost';
  budget?: string;
  requirements?: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

// Builder Types
export interface Builder {
  id: number | string;
  name: string;
  companyName: string;
  phone: string;
  email: string;
  address?: string;
  verified: boolean;
  properties?: Property[];
  rating?: number;
  totalProjects?: number;
  createdAt?: Date | string;
}

// User Types
export interface User {
  id: number | string;
  name: string;
  email: string;
  phone: string;
  role: 'buyer' | 'builder' | 'admin';
  avatar?: string;
  createdAt?: Date | string;
}

// Enquiry Form Types
export interface EnquiryForm {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  propertyId?: number | string;
  budget?: string;
  preferredContact?: 'phone' | 'email' | 'whatsapp';
}

// Search Filters
export interface SearchFilters {
  location?: string;
  city?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
  minArea?: number;
  maxArea?: number;
}

// Dashboard Stats
export interface DashboardStats {
  totalProperties: number;
  activeLeads: number;
  dealsClosed: number;
  revenue: number;
  monthlyGrowth?: {
    properties: number;
    leads: number;
    deals: number;
    revenue: number;
  };
}

// Commission Types
export interface Commission {
  id: number | string;
  leadId: number | string;
  propertyId: number | string;
  builderId: number | string;
  amount: number;
  percentage: number;
  status: 'pending' | 'paid' | 'cancelled';
  paidAt?: Date | string;
  createdAt: Date | string;
}

// Notification Types
export interface Notification {
  id: number | string;
  userId: number | string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date | string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Pagination Types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
