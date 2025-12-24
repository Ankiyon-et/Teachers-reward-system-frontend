<template>
  <AdminLayout>
    <div class="p-6">

      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Teachers
        </h1>

        <Button variant="primary" size="md" @click="openAddModal">
          + Add Teacher
        </Button>
        <Button variant="outline" size="sm" @click="fetchTeachers">
          Refresh
        </Button>
      </div>

      <div v-if="loading" class="p-4">Loading...</div>
      <div v-if="error" class="p-4 bg-red-50 text-red-700 mb-4">
        {{ error }}
      </div>

      <!-- Teachers Table -->
      <ComponentCard title="Teachers List">
        <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="max-w-full overflow-x-auto custom-scrollbar">
            <table class="min-w-full">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <th class="px-5 py-3 text-left">Name</th>
                  <th class="px-5 py-3 text-left">Email</th>
                  <th class="px-5 py-3 text-left">Subject</th>
                  <th class="px-5 py-3 text-left">Grades</th>
                  <th class="px-5 py-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="t in teachers" :key="t.id">
                  <td class="px-5 py-4">{{ t.user.name }}</td>
                  <td class="px-5 py-4">{{ t.user.email }}</td>
                  <td class="px-5 py-4">{{ t.subject }}</td>
                  <td class="px-5 py-4">
                    <span v-if="t.grades.length">
                      {{ t.grades.map(g => g.name).join(", ") }}
                    </span>
                    <span v-else class="text-gray-400">No grades</span>
                  </td>
                  <td class="px-5 py-4 space-x-2">
                    <Button size="sm" variant="outline" @click="openAssignModal(t)">
                      Assign Grades
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="!text-error-600 !dark:text-error-500"
                      @click="confirmDelete(t)"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>

                <tr v-if="!teachers.length && !loading">
                  <td colspan="5" class="px-5 py-6 text-center text-gray-500">
                    No teachers found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </ComponentCard>

      <!-- Add Teacher Modal -->
      <Modal v-if="showAdd" fullScreenBackdrop @close="closeAdd">
        <template #body>
          <div class="w-full max-w-md bg-white p-6 rounded-xl dark:bg-gray-900">
            <h3 class="text-lg font-semibold mb-4">Add Teacher</h3>
            <form @submit.prevent="onCreate">
              <input v-model="form.name" placeholder="Name" class="input" required />
              <input v-model="form.email" placeholder="Email" type="email" class="input mt-2" required />
              <input v-model="form.password" placeholder="Password" type="password" class="input mt-2" required />
              <input v-model="form.subject" placeholder="Subject" class="input mt-2" required />

              <div class="mt-4 flex justify-end gap-2">
                <Button variant="outline" size="sm" @click="closeAdd">Cancel</Button>
                <Button variant="primary" size="sm" :disabled="submitting">
                  {{ submitting ? "Creating…" : "Create" }}
                </Button>
              </div>
            </form>
          </div>
        </template>
      </Modal>

      <!-- Assign Grades Modal -->
      <Modal v-if="showAssign" fullScreenBackdrop @close="closeAssign">
        <template #body>
          <div class="w-full max-w-md bg-white p-6 rounded-xl dark:bg-gray-900">
            <h3 class="text-lg font-semibold mb-4">Assign Grades</h3>

            <div v-for="g in grades" :key="g.id" class="flex gap-2">
              <input type="checkbox" :value="g.id" v-model="selectedGrades" />
              <span>{{ g.name }}</span>
            </div>

            <div class="mt-4 flex justify-end gap-2">
              <Button variant="outline" size="sm" @click="closeAssign">Cancel</Button>
              <Button variant="primary" size="sm" :disabled="submitting" @click="onAssign">
                Assign
              </Button>
            </div>
          </div>
        </template>
      </Modal>

      <!-- Delete Confirmation -->
      <Modal v-if="showDelete" fullScreenBackdrop @close="cancelDelete">
        <template #body>
          <div class="w-full max-w-md bg-white p-6 rounded-xl dark:bg-gray-900">
            <h3 class="text-lg font-semibold mb-3">Confirm Delete</h3>
            <p>Delete <strong>{{ deleteTarget?.user.name }}</strong>?</p>

            <div class="mt-4 flex justify-end gap-2">
              <Button variant="outline" size="sm" @click="cancelDelete">Cancel</Button>
              <Button
                variant="primary"
                size="sm"
                className="!bg-error-600"
                :disabled="submitting"
                @click="onDelete"
              >
                Delete
              </Button>
            </div>
          </div>
        </template>
      </Modal>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import Button from "@/components/ui/Button.vue";
import Modal from "@/components/ui/Modal.vue";
import { useTeachers } from "@/composables/useTeachers";
import { useSchoolGrades } from "@/composables/useSchoolGrades";

const { teachers, loading, error, fetchTeachers, createTeacher, removeTeacher, assignGrades } = useTeachers();
const { assignedGrades: grades, fetchAssignedGrades } = useSchoolGrades();

onMounted(async () => {
  await fetchTeachers();
  await fetchAssignedGrades();
});

// Add teacher
const showAdd = ref(false);
const submitting = ref(false);
const form = ref({ name: "", email: "", password: "", subject: "" });

function openAddModal() { showAdd.value = true; }
function closeAdd() { showAdd.value = false; }

async function onCreate() {
  submitting.value = true;
  try {
    await createTeacher(form.value);
    closeAdd();
  } finally {
    submitting.value = false;
  }
}

// Assign grades
const showAssign = ref(false);
const selectedTeacher = ref<any>(null);
const selectedGrades = ref<number[]>([]);

function openAssignModal(t: any) {
  selectedTeacher.value = t;
  selectedGrades.value = t.grades.map((g: any) => g.id);
  showAssign.value = true;
}
function closeAssign() { showAssign.value = false; }

async function onAssign() {
  submitting.value = true;
  try {
    await assignGrades(selectedTeacher.value.id, selectedGrades.value);
    closeAssign();
  } finally {
    submitting.value = false;
  }
}

// Delete
const showDelete = ref(false);
const deleteTarget = ref<any>(null);

function confirmDelete(t: any) {
  deleteTarget.value = t;
  showDelete.value = true;
}
function cancelDelete() {
  deleteTarget.value = null;
  showDelete.value = false;
}

async function onDelete() {
  submitting.value = true;
  try {
    await removeTeacher(deleteTarget.value.id);
    cancelDelete();
  } finally {
    submitting.value = false;
  }
}
</script>
