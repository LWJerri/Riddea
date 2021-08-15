import { createStore } from "nanostores";

import type { User } from "../../../api/src/types/user";
import { api } from "../helpers/api";

export const userStore = createStore<Partial<User>>(() => {
  userStore.set({});
});

export async function fetchAndSetData() {
  try {
    const request = await api.get<User>("/v1/auth");
    userStore.set(request.data);
  } catch (err) {
    console.error(`Store user error:`, err);
  }
}
