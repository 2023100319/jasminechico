// Temporarily bypass Prisma client generation issues with Prisma 8 RC
// This is a mock implementation for development

const mockPrisma = {
  user: {
    findUnique: async () => null,
    findMany: async () => [],
    findFirst: async () => null,
    create: async () => ({}),
    update: async () => ({}),
    count: async () => 0,
    aggregate: async () => ({ _sum: {}, _count: {} }),
  },
  order: {
    findUnique: async () => null,
    findMany: async () => [],
    create: async () => ({}),
    update: async () => ({}),
    count: async () => 0,
    aggregate: async () => ({ _sum: {}, _count: {} }),
  },
  inventoryItem: {
    findUnique: async () => null,
    findMany: async () => [],
    findFirst: async () => null,
    create: async () => ({}),
    update: async () => ({}),
    groupBy: async () => [],
  },
  stockMovement: {
    findMany: async () => [],
    create: async () => ({}),
    count: async () => 0,
    groupBy: async () => [],
  },
  stockPurchase: {
    findMany: async () => [],
    create: async () => ({}),
  },
  purchaseOrder: {
    findUnique: async () => null,
    findMany: async () => [],
    create: async () => ({}),
    update: async () => ({}),
    count: async () => 0,
  },
  payment: {
    findUnique: async () => null,
    create: async () => ({}),
  },
  menuItem: {
    findUnique: async () => null,
    findMany: async () => [],
  },
  orderItem: {
    findMany: async () => [],
  },
} as any;

export const prisma = mockPrisma;

console.warn("⚠️ Using mock Prisma client - database operations will not persist");
