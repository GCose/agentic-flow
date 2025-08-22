import jwt from 'jsonwebtoken';

export const loggedInUser = () => {
  const user = localStorage.getItem("agentic_flow_user");

  if (!user) return null;

  return JSON.parse(user);
};


// utils/auth.js (server-side JWT verification)

export interface JwtPayload {
  // Add properties according to your JWT payload structure
  [key: string]: any;
}

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
  } catch (error) {
    return null;
  }
};
