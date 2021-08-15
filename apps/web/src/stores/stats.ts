import { createStore } from "nanostores";

import type { StatsDTO } from "../../../api/src/stats/dto/stats.dto";
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

export const statsStore = createStore<Partial<StatsDTO>>(() => {
  statsStore.set({});
});

export async function fetchAndSetData() {
  try {
    const request = await api.get("/v1/stats");
    statsStore.set(request.data);
  } catch (err) {
    console.error(`Store stats error:`, err);
  }
}
