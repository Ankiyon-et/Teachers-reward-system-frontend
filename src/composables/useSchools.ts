// src/composables/useSchools.ts
import { ref } from "vue";
import type { School, CreateSchoolPayload, UpdateSchoolPayload } from "@/services/schools";
import * as schoolsAPI from "@/services/schools";

export function useSchools() {
  const schools = ref<School[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchSchools() {
    loading.value = true;
    error.value = null;
    try {
      const data = await schoolsAPI.getSchools();
      // backend returns array
      schools.value = data;
    } catch (err: any) {
      console.error("fetchSchools error", err);
      error.value = err?.response?.data?.message || err.message || "Failed to fetch schools";
    } finally {
      loading.value = false;
    }
  }

  async function createSchool(payload: CreateSchoolPayload) {
    loading.value = true;
    error.value = null;
    try {
      const res = await schoolsAPI.createSchool(payload);
      // push created school to list if returned
      if (res?.school) {
        schools.value.unshift(res.school);
      }
      return res;
    } catch (err: any) {
      console.error("createSchool error", err);
      error.value = err?.response?.data?.message || err.message || "Failed to create school";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateSchool(id: number | string, payload: UpdateSchoolPayload) {
    loading.value = true;
    error.value = null;
    try {
      const res = await schoolsAPI.updateSchool(id, payload);
      if (res?.school) {
        const idx = schools.value.findIndex(s => s.id === res.school.id);
        if (idx !== -1) schools.value[idx] = res.school;
      }
      return res;
    } catch (err: any) {
      console.error("updateSchool error", err);
      error.value = err?.response?.data?.message || err.message || "Failed to update school";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function removeSchool(id: number | string) {
    loading.value = true;
    error.value = null;
    try {
      const res = await schoolsAPI.deleteSchool(id);
      // remove from local list
      schools.value = schools.value.filter(s => s.id !== Number(id));
      return res;
    } catch (err: any) {
      console.error("removeSchool error", err);
      error.value = err?.response?.data?.message || err.message || "Failed to delete school";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    schools,
    loading,
    error,
    fetchSchools,
    createSchool,
    updateSchool,
    removeSchool,
  };
}
