// src/composables/useParentRating.ts
import { ref } from "vue";
import type { RateTeacherPayload } from "@/services/ratings";
import * as ratingAPI from "@/services/ratings";

export function useParentRating() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const success = ref(false);

  async function submitRating(payload: RateTeacherPayload) {
    loading.value = true;
    error.value = null;
    success.value = false;

    try {
      await ratingAPI.rateTeacher(payload);
      success.value = true;
    } catch (err: any) {
      console.error("submitRating error", err);
      error.value =
        err?.response?.data?.message ||
        err.message ||
        "Failed to submit rating";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    error,
    success,
    submitRating,
  };
}
