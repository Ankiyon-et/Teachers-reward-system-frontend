<template>
  <admin-layout>
    <div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">
        Super Admin Dashboard
      </h1>
      <p class="mt-4 text-gray-600 dark:text-gray-300">
        This is a placeholder page. Content will be added later.
      </p>
    </div>
  </admin-layout>
</template>

<script>
import AdminLayout from '@/components/layout/AdminLayout.vue'

export default {
  name: 'SuperAdminDashboard',
  components: { AdminLayout },
}
</script>
