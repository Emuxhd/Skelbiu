import jwt from "jsonwebtoken";

const SECRET = "Kitm";

export function authMiddleware(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization") || req.headers.get("authorization");
    
    if (!authHeader) {
      console.log("Middleware error: Nerastas Authorization headeris");
      return null;
    }

    if (!authHeader.startsWith("Bearer ")) {
      console.log("Middleware error: Headeris neprasideda 'Bearer '");
      return null;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      console.log("Middleware error: Tokenas yra tuščias");
      return null;
    }

    const decoded = jwt.verify(token, SECRET) as { id: number; role: string };
    
    return decoded; 
  } catch (err) {
    console.log("Middleware error: Neteisingas arba pasibaigęs Tokenas", err);
    return null;
  }
}