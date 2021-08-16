import { SessionData } from "@mgcrea/fastify-session";

export type ConfirmLogin = SessionData["user"] & {
  hash: string;
};
