<template>
  <AdminLayout>
    <div class="p-6 max-w-xl mx-auto">

      <!-- Unauthorized -->
      <div
        v-if="unauthorized"
        class="bg-red-50 border border-red-200 p-4 rounded-md text-red-800"
      >
        You are not authorized to view this page.
      </div>

      <div v-else>
        <h1 class="text-2xl font-semibold mb-6 text-gray-800 dark:text-white/90">
          Withdraw Request
        </h1>

        <div
          class="rounded-xl border border-gray-200 bg-white p-6
                 dark:border-gray-800 dark:bg-gray-900"
        >
          <form @submit.prevent="submitWithdraw" class="space-y-4">

            <div>
              <label class="block text-sm mb-1 text-gray-600 dark:text-gray-400">
                Amount
              </label>
              <input
                v-model.number="amount"
                type="number"
                min="1"
                placeholder="Enter amount"
                class="input"
                required
              />
            </div>

            <div v-if="error" class="text-red-600 text-sm">
              {{ error }}
            </div>

            <div class="flex justify-end">
              <Button
                variant="primary"
                size="md"
                :disabled="loading"
              >
                {{ loading ? "Submitting…" : "Request Withdraw" }}
              </Button>
            </div>

          </form>
        </div>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from "@/components/layout/AdminLayout.vue";
import Button from "@/components/ui/Button.vue";
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useTeacherWithdraw } from "@/composables/useTeacherWithdraw";
import { userToken, userRoleId } from "@/composables/useAuth";

const router = useRouter();
const unauthorized = ref(false);

// teacher role = 3 (based on your system)
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

onMounted(() => {
  if (!userToken.value) {
    router.replace("/login");
  }
});

const amount = ref<number>(0);
const { withdraw, loading, error } = useTeacherWithdraw();

async function submitWithdraw() {
  try {
    await withdraw(amount.value);
    alert("Withdraw request submitted");
    amount.value = 0;
  } catch {
    // error already handled
  }
}
</script>

<style scoped>
.input {
  width: 100%;
  border: 1px solid #e5e7eb;
  padding: 0.5rem;
  border-radius: 0.375rem;
  background-color: white;
  color: #111827;
}

:global(.dark) .input {
  background-color: #111827;
  border-color: #374151;
  color: #f9fafb;
}
</style>
