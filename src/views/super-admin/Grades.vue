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
            Grades
          </h1>

          <Button variant="primary" size="md" @click="openAddModal">
            + Add Grade
          </Button>
          <Button variant="outline" size="sm" @click="fetchGrades">
            Refresh
          </Button>
        </div>

        <!-- Loading / Error -->
        <div v-if="loading" class="p-4">Loading...</div>
        <div v-if="error" class="p-4 bg-red-50 text-red-700 mb-4">{{ error }}</div>

        <!-- Grades Table -->
        <ComponentCard title="Grades List">
          <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div class="max-w-full overflow-x-auto custom-scrollbar">
              <table class="min-w-full">

                <!-- HEADER -->
                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-700">
                    <th class="px-5 py-3 text-left">ID</th>
                    <th class="px-5 py-3 text-left">Grade Name</th>
                    <th class="px-5 py-3 text-left">Actions</th>
                  </tr>
                </thead>

                <!-- BODY -->
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="g in grades" :key="g.id" class="border-t border-gray-100 dark:border-gray-800">
                    <td class="px-5 py-4">{{ g.id }}</td>
                    <td class="px-5 py-4">{{ g.name }}</td>
                    <td class="px-5 py-4 space-x-2">
                      <Button variant="outline" size="sm" @click="openEditModal(g)">Edit</Button>
                      <Button variant="outline" size="sm" className="!text-error-600 !dark:text-error-500" @click="confirmDelete(g)">
                        Delete
                      </Button>
                    </td>
                  </tr>

                  <tr v-if="!grades.length && !loading">
                    <td colspan="3" class="px-5 py-6 text-center text-gray-500 dark:text-gray-400">
                      No grades found.
                    </td>
                  </tr>
                </tbody>

              </table>
            </div>
          </div>
        </ComponentCard>
      </div>

      <!-- Add Grade Modal -->
      <Modal v-if="showAdd" fullScreenBackdrop @close="closeAdd">
        <template #body>
          <div class="w-full max-w-md rounded-xl bg-white p-6 shadow-theme-sm dark:bg-gray-900">
            <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white/90">Add Grade</h3>
            <form @submit.prevent="onCreate">
              <input v-model="form.name" placeholder="Grade Name" required class="input" />
              <div class="mt-4 flex justify-end gap-2">
                <Button variant="outline" size="sm" @click="closeAdd">Cancel</Button>
                <Button variant="primary" size="sm" :disabled="submitting">{{ submitting ? 'Creating…' : 'Create' }}</Button>
              </div>
            </form>
          </div>
        </template>
      </Modal>

      <!-- Edit Grade Modal -->
      <Modal v-if="showEdit" fullScreenBackdrop @close="closeEdit">
        <template #body>
          <div class="w-full max-w-md rounded-xl bg-white p-6 shadow-theme-sm dark:bg-gray-900">
            <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white/90">Edit Grade</h3>
            <form @submit.prevent="onUpdate">
              <input v-model="editForm.name" placeholder="Grade Name" required class="input" />
              <div class="mt-4 flex justify-end gap-2">
                <Button variant="outline" size="sm" @click="closeEdit">Cancel</Button>
                <Button variant="primary" size="sm" :disabled="submitting">{{ submitting ? 'Updating…' : 'Update' }}</Button>
              </div>
            </form>
          </div>
        </template>
      </Modal>

      <!-- Delete Confirmation -->
      <Modal v-if="showDeleteConfirm" fullScreenBackdrop @close="cancelDelete">
        <template #body>
          <div class="w-full max-w-md rounded-xl bg-white p-6 shadow-theme-sm dark:bg-gray-900">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-3">Confirm Delete</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Are you sure you want to delete <strong>{{ deleteTarget?.name }}</strong>?
            </p>
            <div class="mt-6 flex justify-end gap-2">
              <Button variant="outline" size="sm" @click="cancelDelete">Cancel</Button>
              <Button variant="primary" size="sm" className="!bg-error-600 hover:!bg-error-700" :disabled="submitting" @click="onDelete">
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
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useGrades } from "@/composables/useGrades";
import { userToken, userRoleId } from "@/composables/useAuth";

// role guard
const router = useRouter();
const unauthorized = ref(false);

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

const { grades, loading, error, fetchGrades, addGrade, updateGrade, removeGrade } = useGrades();

// Only fetch grades if token exists and role is superadmin
onMounted(() => {
  if (!userToken.value) {
    router.replace("/login");
    return;
  }
  if (userRoleId.value === 1) {
    fetchGrades();
  }
});

// Add Grade modal
const showAdd = ref(false);
const form = ref({ name: "" });
const submitting = ref(false);

function openAddModal() {
  showAdd.value = true;
  form.value.name = "";
}
function closeAdd() { showAdd.value = false; }

async function onCreate() {
  submitting.value = true;
  try {
    await addGrade(form.value.name);
    closeAdd();
  } catch (err: any) { alert(err?.message || "Failed to add grade"); }
  finally { submitting.value = false; }
}

// Edit Grade modal
const showEdit = ref(false);
const editForm = ref({ id: 0, name: "" });

function openEditModal(g: any) {
  editForm.value.id = g.id;
  editForm.value.name = g.name;
  showEdit.value = true;
}
function closeEdit() { showEdit.value = false; }

async function onUpdate() {
  submitting.value = true;
  try {
    await updateGrade(editForm.value.id, editForm.value.name);
    closeEdit();
  } catch (err: any) { alert(err?.message || "Failed to update grade"); }
  finally { submitting.value = false; }
}

// Delete modal
const showDeleteConfirm = ref(false);
const deleteTarget = ref<any | null>(null);

function confirmDelete(g: any) { deleteTarget.value = g; showDeleteConfirm.value = true; }
function cancelDelete() { deleteTarget.value = null; showDeleteConfirm.value = false; }

async function onDelete() {
  if (!deleteTarget.value) return;
  submitting.value = true;
  try {
    await removeGrade(deleteTarget.value.id);
    cancelDelete();
  } catch (err: any) { alert(err?.message || "Failed to delete grade"); }
  finally { submitting.value = false; }
}
</script>

<style scoped>
.input {
  border: 1px solid #e5e7eb;
  padding: 0.5rem;
  border-radius: 0.35rem;
  width: 100%;
  background-color: white;
  color: #111827;
}
:global(.dark) .input {
  background-color: #111827;
  border-color: #374151;
  color: #f9fafb;
}
</style>
