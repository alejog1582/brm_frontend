export interface Product {
  id: string;
  loteNumber: string;
  name: string;
  price: number;
  availableQuantity: number;
  entryDate: string;
  category?: string;
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Purchase {
  id: string;
  clientId: string;
  clientName: string;
  products: {
    product: Product;
    quantity: number;
    subtotal: number;
  }[];
  total: number;
  purchaseDate: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'client';
  createdAt: string;
}