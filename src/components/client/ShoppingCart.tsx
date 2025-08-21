import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CartItem } from '@/types';
import { ShoppingCart as CartIcon, Trash2, Plus, Minus, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

interface ShoppingCartProps {
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ cartItems, setCartItems }) => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    setCartItems(
      cartItems.map(item =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(newQuantity, item.product.availableQuantity) }
          : item
      )
    );
  };

  const removeItem = (productId: string) => {
    setCartItems(cartItems.filter(item => item.product.id !== productId));
    toast.success('Producto removido del carrito');
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    
    // Simulate checkout process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, this would send the order to the backend
    toast.success('¡Compra realizada exitosamente!');
    setCartItems([]);
    setIsCheckoutOpen(false);
    setIsProcessing(false);
  };

  if (cartItems.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Carrito de Compras</h2>
          <p className="text-muted-foreground">
            Tus productos seleccionados
          </p>
        </div>

        <Card>
          <CardContent className="pt-16 pb-16">
            <div className="text-center">
              <CartIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Tu carrito está vacío
              </h3>
              <p className="text-muted-foreground mb-6">
                Agrega productos desde el catálogo para comenzar tu compra
              </p>
              <Button>
                Explorar Catálogo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Carrito de Compras</h2>
          <p className="text-muted-foreground">
            {getTotalItems()} artículo{getTotalItems() !== 1 ? 's' : ''} en tu carrito
          </p>
        </div>
        <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <CreditCard className="w-4 h-4" />
              Proceder al Pago
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Productos</CardTitle>
              <CardDescription>
                Revisa y modifica los productos en tu carrito
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Precio Unit.</TableHead>
                    <TableHead>Subtotal</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item.product.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Lote: {item.product.loteNumber}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.availableQuantity}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        ${item.product.price.toLocaleString()}
                      </TableCell>
                      <TableCell className="font-bold">
                        ${(item.product.price * item.quantity).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span>{item.product.name} x{item.quantity}</span>
                    <span>${(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">
                    ${getTotalPrice().toLocaleString()}
                  </span>
                </div>
              </div>

              <Button 
                className="w-full gap-2" 
                size="lg"
                onClick={() => setIsCheckoutOpen(true)}
              >
                <CreditCard className="w-4 h-4" />
                Proceder al Pago
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Checkout Dialog */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Compra</DialogTitle>
          <DialogDescription>
            Revisa tu pedido antes de confirmar la compra
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Resumen del Pedido</h4>
            <div className="space-y-1">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span>{item.product.name} x{item.quantity}</span>
                  <span>${(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t mt-2 pt-2 flex justify-between font-bold">
              <span>Total</span>
              <span>${getTotalPrice().toLocaleString()}</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsCheckoutOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCheckout} disabled={isProcessing}>
            {isProcessing ? 'Procesando...' : 'Confirmar Compra'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </div>
  );
};

export default ShoppingCart;