import { ref } from 'vue'
import { getSuperAdminDashboard } from '@/services/dashboard'

import type {
  MonthlyRewardTrend,
  TopPerformingSchool,
} from '@/services/dashboard'

const totalSchools = ref<number>(0)
const totalTeachers = ref<number>(0)
const totalRewardsProcessed = ref<number>(0)

const monthlyRewardTrend = ref<MonthlyRewardTrend[]>([])
const topPerformingSchools = ref<TopPerformingSchool[]>([])


const loading = ref(false)
const error = ref<string | null>(null)

export function useDashboard() {
  async function fetchDashboard() {
    loading.value = true
    error.value = null

    try {
      const data = await getSuperAdminDashboard()

      // metrics
      totalSchools.value = data.total_schools
      totalTeachers.value = data.total_teachers
      totalRewardsProcessed.value = data.total_rewards_processed

      // charts
      monthlyRewardTrend.value = data.monthly_reward_trend
      topPerformingSchools.value = data.top_performing_schools
    } catch (e: any) {
      error.value = e?.message ?? 'Failed to load dashboard'
    } finally {
      loading.value = false
    }
  }

  return {
    // metrics ✅
    totalSchools,
    totalTeachers,
    totalRewardsProcessed,

    // charts
    monthlyRewardTrend,
    topPerformingSchools,

    // state
    loading,
    error,
    fetchDashboard
  }
}
