import { createStore } from "nanostores";
import { api } from "../helpers/api";

export type UserType = {
  id?: string;
  first_name?: string;
  username?: string;
  photo_url?: string;
  auth_date?: string;
};

export const userStore = createStore<UserType>(() => {
  userStore.set({});
});

export async function fetchAndSetData() {
  const request = await api.get("/v1/auth");
  userStore.set(request.data);
}
