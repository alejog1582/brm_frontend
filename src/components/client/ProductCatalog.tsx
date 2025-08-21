import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockProducts } from '@/data/mockData';
import { Product, CartItem } from '@/types';
import { Search, ShoppingCart, Package, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';

interface ProductCatalogProps {
  onAddToCart: (item: CartItem) => void;
  cartItems: CartItem[];
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({ onAddToCart, cartItems }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const availableProducts = mockProducts.filter(p => p.availableQuantity > 0);
  
  const categories = ['all', ...Array.from(new Set(availableProducts.map(p => p.category).filter(Boolean)))];

  const filteredProducts = availableProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCartQuantity = (productId: string) => {
    const cartItem = cartItems.find(item => item.product.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleAddToCart = (product: Product) => {
    const currentQuantity = getCartQuantity(product.id);
    if (currentQuantity >= product.availableQuantity) {
      toast.error('No hay suficiente stock disponible');
      return;
    }

    onAddToCart({ product, quantity: 1 });
    toast.success(`${product.name} agregado al carrito`);
  };

  const handleUpdateQuantity = (product: Product, change: number) => {
    const currentQuantity = getCartQuantity(product.id);
    const newQuantity = currentQuantity + change;
    
    if (newQuantity <= 0) {
      // Remove from cart logic would go here
      toast.info(`${product.name} removido del carrito`);
      return;
    }
    
    if (newQuantity > product.availableQuantity) {
      toast.error('No hay suficiente stock disponible');
      return;
    }

    onAddToCart({ product, quantity: change });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Catálogo de Productos</h2>
        <p className="text-muted-foreground">
          Explora nuestros productos disponibles
        </p>
      </div>

      {/* Search and filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category === 'all' ? 'Todos' : category}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Products grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const cartQuantity = getCartQuantity(product.id);
          const canAddMore = cartQuantity < product.availableQuantity;

          return (
            <Card key={product.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        ${product.price.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {product.availableQuantity} disponibles
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Lote</p>
                      <p className="font-mono text-sm">{product.loteNumber}</p>
                    </div>
                  </div>

                  {cartQuantity > 0 ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(product, -1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="font-medium px-3">{cartQuantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(product, 1)}
                          disabled={!canAddMore}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        En carrito
                      </p>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="w-full gap-2"
                      disabled={product.availableQuantity === 0}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Agregar al Carrito
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No se encontraron productos
          </h3>
          <p className="text-muted-foreground">
            Intenta ajustar los filtros de búsqueda
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;