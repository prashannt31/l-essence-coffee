import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.adminUser.upsert({
    where: { username: "owner" },
    update: {},
    create: {
      name: "Owner",
      email: "owner@lessence.com",
      username: "owner",
      password: "owner123",
      role: "Super Admin",
      status: "Active",
      permissions: [
        "dashboard",
        "orders",
        "menu",
        "ingredients",
        "recipes",
        "inventory",
        "analytics",
        "activity",
        "suppliers",
        "settings",
        "kitchen",
        "manage_admins",
      ],
    },
  });
}

main()
  .then(() => console.log("Owner created"))
  .finally(() => prisma.$disconnect());