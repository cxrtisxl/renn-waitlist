import "server-only";

const NOTION_VERSION = "2026-03-11";
const inFlight = new Map<string, Promise<void>>();

function getConfiguration() {
  const token = process.env.NOTION_TOKEN?.trim();
  const dataSourceId = process.env.NOTION_DATA_SOURCE_ID?.trim();

  if (!token || !dataSourceId) {
    throw new Error("Set NOTION_TOKEN and NOTION_DATA_SOURCE_ID on the server.");
  }

  if (!/^[a-f0-9]{32}$/i.test(dataSourceId.replaceAll("-", ""))) {
    throw new Error("NOTION_DATA_SOURCE_ID must be a Notion data source ID.");
  }

  return { token, dataSourceId };
}

async function notionRequest<T>(
  token: string,
  path: string,
  body: Record<string, unknown>,
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`https://api.notion.com/v1/${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    // Never propagate a request object, token, or email into error logs.
    throw new Error("Notion request timed out or could not connect.");
  }

  if (!response.ok) {
    throw new Error(`Notion request failed (HTTP ${response.status}).`);
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new Error("Notion returned an invalid JSON response.");
  }
}

async function insertIfNew(email: string): Promise<void> {
  const { token, dataSourceId } = getConfiguration();

  const existing = await notionRequest<{ results: unknown[] }>(
    token,
    `data_sources/${dataSourceId}/query?filter_properties=title`,
    {
      // The title property ID is stable even if its display name changes.
      filter: { property: "title", title: { equals: email } },
      page_size: 1,
    },
  );

  if (!Array.isArray(existing.results)) {
    throw new Error("Notion returned an unexpected query response.");
  }

  if (existing.results.length > 0) return;

  const page = await notionRequest<{ id: string }>(token, "pages", {
    parent: { data_source_id: dataSourceId },
    properties: {
      title: { title: [{ text: { content: email } }] },
    },
    // Notion fills Created at (created_time) automatically.
  });

  if (typeof page.id !== "string" || !page.id) {
    throw new Error("Notion did not confirm creation of the waitlist row.");
  }
}

export function saveWaitlistEmail(email: string): Promise<void> {
  const pending = inFlight.get(email);
  if (pending) return pending;

  // Coalesce simultaneous submissions of one email in this server process.
  const operation = insertIfNew(email).finally(() => inFlight.delete(email));
  inFlight.set(email, operation);
  return operation;
}
