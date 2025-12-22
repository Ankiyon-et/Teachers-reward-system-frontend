// src/composables/useGrades.ts
import { ref } from "vue";
import type { Grade } from "@/services/grades";
import * as gradesAPI from "@/services/grades";

export function useGrades() {
  const grades = ref<Grade[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchGrades() {
    loading.value = true;
    error.value = null;
    try {
      const data = await gradesAPI.getGrades();
      grades.value = data;
    } catch (err: any) {
      console.error("fetchGrades error", err);
      error.value = err?.response?.data?.message || err.message || "Failed to fetch grades";
    } finally {
      loading.value = false;
    }
  }

  async function addGrade(name: string) {
    loading.value = true;
    error.value = null;
    try {
      const res = await gradesAPI.createGrade(name);
      if (res?.id) {
        grades.value.unshift(res);
      }
      return res;
    } catch (err: any) {
      console.error("addGrade error", err);
      error.value = err?.response?.data?.message || err.message || "Failed to add grade";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateGrade(id: number, name: string) {
    loading.value = true;
    error.value = null;
    try {
      const res = await gradesAPI.updateGrade(id, name);
      if (res?.id) {
        const idx = grades.value.findIndex(g => g.id === id);
        if (idx !== -1) grades.value[idx] = res;
      }
      return res;
    } catch (err: any) {
      console.error("updateGrade error", err);
      error.value = err?.response?.data?.message || err.message || "Failed to update grade";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function removeGrade(id: number) {
    loading.value = true;
    error.value = null;
    try {
      const res = await gradesAPI.deleteGrade(id);
      grades.value = grades.value.filter(g => g.id !== Number(id));
      return res;
    } catch (err: any) {
      console.error("removeGrade error", err);
      error.value = err?.response?.data?.message || err.message || "Failed to delete grade";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    grades,
    loading,
    error,
    fetchGrades,
    addGrade,
    updateGrade,
    removeGrade,
  };
}
