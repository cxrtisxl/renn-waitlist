import { WaitlistForm } from "./waitlist-form";

export default function Home() {
  return (
    <main
      className="relative flex flex-1 items-center justify-center bg-cover bg-center bg-no-repeat px-6 py-16"
      style={{ backgroundImage: "url(/bg.png)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-black/60"
      />
      <section className="relative z-10 flex w-full max-w-xl flex-col items-center rounded-3xl border border-white/10 bg-black/40 p-8 text-center text-white shadow-2xl ring-1 ring-white/5 backdrop-blur-2xl backdrop-saturate-150 sm:p-12">
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Renn Finance
        </h1>

        <p className="mt-5 max-w-lg text-balance text-base text-white/60 sm:text-lg">
          Join the waitlist and we will contact you as soon as Renn Finance
          will be in Beta.
        </p>

        <div className="mt-10 flex w-full justify-center">
          <WaitlistForm />
        </div>
      </section>
    </main>
  );
}
