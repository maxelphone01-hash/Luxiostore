export interface Order {
  id: string;
  date: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'paid' | 'cancelled';
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    country: string;
    phone: string;
  };
}

const ORDERS_STORAGE_KEY = "luxio-orders";

export const getOrdersFromStorage = (): Order[] => {
  try {
    const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveOrdersToStorage = (orders: Order[]): void => {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (error) {
    console.error("Failed to save orders to storage:", error);
  }
};

export const generateOrderId = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `LXO-${timestamp}-${random}`;
};

export const createOrder = (
  cartItems: Array<{ id: string; quantity: number }>,
  products: Record<string, any>,
  customerInfo: Order['customerInfo']
): Order => {
  const order: Order = {
    id: generateOrderId(),
    date: new Date().toISOString(),
    items: cartItems.map(item => ({
      id: item.id,
      name: products[item.id]?.name || 'Unknown Product',
      quantity: item.quantity,
      price: products[item.id]?.price || 0
    })),
    total: cartItems.reduce((sum, item) => 
      sum + (products[item.id]?.price || 0) * item.quantity, 0
    ),
    status: 'pending',
    customerInfo
  };

  const orders = getOrdersFromStorage();
  orders.unshift(order);
  saveOrdersToStorage(orders);
  
  return order;
};

export const updateOrderStatus = (orderId: string, status: Order['status']): void => {
  const orders = getOrdersFromStorage();
  const orderIndex = orders.findIndex(order => order.id === orderId);
  
  if (orderIndex !== -1) {
    orders[orderIndex].status = status;
    saveOrdersToStorage(orders);
  }
};

export const getUserOrders = (userEmail: string): Order[] => {
  const orders = getOrdersFromStorage();
  return orders.filter(order => order.customerInfo.email === userEmail);
};