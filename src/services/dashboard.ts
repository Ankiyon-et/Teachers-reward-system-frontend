import { api } from './api'

export type MonthlyRewardTrend = {
  month: string
  total_amount: number
}

export type TopPerformingSchool = {
  id: number
  name: string
  total_rewards: number
}



export type DashboardResponse = {
  total_schools: number
  total_teachers: number
  total_rewards_processed: number
  monthly_reward_trend: MonthlyRewardTrend[]
  top_performing_schools: TopPerformingSchool[]
}

export async function getSuperAdminDashboard() {
  const res = await api.get<DashboardResponse>('/superadmin/dashboard')
  return res.data
}
