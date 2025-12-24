<template>
  <div
    class="overflow-hidden rounded-xl border border-gray-200 bg-white
           dark:border-gray-800 dark:bg-white/[0.03]"
  >
    <div class="max-w-full overflow-x-auto custom-scrollbar">
      <table class="min-w-full">

        <!-- HEADER -->
        <thead>
          <tr class="border-b border-gray-200 dark:border-gray-700">
            <th class="px-5 py-3 text-left sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                School
              </p>
            </th>
            <th class="px-5 py-3 text-left sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                Address
              </p>
            </th>
            <th class="px-5 py-3 text-left sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                Email
              </p>
            </th>
            <th class="px-5 py-3 text-left sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                Admin
              </p>
            </th>
            <th class="px-5 py-3 text-left sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                Created
              </p>
            </th>
          </tr>
        </thead>

        <!-- BODY -->
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            v-for="school in schools"
            :key="school.id"
            class="border-t border-gray-100 dark:border-gray-800"
          >
            <!-- School -->
            <td class="px-5 py-4 sm:px-6">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <img
                    v-if="school.logo"
                    :src="school.logo"
                    alt="logo"
                    class="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <span class="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {{ school.name }}
                  </span>
                  <span class="block text-gray-500 text-theme-xs dark:text-gray-400">
                    {{ school.description }}
                  </span>
                </div>
              </div>
            </td>

            <!-- Address -->
            <td class="px-5 py-4 sm:px-6">
              <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                {{ school.address }}
              </p>
            </td>

            <!-- Email -->
            <td class="px-5 py-4 sm:px-6">
              <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                {{ school.contact_email }}
              </p>
            </td>

            <!-- Admin -->
            <td class="px-5 py-4 sm:px-6">
              <span class="block text-gray-800 text-theme-sm dark:text-white/90">
                {{ school.admin_name || '—' }}
              </span>
            </td>

            <!-- Created -->
            <td class="px-5 py-4 sm:px-6">
              <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                {{ formatDate(school.created_at) }}
              </p>
            </td>
          </tr>
        </tbody>

      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  schools: {
    type: Array,
    required: true,
  },
})

function formatDate(date) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}
</script>


<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(107, 114, 128, 0.4);
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
}
</style>
