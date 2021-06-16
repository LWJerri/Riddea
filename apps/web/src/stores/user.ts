import { createStore } from "nanostores";
import { api } from "../helpers/api";
import type { User } from "../../../api/src/types/user";

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
