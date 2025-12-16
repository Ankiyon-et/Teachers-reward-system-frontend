<template>
  <div class="relative" v-click-outside="closeDropdown" ref="dropdown">
    <!-- Dropdown Trigger Button -->
    <button @click="toggleDropdown" :class="buttonClass">
      <slot name="icon">
        <!-- Default icon if no slot provided -->
        <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M5.999 10.245C6.966 10.245 7.749 11.0285 7.749 11.995V12.005C7.749 12.9715 6.966 13.755 5.999 13.755C5.033 13.755 4.249 12.9715 4.249 12.005V11.995C4.249 11.0285 5.033 10.245 5.999 10.245ZM17.999 10.245C18.966 10.245 19.749 11.0285 19.749 11.995V12.005C19.749 12.9715 18.966 13.755 17.999 13.755C17.033 13.755 16.249 12.9715 16.249 12.005V11.995C16.249 11.0285 17.033 10.245 17.999 10.245ZM13.749 11.995C13.749 11.0285 12.966 10.245 11.999 10.245C11.033 10.245 10.249 11.0285 10.249 11.995V12.005C10.249 12.9715 11.033 13.755 11.999 13.755C12.966 13.755 13.749 12.9715 13.749 12.005V11.995Z"
            fill="currentColor"
          />
        </svg>
      </slot>
    </button>

    <!-- Dropdown Menu -->
    <div v-if="open" :class="menuClass">
      <slot name="menu">
        <template v-for="(item, index) in menuItems" :key="index">
          <router-link
            v-if="item.to"
            :to="item.to"
            @click.native="handleMenuItemClick(item.onClick)"
            :class="itemClass"
          >
            {{ item.label }}
          </router-link>

          <button
            v-else
            @click="handleMenuItemClick(item.onClick)"
            :class="itemClass"
          >
            {{ item.label }}
          </button>
        </template>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineSlots } from 'vue'
import vClickOutside from './v-click-outside.vue'

interface MenuItem {
  label: string
  onClick?: () => void
  to?: string
}

const props = defineProps<{
  menuItems: MenuItem[]
  buttonClass?: string
  menuClass?: string
  itemClass?: string
}>()

// THIS is the key part: define slots for TypeScript
defineSlots<{
  icon?: () => any
  menu?: () => any
}>()

const open = ref(false)

const toggleDropdown = () => { open.value = !open.value }
const closeDropdown = () => { open.value = false }
const handleMenuItemClick = (callback?: () => void) => {
  if (callback) callback()
  closeDropdown()
}
</script>

<script lang="ts">
export default {
  directives: { clickOutside: vClickOutside }
}
</script>
