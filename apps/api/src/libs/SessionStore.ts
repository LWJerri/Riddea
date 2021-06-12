import { SessionData, SessionStore } from "@mgcrea/fastify-session";
import { Session } from "@riddea/typeorm";
import { getRepository } from "typeorm";

export class TypeormStore<T extends SessionData = SessionData> implements SessionStore {
  private readonly repository = getRepository(Session)

  async get(sid: string): Promise<[T, number]> {
    try {
      const session = await this.repository.findOne({ sid })

      if (!session) {
        return null
      }

      if (session?.expiredAt <= Date.now()) {
        return null;
      }

      return [JSON.parse(session?.json ?? {}) as T, session?.expiredAt]
    } catch (error) {
      console.error(error)
      return [null, null]
    }
    
  }

  async set(sid: string, session: T, expiredAt: number | null = null): Promise<void> {
    try {
      await this.repository.save({ sid, json: JSON.stringify(session), expiredAt: expiredAt || Date.now() })
    } catch (error) {
      console.error(error)
    }
  }

  async destroy(sid: string): Promise<void> {
    await this.repository.delete({ sid })
  }

  async all(): Promise<T[]> {
    const sessions = await  this.repository.find()

    return sessions?.map(s => JSON.parse(s.json) as T) ?? []
  }

  length() {
    return this.repository.count()
  }

  clear() {
    return this.repository.clear()
  }

  async touch(sid: string, expiry?: number): Promise<void> {
    try {
      const sessionData = await this.get(sid);

      if (!sessionData || !sessionData?.length) {
        return;
      }

      const [session] = sessionData;

      await this.set(sid, session, expiry);
    } catch (error) {
      console.error(error)
    }
  }
}