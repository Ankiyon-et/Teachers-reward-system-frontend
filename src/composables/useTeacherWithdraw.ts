// src/composables/useTeacherWithdraw.ts
import { ref } from "vue";
import * as withdrawAPI from "@/services/teacherWithdraw";

export function useTeacherWithdraw() {
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function withdraw(amount: number) {
    loading.value = true;
    error.value = null;

    try {
      if (amount <= 0) {
        throw new Error("Amount must be greater than zero");
      }

      const res = await withdrawAPI.requestWithdraw(amount);
      return res;
    } catch (err: any) {
      error.value =
        err?.response?.data?.message ||
        err.message ||
        "Withdraw request failed";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    error,
    withdraw,
  };
}
