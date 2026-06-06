const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = 4173;
const host = "127.0.0.1";
const localLikesPath = path.join(root, ".local-likes.json");

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

function sendJson(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(data));
}

function readJsonBody(req, limitBytes = 20 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
      if (Buffer.byteLength(body) > limitBytes) {
        reject(new Error("Request ist zu gross."));
        req.destroy();
      }
    });

    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch (error) {
        reject(new Error("JSON konnte nicht gelesen werden."));
      }
    });

    req.on("error", reject);
  });
}

function slugify(value) {
  return String(value || "shop-logo")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "shop-logo";
}

function cleanLikes(source) {
  return Object.entries(source || {}).reduce((result, [key, value]) => {
    const count = Math.max(0, Math.floor(Number(value) || 0));
    if (key && count > 0) result[key] = count;
    return result;
  }, {});
}

function readLocalLikes() {
  try {
    return cleanLikes(JSON.parse(fs.readFileSync(localLikesPath, "utf8")));
  } catch (error) {
    return {};
  }
}

function writeLocalLikes(likes) {
  fs.writeFileSync(localLikesPath, JSON.stringify(cleanLikes(likes), null, 2), "utf8");
}

async function saveShops(req, res) {
  const shops = await readJsonBody(req);

  if (!Array.isArray(shops)) {
    sendJson(res, 400, { ok: false, error: "Erwartet wurde eine Shop-Liste." });
    return;
  }

  fs.writeFile(path.join(root, "shops.json"), JSON.stringify(shops, null, 2), "utf8", (error) => {
    if (error) {
      sendJson(res, 500, { ok: false, error: error.message });
      return;
    }

    sendJson(res, 200, { ok: true, count: shops.length });
  });
}

async function saveLogo(req, res) {
  const payload = await readJsonBody(req);
  const match = String(payload.dataUrl || "").match(/^data:(image\/(?:png|jpeg|jpg|webp|svg\+xml));base64,(.+)$/);

  if (!match) {
    sendJson(res, 400, { ok: false, error: "Bitte ein PNG, JPG, WEBP oder SVG hochladen." });
    return;
  }

  const mime = match[1];
  const extension = mime.includes("jpeg") || mime.includes("jpg")
    ? ".jpg"
    : mime.includes("webp")
      ? ".webp"
      : mime.includes("svg")
        ? ".svg"
        : ".png";
  const fileName = `${slugify(payload.shopName || payload.fileName)}-${Date.now()}${extension}`;
  const relativePath = `assets/shop-logos/${fileName}`;
  const absolutePath = path.join(root, relativePath);

  fs.mkdir(path.dirname(absolutePath), { recursive: true }, (mkdirError) => {
    if (mkdirError) {
      sendJson(res, 500, { ok: false, error: mkdirError.message });
      return;
    }

    fs.writeFile(absolutePath, Buffer.from(match[2], "base64"), (writeError) => {
      if (writeError) {
        sendJson(res, 500, { ok: false, error: writeError.message });
        return;
      }

      sendJson(res, 200, { ok: true, path: relativePath.replace(/\\/g, "/") });
    });
  });
}

async function handleLikes(req, res) {
  if (req.method === "GET") {
    sendJson(res, 200, { likes: readLocalLikes() });
    return;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { ok: false, error: "Methode nicht erlaubt." });
    return;
  }

  const payload = await readJsonBody(req, 1024 * 1024);
  const shopKey = String(payload.shopKey || "").trim();

  if (!shopKey || shopKey.length > 200) {
    sendJson(res, 400, { ok: false, error: "Ungueltiger Shop." });
    return;
  }

  const likes = readLocalLikes();
  likes[shopKey] = (Number(likes[shopKey]) || 0) + 1;
  writeLocalLikes(likes);

  sendJson(res, 200, {
    ok: true,
    likes,
    shopKey,
    count: likes[shopKey],
  });
}

async function savePlants(req, res) {
  const data = await readJsonBody(req);
  fs.writeFile(path.join(root, "plants.json"), JSON.stringify(data, null, 2), "utf8", (error) => {
    if (error) { sendJson(res, 500, { ok: false, error: error.message }); return; }
    sendJson(res, 200, { ok: true });
  });
}

async function savePlantPhoto(req, res) {
  const payload = await readJsonBody(req);
  const match = String(payload.dataUrl || "").match(/^data:(image\/(?:png|jpeg|jpg|webp));base64,(.+)$/);
  if (!match) { sendJson(res, 400, { ok: false, error: "Bitte PNG, JPG oder WEBP hochladen." }); return; }
  const mime = match[1];
  const ext = mime.includes("jpeg") || mime.includes("jpg") ? ".jpg" : mime.includes("webp") ? ".webp" : ".png";
  const fileName = `${slugify(payload.name || "pflanze")}-${Date.now()}${ext}`;
  const relativePath = `assets/plants/${fileName}`;
  const absolutePath = path.join(root, relativePath);
  fs.mkdir(path.dirname(absolutePath), { recursive: true }, (mkdirErr) => {
    if (mkdirErr) { sendJson(res, 500, { ok: false, error: mkdirErr.message }); return; }
    fs.writeFile(absolutePath, Buffer.from(match[2], "base64"), (writeErr) => {
      if (writeErr) { sendJson(res, 500, { ok: false, error: writeErr.message }); return; }
      sendJson(res, 200, { ok: true, path: relativePath.replace(/\\/g, "/") });
    });
  });
}

const server = http.createServer(async (req, res) => {
  const routePath = decodeURIComponent((req.url || "/").split("?")[0]);

  try {
    if (req.method === "POST" && routePath === "/api/shops") {
      await saveShops(req, res);
      return;
    }

    if (req.method === "POST" && routePath === "/api/shop-logo") {
      await saveLogo(req, res);
      return;
    }

    if (routePath === "/.netlify/functions/likes") {
      await handleLikes(req, res);
      return;
    }

    if (req.method === "POST" && routePath === "/api/plants") {
      await savePlants(req, res);
      return;
    }

    if (req.method === "POST" && routePath === "/api/plant-photo") {
      await savePlantPhoto(req, res);
      return;
    }
  } catch (error) {
    sendJson(res, 500, { ok: false, error: error.message });
    return;
  }

  let requestPath = routePath;
  if (requestPath === "/") requestPath = "/index.html";

  const filePath = path.resolve(root, "." + requestPath);

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    res.writeHead(200, {
      "Content-Type": contentTypes[path.extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(data);
  });
});

server.listen(port, host, () => {
  console.log(`Vorschau laeuft: http://${host}:${port}/`);
  console.log("Wenn du Dateien aenderst: Browser aktualisieren mit Strg + F5.");
  console.log("Zum Beenden dieses Fenster schliessen oder Strg + C druecken.");
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${port} ist schon belegt. Ist die Vorschau bereits offen?`);
  } else {
    console.error(error.message);
  }
  process.exit(1);
});
