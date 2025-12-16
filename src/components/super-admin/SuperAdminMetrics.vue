<script setup lang="ts">
import { onMounted } from 'vue'
import { useDashboard } from '@/composables/useDashboard'

const { totalSchools, totalTeachers, totalRewardsProcessed, fetchDashboard } = useDashboard()

onMounted(() => fetchDashboard())
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
    <!-- Total Schools -->
    <div class="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
      <div class="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl">
        <!-- school icon -->
        <svg class="fill-gray-800" width="24" height="24" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zm0 7.5L4 7v7l8 4 8-4V7l-8 2.5z" />
        </svg>
      </div>
      <div class="flex items-end justify-between mt-5">
        <div>
          <span class="text-sm text-gray-500">Total Schools</span>
          <h4 class="mt-2 font-bold text-gray-800 text-title-sm">{{ totalSchools }}</h4>
        </div>
      </div>
    </div>

    <!-- Total Teachers -->
    <div class="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
      <div class="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl">
        <svg class="fill-gray-800" width="24" height="24">
          <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm7 9v-2a5 5 0 00-5-5H10a5 5 0 00-5 5v2h14z"/>
        </svg>
      </div>
      <div class="flex items-end justify-between mt-5">
        <div>
          <span class="text-sm text-gray-500">Total Teachers</span>
          <h4 class="mt-2 font-bold text-gray-800 text-title-sm">{{ totalTeachers }}</h4>
        </div>
      </div>
    </div>

    <!-- Total Rewards Processed -->
    <div class="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
      <div class="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl">
        <svg class="fill-gray-800" width="24" height="24">
          <path d="M12 2l2.4 4.8L19 8l-3.5 3.2L16.8 16 12 13.6 7.2 16l1.3-4.8L5 8l4.6-1.2L12 2z"/>
        </svg>
      </div>
      <div class="flex items-end justify-between mt-5">
        <div>
          <span class="text-sm text-gray-500">Rewards Processed</span>
          <h4 class="mt-2 font-bold text-gray-800 text-title-sm">{{ totalRewardsProcessed }}</h4>
        </div>
      </div>
    </div>
  </div>
</template>
