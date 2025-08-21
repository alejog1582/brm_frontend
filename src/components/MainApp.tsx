import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AdminDashboard from '@/components/admin/AdminDashboard';
import ClientDashboard from '@/components/client/ClientDashboard';
import ProductManagement from '@/components/admin/ProductManagement';
import ProductCatalog from '@/components/client/ProductCatalog';
import ShoppingCart from '@/components/client/ShoppingCart';
import PurchaseHistory from '@/components/client/PurchaseHistory';
import SalesManagement from '@/components/admin/SalesManagement';
import LoadingOverlay from '@/components/ui/loading-overlay';
import { CartItem } from '@/types';

const MainApp = () => {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(false);

  const handleAddToCart = (newItem: CartItem) => {
    setCartItems(prev => {
      const existingItemIndex = prev.findIndex(item => item.product.id === newItem.product.id);
      
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const updatedItems = [...prev];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        return updatedItems;
      } else {
        // Add new item
        return [...prev, newItem];
      }
    });
  };

  const renderPage = () => {
    if (user?.role === 'admin') {
      switch (currentPage) {
        case 'dashboard':
          return <AdminDashboard />;
        case 'products':
          return <ProductManagement />;
        case 'sales':
          return <SalesManagement />;
        case 'users':
          return <div className="p-8 text-center">
            <h3 className="text-lg font-medium mb-2">Gestión de Usuarios</h3>
            <p className="text-muted-foreground">Funcionalidad en desarrollo</p>
          </div>;
        default:
          return <AdminDashboard />;
      }
    } else {
      switch (currentPage) {
        case 'dashboard':
          return <ClientDashboard />;
        case 'catalog':
          return <ProductCatalog onAddToCart={handleAddToCart} cartItems={cartItems} />;
        case 'cart':
          return <ShoppingCart cartItems={cartItems} setCartItems={setCartItems} />;
        case 'history':
          return <PurchaseHistory />;
        default:
          return <ClientDashboard />;
      }
    }
  };

  const handlePageChange = async (page: string) => {
    setIsPageLoading(true);
    // Simular carga de página
    await new Promise(resolve => setTimeout(resolve, 300));
    setCurrentPage(page);
    setIsPageLoading(false);
  };

  return (
    <>
      <LoadingOverlay 
        isLoading={isLoading} 
        message="Autenticando..." 
      />
      <LoadingOverlay 
        isLoading={isPageLoading} 
        message="Cargando página..." 
      />
      <DashboardLayout 
        currentPage={currentPage} 
        onPageChange={handlePageChange}
      >
        {renderPage()}
      </DashboardLayout>
    </>
  );
};

export default MainApp;