import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import userRoutes from "./routes/user.routes";
import healthcheckRoutes from "./routes/healthcheck.routes";
import { connectDB } from "./db/db";
import todoRoutes from "./routes/todo.routes";

connectDB();

const app = new Hono();

app.use(logger());

app.use(
    cors({
        origin: "https://csrf-frontend.sumitdoescode.me/",
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
    }),
);

app.route("/api/healthcheck", healthcheckRoutes);
app.route("/api/users", userRoutes);
app.route("/api/todos", todoRoutes);

export default app;
