import { Hono } from "hono";
import { authMiddleware } from "../middlewares/auth.middleware";
import { Todo } from "../models/todo.model";
import type { Context } from "hono";

const todoRoutes = new Hono();

// POST => /api/todos
todoRoutes.post("/", authMiddleware, async (c: Context) => {
    try {
        console.log("coming inside create todo");
        const { title, description } = await c.req.json();
        if (!title || !description) {
            return c.json({ ok: false, message: "All fields are required" }, 400);
        }
        const user = c.get("user");
        if (!user) {
            return c.json({ ok: false, message: "Unauthorized" }, 401);
        }
        const todo = await Todo.create({ title, description, user: user._id });
        return c.json({ ok: true, message: "Todo created successfully", todo }, 201);
    } catch (error) {
        console.log("CREATE TODO ERROR", error);
        return c.json({ ok: false, message: "Internal server error" }, 500);
    }
});

export default todoRoutes;
