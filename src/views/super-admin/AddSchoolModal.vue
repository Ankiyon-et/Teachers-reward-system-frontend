<template>
  <!-- WRAP INSIDE ADMIN LAYOUT SPACE -->
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 pl-[var(--sidebar-width,16rem)]"
       @click="$emit('close')">

    <!-- MODAL BOX (stops click from closing when clicking inside) -->
    <div class="bg-white dark:bg-gray-900 rounded-lg w-full max-w-4xl p-6 relative"
         @click.stop>

      <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Add School
      </h2>

      <form @submit.prevent="submit">
        <!-- 2 COLUMNS -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

          <!-- LEFT COLUMN: SCHOOL INFO -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">School Name *</label>
              <input v-model="school_name" type="text" required
                     class="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"/>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">Address *</label>
              <input v-model="address" type="text" required
                     class="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"/>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">Contact Email *</label>
              <input v-model="contact_email" type="email" required
                     class="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"/>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">Description</label>
              <textarea v-model="description"
                        class="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"></textarea>
            </div>

            <!-- ✅ NEW FIELD: SCHOOL LOGO -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">School Logo</label>
              <input type="file" accept="image/*"
                     @change="logo = $event.target.files[0]"
                     class="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"/>
            </div>
          </div>

          <!-- RIGHT COLUMN: ADMIN INFO -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">Admin Name *</label>
              <input v-model="admin_name" type="text" required
                     class="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"/>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">Admin Email *</label>
              <input v-model="admin_email" type="email" required
                     class="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"/>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">Admin Password *</label>
              <input v-model="admin_password" type="password" required
                     class="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"/>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">Admin Title</label>
              <input v-model="admin_title" type="text"
                     class="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"/>
            </div>
          </div>

        </div>

        <div class="mt-6 flex justify-end gap-2">
          <button type="button"
                  @click="$emit('close')"
                  class="px-4 py-2 bg-gray-200 rounded dark:bg-gray-700">
            Cancel
          </button>

          <button type="submit"
                  class="px-4 py-2 bg-brand-500 text-white rounded hover:bg-brand-600">
            Save
          </button>
        </div>
      </form>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['close', 'saved'])

const school_name = ref('')
const address = ref('')
const contact_email = ref('')
const description = ref('')
const logo = ref(null) // ✅ added

const admin_name = ref('')
const admin_email = ref('')
const admin_password = ref('')
const admin_title = ref('')

const submit = () => {
  emit('saved', {
    name: school_name.value,
    address: address.value,
    contact_email: contact_email.value,
    description: description.value,
    logo: logo.value, // ✅ included in payload
    admin_name: admin_name.value,
    admin_email: admin_email.value,
    admin_password: admin_password.value,
    admin_title: admin_title.value
  })
}
</script>
