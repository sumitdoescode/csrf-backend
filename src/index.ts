import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { setCookie, getCookie, deleteCookie } from "hono/cookie";
import { sign, verify } from "jsonwebtoken";

const app = new Hono();

app.use(logger());

app.use(
    cors({
        origin: "https://csrf-frontend.vercel.app",
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
    }),
);

app.get("/", (c) => {
    return c.json({ ok: true, message: "Welcome !" }, 200);
});

app.post("/login", async (c) => {
    const body = await c.req.json();
    console.log(body);
    const token = sign(body, process.env.JWT_SECRET!, {
        expiresIn: "24h",
    });
    setCookie(c, "token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60,
    });
    return c.json({ ok: true, message: "Successfully logged in" }, 200);
});

app.get("/logout", (c) => {
    deleteCookie(c, "token", {
        path: "/",
        secure: true,
        sameSite: "none",
    });
    return c.json({ ok: true, message: "Successfully logged out" }, 200);
});

app.get("/dashboard", (c) => {
    const cookie = getCookie(c, "token");
    console.log({ cookie });
    if (!cookie) {
        return c.json({ ok: false, message: "Unauthorized" }, 401);
    }
    let decoded;
    try {
        decoded = verify(cookie, process.env.JWT_SECRET!);
    } catch (error) {
        return c.json({ ok: false, message: "Invalid token or expired" }, 401);
    }
    console.log(decoded);
    return c.json({ ok: true, message: "Dashboard page", user: decoded }, 200);
});

export default app;
