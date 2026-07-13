import { Hono } from "hono";
import { expireInvitationsController } from "./job.controller";

const app = new Hono();

app.post("/expire-invitations", ...expireInvitationsController);

export default app;
