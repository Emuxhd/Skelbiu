import db from "../db/database";
import { authMiddleware } from "../middleware/auth";

export async function getComments(req: Request, adId: string): Promise<Response> {
  const comments = db.query("SELECT comments.*, users.username FROM comments LEFT JOIN users ON comments.user_id = users.id WHERE comments.ad_id = ?").all(adId);
  return Response.json(comments);
}

export async function createComment(req: Request): Promise<Response> {
  const user = authMiddleware(req);
  if (!user) return Response.json({ error: "Not logged in" }, { status: 401 });

  const { content, ad_id } = await req.json();
  if (!content) return Response.json({ error: "Comment is empty" }, { status: 400 });

  db.query("INSERT INTO comments (content, ad_id, user_id) VALUES (?, ?, ?)").run(content, ad_id, user.id);
  return Response.json({ message: "Comment added" });
}

export async function deleteComment(req: Request, id: string): Promise<Response> {
  const user = authMiddleware(req);
  if (!user) return Response.json({ error: "Not logged in" }, { status: 401 });

  const comment = db.query("SELECT * FROM comments WHERE id = ?").get(id) as any;
  if (!comment) return Response.json({ error: "Not found" }, { status: 404 });

  const ad = db.query("SELECT * FROM ads WHERE id = ?").get(comment.ad_id) as any;
  if (comment.user_id !== user.id && ad.user_id !== user.id && user.role !== "admin") {
    return Response.json({ error: "No permission" }, { status: 403 });
  }

  db.query("DELETE FROM comments WHERE id = ?").run(id);
  return Response.json({ message: "Deleted" });
}