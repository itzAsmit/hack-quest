import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, currency = "HACKS" } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Positive amount required" }, { status: 400 });
    }

    // Get current balance
    const { data: userData } = await supabase
      .from("users")
      .select("hacks_balance")
      .eq("id", user.id)
      .single();

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (userData.hacks_balance < amount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }

    const newBalance = userData.hacks_balance - amount;

    // Update balance
    await supabase
      .from("users")
      .update({ hacks_balance: newBalance })
      .eq("id", user.id);

    // Record transaction
    await supabase.from("hacks_transactions").insert({
      user_id: user.id,
      tx_type: "withdraw",
      amount: -amount,
      currency,
      description: `Withdrew ${amount} Hacks`,
    });

    // Activity feed
    await supabase.from("activity_feed").insert({
      user_id: user.id,
      activity_type: "withdraw",
      message: `Withdrew ${amount} ⚡ from wallet`,
      metadata: { amount, currency },
      is_public: false,
    });

    return NextResponse.json({ success: true, new_balance: newBalance });
  } catch (_err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
