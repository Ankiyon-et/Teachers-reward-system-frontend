// src/composables/useTeachers.ts
import { ref } from "vue";
import type {
  Teacher,
  CreateTeacherPayload,
  UpdateTeacherPayload,
} from "@/services/teachers";
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
      teachers.value = Array.isArray(data) ? data : [];
    } catch (err: any) {
      console.error("fetchTeachers error", err);
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
      const res = await teachersAPI.createTeacher(payload);
      if (res?.teacher) {
        teachers.value.unshift(res.teacher);
      } else {
        await fetchTeachers();
      }
      return res;
    } catch (err: any) {
      error.value =
        err?.response?.data?.message || err.message || "Failed to create teacher";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateTeacher(id: number, payload: UpdateTeacherPayload) {
    loading.value = true;
    error.value = null;
    try {
      const res = await teachersAPI.updateTeacher(id, payload);
      if (res?.teacher) {
        const idx = teachers.value.findIndex(t => t.id === res.teacher.id);
        if (idx !== -1) teachers.value[idx] = res.teacher;
      } else {
        await fetchTeachers();
      }
      return res;
    } catch (err: any) {
      error.value =
        err?.response?.data?.message || err.message || "Failed to update teacher";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteTeacher(id: number) {
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

  return {
    teachers,
    loading,
    error,
    fetchTeachers,
    createTeacher,
    updateTeacher,
    deleteTeacher,
  };
}
