import { NextFunction, Request, Response } from "express";
import { auth } from "../lib/auth";

export enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN"
}

const authMiddleware = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const session = await auth.api.getSession({
      headers: req.headers as any,
    });
    const user = session?.user;
    if (!session) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!session.user.emailVerified) {
      return res
        .status(401)
        .json({ success: false, message: "please verify your email address" });
    }

    req.user = {
      id: session.user.id,
      name: user!.name,
      email: user!.email,
      role: user!.role!,
      emailVerified: user!.emailVerified,
    };

    if (roles.length && !roles.includes(req.user.role as UserRole)) {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden access" });
    }
    next();
  };
};

export default authMiddleware;
