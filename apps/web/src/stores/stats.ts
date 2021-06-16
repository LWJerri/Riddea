import { createStore } from "nanostores";
import { api } from "../helpers/api";

export type StatsType = {
  commandsUsage?: Record<string, number>;
  uploads?: number;
  botInfo?: {
    username: string;
    id: number;
    uptime: string;
    version: string;
  };
};

export const statsStore = createStore<StatsType>(() => {
  statsStore.set({});
});

export async function fetchAndSetData() {
  const request = await api.get("/v1/stats");
  statsStore.set(request.data);
}
