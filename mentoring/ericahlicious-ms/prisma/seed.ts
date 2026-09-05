import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // --- Menu Categories ---
  const menuCategories = [
    "Pasta",
    "Rice Meals",
    "Pica-Pica / Snacks",
    "Cakes",
    "Coffee / Iced Drinks",
    "Sweet Drinks",
  ];
  for (const name of menuCategories) {
    await prisma.menuCategory.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log("✅ Menu categories seeded");

  // --- Inventory Categories ---
  const inventoryCategories = [
    "Pasta",
    "Dairy",
    "Syrups",
    "Powders",
    "Baking",
    "Sweeteners",
    "Meat",
  ];
  for (const name of inventoryCategories) {
    await prisma.inventoryCategory.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log("✅ Inventory categories seeded");

  // --- Users ---
  const hashedPassword = await bcrypt.hash("admin123", 12);

  await prisma.user.upsert({
    where: { username: "owner" },
    update: {},
    create: {
      name: "Ericah Rivera Calayag",
      username: "owner",
      password: hashedPassword,
      role: "OWNER",
    },
  });

  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      name: "Admin User",
      username: "admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { username: "supervisor" },
    update: {},
    create: {
      name: "Samantha Santos",
      username: "supervisor",
      password: hashedPassword,
      role: "SUPERVISOR",
    },
  });

  console.log("✅ Users seeded (password: admin123)");

  // --- Sample Menu Items ---
  const pastaCategory = await prisma.menuCategory.findUnique({
    where: { name: "Pasta" },
  });
  const riceCategory = await prisma.menuCategory.findUnique({
    where: { name: "Rice Meals" },
  });
  const coffeeCategory = await prisma.menuCategory.findUnique({
    where: { name: "Coffee / Iced Drinks" },
  });

  if (pastaCategory) {
    await prisma.menuItem.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        name: "Chicken Alfredo Pasta",
        price: 280,
        categoryId: pastaCategory.id,
        ingredients: {
          create: [
            { name: "Pasta (100g)" },
            { name: "Chicken breast (150g)" },
            { name: "Garlic (10g)" },
            { name: "Milk (80ml)" },
            { name: "Butter (20g)" },
          ],
        },
      },
    });
  }

  if (riceCategory) {
    await prisma.menuItem.upsert({
      where: { id: 2 },
      update: {},
      create: {
        id: 2,
        name: "Filipino Breakfast Danggit",
        price: 320,
        categoryId: riceCategory.id,
        ingredients: {
          create: [
            { name: "Danggit (120g)" },
            { name: "Egg (1 piece)" },
            { name: "Rice (200g)" },
            { name: "Garlic (10g)" },
            { name: "Cooking oil (15ml)" },
            { name: "Butter (10g)" },
          ],
        },
      },
    });
  }

  if (coffeeCategory) {
    await prisma.menuItem.upsert({
      where: { id: 3 },
      update: {},
      create: {
        id: 3,
        name: "Spanish Latte",
        price: 185,
        categoryId: coffeeCategory.id,
        ingredients: {
          create: [
            { name: "Espresso (60ml)" },
            { name: "Condensed milk (30ml)" },
            { name: "Fresh milk (120ml)" },
            { name: "Ice" },
          ],
        },
      },
    });
  }

  console.log("✅ Sample menu items seeded");

  // --- Sample Inventory ---
  const dairyCategory = await prisma.inventoryCategory.findUnique({
    where: { name: "Dairy" },
  });
  const pastaCat = await prisma.inventoryCategory.findUnique({
    where: { name: "Pasta" },
  });

  if (dairyCategory) {
    await prisma.inventoryItem.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        name: "Fresh Milk",
        stock: "8,000 ml",
        supplier: "Dairy Fresh Inc.",
        status: "GOOD",
        categoryId: dairyCategory.id,
      },
    });
    await prisma.inventoryItem.upsert({
      where: { id: 2 },
      update: {},
      create: {
        id: 2,
        name: "Butter",
        stock: "500g",
        supplier: "Anchor Foods",
        status: "LOW",
        categoryId: dairyCategory.id,
      },
    });
  }

  if (pastaCat) {
    await prisma.inventoryItem.upsert({
      where: { id: 3 },
      update: {},
      create: {
        id: 3,
        name: "Spaghetti Noodles",
        stock: "10 kg",
        supplier: "Del Monte",
        status: "GOOD",
        categoryId: pastaCat.id,
      },
    });
  }

  console.log("✅ Sample inventory seeded");

  // --- Sample Orders ---
  const owner = await prisma.user.findUnique({ where: { username: "owner" } });
  if (owner) {
    const existingOrder = await prisma.order.findUnique({ where: { orderCode: "ORD-001" } });
    if (!existingOrder) {
      await prisma.order.create({
        data: {
          orderCode: "ORD-001",
          tableNum: "Table 3",
          type: "DINE_IN",
          status: "COMPLETED",
          total: 465,
          isPaid: true,
          createdById: owner.id,
          items: {
            create: [
              { menuItemId: 1, quantity: 1 },
              { menuItemId: 3, quantity: 1 },
            ],
          },
        },
      });
    }
  }

  console.log("✅ Sample orders seeded");

  // --- Sample Daily Expense ---
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  await prisma.dailyExpense.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      amount: 2500,
      date: today,
      note: "Ingredient restocking",
    },
  });

  console.log("✅ Sample daily expense seeded");
  console.log("\n🎉 Seeding complete!");
  console.log("   Credentials: owner/admin123 | admin/admin123 | supervisor/admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
