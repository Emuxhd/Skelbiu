import { serve } from "bun";
import { register, login } from "./src/routes/auth";
import { getAds, createAd, updateAd, deleteAd } from "./src/routes/ads";
import { getCategories, createCategory } from "./src/routes/categories";
import { getComments, createComment, deleteComment } from "./src/routes/comments";
import { getUsers, blockAd, blockUser } from "./src/routes/admin"; // Užtikrinam teisingą kelią

const PORT = 3000;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;

    if (req.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    let response: Response;

    if (path === "/api/register" && req.method === "POST") response = await register(req);
    else if (path === "/api/login" && req.method === "POST") response = await login(req);
    else if (path === "/api/ads" && req.method === "GET") response = await getAds(req);
    else if (path === "/api/ads" && req.method === "POST") response = await createAd(req);
    else if (path.startsWith("/api/ads/") && req.method === "PUT") response = await updateAd(req, path.split("/")[3]);
    else if (path.startsWith("/api/ads/") && req.method === "DELETE") response = await deleteAd(req, path.split("/")[3]);
    else if (path === "/api/categories" && req.method === "GET") response = await getCategories(req);
    else if (path === "/api/categories" && req.method === "POST") response = await createCategory(req);
    else if (path.startsWith("/api/comments/") && req.method === "GET") response = await getComments(req, path.split("/")[3]);
    else if (path === "/api/comments" && req.method === "POST") response = await createComment(req);
    else if (path.startsWith("/api/comments/") && req.method === "DELETE") response = await deleteComment(req, path.split("/")[3]);
    else if (path === "/api/users" && req.method === "GET") response = await getUsers(req);
    else if (path.startsWith("/api/admin/ads/") && req.method === "PUT") response = await blockAd(req, path.split("/")[4]);
    else if (path.startsWith("/api/admin/users/") && req.method === "PUT") response = await blockUser(req, path.split("/")[4]);
    else response = new Response("Not found", { status: 404 });

    const newHeaders = new Headers(response.headers);
    Object.entries(CORS_HEADERS).forEach(([key, value]) => {
      newHeaders.set(key, value);
    });

    return new Response(response.body, {
      status: response.status,
      headers: newHeaders,
    });
  },
});

console.log(`Server running: http://localhost:${PORT}`);