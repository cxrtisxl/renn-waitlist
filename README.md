# Renn waitlist

A Next.js landing page hosted on Railway. The page uses the supplied Renn logo and background, with a responsive layout based on `Page.png`.

The supplied Geist Regular (400) and Medium (500) fonts are bundled in `src/app/fonts/` with their OFL license and self-hosted through `next/font/local`. The heading, submit button, and thank-you text use Medium; other text uses Regular.

## Local development

```sh
npm ci
npm run dev
```

For a production build:

```sh
npm run lint
npm run build
npm start
```

## What Submit does

1. The browser validates the required email field and posts the form to the same website using the `joinWaitlist` Next.js Server Action (`src/app/actions.ts`). On Railway, that action runs on the Railway server.
2. The action trims and lowercases the email, validates it again (including a 254-character maximum), and calls the server-only Notion module (`src/lib/notion.ts`). It queries the configured data source for that email and creates a row if it is new.
3. The email is saved in the **Email** title property of [Renn Waitlist](https://app.notion.com/p/iansosunov/3e9c947f4336800bb8e8ea3ff61a4e08?v=3e9c947f43368020b768000ca752b051). Notion fills **Created at** automatically. An email already on the list counts as a successful submission. Simultaneous submissions of the same email within one server process share one operation; Notion has no unique constraint, so submissions to different server instances can still race.
4. After success, the input and button are replaced by **Thank you!**. During the request, the controls are disabled. If saving fails, the form stays visible with a retry message.

The application does **not** send a confirmation email or notify the team. Emails appear as rows in the Notion table. No mailing service is connected. Previous Supabase records are not automatically imported into Notion.

The Notion connection needs **Read content** and **Insert content** capabilities and access to the database. The table uses **Email** (Title) and **Created at** (Created time). Add these variables in Railway's service settings:

```dotenv
NOTION_TOKEN=YOUR_NOTION_CONNECTION_TOKEN
NOTION_DATA_SOURCE_ID=3e9c947f-4336-8095-859e-000b0e2042b1
```

For local development, put them in `.env.local` (ignored by Git). The data source ID differs from the database ID in the Notion link; the value above is the verified source inside Renn Waitlist. Supabase environment variables are no longer used.

The Notion token is read at runtime only in a module marked `server-only`, called by a `"use server"` action. Do not use a `NEXT_PUBLIC_` prefix, put the token in `next.config.ts`, or pass it through component props or action return values. The browser receives only a success/error status and public message. Notion requests use the fixed `https://api.notion.com` origin and are uncached, with a 15-second timeout per request. Logs contain only safe failure messages and HTTP status codes, not credentials, stored rows, or submitted emails. Keep `.env.local` out of the deployment image and configure production secrets through Railway's Variables instead.

Use `npm run build` as Railway's build command and `npm start` as its start command. Next.js uses Railway's `PORT` environment variable. Deployment remains manual.

## Background loading and asset caching

The supplied 1600 × 900 PNG is converted to a roughly 204 KiB WebP at maximum quality, preserving the subtle texture and gradients. `BackgroundGate` preloads the image in the document head, then keeps the logo, text, and form hidden until Next/Image's `onLoad` callback runs after image decoding. Cached images follow the same gate. If the image fails, a reload prompt appears; if JavaScript is disabled, a message explains that it is needed to join the waitlist.

The artwork is served directly from `/renn/` rather than through the runtime image optimizer. The filenames contain content hashes, and `next.config.ts` sends:

```http
Cache-Control: public, max-age=31536000, immutable
```

This permits browser and CDN caching for one year. When changing the artwork, generate a new content-hashed filename and update `src/app/brand-assets.ts`; do not replace artwork under the same URL. Other public assets retain their existing cache behavior.

## Cloudflare in front of Railway

Railway can remain the application host while Cloudflare serves cached static assets from its edge:

1. Add your custom domain to Cloudflare and activate it by using Cloudflare's nameservers at your registrar.
2. Add that custom domain to the Railway service. Copy the DNS records Railway provides into Cloudflare, including any domain-verification TXT record. Enable the orange-cloud **Proxied** setting on the website's CNAME.
3. Set Cloudflare **SSL/TLS → Overview → Full**, as required by [Railway's Cloudflare configuration guide](https://docs.railway.com/networking/domains/working-with-domains#cloudflare-configuration).
4. Cloudflare [caches WebP, SVG, CSS, and JavaScript by default](https://developers.cloudflare.com/cache/concepts/default-cache-behavior/). The response headers above make the versioned artwork cacheable. You do not need a separate R2 bucket or Worker.
5. For an explicit rule, create a Cache Rule matching paths beginning with `/renn/`, select **Eligible for cache**, set **Edge TTL** to use the origin cache-control header, and **Browser TTL** to respect the origin. These settings are documented in [Cloudflare's cache rule settings](https://developers.cloudflare.com/cache/how-to/cache-rules/settings/). Hashed `/_next/static/` files already receive long-lived cache headers from Next.js and are eligible for Cloudflare's normal static-asset caching.

Keep the HTML page, React Server Component responses, and form submissions outside any broad “Cache Everything” rule. They should retain Next.js's response handling; only the static files need edge caching here.

After deploying, inspect the background URL twice in the browser's Network panel or with `curl -I`. Check the `Cache-Control` header and Cloudflare's `CF-Cache-Status` (typically `MISS` first and `HIT` once cached; it may be evicted or routed to a different edge location). Cloudflare's Development Mode bypasses caching, so disable it when checking. Cloudflare cannot proxy the Railway-owned `*.up.railway.app` domain; use your own domain for this setup.
