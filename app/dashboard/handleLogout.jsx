import { MenuItem } from "@chakra-ui/react";
import { createClient } from "@/utils/supabase/server";

export default function handleLogout() {
  const signOut = async (e) => {
    "use server";
    console.log("here");
    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  };
  return (
    <form action={signOut}>
      <MenuItem>Log out</MenuItem>
    </form>
  );
}
