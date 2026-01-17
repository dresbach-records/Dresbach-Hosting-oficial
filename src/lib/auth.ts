import { apiFetch } from "./api";

export async function getMe() {
  return apiFetch("/v1/auth/me");
}
