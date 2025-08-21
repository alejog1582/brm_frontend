import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { mockPurchases } from '@/data/mockData';
import { Purchase } from '@/types';
import { Search, TrendingUp, DollarSign, ShoppingCart, Calendar } from 'lucide-react';

const SalesManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredPurchases = mockPurchases.filter(purchase => {
    const matchesSearch = purchase.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || purchase.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalSales = mockPurchases.filter(p => p.status === 'completed').length;
  const totalRevenue = mockPurchases
    .filter(p => p.status === 'completed')
    .reduce((sum, purchase) => sum + purchase.total, 0);
  const pendingSales = mockPurchases.filter(p => p.status === 'pending').length;

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Gestión de Ventas</h2>
        <p className="text-muted-foreground">
          Administra y monitorea todas las ventas del sistema
        </p>
      </div>

      {/* Sales Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ventas Completadas
              </CardTitle>
              <ShoppingCart className="w-4 h-4 text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalSales}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Transacciones exitosas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ingresos Totales
              </CardTitle>
              <DollarSign className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ${totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Revenue generado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ventas Pendientes
              </CardTitle>
              <Calendar className="w-4 h-4 text-warning" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{pendingSales}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Por procesar
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar por cliente o ID de orden..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'completed', 'pending', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedStatus === status
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {status === 'all' ? 'Todos' : getStatusText(status)}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Ventas ({filteredPurchases.length})</CardTitle>
          <CardDescription>
            Lista completa de todas las transacciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Orden ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPurchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell className="font-medium">#{purchase.id}</TableCell>
                  <TableCell>{purchase.clientName}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{purchase.products.length} producto{purchase.products.length !== 1 ? 's' : ''}</p>
                      <div className="text-sm text-muted-foreground">
                        {purchase.products.map((item, index) => (
                          <span key={index}>
                            {item.product.name} x{item.quantity}
                            {index < purchase.products.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{purchase.purchaseDate}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(purchase.status)}>
                      {getStatusText(purchase.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    ${purchase.total.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesManagement;