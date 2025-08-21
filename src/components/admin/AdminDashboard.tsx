import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import { mockProducts, mockPurchases } from '@/data/mockData';

const AdminDashboard = () => {
  const totalProducts = mockProducts.length;
  const totalSales = mockPurchases.filter(p => p.status === 'completed').length;
  const totalRevenue = mockPurchases
    .filter(p => p.status === 'completed')
    .reduce((sum, purchase) => sum + purchase.total, 0);
  const lowStockProducts = mockProducts.filter(p => p.availableQuantity < 10).length;

  const stats = [
    {
      title: 'Total Productos',
      value: totalProducts,
      description: 'Productos en inventario',
      icon: Package,
      color: 'text-primary'
    },
    {
      title: 'Ventas Completadas',
      value: totalSales,
      description: 'Ventas realizadas',
      icon: ShoppingCart,
      color: 'text-success'
    },
    {
      title: 'Ingresos Totales',
      value: `$${totalRevenue.toLocaleString()}`,
      description: 'Revenue generado',
      icon: TrendingUp,
      color: 'text-accent'
    },
    {
      title: 'Stock Bajo',
      value: lowStockProducts,
      description: 'Productos con stock < 10',
      icon: Package,
      color: 'text-warning'
    }
  ];

  const recentSales = mockPurchases
    .filter(p => p.status === 'completed')
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard Administrativo</h2>
        <p className="text-muted-foreground">
          Resumen general del sistema de inventario
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
        {/* Recent Sales */}
        <Card>
          <CardHeader>
            <CardTitle>Ventas Recientes</CardTitle>
            <CardDescription>
              Últimas transacciones completadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-foreground">{sale.clientName}</p>
                    <p className="text-sm text-muted-foreground">
                      {sale.products.length} producto(s) • {sale.purchaseDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">
                      ${sale.total.toLocaleString()}
                    </p>
                    <p className="text-xs text-success">Completado</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle>Alertas de Stock</CardTitle>
            <CardDescription>
              Productos que requieren reabastecimiento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockProducts
                .filter(p => p.availableQuantity < 10)
                .map((product) => (
                  <div key={product.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium text-foreground">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Lote: {product.loteNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-warning">
                        {product.availableQuantity} restantes
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ${product.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              {mockProducts.filter(p => p.availableQuantity < 10).length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No hay productos con stock bajo
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;