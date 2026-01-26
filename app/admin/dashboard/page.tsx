"use client"

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getAllOrders, updateOrderStatus, Order } from '@/lib/admin';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Loader2, Package, Truck, CheckCircle, XCircle, MoreVertical, Calendar, User, MapPin, Mail, DollarSign, Search, Tag } from 'lucide-react';
import { searchAnimeAction } from '@/app/actions/catalog';
import { updateAnimePrice } from '@/lib/admin';
import { Anime } from '@/lib/jikan';
import Image from 'next/image';

type Tab = 'orders' | 'pricing';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  // Tab State
  const [activeTab, setActiveTab] = useState<Tab>('orders');

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Pricing State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Anime[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [editingPrices, setEditingPrices] = useState<Record<string, { price: string, discountedPrice: string }>>({});

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/');
        toast.error("Unauthorized access");
      } else if (user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        router.push('/');
        toast.error("You are not authorized to view this page");
      }
    }
  }, [user, authLoading, router]);

  // -- Orders Logic --

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (user && activeTab === 'orders') {
      fetchOrders();
    }
  }, [user, activeTab]);

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const getStatusBadgeVariant = (status: string) => {
      switch(status) {
          case 'cancelled': return 'destructive';
          case 'pending': return 'secondary';
          default: return 'default';
      }
  };

  // -- Pricing Logic --

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoadingSearch(true);
    try {
      const results = await searchAnimeAction(searchQuery);
      setSearchResults(results);
      
      // Initialize editing state with current values
      const initialPrices: Record<string, { price: string, discountedPrice: string }> = {};
      results.forEach(anime => {
        // If has originalPrice, that's the base price. 'price' is the current (possibly discounted) price.
        // Logic: 
        // If originalPrice exists, Base = originalPrice, Discount = price
        // If no originalPrice, Base = price, Discount = empty
        const basePrice = anime.originalPrice ?? anime.price;
        const discountPrice = anime.originalPrice ? anime.price : undefined;
        
        initialPrices[anime.id] = {
            price: basePrice.toString(),
            discountedPrice: discountPrice ? discountPrice.toString() : ""
        };
      });
      setEditingPrices(initialPrices);
    } catch (error) {
      toast.error("Search failed");
    } finally {
      setLoadingSearch(false);
    }
  };

  const handlePriceChange = (id: string, field: 'price' | 'discountedPrice', value: string) => {
      setEditingPrices(prev => ({
          ...prev,
          [id]: {
              ...prev[id],
              [field]: value
          }
      }));
  };

  const handleSavePrice = async (anime: Anime) => {
      const form = editingPrices[anime.id];
      if (!form) return;

      const price = parseFloat(form.price);
      const discountedPrice = form.discountedPrice ? parseFloat(form.discountedPrice) : undefined;

      if (isNaN(price)) {
          toast.error("Invalid base price");
          return;
      }

      if (discountedPrice !== undefined && isNaN(discountedPrice)) {
        toast.error("Invalid discounted price");
        return;
      }

      try {
          await updateAnimePrice(anime.id, price, discountedPrice);
          toast.success(`Updated price for ${anime.title}`);
          // Update local list to reflect changes visually immediately (optional, as search results hold old data until refresh)
          // Ideally we'd update searchResults but the complex logic of mapped prices makes it simpler to just re-search or let user know.
      } catch (error) {
          toast.error("Failed to update price");
      }
  };

  if (authLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage orders and product pricing.</p>
        </div>
        <div className="flex gap-2">
            <Button 
                variant={activeTab === 'orders' ? 'default' : 'outline'} 
                onClick={() => setActiveTab('orders')}
            >
                <Package className="mr-2 h-4 w-4" /> Orders
            </Button>
            <Button 
                variant={activeTab === 'pricing' ? 'default' : 'outline'} 
                onClick={() => setActiveTab('pricing')}
            >
                <DollarSign className="mr-2 h-4 w-4" /> Pricing
            </Button>
        </div>
      </div>

      {activeTab === 'orders' && (
        <>
            <div className="flex justify-end mb-4">
                <Button variant="outline" size="sm" onClick={fetchOrders} disabled={loadingOrders}>
                    {loadingOrders ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh Orders"}
                </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {orders.map((order) => (
            <Card key={order.id} className="flex flex-col">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-sm font-medium">
                    Order #{order.id.slice(0, 8)}...
                    </CardTitle>
                    <CardDescription className="text-xs">
                    {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                    </CardDescription>
                </div>
                <Badge variant={getStatusBadgeVariant(order.status)}>
                    {order.status}
                </Badge>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                        <User className="mr-2 h-4 w-4" />
                        <span className="truncate">{order.customer?.name || "Guest"}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Mail className="mr-2 h-4 w-4" />
                        <span className="truncate">{order.customer?.email || "No email"}</span>
                    </div>
                </div>
                
                <div className="border-t pt-4">
                    <div className="text-sm font-medium mb-2">Items ({order.items?.length || 0})</div>
                    <div className="space-y-1">
                        {order.items?.slice(0, 2).map((item, idx) => (
                            <div key={idx} className="flex justify-between text-xs">
                                <span className="truncate max-w-[150px]">{item.title}</span>
                                <span>x{item.quantity}</span>
                            </div>
                        ))}
                        {(order.items?.length || 0) > 2 && (
                            <div className="text-xs text-muted-foreground">
                                + {(order.items?.length || 0) - 2} more items
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between border-t pt-4 font-semibold">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                </div>
                </CardContent>
                <CardFooter className="justify-end pt-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'pending')}>
                        <Package className="mr-2 h-4 w-4" /> Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'processing')}>
                        <Loader2 className="mr-2 h-4 w-4" /> Processing
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'shipped')}>
                        <Truck className="mr-2 h-4 w-4" /> Shipped
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'delivered')}>
                        <CheckCircle className="mr-2 h-4 w-4" /> Delivered
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'cancelled')} className="text-destructive focus:text-destructive">
                        <XCircle className="mr-2 h-4 w-4" /> Cancel Order
                    </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                </CardFooter>
            </Card>
            ))}

            {orders.length === 0 && !loadingOrders && (
                <div className="col-span-full py-12 text-center text-muted-foreground">
                    <Package className="mx-auto h-12 w-12 opacity-50 mb-4" />
                    <p className="text-lg font-medium">No orders found</p>
                    <p>Orders will appear here once customers checkout.</p>
                </div>
            )}
            </div>
        </>
      )}

      {activeTab === 'pricing' && (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Manage Prices</CardTitle>
                    <CardDescription>Search for an anime to update its rental price or apply a discount.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search anime by title..." 
                                className="pl-8" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button type="submit" disabled={loadingSearch}>
                            {loadingSearch ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {searchResults.map(anime => (
                    <Card key={anime.id} className="overflow-hidden">
                         <div className="flex flex-row p-4 gap-4">
                            <div className="relative h-24 w-16 shrink-0 rounded overflow-hidden">
                                <Image src={anime.image} alt={anime.title} fill className="object-cover" />
                            </div>
                            <div className="flex flex-col justify-between flex-1 min-w-0">
                                <h3 className="font-semibold text-sm truncate" title={anime.title}>{anime.title}</h3>
                                <div className="text-xs text-muted-foreground truncate">{anime.year} • {anime.episodes} eps</div>
                                <div className="flex gap-2 mt-2">
                                     {anime.isTrending && <Badge variant="secondary" className="text-[10px] px-1 h-5">Trending</Badge>}
                                </div>
                            </div>
                        </div>
                        <CardContent className="p-4 pt-0 space-y-3 bg-muted/20">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-muted-foreground">Standard Price ($)</label>
                                <Input 
                                    type="number" 
                                    step="0.01" 
                                    value={editingPrices[anime.id]?.price || ""} 
                                    onChange={(e) => handlePriceChange(anime.id, 'price', e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-muted-foreground flex justify-between">
                                    <span>Discount Price ($)</span>
                                    <span className="text-[10px] text-muted-foreground/70">Optional</span>
                                </label>
                                <Input 
                                    type="number" 
                                    step="0.01" 
                                    placeholder="Leave empty for no discount"
                                    value={editingPrices[anime.id]?.discountedPrice || ""} 
                                    onChange={(e) => handlePriceChange(anime.id, 'discountedPrice', e.target.value)}
                                    className="border-dashed focus:border-solid"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="p-4 bg-muted/40 flex justify-end">
                            <Button size="sm" onClick={() => handleSavePrice(anime)}>
                                Save Changes
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
                 {searchResults.length === 0 && !loadingSearch && searchQuery && (
                     <div className="col-span-full py-8 text-center text-muted-foreground">
                         No results found.
                     </div>
                 )}
            </div>
        </div>
      )}
    </div>
  );
}