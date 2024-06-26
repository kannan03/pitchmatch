import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);

    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      return NextResponse.redirect(
        `${origin}/login?message=Could not authenticate user`
      );
    }

    const userId = data.user.id;
    const { data: onboarding, error: err } = await supabase
      .from("onboarding_details")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (err) {
      console.log(err);
    }

    console.log(
      onboarding,
      "onboardingonboardingonboardingonboardingonboardingonboardingonboardingonboardingonboarding"
    );

    if (!onboarding) {
      return NextResponse.redirect(`${origin}/getting-started`);
    }

    return NextResponse.redirect(`${origin}/dashboard`);
  }

  return NextResponse.redirect(`${origin}/login?message=Invalid code`);
}
