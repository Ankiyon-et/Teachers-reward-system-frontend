// src/services/teacherDashboard.ts
import { api } from "./api";

export type TeacherDashboardResponse = {
  average_rating: number;
  current_balance: number;
  total_rewards_this_month: number;
  monthly_rewards: Record<string, number>;
};

export async function getTeacherDashboard() {
  const res = await api.get<TeacherDashboardResponse>(
    "/teacher/dashboard"
  );
  return res.data;
}
