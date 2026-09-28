"use server";

import { saveWaitlistEmail } from "@/lib/notion";

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

  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  try {
    await saveWaitlistEmail(email);

    return {
      status: "success",
      message: "Thank you!",
    };
  } catch (err) {
    console.error(
      "waitlist save failed",
      err instanceof Error ? err.message : "Unknown error",
    );
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }
}
