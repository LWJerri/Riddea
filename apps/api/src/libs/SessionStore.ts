import { SessionData, SessionStore } from "@mgcrea/fastify-session";
import { Session } from "@riddea/typeorm";
import { getRepository } from "typeorm";

export class TypeormStore<T extends SessionData = SessionData> implements SessionStore {
  private readonly repository = getRepository(Session)
  private ttl: number
  constructor(
    {
      ttl = 86400
    }: { ttl?: number } = {}
  ) {
    this.ttl = ttl * 1000
  }

  async get(sid: string): Promise<[T, number]> {
    try {
      const session = await this.repository.findOne({ sid })

      if (!session) {
        return null
      }

      if (session?.expireAt <= Date.now()) {
        return null;
      }

      return [JSON.parse(session?.json ?? {}) as T, session?.expireAt]
    } catch (error) {
      console.error(error)
      return [null, null]
    }
    
  }

  async set(sid: string, sessionData: T, expiry: number | null = null): Promise<void> {
    const ttl = expiry ? expiry : Date.now() + this.ttl;
    const session = await this.repository.findOne({ sid }) || this.repository.create()
    session.sid = sid
    session.expireAt = ttl
    session.json = JSON.stringify(sessionData)
    await this.repository.save(session)
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


  // This method is used to touch a session from the store given a session ID (sid).
  async touch(sid: string, expiry?: number | null): Promise<void> {
    const ttl = expiry ? expiry : Date.now() + this.ttl;
    const session = await this.repository.findOne({ sid }) || this.repository.create()
    session.expireAt = ttl
    await this.repository.save(session)
  }
}