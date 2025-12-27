<template>
  <AdminLayout>
    <div class="p-6">

      <!-- Authorization alert -->
      <div
        v-if="unauthorized"
        class="bg-red-50 border border-red-200 p-4 rounded-md text-red-800"
      >
        You are not authorized to view this page.
      </div>

      <div v-else>
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-semibold text-gray-800 dark:text-white/90">
            Schools
          </h1>
          <Button
  variant="primary"
  size="md"
  @click="openAddModal"
>
  + Add School
</Button>

          <Button
  variant="outline"
  size="sm"
  @click="fetchSchools"
>
  Refresh
</Button>

        </div>

        <div v-if="loading" class="p-4">Loading...</div>
        <div
          v-if="error"
          class="p-4 bg-red-50 text-red-700 mb-4"
        >
          {{ error }}
        </div>

        <!-- ✅ CORRECT TailAdmin usage -->
        <ComponentCard title="Schools List">
          <div
            class="overflow-hidden rounded-xl border border-gray-200 bg-white
                   dark:border-gray-800 dark:bg-white/[0.03]"
          >
            <div class="max-w-full overflow-x-auto custom-scrollbar">
              <table class="min-w-full">

                <!-- HEADER -->
                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-700">
                    <th class="px-5 py-3 text-left sm:px-6">
                      <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">School</p>
                    </th>
                    <th class="px-5 py-3 text-left sm:px-6">
                      <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Address</p>
                    </th>
                    <th class="px-5 py-3 text-left sm:px-6">
                      <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Email</p>
                    </th>
                    <th class="px-5 py-3 text-left sm:px-6">
                      <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Admins</p>
                    </th>
                    <th class="px-5 py-3 text-left sm:px-6">
                      <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Actions</p>
                    </th>
                  </tr>
                </thead>

                <!-- BODY -->
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr
                    v-for="s in filteredSchools"
                    :key="s.id"
                    class="border-t border-gray-100 dark:border-gray-800"
                  >
                    <!-- School -->
                    <td class="px-5 py-4 sm:px-6">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                          <img
  v-if="s.logo"
  :src="storageUrl(s.logo)"
  class="h-12 w-12 object-contain"
/>
<div
  class="flex items-center justify-center
         h-10 w-10 rounded-full
         bg-gray-200 text-gray-700
         dark:bg-gray-800 dark:text-gray-200"
>
  <span class="text-xs font-semibold">
    {{ s.name?.charAt(0) }}
  </span>
</div>
                        </div>
                        <div>
                          <span class="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {{ s.name }}
                          </span>
                          <span class="block text-gray-500 text-theme-xs dark:text-gray-400">
                            {{ s.description }}
                          </span>
                        </div>
                      </div>
                    </td>

                    <!-- Address -->
                    <td class="px-5 py-4 sm:px-6">
                      <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                        {{ s.address }}
                      </p>
                    </td>

                    <!-- Email -->
                    <td class="px-5 py-4 sm:px-6">
                      <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                        {{ s.contact_email }}
                      </p>
                    </td>

                    <!-- Admins -->
                    <td class="px-5 py-4 sm:px-6">
                      <div v-if="s.admins?.length">
                        <div
                          v-for="adm in s.admins"
                          :key="adm.id"
                          class="text-theme-sm text-gray-800 dark:text-white/90"
                        >
                          {{ adm.user?.name || adm.user?.email }}
                        </div>
                      </div>
                      <span v-else class="text-theme-xs text-gray-400">
                        No admin
                      </span>
                    </td>

                    <!-- Actions -->
                    <td class="px-5 py-4 sm:px-6 space-x-2">
                      <Button
  variant="outline"
  size="sm"
  @click="openEditModal(s)"
>
  Edit
</Button>

                      <Button
  variant="outline"
  size="sm"
  className="!text-error-600 !dark:text-error-500"
  @click="confirmDelete(s)"
>
  Delete
</Button>

                      <router-link
  :to="`/super-admin/schools/${s.id}`"
  class="inline-flex items-center px-3 py-1 text-sm font-medium border rounded text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
>
  View
