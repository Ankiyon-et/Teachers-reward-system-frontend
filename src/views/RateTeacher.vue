<template>
  <FullScreenLayout>
    <div class="min-h-screen flex items-center justify-center px-4">

      <div
        class="w-full max-w-md p-6 rounded-xl
               bg-white border border-gray-200
               dark:bg-gray-900 dark:border-gray-800"
      >
        <h1 class="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
          Rate a Teacher
        </h1>

        <!-- Success Message -->
        <div
          v-if="success"
          class="mb-4 p-3 rounded-md
                 bg-green-50 text-green-700
                 dark:bg-green-900/30 dark:text-green-400"
        >
          Thank you for your feedback!
        </div>

        <!-- Error Message -->
        <div
          v-if="error"
          class="mb-4 p-3 rounded-md
                 bg-red-50 text-red-700
                 dark:bg-red-900/30 dark:text-red-400"
        >
          {{ error }}
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">

          <!-- Teacher ID (placeholder for now) -->
          <div>
            <label class="block mb-1 text-sm text-gray-600 dark:text-gray-400">
              Teacher ID
            </label>
            <input
              v-model.number="form.teacher_id"
              type="number"
              required
              class="w-full px-3 py-2 rounded-md border
                     bg-white text-gray-800
                     dark:bg-gray-800 dark:text-white
                     dark:border-gray-700"
            />
          </div>

          <!-- Rating -->
          <div>
            <label class="block mb-1 text-sm text-gray-600 dark:text-gray-400">
              Rating (1–5)
            </label>
            <select
              v-model.number="form.value"
              required
              class="w-full px-3 py-2 rounded-md border
                     bg-white text-gray-800
                     dark:bg-gray-800 dark:text-white
                     dark:border-gray-700"
            >
              <option disabled value="">Select rating</option>
              <option v-for="n in 5" :key="n" :value="n">
                {{ n }}
              </option>
            </select>
          </div>

          <!-- Comment -->
          <div>
            <label class="block mb-1 text-sm text-gray-600 dark:text-gray-400">
              Comment (optional)
            </label>
            <textarea
              v-model="form.comment"
              rows="3"
              class="w-full px-3 py-2 rounded-md border
                     bg-white text-gray-800
                     dark:bg-gray-800 dark:text-white
                     dark:border-gray-700"
            />
          </div>

          <!-- Submit -->
          <Button
            type="submit"
            class="w-full"
            :loading="loading"
          >
            Submit Rating
          </Button>

        </form>
      </div>

    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import FullScreenLayout from "@/components/layout/FullScreenLayout.vue";
import Button from "@/components/ui/Button.vue";
import { useParentRating } from "@/composables/useParentRating";

const { submitRating, loading, error, success } = useParentRating();

const form = reactive({
  teacher_id: 1, // placeholder for now
  value: 5,
  comment: "",
});

async function handleSubmit() {
  await submitRating(form);
}
</script>
