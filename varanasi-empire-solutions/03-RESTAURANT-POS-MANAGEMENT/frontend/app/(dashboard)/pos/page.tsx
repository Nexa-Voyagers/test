'use client';

import { useState } from 'react';
import { useGet, usePost } from '@/hooks/useApi';
import { MenuItem, OrderItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/lib/utils';
import { Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function POSPage() {
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: menuItems } = useGet<MenuItem[]>(['menu-items'], '/menu');
  const createOrder = usePost('/orders');

  const categories = ['all', ...new Set(menuItems?.map((item) => item.category) || [])];

  const filteredItems = menuItems?.filter(
    (item) => selectedCategory === 'all' || item.category === selectedCategory
  );

  const addToCart = (menuItem: MenuItem) => {
    const existingItem = cart.find((item) => item.menuItemId === menuItem.id);

    if (existingItem) {
      setCart(cart.map((item) =>
        item.menuItemId === menuItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([
        ...cart,
        {
          id: Math.random().toString(),
          menuItemId: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: 1,
          status: 'pending',
        },
      ]);
    }
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(cart.map((item) => {
      if (item.id === itemId) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter((item) => item.quantity > 0));
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter((item) => item.id !== itemId));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + tax;

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    try {
      await createOrder.mutateAsync({
        type: 'dine-in',
        items: cart,
        subtotal,
        tax,
        total,
      });
      setCart([]);
      toast.success('Order placed successfully!');
    } catch (error) {
      toast.error('Failed to place order');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Point of Sale</h1>
        <p className="text-muted-foreground">Take orders and process payments</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Tabs defaultValue="all" onValueChange={setSelectedCategory}>
            <TabsList>
              {categories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredItems?.map((item) => (
              <Card
                key={item.id}
                className="cursor-pointer hover:shadow-lg transition-all"
                onClick={() => addToCart(item)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <Badge variant={item.isVeg ? 'default' : 'secondary'}>
                    {item.isVeg ? 'Veg' : 'Non-Veg'}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-bold">{formatCurrency(item.price)}</p>
                  {!item.isAvailable && (
                    <Badge variant="destructive">Unavailable</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Current Order
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Cart is empty
                </p>
              ) : (
                <>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-2 p-2 border rounded">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(item.price)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (5%)</span>
                      <span>{formatCurrency(tax)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={createOrder.isPending}
                  >
                    {createOrder.isPending ? 'Processing...' : 'Checkout'}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
