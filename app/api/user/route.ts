import { createClient } from "@supabase/supabase-js";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/* ── Upsert user into Supabase when they sign in ── */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Save user profile
    const { error: userError } = await supabase
      .from("users")
      .upsert({
        id: userId,
        email: user.emailAddresses[0]?.emailAddress ?? "",
        first_name: user.firstName ?? "",
        last_name: user.lastName ?? "",
      }, { onConflict: "id" });

    if (userError) throw userError;

    // Create usage row if it doesn't exist
    const { data: existingUsage } = await supabase
      .from("usage")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (!existingUsage) {
      await supabase.from("usage").insert({ user_id: userId, message_count: 0 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[user/route] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/* ── Get user's usage count and plan ── */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

    // Get user plan
    const { data: userData } = await supabase
      .from("users")
      .select("plan, first_name")
      .eq("id", userId)
      .single();

    // Get usage count
    const { data: usageData } = await supabase
      .from("usage")
      .select("message_count")
      .eq("user_id", userId)
      .single();

    return NextResponse.json({
      plan: userData?.plan ?? "free",
      first_name: userData?.first_name ?? "",
      message_count: usageData?.message_count ?? 0,
    });
  } catch (err) {
    console.error("[user/route] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/* ── Increment usage count ── */
export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

    // Get current count
    const { data: usageData } = await supabase
      .from("usage")
      .select("message_count, id")
      .eq("user_id", userId)
      .single();

    const currentCount = usageData?.message_count ?? 0;
    const newCount = currentCount + 1;

    // Update count
    await supabase
      .from("usage")
      .update({ message_count: newCount, updated_at: new Date().toISOString() })
      .eq("user_id", userId);

    return NextResponse.json({ message_count: newCount });
  } catch (err) {
    console.error("[user/route] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
