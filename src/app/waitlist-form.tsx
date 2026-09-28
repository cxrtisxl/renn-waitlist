"use client";

import { useActionState } from "react";
import { joinWaitlist, type JoinWaitlistState } from "./actions";

const initialState: JoinWaitlistState = { status: "idle", message: "" };

export function WaitlistForm() {
  const [state, action, pending] = useActionState(joinWaitlist, initialState);

  return (
    <div className="waitlist-form-area">
      {state.status !== "success" && (
        <form action={action} className="waitlist-form" aria-busy={pending}>
          <input
            type="email"
            name="email"
            required
            maxLength={254}
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="Your Email"
            aria-label="Your Email"
            aria-describedby={state.status === "error" ? "waitlist-status" : undefined}
            aria-invalid={state.status === "error" || undefined}
            disabled={pending}
            className="waitlist-input"
          />
          <button type="submit" disabled={pending} className="submit-button">
            {pending ? "Sending…" : "Submit"}
          </button>
        </form>
      )}

      <p
        id="waitlist-status"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={
          state.status === "success"
            ? "waitlist-thanks"
            : state.status === "error"
              ? "waitlist-error"
              : "sr-only"
        }
      >
        {state.status === "success" ? "Thank you!" : state.message}
      </p>
    </div>
  );
}
