import { Hono } from "hono";

const healthcheckRoutes = new Hono();

healthcheckRoutes.get("/", (c) => {
    return c.json({ ok: true, message: "Healthcheck successful" }, 200);
});

export default healthcheckRoutes;
