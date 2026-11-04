import { RENN_X_URL } from "@/lib/renn-twitter";
import { BackgroundGate } from "./background-gate";
import { WaitlistForm } from "./waitlist-form";

export default function Home() {
  return (
    <BackgroundGate>
      <section className="waitlist" aria-labelledby="waitlist-heading">
        <h1 id="waitlist-heading">Join the waitlist</h1>
        <p className="waitlist-description">
          Leave your email address, and we will contact you as soon as Renn
          Finance will be in Beta.
        </p>
        <WaitlistForm />
      </section>
      <footer className="landing-footer">
        <a
          href={RENN_X_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Renn on X (opens in a new tab)"
          title="Renn on X"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.64 7.584H.47l8.6-9.835L0 1.154h7.594l5.243 6.932 6.064-6.933Zm-1.29 19.492h2.039L6.487 3.24H4.3l13.31 17.405Z" />
          </svg>
        </a>
      </footer>
    </BackgroundGate>
  );
}
