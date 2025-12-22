import { ref } from "vue";
import type { Teacher, CreateTeacherPayload } from "@/services/teachers";
import * as teachersAPI from "@/services/teachers";

export function useTeachers() {
  const teachers = ref<Teacher[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchTeachers() {
    loading.value = true;
    error.value = null;

    try {
      const data = await teachersAPI.getTeachers();
      teachers.value = data;
    } catch (err: any) {
      error.value =
        err?.response?.data?.message || err.message || "Failed to fetch teachers";
      teachers.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function createTeacher(payload: CreateTeacherPayload) {
    loading.value = true;
    error.value = null;

    try {
      await teachersAPI.createTeacher(payload);
      await fetchTeachers(); // clean refresh
    } catch (err: any) {
      error.value =
        err?.response?.data?.message || err.message || "Failed to create teacher";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteTeacher(id: number) {
    loading.value = true;
    error.value = null;

    try {
      await teachersAPI.deleteTeacher(id);
      teachers.value = teachers.value.filter(t => t.id !== id);
    } catch (err: any) {
      error.value =
        err?.response?.data?.message || err.message || "Failed to delete teacher";
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
    deleteTeacher,
  };
}
