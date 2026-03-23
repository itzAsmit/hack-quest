import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { event_id } = await request.json();

    if (!event_id) {
      return NextResponse.json({ error: "event_id is required" }, { status: 400 });
    }

    // Check if event exists and is joinable
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("id, status, max_participants")
      .eq("id", event_id)
      .single();

    if (eventError || !event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.status === "completed") {
      return NextResponse.json({ error: "Event has already ended" }, { status: 400 });
    }

    // Check if already joined
    const { data: existing } = await supabase
      .from("event_participants")
      .select("id")
      .eq("event_id", event_id)
      .eq("user_id", user.id)
      .single();

    if (existing) {
      return NextResponse.json({ error: "Already joined this event" }, { status: 409 });
    }

    // Check max participants
    if (event.max_participants) {
      const { count } = await supabase
        .from("event_participants")
        .select("id", { count: "exact", head: true })
        .eq("event_id", event_id);

      if (count && count >= event.max_participants) {
        return NextResponse.json({ error: "Event is full" }, { status: 400 });
      }
    }

    // Get user's team
    const { data: userData } = await supabase
      .from("users")
      .select("team_id")
      .eq("id", user.id)
      .single();

    // Join event
    const { error: joinError } = await supabase
      .from("event_participants")
      .insert({
        event_id,
        user_id: user.id,
        team_id: userData?.team_id || null,
      });

    if (joinError) {
      return NextResponse.json({ error: joinError.message }, { status: 500 });
    }

    // Log activity
    await supabase.from("activity_feed").insert({
      user_id: user.id,
      activity_type: "event_join",
      message: `Joined event`,
      metadata: { event_id },
      is_public: true,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
