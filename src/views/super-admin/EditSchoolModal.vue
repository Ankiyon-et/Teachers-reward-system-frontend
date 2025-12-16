<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
       @click.self="$emit('close')">

    <div class="bg-white dark:bg-gray-900 rounded-lg w-full max-w-xl p-6">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Edit School
      </h2>

      <form @submit.prevent="submit" class="space-y-4">
        
        <div>
          <label class="block text-sm mb-1">School Name *</label>
          <input v-model="school_name" type="text"
                 class="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"/>
        </div>

        <div>
          <label class="block text-sm mb-1">Address *</label>
          <input v-model="address" type="text"
                 class="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"/>
        </div>

        <div>
          <label class="block text-sm mb-1">Description</label>
          <textarea v-model="description"
                    class="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"></textarea>
        </div>

        <div class="mt-6 flex justify-end gap-2">
          <button @click="$emit('close')" type="button"
                  class="px-4 py-2 bg-gray-200 rounded dark:bg-gray-700">
            Cancel
          </button>

          <button type="submit"
                  class="px-4 py-2 bg-brand-500 text-white rounded hover:bg-brand-600">
            Update
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['close', 'updated'])
const props = defineProps({
  school: Object
})

const school_name = ref(props.school.name)
const address = ref(props.school.address)
const description = ref(props.school.description)

const submit = () => {
  emit('updated', {
    school_name: school_name.value,
    address: address.value,
    description: description.value
  })
}
</script>
