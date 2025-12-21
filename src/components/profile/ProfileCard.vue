<template>
  <div>
    <!-- PROFILE CARD -->
    <div class="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div class="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div class="flex items-center gap-6">
          <div class="w-20 h-20 overflow-hidden border rounded-full dark:border-gray-800">
            <img src="/images/user/image.png" alt="user" />
          </div>

          <div>
            <h4 class="mb-1 text-lg font-semibold text-gray-800 dark:text-white/90">
              {{ profile.name }}
            </h4>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ profile.email }}
            </p>
          </div>
        </div>

        <button @click="isProfileInfoModal = true" class="edit-button">
          Edit
        </button>
      </div>
    </div>

    <!-- EDIT MODAL -->
    <Modal v-if="isProfileInfoModal" fullScreenBackdrop @close="isProfileInfoModal = false">
      <template #body>
        <div class="relative w-full max-w-[600px] rounded-3xl bg-white p-6 dark:bg-gray-900">
          <h4 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Edit Profile
          </h4>
          <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Update your account information
          </p>

          <form @submit.prevent="saveProfile" class="space-y-5">
            <div>
              <label class="label">Name</label>
              <input v-model="form.name" type="text" class="input" />
            </div>

            <div>
              <label class="label">Email</label>
              <input v-model="form.email" type="email" class="input" />
            </div>

            <div>
              <label class="label">New Password</label>
              <input v-model="form.password" type="password" class="input" />
            </div>

            <div>
              <label class="label">Confirm Password</label>
              <input v-model="form.password_confirmation" type="password" class="input" />
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                @click="isProfileInfoModal = false"
                class="btn-outline"
              >
                Cancel
              </button>

              <button
                type="submit"
                class="btn-primary"
                :disabled="saving"
              >
                {{ saving ? 'Saving…' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      </template>
    </Modal>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Modal from '@/components/ui/Modal.vue'
import { api } from '@/services/api'

const isProfileInfoModal = ref(false)
const saving = ref(false)

const profile = ref({
  name: '',
  email: '',
})

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

/* Fetch profile */
const fetchProfile = async () => {
  try {
    const { data } = await api.get('/profile')
    profile.value = data.user
    form.value.name = data.user.name
    form.value.email = data.user.email
  } catch (err) {
    console.error('Failed to load profile', err)
  }
}

/* Update profile */
const saveProfile = async () => {
  saving.value = true
  try {
    await api.post('/profile/update', form.value)
    profile.value.name = form.value.name
    profile.value.email = form.value.email
    isProfileInfoModal.value = false
    form.value.password = ''
    form.value.password_confirmation = ''
  } catch (err) {
    console.error('Failed to update profile', err)
  } finally {
    saving.value = false
  }
}

onMounted(fetchProfile)
</script>

<style scoped>
.label {
  display: block;
  margin-bottom: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}
.dark .label {
  color: #9ca3af;
}

.input {
  width: 100%;
  height: 44px;
  padding: 0 14px;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  background: transparent;
  color: #111827;
}
.dark .input {
  border-color: #374151;
  background: #111827;
  color: rgba(255,255,255,0.9);
}

.btn-primary {
  background: #0ea5a4;
  color: white;
  padding: 0.6rem 1.25rem;
  border-radius: 0.5rem;
}

.btn-outline {
  border: 1px solid #d1d5db;
  padding: 0.6rem 1.25rem;
  border-radius: 0.5rem;
  color: #374151;
}
.dark .btn-outline {
  border-color: #374151;
  color: #9ca3af;
}
</style>

