// src/composables/useTeacherRewards.ts
import { ref } from "vue";
import type { TeacherReward } from "@/services/teacherRewards";
import * as rewardsAPI from "@/services/teacherRewards";

export function useTeacherRewards() {
  const rewards = ref<TeacherReward[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchRewards() {
    loading.value = true;
    error.value = null;
    try {
      rewards.value = await rewardsAPI.getTeacherRewards();
    } catch (err: any) {
      console.error("fetchRewards error", err);
      error.value =
        err?.response?.data?.message ||
        err.message ||
        "Failed to fetch rewards";
    } finally {
      loading.value = false;
    }
  }

  return {
    rewards,
    loading,
    error,
    fetchRewards,
  };
}
