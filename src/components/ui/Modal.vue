<template>
  <div class="fixed inset-0 z-99999 flex items-center justify-center overflow-y-auto">
    <!-- Backdrop -->
    <div
      v-if="fullScreenBackdrop"
      class="fixed inset-0 bg-gray-400/50 backdrop-blur-[32px]"
      aria-hidden="true"
      @click="$emit('close')"
    ></div>

    <!-- Modal content -->
    <div class="relative z-10">
      <slot name="body"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ModalProps {
  fullScreenBackdrop?: boolean
}

defineProps<ModalProps>()
defineEmits(['close'])
</script>
