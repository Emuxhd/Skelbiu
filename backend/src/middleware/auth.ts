import jwt from "jsonwebtoken";

const SECRET = "Kitm";

export function authMiddleware(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization") || req.headers.get("authorization");
    
    if (!authHeader) {
      console.log("Middleware klaida: Nerastas Authorization headeris");
      return null;
    }

    if (!authHeader.startsWith("Bearer ")) {
      console.log("Middleware klaida: Headeris neprasideda 'Bearer '");
      return null;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      console.log("Middleware klaida: Tokenas yra tuščias");
      return null;
    }

    const decoded = jwt.verify(token, SECRET) as { id: number; role: string };
    
    return decoded; 
  } catch (err) {
    console.log("Middleware klaida: Neteisingas arba pasibaigęs Tokenas", err);
    return null;
  }
}