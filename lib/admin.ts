import { db } from "./firebase";
import { collection, getDocs, doc, updateDoc, orderBy, query, Timestamp, setDoc } from "firebase/firestore";

export interface OrderItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
}

export interface CustomerDetails {
  name: string;
  email: string;
  address: string;
  phone: string;
}

export interface Order {
  id: string;
  userId: string;
  customer: CustomerDetails;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Timestamp;
}

export interface PriceOverride {
  id: string;
  price: number;
  discountedPrice?: number;
  updatedAt: Timestamp;
}

export async function getAllOrders(): Promise<Order[]> {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });
    
    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Failed to fetch orders");
  }
}

export async function updateOrderStatus(orderId: string, newStatus: Order['status']) {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      status: newStatus
    });
    return true;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw new Error("Failed to update order status");
  }
}

export async function updateAnimePrice(animeId: string, price: number, discountedPrice?: number) {
  try {
    const priceRef = doc(db, "prices", animeId);
    await setDoc(priceRef, {
      price,
      discountedPrice: discountedPrice || null,
      updatedAt: Timestamp.now()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error updating anime price:", error);
    throw new Error("Failed to update anime price");
  }
}

export async function getPriceOverrides(): Promise<PriceOverride[]> {
  try {
    const pricesRef = collection(db, "prices");
    const snapshot = await getDocs(pricesRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PriceOverride));
  } catch (error) {
    console.error("Error fetching price overrides:", error);
    return [];
  }
}
