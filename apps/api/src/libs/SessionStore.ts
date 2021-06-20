import { SessionData, SessionStore } from "@mgcrea/fastify-session";
import { PrismaClient } from "@prisma/client";
import { apiLogger } from "../main";

export class SessionsService<T extends SessionData = SessionData> implements SessionStore {
  private ttl: number;
  constructor({ ttl = 86400 }: { ttl?: number } = {}, private readonly prisma: PrismaClient) {
    this.ttl = ttl;
  }

  async get(sid: string): Promise<[T, number]> {
    try {
      const session = await this.prisma.session.findFirst({ where: { sid } });

      if (!session || session?.expireAt <= Date.now()) {
        return null;
      }

      return [JSON.parse(session?.json ?? "{}") as T, Number(session?.expireAt)];
    } catch (err) {
      apiLogger.error(`SessionStore error:`, err.stack);
      return [null, null];
    }
  }

  async set(sid: string, sessionData: T, expiry: number | null = null): Promise<void> {
    try {
      const ttl = expiry ? expiry : Date.now() + this.ttl;
      const data = {
        sid,
        expireAt: ttl,
        json: JSON.stringify(sessionData),
      };

      await this.prisma.session.upsert({
        where: data,
        create: data,
        update: data,
      });
    } catch (err) {
      apiLogger.error(`SessionStore error:`, err.stack);
    }
  }

  async destroy(sid: string): Promise<void> {
    try {
      await this.prisma.session.delete({ where: { sid } });
    } catch (err) {
      apiLogger.error(`SessionStore error:`, err.stack);
    }
  }

  async all(): Promise<T[]> {
    try {
      const sessions = await this.prisma.session.findMany();

      return sessions?.map((s) => JSON.parse(s.json) as T) ?? [];
    } catch (err) {
      apiLogger.error(`SessionStore error:`, err.stack);
    }
  }

  length() {
    try {
      return this.prisma.session.count();
    } catch (err) {
      apiLogger.error(`SessionStore error:`, err.stack);
    }
  }

  async clear() {
    try {
      await this.prisma.session.deleteMany();
      return;
    } catch (err) {
      apiLogger.error(`SessionStore error:`, err.stack);
    }
  }

  async touch(sid: string, expiry?: number | null): Promise<void> {
    try {
      const ttl = expiry ? expiry : Date.now() + this.ttl;
      await this.prisma.session.upsert({
        where: {
          sid,
        },
        update: {
          expireAt: ttl,
        },
        create: {
          sid,
          expireAt: ttl,
          json: "{}",
        },
      });
    } catch (err) {
      apiLogger.error(`SessionStore error:`, err.stack);
    }
  }
}
