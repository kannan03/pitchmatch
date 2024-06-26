import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

function withAuth(WrappedComponent) {
  return async (props) => {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return redirect("/login");
    }

    return <WrappedComponent {...props} />;
  };
}

export default withAuth;
