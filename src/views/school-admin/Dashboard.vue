<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Dashboard" />

    <!-- Loading -->
    <div v-if="loading" class="p-6 text-gray-500 dark:text-gray-400">
      Loading dashboard...
    </div>

    <!-- Dashboard Content -->
    <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-3">
      <!-- Total Teachers -->
      <ComponentCard title="Total Teachers">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Total Teachers
            </p>
            <h3 class="mt-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {{ dashboard.total_teachers }}
            </h3>
          </div>
          <div
            class="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
          >
            👩‍🏫
          </div>
        </div>
      </ComponentCard>

      <!-- Total Rewards -->
      <ComponentCard title="Total Rewards Received">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Total Rewards Received
            </p>
            <h3 class="mt-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {{ formatCurrency(dashboard.total_rewards_received) }}
            </h3>
          </div>
          <div
            class="flex h-12 w-12 items-center justify-center rounded-full bg-success-100 text-success-600 dark:bg-success-500/10 dark:text-success-400"
          >
            💰
          </div>
        </div>
      </ComponentCard>

      <!-- Average Rating -->
      <ComponentCard title="Average School Rating">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Average School Rating
            </p>
            <h3 class="mt-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {{ dashboard.average_school_rating }}
            </h3>
          </div>
          <div
            class="flex h-12 w-12 items-center justify-center rounded-full bg-warning-100 text-warning-600 dark:bg-warning-500/10 dark:text-warning-400"
          >
            ⭐
          </div>
        </div>
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import { api } from '@/services/api'

const loading = ref(true)

const dashboard = ref({
  total_teachers: 0,
  total_rewards_received: 0,
  average_school_rating: 0,
})

const fetchDashboard = async () => {
  try {
    const { data } = await api.get('/schooladmin/dashboard')
    dashboard.value = data
  } catch (error) {
    console.error('Failed to load school admin dashboard', error)
  } finally {
    loading.value = false
  }
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

onMounted(fetchDashboard)
</script>
