import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Package, History, Star } from 'lucide-react';
import { mockProducts, mockPurchases } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

const ClientDashboard = () => {
  const { user } = useAuth();
  
  // Mock data filtered for current user
  const userPurchases = mockPurchases.filter(p => p.clientName === user?.name);
  const totalPurchases = userPurchases.length;
  const totalSpent = userPurchases.reduce((sum, purchase) => sum + purchase.total, 0);
  const availableProducts = mockProducts.filter(p => p.availableQuantity > 0).length;

  const stats = [
    {
      title: 'Productos Disponibles',
      value: availableProducts,
      description: 'Productos en catálogo',
      icon: Package,
      color: 'text-primary'
    },
    {
      title: 'Compras Realizadas',
      value: totalPurchases,
      description: 'Total de compras',
      icon: ShoppingCart,
      color: 'text-success'
    },
    {
      title: 'Total Gastado',
      value: `$${totalSpent.toLocaleString()}`,
      description: 'Dinero invertido',
      icon: History,
      color: 'text-accent'
    },
    {
      title: 'Productos Favoritos',
      value: '3',
      description: 'En tu lista de favoritos',
      icon: Star,
      color: 'text-warning'
    }
  ];

  const featuredProducts = mockProducts
    .filter(p => p.availableQuantity > 0)
    .slice(0, 4);

  const recentPurchases = userPurchases.slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          ¡Bienvenido, {user?.name}!
        </h2>
        <p className="text-muted-foreground">
          Explora nuestro catálogo y gestiona tus compras
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Featured Products */}
        <Card>
          <CardHeader>
            <CardTitle>Productos Destacados</CardTitle>
            <CardDescription>
              Los mejores productos de nuestro catálogo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {featuredProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.availableQuantity} disponibles
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">
                      ${product.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Purchases */}
        <Card>
          <CardHeader>
            <CardTitle>Compras Recientes</CardTitle>
            <CardDescription>
              Tu historial de compras más reciente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPurchases.length > 0 ? (
                recentPurchases.map((purchase) => (
                  <div key={purchase.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium text-foreground">
                        Orden #{purchase.id}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {purchase.products.length} producto(s) • {purchase.purchaseDate}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">
                        ${purchase.total.toLocaleString()}
                      </p>
                      <p className={`text-xs ${
                        purchase.status === 'completed' ? 'text-success' :
                        purchase.status === 'pending' ? 'text-warning' :
                        'text-destructive'
                      }`}>
                        {purchase.status === 'completed' ? 'Completado' :
                         purchase.status === 'pending' ? 'Pendiente' :
                         'Cancelado'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    Aún no has realizado compras
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ¡Explora nuestro catálogo para comenzar!
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientDashboard;