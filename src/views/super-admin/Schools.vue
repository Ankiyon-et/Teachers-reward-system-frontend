<template>
  <admin-layout>
  <div class="p-6">
    <!-- Authorization alert -->
    <div v-if="unauthorized" class="bg-red-50 border border-red-200 p-4 rounded-md text-red-800">
      You are not authorized to view this page.
    </div>

    <div v-else>
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-semibold">Schools</h1>
        <div>
          <button class="btn-primary px-4 py-2 rounded" @click="openAddModal">
            + Add School
          </button>
        </div>
      </div>

      <!-- simple search -->
      <div class="mb-4 flex gap-3 items-center">
        <input v-model="search" placeholder="Search schools..." class="border rounded px-3 py-2 w-72" />
        <button @click="fetchSchools" class="btn-outline px-3 py-2 rounded">Refresh</button>
      </div>

      <div v-if="loading" class="p-4">Loading...</div>

      <div v-if="error" class="p-4 bg-red-50 text-red-700 mb-4">{{ error }}</div>

      <!-- Table -->
      <div class="bg-white border rounded shadow-sm overflow-x-auto">
        <table class="min-w-full">
          <thead class="bg-gray-50 text-left">
            <tr>
              <th class="p-3">#</th>
              <th class="p-3">Name</th>
              <th class="p-3">Address</th>
              <th class="p-3">Contact Email</th>
              <th class="p-3">Admins</th>
              <th class="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(s, idx) in filteredSchools" :key="s.id" class="border-t hover:bg-gray-50">
              <td class="p-3">{{ idx + 1 }}</td>
              <td class="p-3">
                <div class="flex items-center gap-3">
                  <img v-if="s.logo" :src="s.logo" alt="logo" class="w-10 h-10 object-cover rounded" />
                  <div>
                    <div class="font-medium">{{ s.name }}</div>
                    <div class="text-xs text-gray-500">{{ s.description }}</div>
                  </div>
                </div>
              </td>
              <td class="p-3">{{ s.address }}</td>
              <td class="p-3">{{ s.contact_email }}</td>
              <td class="p-3">
                <div v-if="s.admins?.length">
                  <div v-for="adm in s.admins" :key="adm.id" class="text-sm">
                    {{ adm.user?.name || adm.user?.email }} — <span class="text-xs text-gray-500">{{ adm.title }}</span>
                  </div>
                </div>
                <div v-else class="text-sm text-gray-400">No admin</div>
              </td>
              <td class="p-3 space-x-2">
                <button class="px-3 py-1 border rounded text-sm" @click="openEditModal(s)">Edit</button>
                <button class="px-3 py-1 border rounded text-sm text-red-600" @click="confirmDelete(s)">Delete</button>
                <router-link :to="`/super-admin/schools/${s.id}`" class="px-3 py-1 border rounded text-sm">View</router-link>
              </td>
            </tr>

            <tr v-if="!filteredSchools.length && !loading">
              <td colspan="6" class="p-6 text-center text-gray-500">No schools found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add School Modal -->
    <div v-if="showAdd" class="modal-backdrop">
      <div class="modal">
        <h3 class="text-lg font-semibold mb-3">Add School</h3>
        <form @submit.prevent="onCreate">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
  <!-- school info -->
  <div class="space-y-3">
    <input v-model="form.school_name" placeholder="School Name" required class="input" />
    <input v-model="form.address" placeholder="Address" class="input" />
    <input v-model="form.contact_email" placeholder="Contact Email" type="email" class="input" />
    <textarea v-model="form.description" placeholder="Description" class="input h-24"></textarea>
    <label class="block">
      <div class="text-sm mb-1">Logo (optional)</div>
      <input type="file" accept="image/*" @change="onLogoSelected" />
      <div v-if="form.logoPreview" class="mt-2">
        <img :src="form.logoPreview" class="w-24 h-24 object-cover rounded" />
      </div>
    </label>
  </div>

  <!-- admin info -->
  <div class="space-y-3">
    <div class="text-sm font-semibold">Admin user (will be created)</div>
    <input v-model="form.admin_name" placeholder="Admin name" required class="input" />
    <input v-model="form.admin_email" placeholder="Admin email" type="email" required class="input" />
    <input v-model="form.admin_password" placeholder="Admin password" type="password" required class="input" />
    <input v-model="form.admin_title" placeholder="Admin title (e.g. Principal)" class="input" />
  </div>
