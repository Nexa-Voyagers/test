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
  restaurantId?: string;
  createdAt: string;
  updatedAt: string;
}

// Restaurant POS specific types
export interface Restaurant {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  taxId?: string;
  logo?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  cost?: number;
  image?: string;
  preparationTime?: number;
  isAvailable: boolean;
  isVeg: boolean;
  calories?: number;
  allergens?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Table {
  id: string;
  restaurantId: string;
  number: string;
  capacity: number;
  floor?: string;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  currentOrderId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  restaurantId: string;
  tableId?: string;
  orderNumber: string;
  type: 'dine-in' | 'takeaway' | 'delivery';
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod?: string;
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
  status: 'pending' | 'preparing' | 'ready' | 'served';
}

export interface InventoryItem {
  id: string;
  restaurantId: string;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  reorderLevel: number;
  unitCost: number;
  supplierId?: string;
  lastRestocked?: string;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  id: string;
  restaurantId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: string;
  time: string;
  partySize: number;
  tableId?: string;
  status: 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Report {
  id: string;
  type: 'sales' | 'inventory' | 'staff' | 'customer';
  startDate: string;
  endDate: string;
  data: any;
  createdAt: string;
}

export interface SalesReport {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  topItems: {
    name: string;
    quantity: number;
    revenue: number;
  }[];
  salesByHour: {
    hour: number;
    sales: number;
    orders: number;
  }[];
  salesByCategory: {
    category: string;
    sales: number;
    orders: number;
  }[];
}

export interface DashboardStats {
  todaySales: number;
  todayOrders: number;
  activeTables: number;
  lowStockItems: number;
  salesGrowth: number;
  ordersGrowth: number;
}
