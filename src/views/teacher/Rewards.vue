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
          My Rewards
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

        <!-- Rewards Table -->
        <ComponentCard title="Rewards History">
          <div
            class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
          >
            <div class="max-w-full overflow-x-auto custom-scrollbar">
              <table class="min-w-full">

                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-700">
                    <th class="px-5 py-3 text-left">Amount</th>
                    <th class="px-5 py-3 text-left">Date</th>
                  </tr>
                </thead>

                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr
                    v-for="r in rewards"
                    :key="r.id"
                    class="border-t border-gray-100 dark:border-gray-800"
                  >
                    <td class="px-5 py-4 font-semibold text-green-600 dark:text-green-400">
                      {{ Number(r.amount).toLocaleString() }} ETB
                    </td>

                    <td class="px-5 py-4">
                      {{ new Date(r.created_at).toLocaleDateString() }}
                    </td>
                  </tr>

                  <tr v-if="!rewards.length && !loading">
                    <td
                      colspan="2"
                      class="px-5 py-6 text-center text-gray-500 dark:text-gray-400"
                    >
                      No rewards yet.
                    </td>
                  </tr>
                </tbody>

              </table>
            </div>
          </div>
        </ComponentCard>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import { useTeacherRewards } from "@/composables/useTeacherRewards";
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

const { rewards, loading, error, fetchRewards } =
  useTeacherRewards();

onMounted(() => {
  if (!userToken.value) {
    router.replace("/login");
  } else if (userRoleId.value === 3) {
    fetchRewards();
  }
});
</script>
