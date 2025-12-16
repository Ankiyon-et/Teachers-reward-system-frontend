<template>
  <div class="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
    <div class="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
      <div class="w-full">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">
          Monthly Reward Trend
        </h3>
        <p class="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
          Rewards processed each month
        </p>
      </div>

      <div class="relative">
        <div class="inline-flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
          <button
            v-for="option in options"
            :key="option.value"
            @click="selected = option.value"
            :class="[
              selected === option.value
                ? 'shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800'
                : 'text-gray-500 dark:text-gray-400',
              'px-3 py-2 font-medium rounded-md text-theme-sm hover:text-gray-900 hover:shadow-theme-xs dark:hover:bg-gray-800 dark:hover:text-white'
            ]"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-full overflow-x-auto custom-scrollbar">
      <div id="chartReward" class="-ml-4 min-w-[1000px] xl:min-w-full pl-2">
        <VueApexCharts
          type="area"
          height="310"
          :options="chartOptions"
          :series="series"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { useDashboard } from '@/composables/useDashboard'

/* =====================
   selected range (union type)
===================== */
type Range = 'monthly' | 'quarterly' | 'annually'
const options: { value: Range; label: string }[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annually', label: 'Annually' },
]
const selected = ref<Range>('monthly')

/* =====================
   composable
===================== */
const { monthlyRewardTrend, fetchDashboard } = useDashboard()

/* =====================
   chart series
===================== */
const series = computed(() => [
  {
    name: 'Rewards',
    data: monthlyRewardTrend.value.map(item => item.total_amount ?? 0),
  },
])

/* =====================
   chart options
===================== */
const chartOptions = computed(() => ({
  legend: { show: false, position: 'top', horizontalAlign: 'left' },
  colors: ['#465FFF'],
  chart: { fontFamily: 'Outfit, sans-serif', type: 'area', toolbar: { show: false } },
  fill: { gradient: { enabled: true, opacityFrom: 0.45, opacityTo: 0 } },
  stroke: { curve: 'straight', width: [2] },
  markers: { size: 0 },
  grid: { xaxis: { lines: { show: false } }, yaxis: { lines: { show: true } } },
  dataLabels: { enabled: false },
  tooltip: { x: { format: 'MMM yyyy' } },
  xaxis: {
    type: 'category',
    categories: monthlyRewardTrend.value.map(item => item.month),
    axisBorder: { show: false },
    axisTicks: { show: false },
    tooltip: { enabled: false },
  },
  yaxis: { title: { style: { fontSize: '0px' } } },
}))

/* =====================
   fetch dashboard data
===================== */
onMounted(() => {
  if (!monthlyRewardTrend.value.length) fetchDashboard()
})
</script>
