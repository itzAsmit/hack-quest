import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify organiser role
    const { data: orgData } = await supabase
      .from("organisers")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!orgData) {
      return NextResponse.json({ error: "Only organisers can award XP" }, { status: 403 });
    }

    const { user_id, amount, event_id, source = "event_award" } = await request.json();

    if (!user_id || !amount || amount <= 0) {
      return NextResponse.json({ error: "user_id and positive amount required" }, { status: 400 });
    }

    // Get current user XP
    const { data: targetUser, error: userError } = await supabase
      .from("users")
      .select("total_xp, cumulative_xp, player_level")
      .eq("id", user_id)
      .single();

    if (userError || !targetUser) {
      return NextResponse.json({ error: "Target user not found" }, { status: 404 });
    }

    const newTotalXp = targetUser.total_xp + amount;
    const newCumulativeXp = targetUser.cumulative_xp + amount;
    const newLevel = Math.floor(newTotalXp / 1000) + 1;

    // Update user XP
    await supabase
      .from("users")
      .update({
        total_xp: newTotalXp,
        cumulative_xp: newCumulativeXp,
        player_level: newLevel,
      })
      .eq("id", user_id);

    // Update event participant XP if event_id provided
    if (event_id) {
      const { data: participant } = await supabase
        .from("event_participants")
        .select("xp_earned")
        .eq("event_id", event_id)
        .eq("user_id", user_id)
        .single();

      if (participant) {
        await supabase
          .from("event_participants")
          .update({ xp_earned: participant.xp_earned + amount })
          .eq("event_id", event_id)
          .eq("user_id", user_id);
      }
    }

    // Log XP
    await supabase.from("xp_logs").insert({
      user_id,
      amount,
      source,
      source_id: event_id || null,
    });

    // Activity feed
    await supabase.from("activity_feed").insert({
      user_id,
      activity_type: "xp_earn",
      message: `Earned ${amount} XP from ${source.replace(/_/g, " ")}`,
      metadata: { amount, source, event_id },
      is_public: true,
    });

    // Check for level up
    if (newLevel > targetUser.player_level) {
      await supabase.from("activity_feed").insert({
        user_id,
        activity_type: "level_up",
        message: `Reached Level ${newLevel}!`,
        metadata: { new_level: newLevel },
        is_public: true,
      });
    }

    return NextResponse.json({ success: true, new_xp: newTotalXp, new_level: newLevel });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
