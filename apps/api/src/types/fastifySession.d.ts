import "@mgcrea/fastify-session";
import { User } from "./user";

declare module "@mgcrea/fastify-session" {
  interface SessionData {
    user?: User;
  }
}
