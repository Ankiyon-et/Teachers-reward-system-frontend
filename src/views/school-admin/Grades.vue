<template>
  <AdminLayout>
    <div class="p-6">

      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-semibold text-gray-800 dark:text-white/90">Manage Grades</h1>
        <Button variant="primary" size="md" @click="openAssignModal">+ Assign Grades</Button>
        <Button variant="outline" size="sm" @click="refresh">Refresh</Button>
      </div>

      <div v-if="loading" class="p-4">Loading...</div>
      <div v-if="error" class="p-4 bg-red-50 text-red-700 mb-4">{{ error }}</div>

      <ComponentCard title="Assigned Grades">
        <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="max-w-full overflow-x-auto custom-scrollbar">
            <table class="min-w-full">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <th class="px-5 py-3 text-left">ID</th>
                  <th class="px-5 py-3 text-left">Grade Name</th>
                  <th class="px-5 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="g in assignedGrades" :key="g.id">
                  <td class="px-5 py-4">{{ g.id }}</td>
                  <td class="px-5 py-4">{{ g.name }}</td>
                  <td class="px-5 py-4 space-x-2">
                    <Button variant="outline" size="sm" className="!text-error-600 !dark:text-error-500" @click="confirmDelete(g)">Remove</Button>
                  </td>
                </tr>
                <tr v-if="!assignedGrades.length && !loading">
                  <td colspan="3" class="px-5 py-6 text-center text-gray-500 dark:text-gray-400">
                    No grades assigned.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </ComponentCard>

      <!-- Assign Grades Modal -->
      <Modal v-if="showAssign" fullScreenBackdrop @close="closeAssignModal">
        <template #body>
          <div class="w-full max-w-md rounded-xl bg-white p-6 shadow-theme-sm dark:bg-gray-900">
            <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white/90">Assign Grades</h3>

            <div class="space-y-2 max-h-96 overflow-y-auto">
              <div v-for="g in allGrades" :key="g.id" class="flex items-center gap-2">
                <input type="checkbox" :id="'grade-'+g.id" :value="g.id" v-model="selectedGrades" />
                <label :for="'grade-'+g.id" class="text-gray-800 dark:text-white/90">{{ g.name }}</label>
              </div>
            </div>

            <div class="mt-4 flex justify-end gap-2">
              <Button variant="outline" size="sm" @click="closeAssignModal">Cancel</Button>
              <Button variant="primary" size="sm" :disabled="submitting" @click="onAssign">
                {{ submitting ? 'Assigning…' : 'Assign Selected' }}
              </Button>
            </div>
          </div>
        </template>
      </Modal>

      <!-- Delete Confirmation -->
      <Modal v-if="showDeleteConfirm" fullScreenBackdrop @close="cancelDelete">
        <template #body>
          <div class="w-full max-w-md rounded-xl bg-white p-6 shadow-theme-sm dark:bg-gray-900">
            <h3 class="text-lg font-semibold mb-3 text-gray-800 dark:text-white/90">Confirm Remove</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Are you sure you want to remove <strong>{{ deleteTarget?.name }}</strong> from this school?
            </p>
            <div class="mt-4 flex justify-end gap-2">
              <Button variant="outline" size="sm" @click="cancelDelete">Cancel</Button>
              <Button variant="primary" size="sm" className="!bg-error-600 hover:!bg-error-700" :disabled="submitting" @click="onDelete">
                {{ submitting ? 'Removing…' : 'Remove' }}
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
import { ref, onMounted } from "vue";
import { useSchoolGrades } from "@/composables/useSchoolGrades";

const { allGrades, assignedGrades, loading, error, fetchAllGrades, fetchAssignedGrades, assignSelectedGrades, removeGrade } = useSchoolGrades();

const showAssign = ref(false);
const selectedGrades = ref<number[]>([]);
const submitting = ref(false);

const showDeleteConfirm = ref(false);
const deleteTarget = ref<any | null>(null);

// fetch all and assigned grades on mount
onMounted(async () => {
  await fetchAllGrades();
  await fetchAssignedGrades();
});

// Assign modal
function openAssignModal() {
  selectedGrades.value = assignedGrades.value.map(g => g.id);
  showAssign.value = true;
}
function closeAssignModal() { showAssign.value = false; }

async function onAssign() {
  if (!selectedGrades.value.length) return;
  submitting.value = true;
  try {
    await assignSelectedGrades(selectedGrades.value);
    closeAssignModal();
  } catch (err: any) {
    alert(err?.message || "Failed to assign grades");
  } finally {
    submitting.value = false;
  }
}

// Delete grade
function confirmDelete(g: any) { deleteTarget.value = g; showDeleteConfirm.value = true; }
function cancelDelete() { deleteTarget.value = null; showDeleteConfirm.value = false; }

async function onDelete() {
  if (!deleteTarget.value) return;
  submitting.value = true;
  try {
    await removeGrade(deleteTarget.value.id);
    cancelDelete();
  } catch (err: any) {
    alert(err?.message || "Failed to remove grade");
  } finally {
    submitting.value = false;
  }
}

// refresh
async function refresh() {
  await fetchAllGrades();
  await fetchAssignedGrades();
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
