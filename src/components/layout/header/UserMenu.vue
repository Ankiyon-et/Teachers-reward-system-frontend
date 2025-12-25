<template>
  <div class="relative" ref="dropdownRef">
    <!-- Trigger -->
    <button
      class="flex items-center text-gray-700 dark:text-gray-400"
      @click.prevent="toggleDropdown"
    >
      <span class="mr-3 overflow-hidden rounded-full h-11 w-11">
        <img
          src="/images/user/image.png"
          alt="User"
          class="h-full w-full object-cover"
        />
      </span>

      <span class="block mr-1 font-medium text-theme-sm">
        {{ user?.name || 'Loading…' }}
      </span>

      <ChevronDownIcon :class="{ 'rotate-180': dropdownOpen }" />
    </button>

    <!-- Dropdown -->
    <div
      v-if="dropdownOpen"
      class="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl
             border border-gray-200 bg-white p-3 shadow-theme-lg
             dark:border-gray-800 dark:bg-gray-dark"
    >
      <!-- User Info -->
      <div>
        <span class="block font-medium text-gray-700 text-theme-sm dark:text-gray-300">
          {{ user?.name }}
        </span>
        <span class="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
          {{ user?.email }}
        </span>
      </div>

      <!-- Menu -->
      <ul
        class="flex flex-col gap-1 pt-4 pb-3 border-b
               border-gray-200 dark:border-gray-800"
      >
        <li v-for="item in menuItems" :key="item.href">
          <router-link
            :to="item.href"
            class="flex items-center gap-3 px-3 py-2 font-medium rounded-lg
                   text-theme-sm text-gray-700 hover:bg-gray-100
                   dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            @click="closeDropdown"
          >
            <component
              :is="item.icon"
              class="text-gray-500 dark:text-gray-400"
            />
            {{ item.text }}
          </router-link>
        </li>
      </ul>

      <!-- Logout -->
      <button
        @click="signOut"
        class="flex items-center gap-3 px-3 py-2 mt-3 font-medium rounded-lg
               text-theme-sm text-gray-700 hover:bg-gray-100
               dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
      >
        <LogoutIcon class="text-gray-500 dark:text-gray-400" />
        Sign out
      </button>
    </div>
  </div>
</template>


<script setup lang="ts">
import {
  ChevronDownIcon,
  InfoCircleIcon,
  LogoutIcon,
  SettingsIcon,
  UserCircleIcon,
} from '@/icons'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/services/api'
import { userToken } from '@/composables/useAuth'

const router = useRouter()

const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const user = ref<{ id: number; name: string; email: string } | null>(null)

const menuItems = [
  { href: '/profile', icon: UserCircleIcon, text: 'Edit profile' },
  // { href: '/profile', icon: SettingsIcon, text: 'Account settings' },
  // { href: '/support', icon: InfoCircleIcon, text: 'Support' },
]

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

/* Fetch profile */
const fetchProfile = async () => {
  try {
    const { data } = await api.get('/profile')
    user.value = data.user
  } catch (error) {
    console.error('Failed to load profile', error)
  }
}

/* Logout */
const signOut = () => {
  // userToken.value = null
  localStorage.removeItem('token')
  closeDropdown()
  router.replace('/')
}

/* Click outside */
const handleClickOutside = (event: Event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

onMounted(() => {
  if (userToken.value) {
    fetchProfile()
  }
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

