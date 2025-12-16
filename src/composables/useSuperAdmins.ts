// src/composables/useSuperAdmins.ts
import { ref } from "vue";
import type { SuperAdmin, CreateSuperAdminPayload, UpdateSuperAdminPayload } from "@/services/superadmins";
import * as superAdminsAPI from "@/services/superadmins";

export function useSuperAdmins() {
  const superAdmins = ref<SuperAdmin[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchSuperAdmins() {
    loading.value = true;
    error.value = null;
    try {
      const data = await superAdminsAPI.getSuperAdmins();
      superAdmins.value = data;
    } catch (err: any) {
      console.error("fetchSuperAdmins error", err);
      error.value = err?.response?.data?.message || err.message || "Failed to fetch superadmins";
    } finally {
      loading.value = false;
    }
  }

  async function createSuperAdmin(payload: CreateSuperAdminPayload) {
    loading.value = true;
    error.value = null;
    try {
      const res = await superAdminsAPI.createSuperAdmin(payload);
      if (res?.user) superAdmins.value.unshift(res.user);
      return res;
    } catch (err: any) {
      console.error("createSuperAdmin error", err);
      error.value = err?.response?.data?.message || err.message || "Failed to create superadmin";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateSuperAdmin(id: number | string, payload: UpdateSuperAdminPayload) {
    loading.value = true;
    error.value = null;
    try {
      const res = await superAdminsAPI.updateSuperAdmin(id, payload);
      if (res?.user) {
        const idx = superAdmins.value.findIndex(sa => sa.id === res.user.id);
        if (idx !== -1) superAdmins.value[idx] = res.user;
      }
      return res;
    } catch (err: any) {
      console.error("updateSuperAdmin error", err);
      error.value = err?.response?.data?.message || err.message || "Failed to update superadmin";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function removeSuperAdmin(id: number | string) {
    loading.value = true;
    error.value = null;
    try {
      const res = await superAdminsAPI.deleteSuperAdmin(id);
      superAdmins.value = superAdmins.value.filter(sa => sa.id !== Number(id));
      return res;
    } catch (err: any) {
      console.error("removeSuperAdmin error", err);
      error.value = err?.response?.data?.message || err.message || "Failed to delete superadmin";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    superAdmins,
    loading,
    error,
    fetchSuperAdmins,
    createSuperAdmin,
    updateSuperAdmin,
    removeSuperAdmin,
  };
}
