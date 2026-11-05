import { createRemoteJWKSet, jwtVerify } from "jose";

let jwks = null;

function getJwks() {
  if (!jwks) {
    const base = process.env.CLIENT_URL || "http://localhost:3000";
    jwks = createRemoteJWKSet(new URL(`${base}/api/auth/jwks`));
  }
  return jwks;
}

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Please log in to continue." });
  }
  try {
    const { payload } = await jwtVerify(header.slice(7), getJwks());
    const email = typeof payload.email === "string" ? payload.email : "";
    if (!email) {
      return res.status(401).json({ message: "Invalid session token." });
    }
    req.user = {
      email: email.toLowerCase(),
      name: typeof payload.name === "string" ? payload.name : "",
    };
    next();
  } catch {
    return res.status(401).json({ message: "Your session has expired. Please log in again." });
  }
}