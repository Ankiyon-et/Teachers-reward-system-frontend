// src/services/rewards.ts
import { api } from "./api";

export type RewardPayload = {
  teacher_id: number;
  amount: number;
};

export async function rewardTeacher(payload: RewardPayload) {
  const res = await api.post("/reward", payload);
  return res.data;
}
