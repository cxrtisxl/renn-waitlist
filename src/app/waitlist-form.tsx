"use client";

import { useActionState, useEffect, useRef } from "react";
import { joinWaitlist, type JoinWaitlistState } from "./actions";

const initialState: JoinWaitlistState = { status: "idle", message: "" };

export function WaitlistForm() {
  const [state, action, pending] = useActionState(joinWaitlist, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className="w-full max-w-md">
      <form
        ref={formRef}
        action={action}
        className="flex flex-col gap-2 sm:flex-row sm:gap-0 sm:rounded-full sm:border sm:border-black/10 sm:bg-white sm:p-1 sm:shadow-sm dark:sm:border-white/15 dark:sm:bg-white/5"
      >
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          aria-label="Email address"
          disabled={pending}
          className="h-12 flex-1 rounded-full border border-black/10 bg-white px-5 text-base text-black placeholder:text-black/40 outline-none focus:border-black/30 disabled:opacity-60 sm:border-0 sm:bg-transparent sm:focus:border-0 sm:focus:ring-0 dark:border-white/15 dark:bg-transparent dark:text-white dark:placeholder:text-white/40 dark:focus:border-white/30"
        />
        <button
          type="submit"
          disabled={pending}
          className="h-12 rounded-full bg-black px-6 text-sm font-medium text-white transition-colors hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-white/90"
        >
          {pending ? "Sending…" : "Join"}
        </button>
      </form>

      <p
        role="status"
        aria-live="polite"
        className={`mt-3 min-h-5 text-sm ${
          state.status === "error"
            ? "text-red-600 dark:text-red-400"
            : "text-black/60 dark:text-white/60"
        }`}
      >
        {state.message}
      </p>
    </div>
  );
}
