<template>
  <admin-layout>
    <div class="p-6">
      <div v-if="unauthorized" class="bg-red-50 border border-red-200 p-4 rounded-md text-red-800">
        You are not authorized to view this page.
      </div>

      <div v-else>
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-semibold">SuperAdmins</h1>
          <button class="btn-primary px-4 py-2 rounded" @click="openAddModal">+ Add SuperAdmin</button>
        </div>

        <div class="mb-4 flex gap-3 items-center">
          <input v-model="search" placeholder="Search superadmins..." class="border rounded px-3 py-2 w-72" />
          <button @click="fetchSuperAdmins" class="btn-outline px-3 py-2 rounded">Refresh</button>
        </div>

        <div v-if="loading" class="p-4">Loading...</div>
        <div v-if="error" class="p-4 bg-red-50 text-red-700 mb-4">{{ error }}</div>

        <div class="bg-white border rounded shadow-sm overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gray-50 text-left">
              <tr>
                <th class="p-3">#</th>
                <th class="p-3">Name</th>
                <th class="p-3">Email</th>
                <th class="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(sa, idx) in filteredSuperAdmins" :key="sa.id" class="border-t hover:bg-gray-50">
                <td class="p-3">{{ idx + 1 }}</td>
                <td class="p-3">{{ sa.name }}</td>
                <td class="p-3">{{ sa.email }}</td>
                <td class="p-3 space-x-2">
                  <button class="px-3 py-1 border rounded text-sm" @click="openEditModal(sa)">Edit</button>
                  <button class="px-3 py-1 border rounded text-sm text-red-600" @click="confirmDelete(sa)">Delete</button>
                </td>
              </tr>
              <tr v-if="!filteredSuperAdmins.length && !loading">
                <td colspan="4" class="p-6 text-center text-gray-500">No superadmins found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add SuperAdmin Modal -->
      <div v-if="showAdd" class="modal-backdrop">
        <div class="modal">
          <h3 class="text-lg font-semibold mb-3">Add SuperAdmin</h3>
          <form @submit.prevent="onCreate">
            <div class="grid grid-cols-1 gap-3">
              <input v-model="form.name" placeholder="Name" required class="input" />
              <input v-model="form.email" placeholder="Email" type="email" required class="input" />
              <input v-model="form.password" placeholder="Password" type="password" required class="input" />
            </div>

            <div class="mt-4 flex justify-end gap-2">
              <button type="button" class="btn-secondary px-3 py-1 rounded" @click="closeAdd">Cancel</button>
              <button type="submit" class="btn-primary px-4 py-1 rounded" :disabled="submitting">
                {{ submitting ? "Creating..." : "Create SuperAdmin" }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Edit SuperAdmin Modal -->
      <div v-if="showEdit" class="modal-backdrop">
        <div class="modal">
          <h3 class="text-lg font-semibold mb-3">Edit SuperAdmin</h3>
          <form @submit.prevent="onUpdate">
            <div class="grid grid-cols-1 gap-3">
              <input v-model="editForm.name" placeholder="Name" required class="input" />
              <input v-model="editForm.email" placeholder="Email" type="email" required class="input" />
            </div>

            <div class="mt-4 flex justify-end gap-2">
              <button type="button" class="btn-secondary px-3 py-1 rounded" @click="closeEdit">Cancel</button>
              <button type="submit" class="btn-primary px-4 py-1 rounded" :disabled="submitting">
                {{ submitting ? "Updating..." : "Update SuperAdmin" }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Confirmation -->
      <div v-if="showDeleteConfirm" class="modal-backdrop">
        <div class="modal">
          <h3 class="text-lg font-semibold mb-3">Confirm Delete</h3>
          <p>Are you sure you want to delete <strong>{{ deleteTarget?.name }}</strong>?</p>
          <div class="mt-4 flex justify-end gap-2">
            <button class="btn-secondary px-3 py-1 rounded" @click="cancelDelete">Cancel</button>
            <button class="px-3 py-1 rounded border text-red-600" @click="onDelete" :disabled="submitting">
              {{ submitting ? "Deleting..." : "Delete" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import AdminLayout from "@/components/layout/AdminLayout.vue";
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import type { SuperAdmin, CreateSuperAdminPayload, UpdateSuperAdminPayload } from "@/services/superadmins";
import { useSuperAdmins } from "@/composables/useSuperAdmins";
import { userToken, userRoleId } from "@/composables/useAuth";

const router = useRouter();
const unauthorized = ref(false);

// Role guard
watch(userRoleId, (role) => {
  if (role !== 1) {
    unauthorized.value = true;
    router.replace("/");
  } else {
    unauthorized.value = false;
  }
}, { immediate: true });

// Composable
const { superAdmins, loading, error, fetchSuperAdmins, createSuperAdmin, updateSuperAdmin, removeSuperAdmin } = useSuperAdmins();

// Search
const search = ref("");
const filteredSuperAdmins = computed<SuperAdmin[]>(() => {
  if (!search.value) return superAdmins.value;
  const q = search.value.toLowerCase();
  return superAdmins.value.filter(sa =>
    (sa.name || "").toLowerCase().includes(q) ||
    (sa.email || "").toLowerCase().includes(q)
  );
});

// Add
const showAdd = ref(false);
const form = ref<CreateSuperAdminPayload>({ name: "", email: "", password: "" });
const submitting = ref(false);

function openAddModal() {
  showAdd.value = true;
  form.value = { name: "", email: "", password: "" };
}
function closeAdd() { showAdd.value = false; }

async function onCreate() {
  submitting.value = true;
  try {
    if (!form.value.name || !form.value.email || !form.value.password) {
      alert("Please fill required fields.");
      return;
    }
    const res = await createSuperAdmin(form.value);
    alert(res?.message || "SuperAdmin created");
    closeAdd();
    fetchSuperAdmins();
  } catch (err: any) {
    alert(err?.response?.data?.message || err.message || "Failed to create");
  } finally { submitting.value = false; }
}

// Edit
const showEdit = ref(false);
const editForm = ref({ id: null as number | null, name: "", email: "" });

function openEditModal(sa: SuperAdmin) {
  editForm.value.id = sa.id ?? null;
  editForm.value.name = sa.name ?? "";
  editForm.value.email = sa.email ?? "";
  showEdit.value = true;
}
function closeEdit() { showEdit.value = false; }

async function onUpdate() {
  if (editForm.value.id === null) return;
  submitting.value = true;
  try {
    const payload: UpdateSuperAdminPayload = { name: editForm.value.name, email: editForm.value.email };
    const res = await updateSuperAdmin(editForm.value.id, payload);
    alert(res?.message || "SuperAdmin updated");
    closeEdit();
    fetchSuperAdmins();
  } catch (err: any) {
    alert(err?.response?.data?.message || err.message || "Failed to update");
  } finally { submitting.value = false; }
}

// Delete
const showDeleteConfirm = ref(false);
const deleteTarget = ref<SuperAdmin | null>(null);

function confirmDelete(sa: SuperAdmin) { deleteTarget.value = sa; showDeleteConfirm.value = true; }
function cancelDelete() { deleteTarget.value = null; showDeleteConfirm.value = false; }

async function onDelete() {
  if (!deleteTarget.value?.id) return;
  submitting.value = true;
  try {
    const res = await removeSuperAdmin(deleteTarget.value.id);
    alert(res?.message || "SuperAdmin deleted");
    showDeleteConfirm.value = false;
    deleteTarget.value = null;
  } catch (err: any) {
    alert(err?.response?.data?.message || err.message || "Failed to delete");
  } finally { submitting.value = false; }
}

// Initial fetch
onMounted(() => {
  if (!userToken.value) router.replace("/login");
  else if (userRoleId.value === 1) fetchSuperAdmins();
});
</script>

<style scoped>
.input { border: 1px solid #e5e7eb; padding: 0.5rem; border-radius: 0.35rem; width: 100%; }
.btn-primary { background: #0ea5a4; color: white; }
.btn-secondary { background: white; border: 1px solid #e5e7eb; }
.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 60; padding: 1rem; }
.modal { background: white; max-width: 500px; width: 100%; padding: 1.25rem; border-radius: 0.5rem; box-shadow: 0 8px 20px rgba(0,0,0,0.08); }
</style>
