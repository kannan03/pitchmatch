"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { GoogleChromeLogo } from "@phosphor-icons/react";

function GoogleLoginButton() {
  const handleLoginWithOAuth = async () => {
    console.log("Handling Google login");
    const supabase = createClient();

    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });
  };

  return (
    <Button
      variant="outline"
      onClick={handleLoginWithOAuth}
      className="w-full font-mono"
    >
      <GoogleChromeLogo className=" h-5 w-5 mr-2" />
      Google
    </Button>
  );
}

export default GoogleLoginButton;
