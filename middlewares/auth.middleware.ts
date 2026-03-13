import type { Context, Next } from "hono";
import { verify } from "jsonwebtoken";
import { getCookie } from "hono/cookie";
import { User } from "../models/user.model";

export const authMiddleware = async (c: Context, next: Next) => {
    try {
        const cookie = getCookie(c, "token");
        if (!cookie) {
            return c.json({ ok: false, message: "Unauthorized" }, 401);
        }
        let decoded: any;
        try {
            decoded = verify(cookie, process.env.JWT_SECRET!);
        } catch (error) {
            return c.json({ ok: false, message: "Invalid token or expired" }, 401);
        }

        // check in the database
        const user = await User.findById(decoded.id);
        if (!user) {
            return c.json({ ok: false, message: "Invalid token or expired" }, 401);
        }

        c.set("user", user);

        next();
    } catch (error) {
        return c.json({ ok: false, message: "Unauthorized" }, 401);
    }
};
