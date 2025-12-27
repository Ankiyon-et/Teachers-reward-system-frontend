<template>
  <AdminLayout>
    <div class="p-6">

      <!-- Unauthorized -->
      <div
        v-if="unauthorized"
        class="bg-red-50 border border-red-200 p-4 rounded-md text-red-800
               dark:bg-red-900/20 dark:border-red-800 dark:text-red-400"
      >
        You are not authorized to view this page.
      </div>

      <div v-else>
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-semibold text-gray-800 dark:text-white/90">
            School Admins
          </h1>

          <Button variant="primary" size="md" @click="openAddModal">
            + Add School Admin
          </Button>
        </div>

        <!-- Search -->
        <div class="mb-4 flex gap-3 items-center">
          <input
            v-model="search"
            placeholder="Search admins..."
            class="input w-72"
          />

          <Button variant="outline" size="sm" @click="fetchSchoolAdmins">
            Refresh
          </Button>
        </div>

        <div v-if="loading" class="p-4 text-gray-500 dark:text-gray-400">
          Loading...
        </div>

        <div
          v-if="error"
          class="p-4 bg-red-50 text-red-700 mb-4
                 dark:bg-red-900/20 dark:text-red-400"
        >
          {{ error }}
        </div>

        <!-- Table -->
        <div
          class="overflow-hidden rounded-xl border border-gray-200 bg-white
                 dark:border-gray-800 dark:bg-white/[0.03]"
        >
          <div class="max-w-full overflow-x-auto">
            <table class="min-w-full">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <th class="px-5 py-3 text-left text-theme-xs text-gray-500 dark:text-gray-400">#</th>
                  <th class="px-5 py-3 text-left text-theme-xs text-gray-500 dark:text-gray-400">Name</th>
                  <th class="px-5 py-3 text-left text-theme-xs text-gray-500 dark:text-gray-400">Email</th>
                  <th class="px-5 py-3 text-left text-theme-xs text-gray-500 dark:text-gray-400">Title</th>
                  <th class="px-5 py-3 text-left text-theme-xs text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>

              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="(sa, idx) in filteredAdmins" :key="sa.id">
                  <td class="px-5 py-4">{{ idx + 1 }}</td>
                  <td class="px-5 py-4 font-medium">
                    {{ sa.user.name }}
                  </td>
                  <td class="px-5 py-4 text-gray-500">
                    {{ sa.user.email }}
                  </td>
                  <td class="px-5 py-4 text-gray-500">
                    {{ sa.title }}
                  </td>
                  <td class="px-5 py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="!text-error-600 dark:!text-error-500"
                      @click="confirmDelete(sa)"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>

                <tr v-if="!filteredAdmins.length && !loading">
                  <td colspan="5" class="px-5 py-6 text-center text-gray-500">
                    No school admins found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ADD MODAL -->
      <Modal v-if="showAdd" fullScreenBackdrop @close="closeAdd">
        <template #body>
          <div class="w-full max-w-lg rounded-xl bg-white p-6 dark:bg-white/[0.03]">
            <h3 class="mb-4 text-lg font-semibold">Add School Admin</h3>

            <form @submit.prevent="onCreate" class="space-y-3">
              <input v-model="form.name" placeholder="Name" class="input" />
              <input v-model="form.email" placeholder="Email" type="email" class="input" />
              <input v-model="form.password" placeholder="Password" type="password" class="input" />
              <input v-model="form.title" placeholder="Title" class="input" />

              <div class="flex justify-end gap-2 mt-6">
                <Button variant="outline" size="sm" @click="closeAdd">Cancel</Button>
                <Button variant="primary" size="sm" :disabled="submitting">
                  {{ submitting ? "Creating…" : "Create" }}
                </Button>
              </div>
            </form>
          </div>
        </template>
      </Modal>

      <!-- DELETE MODAL -->
      <Modal v-if="showDeleteConfirm" fullScreenBackdrop @close="cancelDelete">
        <template #body>
          <div class="w-full max-w-md rounded-xl bg-white p-6 dark:bg-white/[0.03]">
            <h3 class="mb-3 text-lg font-semibold">Confirm Delete</h3>
            <p>Delete <strong>{{ deleteTarget?.user.name }}</strong>?</p>

            <div class="flex justify-end gap-2 mt-6">
              <Button variant="outline" size="sm" @click="cancelDelete">Cancel</Button>
              <Button
                variant="primary"
                size="sm"
                className="!bg-error-600 hover:!bg-error-700"
                :disabled="submitting"
                @click="onDelete"
              >
                {{ submitting ? "Deleting…" : "Delete" }}
              </Button>
            </div>
          </div>
        </template>
      </Modal>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from "@/components/layout/AdminLayout.vue";
import Button from "@/components/ui/Button.vue";
import Modal from "@/components/ui/Modal.vue";
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useSchoolAdmins } from "@/composables/useSchoolAdmins";
import { userToken, userRoleId } from "@/composables/useAuth";

const router = useRouter();
const unauthorized = ref(false);

// School admin role = 2
watch(
  userRoleId,
  role => {
    if (role !== 2) {
      unauthorized.value = true;
      router.replace("/");
    }
  },
  { immediate: true }
);

const {
  schoolAdmins,
  loading,
  error,
  fetchSchoolAdmins,
  createSchoolAdmin,
  removeSchoolAdmin,
} = useSchoolAdmins();

const search = ref("");
const filteredAdmins = computed(() => {
  if (!search.value) return schoolAdmins.value;
  const q = search.value.toLowerCase();
  return schoolAdmins.value.filter(sa =>
    sa.user.name.toLowerCase().includes(q) ||
    sa.user.email.toLowerCase().includes(q)
  );
});

// ADD
const showAdd = ref(false);
const form = ref({ name: "", email: "", password: "", title: "" });
const submitting = ref(false);

function openAddModal() {
  showAdd.value = true;
  form.value = { name: "", email: "", password: "", title: "" };
}
function closeAdd() {
  showAdd.value = false;
}

async function onCreate() {
  submitting.value = true;
  try {
    await createSchoolAdmin(form.value);
    closeAdd();
  } finally {
    submitting.value = false;
  }
}

// DELETE
const showDeleteConfirm = ref(false);
const deleteTarget = ref<any>(null);

function confirmDelete(sa: any) {
  deleteTarget.value = sa;
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
    await removeSchoolAdmin(deleteTarget.value.id);
    cancelDelete();
  } finally {
    submitting.value = false;
  }
}

onMounted(() => {
  if (!userToken.value) router.replace("/login");
  else if (userRoleId.value === 2) fetchSchoolAdmins();
});
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
  background-color: white;
  color: #111827;
}
.dark .input {
  background-color: rgba(255, 255, 255, 0.03);
  border-color: #1f2937;
  color: #e5e7eb;
}
</style>
