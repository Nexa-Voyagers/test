// Common types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
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

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  hotelId?: string;
  createdAt: string;
  updatedAt: string;
}

// Hotel Management specific types
export interface Hotel {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone: string;
  email: string;
  website?: string;
  starRating: number;
  totalRooms: number;
  description?: string;
  amenities?: string[];
  checkInTime: string;
  checkOutTime: string;
  status: 'active' | 'inactive' | 'maintenance';
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: string;
  hotelId: string;
  roomNumber: string;
  floor: number;
  roomType: string;
  bedType: string;
  capacity: number;
  basePrice: number;
  description?: string;
  amenities?: string[];
  size?: number;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved' | 'cleaning';
  currentBookingId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  hotelId: string;
  roomId: string;
  guestId: string;
  bookingNumber: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  numberOfNights: number;
  roomRate: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'partial' | 'paid' | 'refunded';
  bookingStatus: 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled' | 'no-show';
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  idType?: string;
  idNumber?: string;
  dateOfBirth?: string;
  nationality?: string;
  vipStatus: boolean;
  preferences?: string;
  totalBookings: number;
  createdAt: string;
  updatedAt: string;
}

export interface Housekeeping {
  id: string;
  hotelId: string;
  roomId: string;
  assignedTo?: string;
  taskType: 'cleaning' | 'maintenance' | 'inspection' | 'turndown';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  hotelId: string;
  name: string;
  category: string;
  description?: string;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  bookingId: string;
  guestId: string;
  invoiceNumber: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentStatus: 'pending' | 'paid' | 'partial' | 'refunded';
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Report {
  id: string;
  type: 'occupancy' | 'revenue' | 'guest' | 'housekeeping';
  startDate: string;
  endDate: string;
  data: any;
  createdAt: string;
}

export interface OccupancyReport {
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  occupancyRate: number;
  revenuePerAvailableRoom: number;
  averageDailyRate: number;
  occupancyByRoomType: {
    roomType: string;
    total: number;
    occupied: number;
    rate: number;
  }[];
}

export interface DashboardStats {
  totalBookings: number;
  checkInsToday: number;
  checkOutsToday: number;
  occupancyRate: number;
  totalRevenue: number;
  availableRooms: number;
  revenueGrowth: number;
  bookingsGrowth: number;
}
