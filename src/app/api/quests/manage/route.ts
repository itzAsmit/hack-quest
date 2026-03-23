import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify organiser
    const { data: orgData } = await supabase
      .from("organisers")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!orgData) {
      return NextResponse.json({ error: "Only organisers can manage quests" }, { status: 403 });
    }

    const { action, ...data } = await request.json();

    switch (action) {
      case "create": {
        const { event_id, title, description, xp_reward, quest_type, required_value, order_index } = data;

        if (!event_id || !title || !xp_reward) {
          return NextResponse.json({ error: "event_id, title, and xp_reward are required" }, { status: 400 });
        }

        const { data: quest, error } = await supabase
          .from("quests")
          .insert({
            event_id,
            title,
            description: description || null,
            xp_reward,
            quest_type: quest_type || "manual",
            required_value: required_value || 1,
            order_index: order_index || 0,
            is_active: true,
          })
          .select("id")
          .single();

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        return NextResponse.json({ success: true, quest_id: quest.id });
      }

      case "update": {
        const { quest_id, ...updates } = data;
        if (!quest_id) return NextResponse.json({ error: "quest_id required" }, { status: 400 });

        const { error } = await supabase
          .from("quests")
          .update(updates)
          .eq("id", quest_id);

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        return NextResponse.json({ success: true });
      }

      case "delete": {
        const { quest_id } = data;
        if (!quest_id) return NextResponse.json({ error: "quest_id required" }, { status: 400 });

        const { error } = await supabase
          .from("quests")
          .delete()
          .eq("id", quest_id);

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        return NextResponse.json({ success: true });
      }

      case "complete_for_user": {
        const { quest_id, user_id } = data;
        if (!quest_id || !user_id) {
          return NextResponse.json({ error: "quest_id and user_id required" }, { status: 400 });
        }

        const { data: quest } = await supabase
          .from("quests")
          .select("required_value")
          .eq("id", quest_id)
          .single();

        if (!quest) return NextResponse.json({ error: "Quest not found" }, { status: 404 });

        await supabase.from("quest_progress").upsert({
          quest_id,
          user_id,
          current_value: quest.required_value,
          is_completed: true,
          completed_at: new Date().toISOString(),
        }, { onConflict: "quest_id,user_id" });

        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
