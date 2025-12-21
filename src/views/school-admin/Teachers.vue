<template>
  <AdminLayout>
    <div class="p-6">
      <h1 class="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-6">
        Teachers
      </h1>

      <div class="flex items-center gap-2 mb-4">
        <Button variant="primary" size="md" @click="showAdd = true">
          + Add Teacher
        </Button>
        <Button variant="outline" size="sm" @click="fetchTeachers">
          Refresh
        </Button>
      </div>

      <div v-if="loading" class="p-4">Loading...</div>
      <div
        v-if="error"
        class="p-4 mb-4 bg-red-50 text-red-700 rounded"
      >
        {{ error }}
      </div>

      <ComponentCard title="Teachers List">
        <div
          class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
        >
          <table class="min-w-full">
            <thead>
              <tr class="border-b dark:border-gray-700">
                <th class="px-5 py-3 text-left">Name</th>
                <th class="px-5 py-3 text-left">Email</th>
                <th class="px-5 py-3 text-left">Subject</th>
                <th class="px-5 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody v-if="teachers.length">
              <tr
                v-for="t in teachers"
                :key="t.id"
                class="border-t dark:border-gray-800"
              >
                <td class="px-5 py-4">{{ t.name }}</td>
                <td class="px-5 py-4">{{ t.email }}</td>
                <td class="px-5 py-4">{{ t.subject || "-" }}</td>
                <td class="px-5 py-4 flex gap-2">
                  <Button size="sm" variant="outline" @click="openEdit(t)">
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="!text-error-600"
                    @click="confirmDelete(t)"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            </tbody>

            <tbody v-else>
              <tr>
                <td
                  colspan="4"
                  class="px-5 py-6 text-center text-gray-500"
                >
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
          <div class="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-md">
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
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import Button from "@/components/ui/Button.vue";
import Modal from "@/components/ui/Modal.vue";
import { useTeachers } from "@/composables/useTeachers";

const { teachers, loading, error, fetchTeachers, createTeacher, deleteTeacher } =
  useTeachers();

const showAdd = ref(false);

const form = ref({
  name: "",
  email: "",
  password: "",
  subject: "",
});

async function create() {
  await createTeacher(form.value);
  showAdd.value = false;
  form.value = { name: "", email: "", password: "", subject: "" };
}

function openEdit(t: any) {
  alert("Edit coming next 👍");
}

function confirmDelete(t: any) {
  if (confirm(`Delete ${t.name}?`)) {
    deleteTeacher(t.id);
  }
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
