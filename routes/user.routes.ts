import { Hono } from "hono";
import { User } from "../models/user.model";
import { setCookie, deleteCookie } from "hono/cookie";
import { sign } from "jsonwebtoken";
import { authMiddleware } from "../middlewares/auth.middleware";
import type { Context } from "hono";

const userRoutes = new Hono();

// POST => /api/user/register
userRoutes.post("/register", async (c) => {
    try {
        const { name, email, password } = await c.req.json();
        if (!name || !email || !password) {
            return c.json({ ok: false, message: "All fields are required" }, 400);
        }
        // check if the email already exists
        const user = await User.findOne({ email });
        if (user) {
            return c.json({ ok: false, message: "User already exists" }, 400);
        }
        const newUser = await User.create({ name, email, password });
        return c.json({ ok: true, message: "User registered successfully", user: newUser }, 201);
    } catch (error) {
        console.log("REGISTER USER ERROR", error);
        return c.json({ ok: false, message: "Internal server error" }, 500);
    }
});

// POST => /api/user/login
userRoutes.post("/login", async (c) => {
    try {
        const { email, password } = await c.req.json();
        if (!email || !password) {
            return c.json({ ok: false, message: "All fields are required" }, 400);
        }
        const user = await User.findOne({ email });
        if (!user) {
            return c.json({ ok: false, message: "Invalid credentials" }, 401);
        }
        const isPasswordValid = user.password === password;
        if (!isPasswordValid) {
            return c.json({ ok: false, message: "Invalid credentials" }, 401);
        }
        const token = sign({ id: user._id, email: user.email }, process.env.JWT_SECRET!);
        setCookie(c, "token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 24 * 60 * 60, // 24 hours in seconds
        });
        return c.json({ ok: true, message: "User logged in successfully", user }, 200);
    } catch (error) {
        console.log("LOGIN USER ERROR", error);
        return c.json({ ok: false, message: "Internal server error" }, 500);
    }
});

// GET => /api/user/logout
userRoutes.get("/logout", authMiddleware, (c: Context) => {
    try {
        const user = c.get("user");
        if (!user) {
            return c.json({ ok: false, message: "Unauthorized" }, 401);
        }
        deleteCookie(c, "token", {
            path: "/",
            secure: true,
            sameSite: "lax",
        });
        return c.json({ ok: true, message: `${user.email} is logged out successfully` }, 200);
    } catch (error) {
        console.log("LOGOUT USER ERROR", error);
        return c.json({ ok: false, message: "Internal server error" }, 500);
    }
});

// GET => /api/user/me
userRoutes.get("/me", authMiddleware, async (c: Context) => {
    try {
        const user = c.get("user");
        if (!user) {
            return c.json({ ok: false, message: "Unauthorized" }, 401);
        }
        return c.json({ ok: true, message: "User fetched successfully", user }, 200);
    } catch (error) {
        console.log("ME USER ERROR", error);
        return c.json({ ok: false, message: "Internal server error" }, 500);
    }
});

export default userRoutes;
