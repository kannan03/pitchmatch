import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "./submit-button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import GoogleLogin from "./GoogleLogin";
import GithubLoginButton from "./GithubLogin";
import Link from "next/link";
export default function Login({ searchParams }) {
  const signIn = async (formData) => {
    "use server";

    const email = formData.get("email");
    const password = formData.get("password");
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    const { data: user } = await supabase.auth.getUser();
    const { data: onboarding } = await supabase
      .from("onboarding_details")
      .select("*")
      .eq("user_id", user.id)
      .single();

    console.log(onboarding);

    if (!onboarding) {
      return redirect("/getting-started");
    }

    return redirect("/dashboard");
  };

  const signUp = async (formData) => {
    "use server";

    const origin = headers().get("origin");
    const email = formData.get("email");
    const password = formData.get("password");
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/getting-started");
  };

  return (
    <div className="grid w-full min-h-[100dvh] lg:grid-cols-2">
      <div className="hidden lg:block bg-gray-100 dark:bg-gray-800">
        <img
          alt="Login Illustration"
          className="h-full w-full object-cover"
          height="600"
          src="https://generated.vusercontent.net/placeholder.svg"
          style={{
            aspectRatio: "800/600",
            objectFit: "cover",
          }}
          width="800"
        />
      </div>
      <div className="flex items-center justify-center p-6 lg:p-10 font-sans  inset-0 bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] ">
        <div className="mx-auto w-full max-w-[400px] space-y-6 ">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-mono">Welcome back</h1>
            <p className="text-gray-500 dark:text-gray-400 font-sans">
              Enter your credentials to access your account.
            </p>
          </div>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label className="sr-only" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                className="border-slate-500 bg-white"
                name="email"
                placeholder="m@example.com"
                required
                type="email"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  className="ml-auto inline-block text-sm underline"
                  href="/reset-password"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                className="border-slate-500 bg-white"
                name="password"
                placeholder="**********"
                required
                type="password"
              />
            </div>
            <div className="flex items-center justify-center">
              <SubmitButton
                formAction={signIn}
                className="bg-gray-800 rounded-md px-16 py-2 mr-7 text-foreground mb-2 text-white"
                pendingText="Signing In..."
              >
                Sign In
              </SubmitButton>
              <SubmitButton
                formAction={signUp}
                className="border border-foreground/20 rounded-md px-16 py-2 text-foreground mb-2"
                pendingText="Signing Up..."
              >
                Sign Up
              </SubmitButton>
            </div>
          </form>
          <div className="space-y-2 text-center">
            <p className="text-gray-500 dark:text-gray-400">or Sign in with</p>
            <div className="grid grid-cols-2 gap-4">
              <GoogleLogin />
              <GithubLoginButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
