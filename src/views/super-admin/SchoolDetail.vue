<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="school?.name || 'School Details'" />

    <div v-if="loading" class="p-6 text-gray-500 dark:text-gray-400">Loading...</div>

    <div v-else-if="school" class="space-y-6">
      <!-- School Info -->
      <ComponentCard title="School Information">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p class="text-gray-500 dark:text-gray-400">Name</p>
            <p class="font-medium text-gray-800 dark:text-white">{{ school.name }}</p>
          </div>

          <div>
            <p class="text-gray-500 dark:text-gray-400">Email</p>
            <p class="font-medium text-gray-800 dark:text-white">{{ school.contact_email }}</p>
          </div>

          <div>
            <p class="text-gray-500 dark:text-gray-400">Address</p>
            <p class="font-medium text-gray-800 dark:text-white">{{ school.address }}</p>
          </div>

          <div>
            <p class="text-gray-500 dark:text-gray-400">Created At</p>
            <p class="font-medium text-gray-800 dark:text-white">{{ formatDate(school.created_at) }}</p>
          </div>

          <div class="md:col-span-2">
            <p class="text-gray-500 dark:text-gray-400">Description</p>
            <p class="font-medium text-gray-800 dark:text-white">{{ school.description }}</p>
          </div>
        </div>
      </ComponentCard>

      <!-- Admins -->
      <ComponentCard title="School Admins">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="px-4 py-2 text-left text-gray-500 dark:text-gray-400">Name</th>
              <th class="px-4 py-2 text-left text-gray-500 dark:text-gray-400">Email</th>
              <th class="px-4 py-2 text-left text-gray-500 dark:text-gray-400">Title</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="admin in school.admins"
              :key="admin.id"
              class="border-t border-gray-100 dark:border-gray-800"
            >
              <td class="px-4 py-2 text-gray-800 dark:text-white">{{ admin.user.name }}</td>
              <td class="px-4 py-2 text-gray-800 dark:text-white">{{ admin.user.email }}</td>
              <td class="px-4 py-2 text-gray-800 dark:text-white">{{ admin.title }}</td>
            </tr>
          </tbody>
        </table>
      </ComponentCard>
    </div>

    <div v-else class="p-6 text-red-600 dark:text-red-400">
      School not found
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import { api } from '@/services/api' // named import

const route = useRoute()
const school = ref<any>(null)
const loading = ref(true)

const fetchSchool = async () => {
  try {
    const { data } = await api.get(`/schools/${route.params.id}`)
    school.value = data
  } catch (error) {
    console.error('Failed to load school', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString()

onMounted(fetchSchool)
</script>
