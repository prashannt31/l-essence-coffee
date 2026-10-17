'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Define the return type to satisfy TypeScript
type ActionResponse = {
  success: boolean;
  message?: string;
};

export async function processOrder(productId: string): Promise<ActionResponse> {
  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Fetch Product and Recipe requirements
      const product = await tx.product.findUnique({
        where: { id: productId },
        include: { ingredients: { include: { ingredient: true } } }
      });

      if (!product) throw new Error("Product not found");

      // 2. Check stock for every ingredient needed
      for (const req of product.ingredients) {
        if (req.ingredient.stock < req.quantity) {
          throw new Error(`Insufficient stock for: ${req.ingredient.name}`);
        }
      }

      // 3. Deduct stock from Ingredient table
      for (const req of product.ingredients) {
        await tx.ingredient.update({
          where: { id: req.ingredientId },
          data: { stock: { decrement: req.quantity } }
        });
      }

      // 4. Record the Order
      await tx.order.create({
        data: {
          total: product.price,
          status: "DELIVERED",
          items: { create: { productId: product.id, quantity: 1 } }
        }
      });

      // 5. Refresh the UI
      revalidatePath('/admin/dashboard');
      
      // Return success with a message
      return { success: true, message: `Successfully processed ${product.name}!` };
    });
  } catch (error: any) {
    // Return failure with the error message
    return { success: false, message: error.message || "An error occurred" };
  }
}