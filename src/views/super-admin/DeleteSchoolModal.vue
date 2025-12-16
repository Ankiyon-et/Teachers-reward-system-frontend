<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
       @click.self="$emit('close')">

    <div class="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-sm w-full">

      <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Delete School?
      </h2>

      <p class="text-gray-600 dark:text-gray-300 mb-6">
        Are you sure you want to delete this school? This action cannot be undone.
      </p>

      <div class="flex justify-end gap-2">
        <button @click="$emit('close')"
                class="px-4 py-2 bg-gray-200 rounded dark:bg-gray-700">
          Cancel
        </button>

        <button @click="$emit('confirm')"
                class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Delete
        </button>
      </div>

    </div>
  </div>
</template>
