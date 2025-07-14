export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export class CartService {
  private static instance: CartService;
  private cartState: CartState = {
    items: [],
    total: 0,
    itemCount: 0,
  };
  private listeners: Array<(state: CartState) => void> = [];

  private constructor() {
    this.loadFromStorage();
    this.updateTotals();
  }

  static getInstance(): CartService {
    if (!CartService.instance) {
      CartService.instance = new CartService();
    }
    return CartService.instance;
  }

  private loadFromStorage(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        this.cartState.items = JSON.parse(savedCart);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        this.cartState.items = [];
      }
    }
  }

  private saveToStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartState.items));
  }

  private updateTotals(): void {
    this.cartState.total = this.cartState.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    this.cartState.itemCount = this.cartState.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener({ ...this.cartState }));
  }

  subscribe(listener: (state: CartState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  addItem(newItem: Omit<CartItem, 'quantity'>): void {
    const existingItemIndex = this.cartState.items.findIndex(
      item => item.id === newItem.id
    );

    if (existingItemIndex >= 0) {
      this.cartState.items[existingItemIndex].quantity += 1;
    } else {
      this.cartState.items.push({ ...newItem, quantity: 1 });
    }

    this.updateTotals();
    this.saveToStorage();
    this.notifyListeners();
  }

  removeItem(id: number): void {
    this.cartState.items = this.cartState.items.filter(item => item.id !== id);
    this.updateTotals();
    this.saveToStorage();
    this.notifyListeners();
  }

  updateQuantity(id: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(id);
      return;
    }

    const itemIndex = this.cartState.items.findIndex(item => item.id === id);
    if (itemIndex >= 0) {
      this.cartState.items[itemIndex].quantity = quantity;
      this.updateTotals();
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  clearCart(): void {
    this.cartState.items = [];
    this.updateTotals();
    this.saveToStorage();
    this.notifyListeners();
  }

  getCartState(): CartState {
    return { ...this.cartState };
  }

  getItems(): CartItem[] {
    return [...this.cartState.items];
  }

  getTotal(): number {
    return this.cartState.total;
  }

  getItemCount(): number {
    return this.cartState.itemCount;
  }

  isEmpty(): boolean {
    return this.cartState.items.length === 0;
  }

  hasItem(id: number): boolean {
    return this.cartState.items.some(item => item.id === id);
  }

  getItemQuantity(id: number): number {
    const item = this.cartState.items.find(item => item.id === id);
    return item ? item.quantity : 0;
  }
}

export const cartService = CartService.getInstance();