</router-link>


                    </td>
                  </tr>

                  <tr v-if="!filteredSchools.length && !loading">
                    <td
                      colspan="5"
                      class="px-5 py-6 text-center text-gray-500 dark:text-gray-400"
                    >
                      No schools found.
                    </td>
                  </tr>
                </tbody>

              </table>
            </div>
          </div>
        </ComponentCard>
      </div>
    <!-- Add School Modal -->
    <Modal v-if="showAdd" fullScreenBackdrop @close="closeAdd">
  <template #body>
    <div
      class="w-full max-w-3xl rounded-xl bg-white p-6 shadow-theme-sm
             dark:bg-gray-900"
    >
      <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white/90">
        Add School
      </h3>

      <form @submit.prevent="onCreate">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- School info -->
          <div class="space-y-3">
            <input v-model="form.school_name" placeholder="School Name" required class="input" />
            <input v-model="form.address" placeholder="Address" class="input" />
            <input v-model="form.contact_email" placeholder="Contact Email" type="email" class="input" />
            <textarea v-model="form.description" placeholder="Description" class="input h-24"></textarea>

            <label class="block">
              <div class="text-sm mb-1 text-gray-600 dark:text-gray-400">Logo (optional)</div>
              <input type="file" accept="image/*" @change="onLogoSelected" />
              <img
                v-if="form.logoPreview"
                :src="form.logoPreview"
                class="mt-2 w-24 h-24 object-cover rounded"
              />
            </label>
          </div>

          <!-- Admin info -->
          <div class="space-y-3">
            <div class="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Admin user
            </div>
            <input v-model="form.admin_name" placeholder="Admin name" required class="input" />
            <input v-model="form.admin_email" placeholder="Admin email" type="email" required class="input" />
            <input v-model="form.admin_password" placeholder="Admin password" type="password" required class="input" />
            <input v-model="form.admin_title" placeholder="Admin title" class="input" />
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-2">
          <Button variant="outline" size="sm" @click="closeAdd">
            Cancel
          </Button>
          <Button variant="primary" size="sm" :disabled="submitting">
            {{ submitting ? 'Creating…' : 'Create School' }}
          </Button>
        </div>
      </form>
    </div>
  </template>
</Modal>


    <!-- Edit School Modal -->
    <Modal v-if="showEdit" fullScreenBackdrop @close="closeEdit">
  <template #body>
    <div class="w-full max-w-xl rounded-xl bg-white p-6 shadow-theme-sm dark:bg-gray-900">
      <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white/90">
        Edit School
      </h3>

      <form @submit.prevent="onUpdate" class="space-y-3">
        <input v-model="editForm.school_name" class="input" placeholder="School Name" />
        <input v-model="editForm.address" class="input" placeholder="Address" />
        <input v-model="editForm.contact_email" type="email" class="input" placeholder="Email" />
        <textarea v-model="editForm.description" class="input h-24" placeholder="Description" />

        <input type="file" accept="image/*" @change="onEditLogoSelected" />
        <img
          v-if="editForm.logoPreview"
          :src="editForm.logoPreview"
          class="w-24 h-24 rounded object-cover mt-2"
        />

        <div class="flex justify-end gap-2 mt-4">
          <Button variant="outline" size="sm" @click="closeEdit">
            Cancel
          </Button>
          <Button variant="primary" size="sm" :disabled="submitting">
            {{ submitting ? 'Updating…' : 'Update' }}
          </Button>
        </div>
      </form>
    </div>
  </template>
</Modal>


    <!-- Delete Confirmation -->
    <Modal v-if="showDeleteConfirm" fullScreenBackdrop @close="cancelDelete">
  <template #body>
    <div class="w-full max-w-md rounded-xl bg-white p-6 shadow-theme-sm dark:bg-gray-900">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-3">
        Confirm Delete
      </h3>

      <p class="text-gray-600 dark:text-gray-400">
        Are you sure you want to delete
        <strong>{{ deleteTarget?.name }}</strong>?
      </p>

      <div class="mt-6 flex justify-end gap-2">
        <Button variant="outline" size="sm" @click="cancelDelete">
          Cancel
        </Button>
        <Button
          variant="primary"
          size="sm"
          className="!bg-error-600 hover:!bg-error-700"
          :disabled="submitting"
          @click="onDelete"
        >
          {{ submitting ? 'Deleting…' : 'Delete' }}
        </Button>
      </div>
    </div>
  </template>
</Modal>


  </div>
</AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import Button from '@/components/ui/Button.vue';
import Modal from '@/components/ui/Modal.vue';
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useSchools } from "@/composables/useSchools";
import { userToken, setUserToken, userRoleId } from "@/composables/useAuth";
import { resolveStorageUrl } from "@/utils/files";
import { storageUrl } from "@/utils/storage";

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

  // Save file for upload
  form.value.logo = file as any;

  // Preview only
  form.value.logoPreview = URL.createObjectURL(file);
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
  logo: form.value.logo, // <-- FILE now
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

  editForm.value.logo = file as any;
  editForm.value.logoPreview = URL.createObjectURL(file);
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
  background-color: white;
  color: #111827; /* text-gray-900 */

  /* placeholder */
  ::placeholder {
    color: #9ca3af; /* gray-400 */
  }
}

/* dark mode */
:global(.dark) .input {
  background-color: #111827; /* gray-900 */
  border-color: #374151; /* gray-700 */
  color: #f9fafb; /* gray-50 */

  ::placeholder {
    color: #6b7280; /* gray-500 */
  }
}


</style>
