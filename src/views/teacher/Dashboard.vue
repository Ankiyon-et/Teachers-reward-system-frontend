<template>
  <AdminLayout>
    <div class="p-6">

      <!-- Unauthorized -->
      <div
        v-if="unauthorized"
        class="bg-red-50 border border-red-200 p-4 rounded-md text-red-800"
      >
        You are not authorized to view this page.
      </div>

      <div v-else>
        <h1 class="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-6">
          Teacher Dashboard
        </h1>

        <!-- Loading -->
        <div v-if="loading" class="p-4">Loading...</div>

        <!-- Error -->
        <div
          v-if="error"
          class="p-4 bg-red-50 text-red-700 mb-4"
        >
          {{ error }}
        </div>

        <!-- Stats -->
        <div
          v-if="dashboard"
          class="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <!-- Average Rating -->
          <div
            class="rounded-xl border border-gray-200 bg-white p-5
                   dark:border-gray-800 dark:bg-gray-900"
          >
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Average Rating
            </p>
            <p class="mt-2 text-3xl font-semibold text-gray-800 dark:text-white">
              ⭐ {{ dashboard.average_rating }}
            </p>
          </div>

          <!-- Balance -->
          <div
            class="rounded-xl border border-gray-200 bg-white p-5
                   dark:border-gray-800 dark:bg-gray-900"
          >
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Current Balance
            </p>
            <p class="mt-2 text-3xl font-semibold text-green-600 dark:text-green-400">
              {{ dashboard.current_balance }} ETB
            </p>
          </div>

          <!-- Monthly Rewards -->
          <div
            class="rounded-xl border border-gray-200 bg-white p-5
                   dark:border-gray-800 dark:bg-gray-900"
          >
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Rewards This Month
            </p>
            <p class="mt-2 text-3xl font-semibold text-blue-600 dark:text-blue-400">
              {{ dashboard.total_rewards_this_month }} ETB
            </p>
          </div>
        </div>

        <!-- Monthly Breakdown -->
        <div
          v-if="dashboard"
          class="mt-8 rounded-xl border border-gray-200 bg-white p-6
                 dark:border-gray-800 dark:bg-gray-900"
        >
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
            Monthly Rewards Breakdown
          </h2>

          <div
            v-if="Object.keys(dashboard.monthly_rewards).length"
            class="space-y-2"
          >
            <div
              v-for="(amount, month) in dashboard.monthly_rewards"
              :key="month"
              class="flex justify-between text-gray-700 dark:text-gray-300"
            >
              <span>{{ month }}</span>
              <span class="font-medium">{{ amount }} ETB</span>
            </div>
          </div>

          <p
            v-else
            class="text-gray-500 dark:text-gray-400"
          >
            No rewards recorded yet.
          </p>
        </div>

      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import { useTeacherDashboard } from "@/composables/useTeacherDashboard";
import { userToken, userRoleId } from "@/composables/useAuth";

const router = useRouter();
const unauthorized = ref(false);

// Teacher role = 3
watch(
  userRoleId,
  (role) => {
    if (role !== 3) {
      unauthorized.value = true;
      router.replace("/");
    } else {
      unauthorized.value = false;
    }
  },
  { immediate: true }
);

const { dashboard, loading, error, fetchDashboard } =
  useTeacherDashboard();

onMounted(() => {
  if (!userToken.value) {
    router.replace("/login");
  } else if (userRoleId.value === 3) {
    fetchDashboard();
  }
});
</script>
