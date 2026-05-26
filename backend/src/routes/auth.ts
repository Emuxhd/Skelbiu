import db from "../db/database";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = "Kitm";

export async function register(req: Request): Promise<Response> {
  const { username, password } = await req.json();

  if (!username || !password) {
    return Response.json({ error: "Missing data" }, { status: 400 });
  }

  const existing = db.query("SELECT id FROM users WHERE username = ?").get(username);
  if (existing) {
    return Response.json({ error: "User already exists" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);
  db.query("INSERT INTO users (username, password) VALUES (?, ?)").run(username, hashed);

  return Response.json({ message: "Registration successful" });
}

export async function login(req: Request): Promise<Response> {
  const { username, password } = await req.json();

  const user = db.query("SELECT * FROM users WHERE username = ?").get(username) as any;
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  if (user.blocked) {
    return Response.json({ error: "Account blocked" }, { status: 403 });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return Response.json({ error: "Wrong password" }, { status: 401 });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, SECRET);
  return Response.json({ token, role: user.role });
}