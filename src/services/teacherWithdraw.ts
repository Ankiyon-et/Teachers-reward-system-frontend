// src/services/teacherWithdraw.ts
import { api } from "./api";

export type WithdrawResponse = {
  message?: string;
};

export async function requestWithdraw(amount: number) {
  const res = await api.post<WithdrawResponse>("/teacher/withdraw", {
    amount,
  });
  return res.data;
}
