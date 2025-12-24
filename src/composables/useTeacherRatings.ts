// src/composables/useTeacherRatings.ts
import { ref } from "vue";
import * as ratingsAPI from "@/services/teacherRatings";
import type { TeacherRating } from "@/services/teacherRatings";

export function useTeacherRatings() {
  const ratings = ref<TeacherRating[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchRatings() {
    loading.value = true;
    error.value = null;

    try {
      ratings.value = await ratingsAPI.getTeacherRatings();
    } catch (err: any) {
      console.error("fetchRatings error", err);
      error.value =
        err?.response?.data?.message ||
        err.message ||
        "Failed to fetch ratings";
    } finally {
      loading.value = false;
    }
  }

  return {
    ratings,
    loading,
    error,
    fetchRatings,
  };
}
