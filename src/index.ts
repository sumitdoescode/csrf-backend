import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import userRoutes from "./routes/user.routes";
import healthcheckRoutes from "./routes/healthcheck.routes";
import { connectDB } from "./db/db";

connectDB();

const app = new Hono();

app.use(logger());

app.use(
    cors({
        origin: "https://csrf-frontend.vercel.app",
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
    }),
);

app.route("/api/healthcheck", healthcheckRoutes);
app.route("/api/user", userRoutes);

export default app;
