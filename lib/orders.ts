import { db } from "./firebase";
import { collection, getDocs, query, where, orderBy, Timestamp } from "firebase/firestore";
import { Order } from "./admin"; // Re-use the interface

export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    const ordersRef = collection(db, "orders");
    // Note: If you have an index, you can add orderBy("createdAt", "desc") here.
    // For now, we'll fetch and sort in memory to avoid "Missing Index" errors during dev.
    const q = query(ordersRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });
    
    // Client-side sort
    return orders.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw new Error("Failed to fetch user orders");
  }
}
