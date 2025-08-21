import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { mockProducts } from '@/data/mockData';
import { Product } from '@/types';
import { Plus, Edit, Trash2, Search, Package } from 'lucide-react';
import { toast } from 'sonner';

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    loteNumber: '',
    name: '',
    price: 0,
    availableQuantity: 0,
    category: '',
    description: ''
  });

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.loteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setSelectedProduct(product);
      setFormData({
        loteNumber: product.loteNumber,
        name: product.name,
        price: product.price,
        availableQuantity: product.availableQuantity,
        category: product.category || '',
        description: product.description || ''
      });
      setIsEditing(true);
    } else {
      setSelectedProduct(null);
      setFormData({
        loteNumber: '',
        name: '',
        price: 0,
        availableQuantity: 0,
        category: '',
        description: ''
      });
      setIsEditing(false);
    }
    setIsDialogOpen(true);
  };

  const handleSaveProduct = () => {
    if (!formData.name || !formData.loteNumber) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    if (isEditing && selectedProduct) {
      // Update existing product
      const updatedProducts = products.map(p =>
        p.id === selectedProduct.id
          ? {
              ...selectedProduct,
              ...formData,
              entryDate: selectedProduct.entryDate
            }
          : p
      );
      setProducts(updatedProducts);
      toast.success('Producto actualizado exitosamente');
    } else {
      // Create new product
      const newProduct: Product = {
        id: Date.now().toString(),
        ...formData,
        entryDate: new Date().toISOString().split('T')[0]
      };
      setProducts([...products, newProduct]);
      toast.success('Producto creado exitosamente');
    }

    setIsDialogOpen(false);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
    toast.success('Producto eliminado exitosamente');
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: 'Sin stock', variant: 'destructive' as const };
    if (quantity < 10) return { label: 'Stock bajo', variant: 'secondary' as const };
    return { label: 'En stock', variant: 'default' as const };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Gestión de Productos</h2>
          <p className="text-muted-foreground">
            Administra el inventario de productos
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              Nuevo Producto
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {/* Search and filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Products table */}
      <Card>
        <CardHeader>
          <CardTitle>Productos ({filteredProducts.length})</CardTitle>
          <CardDescription>
            Lista completa de productos en el inventario
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Lote</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Ingreso</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.availableQuantity);
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        {product.category && (
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{product.loteNumber}</TableCell>
                    <TableCell className="font-medium">${product.price.toLocaleString()}</TableCell>
                    <TableCell>{product.availableQuantity}</TableCell>
                    <TableCell>
                      <Badge variant={stockStatus.variant}>
                        {stockStatus.label}
                      </Badge>
                    </TableCell>
                    <TableCell>{product.entryDate}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Product Dialog */}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Actualiza la información del producto' 
              : 'Completa los datos del nuevo producto'
            }
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nombre del producto"
            />
          </div>
          <div>
            <Label htmlFor="loteNumber">Número de Lote *</Label>
            <Input
              id="loteNumber"
              value={formData.loteNumber}
              onChange={(e) => setFormData({ ...formData, loteNumber: e.target.value })}
              placeholder="LOT001"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Precio</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="quantity">Cantidad</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.availableQuantity}
                onChange={(e) => setFormData({ ...formData, availableQuantity: Number(e.target.value) })}
                placeholder="0"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="category">Categoría</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Electrónicos, Accesorios, etc."
            />
          </div>
          <div>
            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción del producto"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSaveProduct}>
            {isEditing ? 'Actualizar' : 'Crear'} Producto
          </Button>
        </DialogFooter>
      </DialogContent>
    </div>
  );
};

export default ProductManagement;