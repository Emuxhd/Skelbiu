import db from "../db/database";
import { authMiddleware } from "../middleware/auth";

export async function getUsers(req: Request): Promise<Response> {
  const user = authMiddleware(req);
  if (!user) return Response.json({ error: "Not logged in" }, { status: 401 });
  if (user.role !== "admin") return Response.json({ error: "No permission" }, { status: 403 });

  const users = db.query("SELECT id, username, role, blocked FROM users").all();
  return Response.json(users);
}

export async function blockAd(req: Request, id: string): Promise<Response> {
  const user = authMiddleware(req);
  if (!user) return Response.json({ error: "Not logged in" }, { status: 401 });
  if (user.role !== "admin") return Response.json({ error: "No permission" }, { status: 403 });

  db.query("UPDATE ads SET blocked = 1 WHERE id = ?").run(id);
  return Response.json({ message: "Ad blocked successfully" });
}

export async function blockUser(req: Request, id: string): Promise<Response> {
  const user = authMiddleware(req);
  if (!user) return Response.json({ error: "Not logged in" }, { status: 401 });
  if (user.role !== "admin") return Response.json({ error: "No permission" }, { status: 403 });

  db.query("UPDATE users SET blocked = 1 WHERE id = ?").run(id);
  return Response.json({ message: "User blocked successfully" });
}