// Inside lib/test-db.ts
import { prisma } from './prisma.js'; 

async function main() {
  const allProducts = await prisma.product.findMany();
  console.log(allProducts);
}
main();