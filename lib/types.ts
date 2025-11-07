// Database schema types for restaurant management

export interface MenuItem {
  id: string
  name: string
  category: "entrée" | "plat" | "dessert" | "boisson"
  price: number
  description: string
  available: boolean
  image?: string
}

export interface Order {
  id: string
  tableNumber: number
  items: OrderItem[]
  status: "en attente" | "en préparation" | "prêt" | "servi" | "payé"
  total: number
  createdAt: Date
  updatedAt: Date
  serverName: string
}

export interface OrderItem {
  menuItemId: string
  menuItemName: string
  quantity: number
  price: number
  notes?: string
}

export interface Reservation {
  id: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  date: Date
  time: string
  numberOfGuests: number
  tableNumber?: number
  status: "confirmée" | "en attente" | "annulée" | "terminée"
  notes?: string
}

export interface Invoice {
  id: string
  orderId: string
  amount: number
  tax: number
  total: number
  paymentMethod: "espèces" | "carte" | "chèque"
  createdAt: Date
  status: "payée" | "en attente" | "annulée"
}

export interface DashboardStats {
  todayRevenue: number
  todayOrders: number
  todayReservations: number
  activeOrders: number
  averageOrderValue: number
  popularItems: { name: string; count: number }[]
  revenueByDay: { date: string; revenue: number }[]
}

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "serveur" | "cuisinier"
  password: string
}
