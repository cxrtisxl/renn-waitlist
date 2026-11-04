"use client";

import { useActionState, useState } from "react";
import {
  isRennTweetUrl,
  RENN_TWEET_URL_ERROR,
  RENN_X_URL,
} from "@/lib/renn-twitter";
import { joinWaitlist, type JoinWaitlistState } from "./actions";

const initialState: JoinWaitlistState = { status: "idle", message: "" };

export function WaitlistForm() {
  const [state, action, pending] = useActionState(joinWaitlist, initialState);
  const [email, setEmail] = useState("");
  const [tweetUrl, setTweetUrl] = useState("");

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
            aria-describedby={state.field === "email" ? "waitlist-status" : undefined}
            aria-invalid={state.field === "email" || undefined}
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
            disabled={pending}
            className="waitlist-input"
          />
          <div className="waitlist-tweet-field">
            <label htmlFor="tweet-url" className="waitlist-label">
              Link to the latest tweet from{" "}
              <a href={RENN_X_URL} target="_blank" rel="noopener noreferrer">
                Ren Finance
              </a>
            </label>
            <input
              id="tweet-url"
              type="text"
              inputMode="url"
              name="tweetUrl"
              required
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="x.com/RennFinance/status/…"
              aria-describedby={
                state.field === "tweetUrl" ? "waitlist-status" : undefined
              }
              aria-invalid={state.field === "tweetUrl" || undefined}
              value={tweetUrl}
              onChange={(event) => {
                const input = event.currentTarget;
                setTweetUrl(input.value);
                input.setCustomValidity(
                  isRennTweetUrl(input.value) ? "" : RENN_TWEET_URL_ERROR,
                );
              }}
              onInvalid={(event) => {
                event.currentTarget.setCustomValidity(RENN_TWEET_URL_ERROR);
              }}
              disabled={pending}
              className="waitlist-input"
            />
          </div>
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