</div>


          <div class="mt-4 flex justify-end gap-2">
            <button type="button" class="btn-secondary px-3 py-1 rounded" @click="closeAdd">Cancel</button>
            <button type="submit" class="btn-primary px-4 py-1 rounded" :disabled="submitting">
              {{ submitting ? "Creating..." : "Create School" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit School Modal -->
    <div v-if="showEdit" class="modal-backdrop">
      <div class="modal">
        <h3 class="text-lg font-semibold mb-3">Edit School</h3>
        <form @submit.prevent="onUpdate">
          <div class="grid grid-cols-1 gap-3">
            <input v-model="editForm.school_name" placeholder="School Name" required class="input" />
            <input v-model="editForm.address" placeholder="Address" class="input" />
            <input v-model="editForm.contact_email" placeholder="Contact Email" type="email" class="input" />
            <textarea v-model="editForm.description" placeholder="Description" class="input h-24"></textarea>

            <label class="block">
              <div class="text-sm mb-1">Logo (optional)</div>
              <input type="file" accept="image/*" @change="onEditLogoSelected" />
              <div v-if="editForm.logoPreview" class="mt-2">
                <img :src="editForm.logoPreview" class="w-24 h-24 object-cover rounded" />
              </div>
            </label>
          </div>

          <div class="mt-4 flex justify-end gap-2">
            <button type="button" class="btn-secondary px-3 py-1 rounded" @click="closeEdit">Cancel</button>
            <button type="submit" class="btn-primary px-4 py-1 rounded" :disabled="submitting">
              {{ submitting ? "Updating..." : "Update School" }}
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
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useSchools } from "@/composables/useSchools";
import { userToken, setUserToken, userRoleId } from "@/composables/useAuth";

// role guard: super admin role id is 1 (per your sidebar)
const router = useRouter();
const unauthorized = ref(false);

import { watch } from "vue";

watch(
  userRoleId,
  (role) => {
    if (role !== 1) {
      unauthorized.value = true;
      router.replace("/");
    } else {
      unauthorized.value = false;
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (!userToken.value) {
    router.replace('/login'); // redirect to login if no token
  } else if (userRoleId.value === 1) {
    fetchSchools(); // only fetch if superadmin
  }
});



// composable
const { schools, loading, error, fetchSchools, createSchool, updateSchool, removeSchool } = useSchools();

// search
const search = ref("");

// filtered list
const filteredSchools = computed(() => {
  if (!search.value) return schools.value;
  const q = search.value.toLowerCase();
  return schools.value.filter(s => {
    return (
      (s.name || "").toLowerCase().includes(q) ||
      (s.address || "").toLowerCase().includes(q) ||
      (s.contact_email || "").toLowerCase().includes(q)
    );
  });
});

onMounted(() => {
  if (userRoleId.value === 1) {
    fetchSchools();
  }
});


// ADD modal state
const showAdd = ref(false);
const form = ref({
  school_name: "",
  address: "",
  contact_email: "",
  description: "",
  logo: null as string | null,
  logoPreview: null as string | null,
  admin_name: "",
  admin_email: "",
  admin_password: "",
  admin_title: "",
});
const submitting = ref(false);

function openAddModal() {
  showAdd.value = true;
  resetForm();
}
function closeAdd() {
  showAdd.value = false;
}

function resetForm() {
  form.value = {
    school_name: "",
    address: "",
    contact_email: "",
    description: "",
    logo: null,
    logoPreview: null,
    admin_name: "",
    admin_email: "",
    admin_password: "",
    admin_title: "",
  };
}

async function onLogoSelected(e: Event) {
  const input = e.target as HTMLInputElement;
  if (!input.files?.length) return;
  const file = input.files[0];
  form.value.logoPreview = await fileToDataUrl(file);
  form.value.logo = form.value.logoPreview;
}

async function onCreate() {
  submitting.value = true;
  try {
    // validate minimal fields
    if (!form.value.school_name || !form.value.admin_name || !form.value.admin_email || !form.value.admin_password) {
      alert("Please fill required fields.");
      return;
    }

    const payload = {
      school_name: form.value.school_name,
      address: form.value.address,
      contact_email: form.value.contact_email,
      description: form.value.description,
      logo: form.value.logo, // base64 or null
      admin_name: form.value.admin_name,
      admin_email: form.value.admin_email,
      admin_password: form.value.admin_password,
      admin_title: form.value.admin_title,
    };

    const res = await createSchool(payload);
    // optionally show message
    alert(res?.message || "School created");
    closeAdd();
    await fetchSchools();
  } catch (err: any) {
    console.error(err);
    alert(err?.response?.data?.message || err.message || "Failed to create");
  } finally {
    submitting.value = false;
  }
}

// EDIT modal state
const showEdit = ref(false);
const editForm = ref({
  id: null as number | null,
  school_name: "",
  address: "",
  contact_email: "",
  description: "",
  logo: null as string | null,
  logoPreview: null as string | null,
});

function openEditModal(s: any) {
  editForm.value.id = s.id;
  editForm.value.school_name = s.name || "";
  editForm.value.address = s.address || "";
  editForm.value.contact_email = s.contact_email || "";
  editForm.value.description = s.description || "";
  editForm.value.logo = s.logo || null;
  editForm.value.logoPreview = s.logo || null;
  showEdit.value = true;
}

function closeEdit() {
  showEdit.value = false;
}

async function onEditLogoSelected(e: Event) {
  const input = e.target as HTMLInputElement;
  if (!input.files?.length) return;
  const file = input.files[0];
  editForm.value.logoPreview = await fileToDataUrl(file);
  editForm.value.logo = editForm.value.logoPreview;
}

async function onUpdate() {
  if (!editForm.value.id) return;
  submitting.value = true;
  try {
    const payload: Record<string, any> = {};
    if (editForm.value.school_name) payload.school_name = editForm.value.school_name;
    if (editForm.value.address) payload.address = editForm.value.address;
    if (editForm.value.contact_email) payload.contact_email = editForm.value.contact_email;
    if (editForm.value.description) payload.description = editForm.value.description;
    if (editForm.value.logo) payload.logo = editForm.value.logo;

    const res = await updateSchool(editForm.value.id, payload);
    alert(res?.message || "Updated");
    closeEdit();
    await fetchSchools();
  } catch (err: any) {
    console.error(err);
    alert(err?.response?.data?.message || err.message || "Failed to update");
  } finally {
    submitting.value = false;
  }
}

// DELETE
const showDeleteConfirm = ref(false);
const deleteTarget = ref<any | null>(null);

function confirmDelete(s: any) {
  deleteTarget.value = s;
  showDeleteConfirm.value = true;
}

function cancelDelete() {
  deleteTarget.value = null;
  showDeleteConfirm.value = false;
}

async function onDelete() {
  if (!deleteTarget.value) return;
  submitting.value = true;
  try {
    const res = await removeSchool(deleteTarget.value.id);
    alert(res?.message || "Deleted");
    showDeleteConfirm.value = false;
    deleteTarget.value = null;
  } catch (err: any) {
    console.error(err);
    alert(err?.response?.data?.message || err.message || "Failed to delete");
  } finally {
    submitting.value = false;
  }
}

// small helper: convert file to data URL (base64)
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("File read error"));
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
}
</script>

<style scoped>
/* minimal styling; replace with your design system classes */
.input {
  border: 1px solid #e5e7eb;
  padding: 0.5rem;
  border-radius: 0.35rem;
  width: 100%;
}
.btn-primary {
  background: #0ea5a4;
  color: white;
}
.btn-secondary {
  background: white;
  border: 1px solid #e5e7eb;
}

/* modal quick styles */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
  padding: 1rem;
}
.modal {
  background: white;
  max-width: 700px;
  width: 100%;
  padding: 1.25rem;
  border-radius: 0.5rem;
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
}
</style>
