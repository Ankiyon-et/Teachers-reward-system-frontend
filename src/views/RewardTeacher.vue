<template>
  <FullScreenLayout>
    <div class="min-h-screen flex flex-col items-center justify-center px-6">

      <div
        class="w-full max-w-md p-6 rounded-xl border
               border-gray-200 bg-white
               dark:border-gray-800 dark:bg-gray-900"
      >
        <h2 class="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
          Reward a Teacher
        </h2>

        <p class="text-sm mb-6 text-gray-600 dark:text-gray-400">
          Support a teacher by sending a financial reward.
        </p>

        <form @submit.prevent="onSubmit" class="space-y-4">
          <input
            v-model.number="teacherId"
            type="number"
            placeholder="Teacher ID"
            class="input"
            required
          />

          <input
            v-model.number="amount"
            type="number"
            min="1"
            placeholder="Amount"
            class="input"
            required
          />

          <div v-if="error" class="text-sm text-red-600">
            {{ error }}
          </div>

          <div v-if="success" class="text-sm text-green-600">
            Reward sent successfully 🎉
          </div>

          <Button
            variant="primary"
            size="md"
            class="w-full"
            :disabled="loading"
          >
            {{ loading ? "Sending..." : "Send Reward" }}
          </Button>
        </form>
      </div>

    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import FullScreenLayout from "@/components/layout/FullScreenLayout.vue";
import Button from "@/components/ui/Button.vue";
import { useRewards } from "@/composables/useRewards";

const teacherId = ref<number | null>(null);
const amount = ref<number | null>(null);

const { loading, error, success, sendReward } = useRewards();

async function onSubmit() {
  if (!teacherId.value || !amount.value) return;
  await sendReward(teacherId.value, amount.value);
}
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.6rem;
  border-radius: 0.4rem;
  border: 1px solid #e5e7eb;
  background: white;
  color: #111827;
}

:global(.dark) .input {
  background: #111827;
  border-color: #374151;
  color: #f9fafb;
}
</style>
