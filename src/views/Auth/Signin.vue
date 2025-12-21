<template>
  <FullScreenLayout>
    <div class="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div class="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900">
        <!-- Left side: login form -->
        <div class="flex flex-col flex-1 w-full lg:w-1/2">
          <div class="w-full max-w-md pt-10 mx-auto">
            <router-link
              to="/"
              class="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <svg class="stroke-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12.7083 5L7.5 10.2083L12.7083 15.4167" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Back to dashboard
            </router-link>
          </div>

          <div class="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div>
              <div class="mb-5 sm:mb-8">
                <h1 class="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">Sign In</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">Enter your email and password to sign in!</p>
              </div>

              <!-- Login form -->
              <form @submit.prevent="handleSubmit">
                <div class="space-y-5">
                  <!-- Email -->
                  <div>
                    <label for="email" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Email<span class="text-error-500">*</span></label>
                    <input v-model="email" type="email" id="email" placeholder="info@gmail.com" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"/>
                  </div>

                  <!-- Password -->
                  <div>
                    <label for="password" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Password<span class="text-error-500">*</span></label>
                    <div class="relative">
                      <input v-model="password" :type="showPassword ? 'text' : 'password'" id="password" placeholder="Enter your password" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 py-2.5 pl-4 pr-11 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"/>
                      <span @click="togglePasswordVisibility" class="absolute z-30 text-gray-500 -translate-y-1/2 cursor-pointer right-4 top-1/2 dark:text-gray-400">
                        <!-- Eye icon toggle here -->
                      </span>
                    </div>
                  </div>

                  <!-- Keep me logged in / forgot password -->
                  <div class="flex items-center justify-between">
                    <div>
                      <label for="keepLoggedIn" class="flex items-center text-sm font-normal text-gray-700 cursor-pointer select-none dark:text-gray-400">
                        <div class="relative">
                          <input v-model="keepLoggedIn" type="checkbox" id="keepLoggedIn" class="sr-only"/>
                          <div :class="keepLoggedIn ? 'border-brand-500 bg-brand-500' : 'bg-transparent border-gray-300 dark:border-gray-700'" class="mr-3 flex h-5 w-5 items-center justify-center rounded-md border-[1.25px]">
                            <span :class="keepLoggedIn ? '' : 'opacity-0'">
                              <!-- Checkmark SVG -->
                            </span>
                          </div>
                        </div>
                        Keep me logged in
                      </label>
                    </div>
                    <router-link to="/reset-password" class="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400">Forgot password?</router-link>
                  </div>

                  <!-- Submit button -->
                  <div>
                    <button type="submit" class="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">Sign In</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Right side: illustration -->
        <div class="relative items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
          <div class="flex items-center justify-center z-1">
            <common-grid-shape />
            <div class="flex flex-col items-center max-w-xs">
              <router-link to="/" class="block mb-4">
                <img width="231" height="48" src="/images/logo/auth-logo.png" alt="Logo" />
              </router-link>
              <p class="text-center text-gray-400 dark:text-white/60">School Wallet, a platform to reward teachers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { login } from '@/services/auth'
import { useRouter } from 'vue-router'
import { userToken, setUserToken, setUserRoleId } from '@/composables/useAuth'

import CommonGridShape from '@/components/common/CommonGridShape.vue'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const keepLoggedIn = ref(false)

const router = useRouter()

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleSubmit = async () => {
  try {
    const response = await login(email.value, password.value)

    // Save token and role
    if (keepLoggedIn.value) {
      localStorage.setItem('token', response.token)
      localStorage.setItem('role_id', response.user.role_id.toString())
    } 
    // else {
    //   sessionStorage.setItem('token', response.token)
    //   sessionStorage.setItem('role_id', response.user.role_id.toString())
    // }

    // Update reactive role in composable
    setUserToken(response.token);
    setUserRoleId(response.user.role_id)

    // Redirect based on role
    switch (response.user.role_id) {
      case 1:
        router.push('/super-admin/dashboard')
        break
      case 2:
        router.push('/school-admin/dashboard')
        break
      case 3:
        router.push('/teacher/dashboard')
        break
      default:
        router.push('/dashboard')
    }
  } catch (error) {
    console.error(error)
    alert('Invalid email or password')
  }

  const response = await login(email.value, password.value);
console.log("LOGIN RESPONSE:", response);
}
</script>
