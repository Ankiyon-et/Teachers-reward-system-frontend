// src/composables/useTeachers.ts
import { ref } from "vue";
import * as teachersAPI from "@/services/teachers";
import type { Teacher, CreateTeacherPayload } from "@/services/teachers";

export function useTeachers() {
  const teachers = ref<Teacher[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchTeachers() {
    loading.value = true;
    error.value = null;
    try {
      teachers.value = await teachersAPI.getTeachers();
    } catch (err: any) {
      console.error("fetchTeachers error", err);
      error.value =
        err?.response?.data?.message || err.message || "Failed to fetch teachers";
    } finally {
      loading.value = false;
    }
  }

  async function createTeacher(payload: CreateTeacherPayload) {
    loading.value = true;
    error.value = null;
    try {
      const res = await teachersAPI.createTeacher(payload);
      await fetchTeachers();
      return res;
    } catch (err: any) {
      error.value =
        err?.response?.data?.message || err.message || "Failed to create teacher";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function removeTeacher(id: number) {
    loading.value = true;
    error.value = null;
    try {
      const res = await teachersAPI.deleteTeacher(id);
      teachers.value = teachers.value.filter(t => t.id !== id);
      return res;
    } catch (err: any) {
      error.value =
        err?.response?.data?.message || err.message || "Failed to delete teacher";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function assignGrades(teacherId: number, gradeIds: number[]) {
    loading.value = true;
    error.value = null;
    try {
      const res = await teachersAPI.assignGradesToTeacher(
        teacherId,
        gradeIds
      );
      await fetchTeachers();
      return res;
    } catch (err: any) {
      error.value =
        err?.response?.data?.message || err.message || "Failed to assign grades";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    teachers,
    loading,
    error,
    fetchTeachers,
    createTeacher,
    removeTeacher,
    assignGrades,
  };
}
