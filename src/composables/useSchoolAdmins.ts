import { ref } from "vue";
import type { SchoolAdmin, CreateSchoolAdminPayload } from "@/services/schoolAdmins";
import * as schoolAdminsAPI from "@/services/schoolAdmins";

export function useSchoolAdmins() {
  const schoolAdmins = ref<SchoolAdmin[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchSchoolAdmins() {
    loading.value = true;
    error.value = null;
    try {
      schoolAdmins.value = await schoolAdminsAPI.getSchoolAdmins();
    } catch (err: any) {
      error.value =
        err?.response?.data?.message ||
        err.message ||
        "Failed to fetch school admins";
    } finally {
      loading.value = false;
    }
  }

  async function createSchoolAdmin(payload: CreateSchoolAdminPayload) {
    loading.value = true;
    error.value = null;
    try {
      const res = await schoolAdminsAPI.createSchoolAdmin(payload);
      await fetchSchoolAdmins();
      return res;
    } catch (err: any) {
      error.value =
        err?.response?.data?.message ||
        err.message ||
        "Failed to create school admin";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function removeSchoolAdmin(id: number) {
    loading.value = true;
    error.value = null;
    try {
      await schoolAdminsAPI.deleteSchoolAdmin(id);
      schoolAdmins.value = schoolAdmins.value.filter(sa => sa.id !== id);
    } catch (err: any) {
      error.value =
        err?.response?.data?.message ||
        err.message ||
        "Failed to delete school admin";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    schoolAdmins,
    loading,
    error,
    fetchSchoolAdmins,
    createSchoolAdmin,
    removeSchoolAdmin,
  };
}
