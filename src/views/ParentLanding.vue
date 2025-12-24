<template>
  <FullScreenLayout>
    <div class="min-h-screen flex flex-col">

      <!-- Header -->
      <header
        class="flex items-center justify-between px-6 py-4
               border-b border-gray-200 bg-white
               dark:border-gray-800 dark:bg-gray-900"
      >
        <h1 class="text-xl font-semibold text-gray-800 dark:text-white/90">
          School Wallet
        </h1>

        <Button
          variant="outline"
          size="sm"
          @click="goToLogin"
        >
          Login
        </Button>
      </header>

      <!-- Hero Section -->
      <main class="flex-1 flex items-center justify-center px-6">
        <div class="max-w-3xl text-center space-y-6">
          <h2
            class="text-4xl font-bold text-gray-900
                   dark:text-white"
          >
            Rate & Reward Teachers
          </h2>

          <p
            class="text-lg text-gray-600
                   dark:text-gray-400"
          >
            Help schools improve education by sharing your feedback and
            supporting great teachers.
          </p>

          <div class="flex justify-center gap-4">
            <Button
  variant="primary"
  size="md"
  @click="goToRateTeacher"
>
  Rate a Teacher
</Button>

            <Button
  variant="primary"
  size="md"
  @click="goToRewardTeacher"
> Reward a Teacher
</Button> 
          </div>
        </div>
      </main>

      <!-- Info Sections -->
      <section
        class="bg-gray-50 px-6 py-12
               dark:bg-gray-950"
      >
        <div class="max-w-5xl mx-auto grid gap-8 md:grid-cols-3">

          <div
            class="p-6 rounded-xl bg-white border border-gray-200
                   dark:bg-gray-900 dark:border-gray-800"
          >
            <h3 class="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
              Rate Teachers
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Share your honest feedback about teachers to help schools
              maintain quality education.
            </p>
          </div>

          <div
            class="p-6 rounded-xl bg-white border border-gray-200
                   dark:bg-gray-900 dark:border-gray-800"
          >
            <h3 class="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
              Reward Excellence
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Support teachers financially as a token of appreciation
              for their hard work.
            </p>
          </div>

          <div
            class="p-6 rounded-xl bg-white border border-gray-200
                   dark:bg-gray-900 dark:border-gray-800"
          >
            <h3 class="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
              No Account Needed
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Parents can rate and reward teachers without creating an
              account.
            </p>
          </div>

        </div>
      </section>

      <!-- Footer -->
      <footer
        class="text-center py-4 text-sm text-gray-500
               dark:text-gray-400"
      >
        © {{ new Date().getFullYear() }} School Management System
      </footer>

    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import FullScreenLayout from "@/components/layout/FullScreenLayout.vue";
import Button from "@/components/ui/Button.vue";
import { useRouter } from "vue-router";

const router = useRouter();

function goToLogin() {
  router.push("/signin");
}

function goToRateTeacher() {
  router.push("/rate-teacher");
}
function goToRewardTeacher() {
  router.push("/reward-teacher");
}
</script>
