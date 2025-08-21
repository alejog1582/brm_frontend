import { Product, Purchase } from '@/types';

export const mockProducts: Product[] = [
  {
    id: '1',
    loteNumber: 'LOT001',
    name: 'Laptop Dell Inspiron 15',
    price: 25000,
    availableQuantity: 15,
    entryDate: '2024-01-15',
    category: 'Electrónicos',
    description: 'Laptop para uso profesional y personal'
  },
  {
    id: '2',
    loteNumber: 'LOT002',
    name: 'Mouse Inalámbrico Logitech',
    price: 350,
    availableQuantity: 50,
    entryDate: '2024-01-20',
    category: 'Accesorios',
    description: 'Mouse ergonómico con conectividad Bluetooth'
  },
  {
    id: '3',
    loteNumber: 'LOT003',
    name: 'Teclado Mecánico RGB',
    price: 1200,
    availableQuantity: 25,
    entryDate: '2024-01-25',
    category: 'Accesorios',
    description: 'Teclado mecánico para gaming y productividad'
  },
  {
    id: '4',
    loteNumber: 'LOT004',
    name: 'Monitor 27" 4K',
    price: 8500,
    availableQuantity: 8,
    entryDate: '2024-02-01',
    category: 'Monitores',
    description: 'Monitor profesional con resolución 4K'
  },
  {
    id: '5',
    loteNumber: 'LOT005',
    name: 'Auriculares Bluetooth Sony',
    price: 2200,
    availableQuantity: 30,
    entryDate: '2024-02-05',
    category: 'Audio',
    description: 'Auriculares con cancelación de ruido'
  }
];

export const mockPurchases: Purchase[] = [
  {
    id: '1',
    clientId: '2',
    clientName: 'Cliente Test',
    products: [
      {
        product: mockProducts[0],
        quantity: 1,
        subtotal: 25000
      },
      {
        product: mockProducts[1],
        quantity: 2,
        subtotal: 700
      }
    ],
    total: 25700,
    purchaseDate: '2024-02-10',
    status: 'completed'
  },
  {
    id: '2',
    clientId: '3',
    clientName: 'Ana García',
    products: [
      {
        product: mockProducts[2],
        quantity: 1,
        subtotal: 1200
      }
    ],
    total: 1200,
    purchaseDate: '2024-02-12',
    status: 'completed'
  },
  {
    id: '3',
    clientId: '2',
    clientName: 'Cliente Test',
    products: [
      {
        product: mockProducts[4],
        quantity: 1,
        subtotal: 2200
      }
    ],
    total: 2200,
    purchaseDate: '2024-02-15',
    status: 'pending'
  }
];