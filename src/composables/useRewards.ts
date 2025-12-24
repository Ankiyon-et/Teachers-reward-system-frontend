// src/composables/useRewards.ts
import { ref } from "vue";
import * as rewardsAPI from "@/services/rewards";

export function useRewards() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const success = ref(false);

  async function sendReward(teacherId: number, amount: number) {
    loading.value = true;
    error.value = null;
    success.value = false;

    try {
      if (!teacherId) throw new Error("Teacher is required");
      if (amount <= 0) throw new Error("Amount must be greater than 0");

      await rewardsAPI.rewardTeacher({
        teacher_id: teacherId,
        amount,
      });

      success.value = true;
    } catch (err: any) {
      error.value =
        err?.response?.data?.message ||
        err.message ||
        "Failed to send reward";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    error,
    success,
    sendReward,
  };
}
