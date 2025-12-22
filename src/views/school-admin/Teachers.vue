<template>
  <AdminLayout>
    <div class="p-6">
      <h1 class="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
        Teachers
      </h1>

      <!-- ACTIONS -->
      <div class="flex items-center gap-2 mb-4">
        <Button variant="primary" size="md" @click="showAdd = true">
          + Add Teacher
        </Button>
        <Button variant="outline" size="sm" @click="fetchTeachers">
          Refresh
        </Button>
      </div>

      <!-- STATES -->
      <div v-if="loading" class="p-4 text-gray-600 dark:text-gray-400">
        Loading...
      </div>

      <div
        v-if="error"
        class="p-4 mb-4 rounded bg-red-50 text-red-700
               dark:bg-red-900/30 dark:text-red-400"
      >
        {{ error }}
      </div>

      <!-- TABLE -->
      <ComponentCard title="Teachers List">
        <div
          class="overflow-hidden rounded-xl border border-gray-200 bg-white
                 dark:border-gray-800 dark:bg-gray-900"
        >
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <th class="px-5 py-3 text-left">Name</th>
                <th class="px-5 py-3 text-left">Email</th>
                <th class="px-5 py-3 text-left">Subject</th>
                <th class="px-5 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody v-if="visibleTeachers.length">
              <tr
                v-for="t in visibleTeachers"
                :key="t.id"
                class="border-t border-gray-100 dark:border-gray-800"
              >
                <td class="px-5 py-4">{{ t.user.name }}</td>
                <td class="px-5 py-4">{{ t.user.email }}</td>
                <td class="px-5 py-4">{{ t.subject || "-" }}</td>
                <td class="px-5 py-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="!text-error-600"
                    @click="openDeleteModal(t)"
                  >
                    Delete
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    @click="openAssignGrades(t)"
                  >
                    Assign Grades
                  </Button>
                </td>
              </tr>
            </tbody>

            <tbody v-else>
              <tr>
                <td colspan="4" class="px-5 py-6 text-center text-gray-500">
                  No teachers found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ComponentCard>

      <!-- ADD MODAL -->
      <Modal v-if="showAdd" @close="showAdd = false">
        <template #body>
          <div class="bg-white dark:bg-gray-900 p-6 rounded-xl max-w-md">
            <h3 class="font-semibold mb-4">Add Teacher</h3>

            <form @submit.prevent="create">
              <input v-model="form.name" class="input" placeholder="Name" />
              <input v-model="form.email" class="input" placeholder="Email" />
              <input v-model="form.password" type="password" class="input" placeholder="Password" />
              <input v-model="form.subject" class="input" placeholder="Subject" />

              <div class="flex justify-end gap-2 mt-4">
                <Button variant="outline" @click="showAdd = false">Cancel</Button>
                <Button variant="primary" type="submit">Create</Button>
              </div>
            </form>
          </div>
        </template>
      </Modal>

      <!-- DELETE MODAL -->
      <Modal v-if="showDelete" @close="closeDelete">
        <template #body>
          <div class="max-w-md rounded-xl bg-white p-6 dark:bg-gray-900">
            <h3 class="text-lg font-semibold">Confirm Delete</h3>

            <p class="mt-3 text-gray-600">
              Delete <strong>{{ selectedTeacher?.user.name }}</strong>?
            </p>

            <div class="flex justify-end gap-2 mt-6">
              <Button variant="outline" size="sm" @click="closeDelete">
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="!bg-error-600"
                @click="confirmDelete"
              >
                Delete
              </Button>
            </div>
          </div>
        </template>
      </Modal>

      <!-- ASSIGN GRADES MODAL -->
      <Modal v-if="showAssign" @close="closeAssign">
        <template #body>
          <div class="max-w-md rounded-xl bg-white p-6 dark:bg-gray-900">
            <h3 class="text-lg font-semibold">Assign Grades</h3>

            <p class="text-sm text-gray-600">
              Teacher: <strong>{{ selectedTeacher?.user.name }}</strong>
            </p>

            <div class="mt-4 space-y-2 max-h-64 overflow-y-auto">
              <label
                v-for="g in grades"
                :key="g.id"
                class="flex items-center gap-2"
              >
                <input type="checkbox" :value="g.id" v-model="selectedGradeIds" />
                {{ g.name }}
              </label>
            </div>

            <div class="flex justify-end gap-2 mt-6">
              <Button variant="outline" size="sm" @click="closeAssign">
                Cancel
              </Button>
              <Button variant="primary" size="sm" @click="submitAssign">
                Assign
              </Button>
            </div>
          </div>
        </template>
      </Modal>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import Button from "@/components/ui/Button.vue";
import Modal from "@/components/ui/Modal.vue";
import { useTeachers } from "@/composables/useTeachers";
import { useGrades } from "@/composables/useGrades";

/* TEACHERS */
const {
  teachers,
  loading,
  error,
  fetchTeachers,
  createTeacher,
  deleteTeacher,
} = useTeachers();

/* GRADES */
const { grades, fetchAllGrades, assignToTeacher } = useGrades();

/* SHARED STATE */
const selectedTeacher = ref<any | null>(null);

/* FILTER */
const visibleTeachers = computed(() =>
  teachers.value.filter(t => t.user?.name && t.user?.email)
);

/* ADD */
const showAdd = ref(false);
const form = ref({ name: "", email: "", password: "", subject: "" });

async function create() {
  await createTeacher(form.value);
  showAdd.value = false;
  form.value = { name: "", email: "", password: "", subject: "" };
}

/* DELETE */
const showDelete = ref(false);

function openDeleteModal(t: any) {
  selectedTeacher.value = t;
  showDelete.value = true;
}

function closeDelete() {
  selectedTeacher.value = null;
  showDelete.value = false;
}

async function confirmDelete() {
  if (!selectedTeacher.value) return;
  await deleteTeacher(selectedTeacher.value.id);
  await fetchTeachers();
  closeDelete();
}

/* ASSIGN */
const showAssign = ref(false);
const selectedGradeIds = ref<number[]>([]);

function openAssignGrades(t: any) {
  selectedTeacher.value = t;

  // ✅ PRE-CHECK already assigned grades
  selectedGradeIds.value = t.grades
    ? t.grades.map((g: any) => g.id)
    : [];

  showAssign.value = true;
  fetchAllGrades();
}


function closeAssign() {
  selectedTeacher.value = null;
  selectedGradeIds.value = [];
  showAssign.value = false;
}

async function submitAssign() {
  if (!selectedTeacher.value) return;

  if (!selectedGradeIds.value.length) {
    alert("Please select at least one grade.");
    return;
  }

  await assignToTeacher(selectedTeacher.value.id, selectedGradeIds.value);
  closeAssign();
}



onMounted(fetchTeachers);
</script>

<style scoped>
.input {
  width: 100%;
  border: 1px solid #e5e7eb;
  padding: 0.5rem;
  border-radius: 0.375rem;
  margin-bottom: 0.5rem;
}
</style>
