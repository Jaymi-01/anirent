import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Anime } from "./jikan";

interface CartItem extends Anime {
  quantity: number;
}

interface CustomerDetails {
  name: string;
  email: string;
  address: string;
  phone: string;
}

export async function checkout(
  cart: CartItem[], 
  total: number, 
  userId?: string, 
  customer?: CustomerDetails
) {
  if (cart.length === 0) {
    throw new Error("Cart is empty");
  }

  try {
    const orderRef = await addDoc(collection(db, "orders"), {
      userId: userId || "guest",
      customer: customer || {},
      items: cart.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      })),
      total: total,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    return orderRef.id;
  } catch (error) {
    console.error("Error creating order: ", error);
    throw new Error("Failed to process checkout");
  }
}