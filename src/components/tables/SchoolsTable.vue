<template>
  <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
    <div class="max-w-full overflow-x-auto custom-scrollbar">
      <table class="min-w-full">
        <thead>
          <tr class="border-b border-gray-200 dark:border-gray-700">
            <th class="px-5 py-3 text-left w-2/12 sm:px-6">School</th>
            <th class="px-5 py-3 text-left w-2/12 sm:px-6">Address</th>
            <th class="px-5 py-3 text-left w-2/12 sm:px-6">Email</th>
            <th class="px-5 py-3 text-left w-2/12 sm:px-6">Admin</th>
            <th class="px-5 py-3 text-left w-2/12 sm:px-6">Created</th>
            <th class="px-5 py-3 text-left w-2/12 sm:px-6">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="school in schools" :key="school.id" class="border-t border-gray-100 dark:border-gray-800">
            <!-- School Name & Logo -->
            <td class="px-5 py-4 sm:px-6">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 overflow-hidden rounded-full bg-gray-100">
                  <img v-if="school.logo" :src="school.logo" alt="logo" class="object-cover w-full h-full" />
                  <div v-else class="flex items-center justify-center bg-gray-200 text-gray-500 text-sm">
                    No Logo
                  </div>
                </div>
                <div>
                  <span class="block font-medium text-gray-800 dark:text-white/90">{{ school.name }}</span>
                  <span class="block text-gray-500 text-sm dark:text-gray-400">{{ school.description }}</span>
                </div>
              </div>
            </td>

            <!-- Address -->
            <td class="px-5 py-4 sm:px-6 text-gray-600 dark:text-gray-400">{{ school.address }}</td>

            <!-- Email -->
            <td class="px-5 py-4 sm:px-6 text-gray-600 dark:text-gray-400">{{ school.contact_email }}</td>

            <!-- Admin -->
            <td class="px-5 py-4 sm:px-6">
              <div v-if="school.admin_name" class="flex flex-col">
                <span class="text-gray-800 dark:text-gray-200 font-medium">{{ school.admin_name }}</span>
                <span class="text-gray-500 text-xs">{{ school.admin_title }}</span>
              </div>
              <span v-else class="text-gray-400 text-sm">No Admin</span>
            </td>

            <!-- Created -->
            <td class="px-5 py-4 sm:px-6 text-gray-500 dark:text-gray-400">{{ formatDate(school.created_at) }}</td>

            <!-- Actions -->
            <td class="px-5 py-4 sm:px-6">
              <div class="flex gap-2">
                <Button variant="outline" size="sm" @click="$emit('edit', school)">Edit</Button>
                <Button variant="outline" size="sm" class="text-red-500" @click="$emit('delete', school)">Delete</Button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import Button from '@/components/ui/Button.vue'

const props = defineProps({
  schools: { type: Array, required: true },
})

const emit = defineEmits(['edit', 'delete'])

function formatDate(date) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}
</script>

<style scoped>
/* Optional: scrollbar styles if needed */
.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(107, 114, 128, 0.5);
  border-radius: 3px;
}
</style>
