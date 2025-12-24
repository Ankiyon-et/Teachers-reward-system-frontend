// src/composables/useTeacherDashboard.ts
import { ref } from "vue";
import * as dashboardAPI from "@/services/teacherDashboard";
import type { TeacherDashboardResponse } from "@/services/teacherDashboard";

export function useTeacherDashboard() {
  const dashboard = ref<TeacherDashboardResponse | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchDashboard() {
    loading.value = true;
    error.value = null;
    try {
      dashboard.value = await dashboardAPI.getTeacherDashboard();
    } catch (err: any) {
      console.error("Teacher dashboard error", err);
      error.value =
        err?.response?.data?.message ||
        err.message ||
        "Failed to load dashboard";
    } finally {
      loading.value = false;
    }
  }

  return {
    dashboard,
    loading,
    error,
    fetchDashboard,
  };
}
