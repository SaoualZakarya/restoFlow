import type { MenuItem, Order, Reservation, Invoice, User, DashboardStats } from "./types"

// Mock Users
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin Principal",
    email: "admin@restoflow.com",
    role: "admin",
    password: "admin123",
  },
  {
    id: "2",
    name: "Jean Serveur",
    email: "serveur@restoflow.com",
    role: "serveur",
    password: "serveur123",
  },
  {
    id: "3",
    name: "Marie Cuisinière",
    email: "cuisinier@restoflow.com",
    role: "cuisinier",
    password: "cuisinier123",
  },
]

// Mock Menu Items
export const mockMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Salade César",
    category: "entrée",
    price: 8.5,
    description: "Salade romaine, poulet grillé, parmesan, croûtons",
    available: true,
  },
  {
    id: "2",
    name: "Soupe à l'oignon",
    category: "entrée",
    price: 6.5,
    description: "Soupe gratinée au fromage",
    available: true,
  },
  {
    id: "3",
    name: "Steak Frites",
    category: "plat",
    price: 18.5,
    description: "Steak de bœuf 250g, frites maison",
    available: true,
  },
  {
    id: "4",
    name: "Saumon Grillé",
    category: "plat",
    price: 22.0,
    description: "Saumon grillé, légumes de saison",
    available: true,
  },
  {
    id: "5",
    name: "Pizza Margherita",
    category: "plat",
    price: 12.0,
    description: "Tomate, mozzarella, basilic",
    available: true,
  },
  {
    id: "6",
    name: "Tiramisu",
    category: "dessert",
    price: 6.5,
    description: "Dessert italien au café",
    available: true,
  },
  {
    id: "7",
    name: "Crème Brûlée",
    category: "dessert",
    price: 7.0,
    description: "Crème vanille caramélisée",
    available: true,
  },
  {
    id: "8",
    name: "Coca-Cola",
    category: "boisson",
    price: 3.0,
    description: "33cl",
    available: true,
  },
  {
    id: "9",
    name: "Vin Rouge",
    category: "boisson",
    price: 5.0,
    description: "Verre 15cl",
    available: true,
  },
  {
    id: "10",
    name: "Eau Minérale",
    category: "boisson",
    price: 2.5,
    description: "50cl",
    available: true,
  },
]

// Mock Reservations
export const mockReservations: Reservation[] = [
  {
    id: "1",
    customerName: "Pierre Dupont",
    customerPhone: "0612345678",
    customerEmail: "pierre.dupont@email.com",
    date: new Date("2025-01-08"),
    time: "19:00",
    numberOfGuests: 4,
    tableNumber: 12,
    status: "confirmée",
    notes: "Anniversaire",
  },
  {
    id: "2",
    customerName: "Sophie Martin",
    customerPhone: "0687654321",
    date: new Date("2025-01-08"),
    time: "20:30",
    numberOfGuests: 2,
    tableNumber: 5,
    status: "confirmée",
  },
  {
    id: "3",
    customerName: "Lucas Bernard",
    customerPhone: "0698765432",
    date: new Date("2025-01-09"),
    time: "19:30",
    numberOfGuests: 6,
    status: "en attente",
  },
]

// Mock Invoices
export const mockInvoices: Invoice[] = [
  {
    id: "1",
    orderId: "1",
    amount: 60.0,
    tax: 6.0,
    total: 66.0,
    paymentMethod: "carte",
    createdAt: new Date("2025-01-07T13:00:00"),
    status: "payée",
  },
  {
    id: "2",
    orderId: "2",
    amount: 35.0,
    tax: 3.5,
    total: 38.5,
    paymentMethod: "espèces",
    createdAt: new Date("2025-01-07T13:30:00"),
    status: "en attente",
  },
]

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  todayRevenue: 1250.5,
  todayOrders: 24,
  todayReservations: 8,
  activeOrders: 5,
  averageOrderValue: 52.1,
  popularItems: [
    { name: "Steak Frites", count: 12 },
    { name: "Saumon Grillé", count: 8 },
    { name: "Pizza Margherita", count: 7 },
  ],
  revenueByDay: [
    { date: "Lun", revenue: 980 },
    { date: "Mar", revenue: 1150 },
    { date: "Mer", revenue: 1320 },
    { date: "Jeu", revenue: 1100 },
    { date: "Ven", revenue: 1450 },
    { date: "Sam", revenue: 1850 },
    { date: "Dim", revenue: 1250 },
  ],
}
