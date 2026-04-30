"use server";

import { getSupabase } from "@/lib/supabase";

export type JoinWaitlistState = {
  status: "idle" | "success" | "error";
  message: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function joinWaitlist(
  _prev: JoinWaitlistState,
  formData: FormData,
): Promise<JoinWaitlistState> {
  const raw = formData.get("email");
  const email = typeof raw === "string" ? raw.trim().toLowerCase() : "";

  if (!email || !EMAIL_RE.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  try {
    const supabase = getSupabase();
    const { error } = await supabase.from("waitlist").insert({ email });

    if (error) {
      if (error.code === "23505") {
        return {
          status: "success",
          message: "You're already on the list. We'll be in touch.",
        };
      }
      console.error("waitlist insert failed", error);
      return {
        status: "error",
        message: "Something went wrong. Please try again.",
      };
    }

    return {
      status: "success",
      message: "You're on the list. We'll be in touch.",
    };
  } catch (err) {
    console.error("waitlist insert threw", err);
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }
}
