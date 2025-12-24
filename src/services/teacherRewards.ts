// src/services/teacherRewards.ts
import { api } from "./api";

export type TeacherReward = {
  id: number;
  parent_name: string | null;
  teacher_id: number;
  amount: string;
  created_at: string;
  updated_at: string;
};

export async function getTeacherRewards() {
  const res = await api.get<TeacherReward[]>("/teacher/rewards");
  return res.data;
}
