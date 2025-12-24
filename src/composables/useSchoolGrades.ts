// src/composables/useSchoolGrades.ts
import { ref } from "vue";
import * as gradesAPI from "@/services/schoolGrades";
import type { Grade } from "@/services/schoolGrades";

export function useSchoolGrades() {
  const allGrades = ref<Grade[]>([]);
  const assignedGrades = ref<Grade[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchAllGrades() {
    loading.value = true;
    error.value = null;
    try {
      allGrades.value = await gradesAPI.getAllGrades();
    } catch (err: any) {
      console.error("fetchAllGrades error", err);
      error.value = err?.response?.data?.message || err.message || "Failed to fetch all grades";
    } finally {
      loading.value = false;
    }
  }

  async function fetchAssignedGrades() {
    loading.value = true;
    error.value = null;
    try {
      assignedGrades.value = await gradesAPI.getSchoolGrades();
    } catch (err: any) {
      console.error("fetchAssignedGrades error", err);
      error.value = err?.response?.data?.message || err.message || "Failed to fetch assigned grades";
    } finally {
      loading.value = false;
    }
  }

  async function assignSelectedGrades(ids: number[]) {
    loading.value = true;
    error.value = null;
    try {
      const res = await gradesAPI.assignGrades(ids);
      await fetchAssignedGrades();
      return res;
    } catch (err: any) {
      console.error("assignSelectedGrades error", err);
      error.value = err?.response?.data?.message || err.message || "Failed to assign grades";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function removeGrade(id: number) {
    loading.value = true;
    error.value = null;
    try {
      const res = await gradesAPI.removeSchoolGrade(id);
      assignedGrades.value = assignedGrades.value.filter(g => g.id !== id);
      return res;
    } catch (err: any) {
      console.error("removeGrade error", err);
      error.value = err?.response?.data?.message || err.message || "Failed to remove grade";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    allGrades,
    assignedGrades,
    loading,
    error,
    fetchAllGrades,
    fetchAssignedGrades,
    assignSelectedGrades,
    removeGrade,
  };
}
