"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { GithubLogo } from "@phosphor-icons/react";

function GithubLoginButton() {
  const handleLoginWithOAuth = async () => {
    console.log("Handling Google login");
    const supabase = createClient();

    supabase.auth.signInWithOAuth({
      provider: "github",
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
      <GithubLogo className=" h-5 w-5 mr-2" />
      GitHub
    </Button>
  );
}

export default GithubLoginButton;
