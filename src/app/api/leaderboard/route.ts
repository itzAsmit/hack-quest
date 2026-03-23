import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get("sort") || "total_xp";
    const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 200);

    const validSorts = ["total_xp", "nft_count", "player_level", "cumulative_xp"];
    const sortField = validSorts.includes(sort) ? sort : "total_xp";

    const { data, error } = await supabase
      .from("users")
      .select("id, username, display_name, avatar_url, total_xp, nft_count, player_level, college_name, rank_position")
      .order(sortField, { ascending: false })
      .limit(limit);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Add computed rank (ordinal position)
    const ranked = (data || []).map((player, i) => ({
      ...player,
      rank: i + 1,
    }));

    return NextResponse.json({ players: ranked });
  } catch (_err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
