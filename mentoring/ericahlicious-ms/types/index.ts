// This file exports all shared TypeScript types and enums for the system.

export type Role = "OWNER" | "ADMIN" | "SUPERVISOR";

export type OrderStatus = "PENDING" | "PREPARING" | "READY" | "COMPLETED" | "CANCELLED";

export type OrderType = "DINE_IN" | "TAKE_OUT";

export type StockStatus = "GOOD" | "LOW" | "OUT_OF_STOCK";

export type UserStatus = "ACTIVE" | "ARCHIVED";

export interface SessionUser {
  id: number;
  name: string;
  username: string;
  role: Role;
}

export interface User {
  id: number;
  name: string;
  username: string;
  role: Role;
  status: UserStatus;
  lastActive?: string | null;
  createdAt: string;
}

export interface MenuCategory {
  id: number;
  name: string;
}

export interface MenuIngredient {
  id: number;
  name: string;
}

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  imageUrl?: string | null;
  isArchived: boolean;
  categoryId: number;
  category: MenuCategory;
  ingredients: MenuIngredient[];
}

export interface InventoryCategory {
  id: number;
  name: string;
}

export interface InventoryItem {
  id: number;
  name: string;
  stock: string;
  supplier?: string | null;
  expiry?: string | null;
  status: StockStatus;
  categoryId: number;
  category: InventoryCategory;
  updatedBy?: { name: string } | null;
  updatedAt: string;
  reorderLevel?: number | null;
  unitCost?: number | null;
  lastPurchaseDate?: string | null;
}

export interface OrderItem {
  id: number;
  menuItemId: number;
  menuItem: { name: string; price: number };
  quantity: number;
}

export interface Order {
  id: number;
  orderCode: string;
  tableNum?: string | null;
  type: OrderType;
  status: OrderStatus;
  total: number;
  isPaid: boolean;
  createdBy?: { name: string } | null;
  items: OrderItem[];
  createdAt: string;
}

export interface Transaction {
  id: number;
  filename: string;
  generatedAt: string;
  generatedBy?: { name: string } | null;
}

export interface ReportData {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
  orders: number;
}

export interface TopMenuItem {
  name: string;
  count: number;
  revenue: number;
}

export const ROLE_LABELS: Record<Role, string> = {
  OWNER: "Owner",
  ADMIN: "Admin/Management",
  SUPERVISOR: "Supervisor",
};

export const ROLE_COLORS: Record<Role, string> = {
  OWNER: "bg-yellow-100 text-yellow-800",
  ADMIN: "bg-purple-100 text-purple-800",
  SUPERVISOR: "bg-blue-100 text-blue-800",
};

export const STOCK_STATUS_COLORS: Record<StockStatus, string> = {
  GOOD: "bg-green-100 text-green-800",
  LOW: "bg-yellow-100 text-yellow-800",
  OUT_OF_STOCK: "bg-red-100 text-red-800",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PREPARING: "bg-blue-100 text-blue-800",
  READY: "bg-green-100 text-green-800",
  COMPLETED: "bg-gray-100 text-gray-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export const ROLE_DASHBOARDS: Record<Role, string> = {
  OWNER: "/owner",
  ADMIN: "/admin",
  SUPERVISOR: "/supervisor",
};

export const MENU_CATEGORIES = [
  "Pasta",
  "Rice Meals",
  "Pica-Pica / Snacks",
  "Cakes",
  "Coffee / Iced Drinks",
  "Sweet Drinks",
] as const;

export const INVENTORY_CATEGORIES = [
  "Pasta",
  "Dairy",
  "Syrups",
  "Powders",
  "Baking",
  "Sweeteners",
  "Meat",
] as const;
