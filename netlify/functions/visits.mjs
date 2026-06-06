import { getStore } from "@netlify/blobs";

const store = getStore({
  name: "plant-lover-visits",
  consistency: "strong",
});

const visitsKey = "total";
const jsonHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
};

function jsonResponse(status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: jsonHeaders,
  });
}

async function readVisits() {
  const entry = await store.getWithMetadata(visitsKey, { type: "json" });
  return {
    count: Number(entry?.data?.count || 0),
    etag: entry?.etag || null,
  };
}

async function incrementVisits() {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const { count, etag } = await readVisits();
    const newCount = count + 1;

    const result = await store.setJSON(visitsKey, { count: newCount }, etag
      ? { onlyIfMatch: etag }
      : { onlyIfNew: true });

    if (result.modified) {
      return newCount;
    }
  }

  throw new Error("Zähler konnte nicht aktualisiert werden.");
}

export default async function handler(request) {
  if (request.method === "GET") {
    const { count } = await readVisits();
    return jsonResponse(200, { visits: count });
  }

  if (request.method === "POST") {
    const count = await incrementVisits();
    return jsonResponse(200, { visits: count });
  }

  return jsonResponse(405, { error: "Methode nicht erlaubt." });
}
