"use client"

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserOrders } from "@/lib/orders";
import { Order } from "@/lib/admin";
import { OrderTracker } from "@/components/OrderTracker";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PackageOpen, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
      toast.error("Please sign in to view orders");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    async function fetchOrders() {
      if (user) {
        try {
          const data = await getUserOrders(user.uid);
          setOrders(data);
        } catch (error) {
          toast.error("Failed to load your orders");
        } finally {
          setLoadingData(false);
        }
      } else if (!authLoading) {
        // If no user and auth finished, stop loading data (will redirect anyway)
        setLoadingData(false);
      }
    }
    
    if (!authLoading) {
        fetchOrders();
    }
  }, [user, authLoading]);

  const isLoading = authLoading || loadingData;

  // Render the page structure immediately, using Skeletons for content if loading
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl min-h-[60vh]">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingBag className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          // Skeleton Loading State
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="overflow-hidden border-muted/50">
              <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <div className="flex items-center gap-4">
                     <Skeleton className="h-6 w-16" />
                     <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <Skeleton className="h-20 w-full mb-6" />
                <div className="bg-muted/20 rounded-lg p-4 space-y-3">
                   <Skeleton className="h-4 w-20 mb-3" />
                   <div className="space-y-2">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                   </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          // Actual Content
          <>
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden border-muted/50">
                <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        Order #{order.id.slice(0, 8)}
                      </CardTitle>
                      <CardDescription>
                        Placed on {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'Unknown date'}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="font-bold text-lg">${order.total.toFixed(2)}</span>
                        <Badge variant="outline" className="capitalize">{order.status}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="mb-6">
                    <OrderTracker status={order.status} />
                  </div>

                  <div className="bg-muted/20 rounded-lg p-4">
                    <h4 className="font-semibold text-sm mb-3 text-muted-foreground">Items</h4>
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-muted rounded flex items-center justify-center text-xs font-bold text-muted-foreground">
                                {item.quantity}x
                            </div>
                            <span>{item.title}</span>
                          </div>
                          <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {orders.length === 0 && (
              <div className="text-center py-20 border-2 border-dashed rounded-xl">
                <PackageOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-6">Looks like you haven't rented any anime yet.</p>
                <Button asChild>
                    <Link href="/catalog">Browse Catalog</Link>
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}