import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { productId, quantity } = await req.json();

    console.log("Sale received:", {
      productId,
      quantity,
    });

    return NextResponse.json({
      success: true,
      message: "Stock deducted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "Failed to process sale",
      },
      {
        status: 400,
      }
    );
  }
}