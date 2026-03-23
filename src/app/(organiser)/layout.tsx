import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OrganiserShell } from "./OrganiserShell";

export default async function OrganiserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/organiser-login");
  }

  // Verify organiser role
  const { data: orgData } = await supabase
    .from("organisers")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!orgData) {
    redirect("/");
  }

  return <OrganiserShell>{children}</OrganiserShell>;
}
