"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { BACKGROUND_SRC, LOGO_SRC } from "./brand-assets";

export function BackgroundGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <main className="landing" aria-busy={!ready && !failed}>
      <Image
        src={BACKGROUND_SRC}
        alt=""
        fill
        preload
        unoptimized
        sizes="100vw"
        className="landing-background"
        // Next/Image calls onLoad after decoding, including cached images.
        onLoad={() => setReady(true)}
        onError={() => setFailed(true)}
      />

      <div className="landing-content" hidden={!ready}>
        {ready && (
          <header className="landing-header">
            <Image
              src={LOGO_SRC}
              alt="Renn"
              width={176}
              height={40}
              loading="eager"
              className="renn-logo"
            />
          </header>
        )}
        {children}
      </div>

      {!ready && !failed && (
        <p role="status" className="sr-only">
          Loading the page…
        </p>
      )}

      {failed && !ready && (
        <div className="load-error" role="alert">
          <p>The background couldn’t load. Please try again.</p>
          <button type="button" onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      )}

      <noscript>
        <p className="load-error">Please enable JavaScript to join the waitlist.</p>
      </noscript>
    </main>
  );
}
