import { getStore } from "@netlify/blobs";

const store = getStore({
  name: "plant-lover-likes",
  consistency: "strong",
});

const likesKey = "shops";
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

function cleanLikes(source) {
  return Object.entries(source || {}).reduce((result, [key, value]) => {
    const count = Math.max(0, Math.floor(Number(value) || 0));
    if (key && count > 0) result[key] = count;
    return result;
  }, {});
}

async function readLikes() {
  const entry = await store.getWithMetadata(likesKey, { type: "json" });

  return {
    likes: cleanLikes(entry?.data),
    etag: entry?.etag || null,
  };
}

async function incrementLike(shopKey) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const { likes, etag } = await readLikes();
    likes[shopKey] = (Number(likes[shopKey]) || 0) + 1;

    const result = await store.setJSON(likesKey, likes, etag
      ? { onlyIfMatch: etag }
      : { onlyIfNew: true });

    if (result.modified) {
      return likes;
    }
  }

  throw new Error("Likes konnten gerade nicht aktualisiert werden.");
}

export default async function handler(request) {
  if (request.method === "GET") {
    const { likes } = await readLikes();
    return jsonResponse(200, { likes });
  }

  if (request.method === "POST") {
    let payload;

    try {
      payload = await request.json();
    } catch (error) {
      return jsonResponse(400, { error: "JSON konnte nicht gelesen werden." });
    }

    const shopKey = String(payload?.shopKey || "").trim();

    if (!shopKey || shopKey.length > 200) {
      return jsonResponse(400, { error: "Ungueltiger Shop." });
    }

    const likes = await incrementLike(shopKey);
    return jsonResponse(200, {
      likes,
      shopKey,
      count: likes[shopKey],
    });
  }

  return jsonResponse(405, { error: "Methode nicht erlaubt." });
}
