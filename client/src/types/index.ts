export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: 'user' | 'staff' | 'admin';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface ProductFilter {
  category?: string;
  search?: string;
}

export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface CreateOrderData {
  items: OrderItem[];
  total: number;
  paymentMethod: 'cod' | 'bank_transfer' | 'e_wallet';
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  notes?: string;
}
