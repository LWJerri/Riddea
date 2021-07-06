import { SessionData, SessionStore } from "@mgcrea/fastify-session";
import { Session } from "@riddea/typeorm";
import { getRepository } from "typeorm";
import { apiLogger } from "../main";

export class TypeormStore<T extends SessionData = SessionData> implements SessionStore {
  private readonly repository = getRepository(Session);
  private ttl: number;
  constructor({ ttl = 86400 }: { ttl?: number } = {}) {
    this.ttl = ttl * 1000;
  }

  async get(sid: string): Promise<[T, number]> {
    try {
      const session = await this.repository.findOne({ sid });

      if (!session || session?.expireAt.getTime() <= Date.now()) {
        return null;
      }

      return [JSON.parse(session?.json ?? {}) as T, session?.expireAt.getTime()];
    } catch (err) {
      apiLogger.error(`SessionStore error:`, err.stack);
      return [null, null];
    }
  }

  async set(sid: string, sessionData: T, expiry: number | null = null): Promise<void> {
    try {
      const ttl = expiry ? expiry : Date.now() + this.ttl;
      const session = (await this.repository.findOne({ sid })) || this.repository.create();
      session.sid = sid;
      session.expireAt = new Date(ttl);
      session.json = JSON.stringify(sessionData);
      await this.repository.save(session);
    } catch (err) {
      apiLogger.error(`SessionStore error:`, err.stack);
    }
  }

  async destroy(sid: string): Promise<void> {
    try {
      await this.repository.delete({ sid });
    } catch (err) {
      apiLogger.error(`SessionStore error:`, err.stack);
    }
  }

  async all(): Promise<T[]> {
    try {
      const sessions = await this.repository.find();

      return sessions?.map((s) => JSON.parse(s.json) as T) ?? [];
    } catch (err) {
      apiLogger.error(`SessionStore error:`, err.stack);
    }
  }

  length() {
    try {
      return this.repository.count();
    } catch (err) {
      apiLogger.error(`SessionStore error:`, err.stack);
    }
  }

  clear() {
    try {
      return this.repository.clear();
    } catch (err) {
      apiLogger.error(`SessionStore error:`, err.stack);
    }
  }

  async touch(sid: string, expiry?: number | null): Promise<void> {
    try {
      const ttl = expiry ? expiry : Date.now() + this.ttl;
      const session = (await this.repository.findOne({ sid })) || this.repository.create();
      session.expireAt = new Date(ttl);
      await this.repository.save(session);
    } catch (err) {
      apiLogger.error(`SessionStore error:`, err.stack);
    }
  }
}
