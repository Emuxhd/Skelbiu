import db from "../db/database";
import { authMiddleware } from "../middleware/auth";

export async function getAds(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const category = url.searchParams.get("category");
  const search = url.searchParams.get("search");

  let query = "SELECT ads.*, users.username, categories.name as category_name FROM ads LEFT JOIN users ON ads.user_id = users.id LEFT JOIN categories ON ads.category_id = categories.id WHERE ads.blocked = 0";
  const params: any[] = [];

  if (category) {
    query += " AND ads.category_id = ?";
    params.push(category);
  }

  if (search) {
    query += " AND ads.title LIKE ?";
    params.push(`%${search}%`);
  }

  const ads = db.query(query).all(...params);
  return Response.json(ads);
}

export async function createAd(req: Request): Promise<Response> {
  const user = authMiddleware(req);
  if (!user) return Response.json({ error: "Not logged in" }, { status: 401 });

  const { title, description, price, category_id, image } = await req.json();
  if (!title) return Response.json({ error: "Title is required" }, { status: 400 });

  db.query("INSERT INTO ads (title, description, price, category_id, user_id, image) VALUES (?, ?, ?, ?, ?, ?)").run(title, description, price, category_id, user.id, image);
  return Response.json({ message: "Ad created" });
}

export async function updateAd(req: Request, id: string): Promise<Response> {
  const user = authMiddleware(req);
  if (!user) return Response.json({ error: "Not logged in" }, { status: 401 });

  const ad = db.query("SELECT * FROM ads WHERE id = ?").get(id) as any;
  if (!ad) return Response.json({ error: "Not found" }, { status: 404 });
  if (ad.user_id !== user.id) return Response.json({ error: "No permission" }, { status: 403 });

  const { title, description, price, category_id } = await req.json();
  db.query("UPDATE ads SET title = ?, description = ?, price = ?, category_id = ? WHERE id = ?").run(title, description, price, category_id, id);
  return Response.json({ message: "Updated" });
}

export async function deleteAd(req: Request, id: string): Promise<Response> {
  const user = authMiddleware(req);
  if (!user) return Response.json({ error: "Not logged in" }, { status: 401 });

  const ad = db.query("SELECT * FROM ads WHERE id = ?").get(id) as any;
  if (!ad) return Response.json({ error: "Not found" }, { status: 404 });
  if (ad.user_id !== user.id && user.role !== "admin") return Response.json({ error: "No permission" }, { status: 403 });

  db.query("DELETE FROM ads WHERE id = ?").run(id);
  return Response.json({ message: "Deleted" });
}