// src/services/ratings.ts
import { api } from "./api";

export type RateTeacherPayload = {
  teacher_id: number;
  value: number;
  comment?: string;
};

export async function rateTeacher(payload: RateTeacherPayload) {
  const res = await api.post("/rate", payload);
  return res.data;
}
