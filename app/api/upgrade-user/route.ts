import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import crypto from "crypto";

// Service role client — bypasses RLS for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Called from frontend after successful Razorpay payment
// Verifies the payment signature then upgrades the user
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    // Verify payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Upgrade user to pro
    const { error: planError } = await supabase
      .from("users")
      .update({ plan: "pro" })
      .eq("id", userId);

    if (planError) throw planError;

    // Save subscription
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    await supabase.from("subscriptions").upsert({
      user_id: userId,
      plan: "pro",
      status: "active",
      payment_id: razorpay_payment_id,
      started_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
    }, { onConflict: "user_id" });

    // Reset usage count
    await supabase
      .from("usage")
      .update({ message_count: 0 })
      .eq("user_id", userId);

    console.log("[upgrade] ✅ user upgraded:", userId, razorpay_payment_id);

    return NextResponse.json({ success: true, plan: "pro" });
  } catch (err) {
    console.error("[upgrade] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}