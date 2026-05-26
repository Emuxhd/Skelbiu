import db from "../db/database";
import { authMiddleware } from "../middleware/auth";

export async function getCategories(req: Request): Promise<Response> {
  const categories = db.query("SELECT * FROM categories").all();
  return Response.json(categories);
}

export async function createCategory(req: Request): Promise<Response> {
  const user = authMiddleware(req);
  if (!user) return Response.json({ error: "Not logged in" }, { status: 401 });
  if (user.role !== "admin") return Response.json({ error: "No permission" }, { status: 403 });

  const { name } = await req.json();
  if (!name) return Response.json({ error: "Name is required" }, { status: 400 });

  db.query("INSERT INTO categories (name) VALUES (?)").run(name);

  const allCategories = db.query("SELECT * FROM categories").all();
  return Response.json(allCategories);
}