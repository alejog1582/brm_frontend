import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockPurchases } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { History, Package, Calendar, DollarSign } from 'lucide-react';

const PurchaseHistory = () => {
  const { user } = useAuth();
  
  // Filter purchases for current user
  const userPurchases = mockPurchases.filter(p => p.clientName === user?.name);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  if (userPurchases.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Historial de Compras</h2>
          <p className="text-muted-foreground">
            Revisa todas tus compras anteriores
          </p>
        </div>

        <Card>
          <CardContent className="pt-16 pb-16">
            <div className="text-center">
              <History className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No tienes compras registradas
              </h3>
              <p className="text-muted-foreground">
                Cuando realices tu primera compra, aparecerá aquí
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Historial de Compras</h2>
        <p className="text-muted-foreground">
          {userPurchases.length} compra{userPurchases.length !== 1 ? 's' : ''} registrada{userPurchases.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="space-y-4">
        {userPurchases.map((purchase) => (
          <Card key={purchase.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Orden #{purchase.id}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {purchase.purchaseDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      ${purchase.total.toLocaleString()}
                    </span>
                  </CardDescription>
                </div>
                <Badge variant={getStatusColor(purchase.status)}>
                  {getStatusText(purchase.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Productos comprados:</h4>
                <div className="space-y-2">
                  {purchase.products.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{item.product.name}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Lote: {item.product.loteNumber}</span>
                          <span>Cantidad: {item.quantity}</span>
                          <span>Precio unit.: ${item.product.price.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">
                          ${item.subtotal.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center pt-3 border-t border-border">
                  <span className="font-medium text-foreground">Total del pedido:</span>
                  <span className="text-xl font-bold text-primary">
                    ${purchase.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PurchaseHistory;