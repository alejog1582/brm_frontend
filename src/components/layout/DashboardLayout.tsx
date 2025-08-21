import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  History, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  currentPage, 
  onPageChange 
}) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'products', label: 'Productos', icon: Package },
    { id: 'sales', label: 'Ventas', icon: ShoppingCart },
    { id: 'users', label: 'Usuarios', icon: Users },
  ];

  const clientMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'catalog', label: 'Catálogo', icon: Package },
    { id: 'cart', label: 'Carrito', icon: ShoppingCart },
    { id: 'history', label: 'Historial', icon: History },
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : clientMenuItems;

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile menu overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">Inventario</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "secondary" : "ghost"}
                className="w-full justify-start gap-3"
                onClick={() => {
                  onPageChange(item.id);
                  setSidebarOpen(false);
                }}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className="mb-4">
            <p className="text-sm font-medium text-foreground">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={logout}
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-semibold text-foreground capitalize">
              {menuItems.find(item => item.id === currentPage)?.label || 'Dashboard'}
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {user?.name}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;