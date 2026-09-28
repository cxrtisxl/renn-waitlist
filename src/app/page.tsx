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
    </BackgroundGate>
  );
}
