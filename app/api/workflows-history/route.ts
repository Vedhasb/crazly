import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/* ── Save a workflow to history ── */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

    const { role, title, messages } = await req.json();

    const { data, error } = await supabase
      .from("workflows")
      .insert({
        user_id: userId,
        role,
        title: title ?? "Untitled Workflow",
        messages,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, id: data.id });
  } catch (err) {
    console.error("[workflows/route] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/* ── Get user's workflow history ── */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

    const { data, error } = await supabase
      .from("workflows")
      .select("id, role, title, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw error;

    return NextResponse.json({ workflows: data ?? [] });
  } catch (err) {
    console.error("[workflows/route] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
