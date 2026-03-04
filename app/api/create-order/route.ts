import Razorpay from "razorpay";
import { NextResponse } from "next/server";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  const { amount, currency } = await req.json();

  const order = await razorpay.orders.create({
    amount: amount * 100, // Razorpay uses paise, so ₹749 = 74900
    currency: currency || "INR",
    receipt: `receipt_${Date.now()}`,
  });

  return NextResponse.json({ orderId: order.id });
}
