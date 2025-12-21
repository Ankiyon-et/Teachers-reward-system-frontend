<template>
  <admin-layout>
    <div class="grid grid-cols-12 gap-4 md:gap-6">
      <!-- Metrics -->
      <div class="col-span-12">
        <super-admin-metrics
          :total-schools="totalSchools"
          :total-teachers="totalTeachers"
          :total-rewards="totalRewardsProcessed"
        />
      </div>

      <!-- Monthly Reward Trend -->
      <div class="col-span-12 xl:col-span-7">
        <monthly-reward-trend :data="monthlyRewardTrend" />
      </div>

      <!-- Top Performing Schools -->
      <div class="col-span-12 xl:col-span-5">
        <top-performing-schools :schools="topPerformingSchools" />
      </div>

    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import SuperAdminMetrics from '@/components/super-admin/SuperAdminMetrics.vue'
import MonthlyRewardTrend from '@/components/super-admin/MonthlyRewardTrend.vue'
import TopPerformingSchools from '@/components/super-admin/TopPerformingSchools.vue'
import { onMounted } from 'vue'
import { useDashboard } from '@/composables/useDashboard'

const {
  loading,
  error,
  totalSchools,
  totalTeachers,
  totalRewardsProcessed,
  monthlyRewardTrend,
  topPerformingSchools,
  fetchDashboard,
} = useDashboard()

onMounted(() => {
  fetchDashboard()
})
</script>
