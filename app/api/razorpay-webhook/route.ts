import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // needs service role to bypass RLS
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;

    // Verify webhook is genuinely from Razorpay
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    console.log("[webhook] event:", event.event);

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const paymentId = payment.id;
      const phone = payment.contact; // Razorpay stores phone in contact field
      const email = payment.email;

      console.log("[webhook] payment captured:", { paymentId, email, phone });

      // Find user by email
      let userId: string | null = null;

      if (email) {
        const { data: userData } = await supabase
          .from("users")
          .select("id")
          .eq("email", email)
          .single();
        userId = userData?.id ?? null;
      }

      if (!userId) {
        console.error("[webhook] user not found for email:", email);
        // Still return 200 so Razorpay doesn't retry
        return NextResponse.json({ received: true });
      }

      // Update user plan to pro
      const { error: planError } = await supabase
        .from("users")
        .update({ plan: "pro" })
        .eq("id", userId);

      if (planError) {
        console.error("[webhook] failed to update plan:", planError);
        return NextResponse.json({ error: "DB error" }, { status: 500 });
      }

      // Save subscription record
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 month from now

      await supabase.from("subscriptions").upsert({
        user_id: userId,
        plan: "pro",
        status: "active",
        payment_id: paymentId,
        started_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
      }, { onConflict: "user_id" });

      // Reset their usage count so they start fresh
      await supabase
        .from("usage")
        .update({ message_count: 0 })
        .eq("user_id", userId);

      console.log("[webhook] ✅ user upgraded to pro:", userId);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[webhook] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}