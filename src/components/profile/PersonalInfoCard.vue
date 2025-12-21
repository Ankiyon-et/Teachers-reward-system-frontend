<template>
  <div>
    <div
      class="p-5 mb-6 border border-gray-200 rounded-2xl
             dark:border-gray-800 lg:p-6"
    >
      <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4
            class="text-lg font-semibold text-gray-800
                   dark:text-white/90 lg:mb-6"
          >
            Personal Information
          </h4>

          <div
            class="grid grid-cols-1 gap-4
                   lg:grid-cols-2 lg:gap-7 2xl:gap-x-32"
          >
            <div>
              <p class="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Name
              </p>
              <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                {{ profile.name || '—' }}
              </p>
            </div>

            <div>
              <p class="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Email address
              </p>
              <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                {{ profile.email || '—' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/services/api'

const profile = ref<{
  name: string
  email: string
}>({
  name: '',
  email: '',
})

const fetchProfile = async () => {
  const { data } = await api.get('/profile')
  profile.value = data.user
}

onMounted(fetchProfile)
</script>
