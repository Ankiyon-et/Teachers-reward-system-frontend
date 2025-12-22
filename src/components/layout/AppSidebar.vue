<template>
  <aside
    :class="[
      'fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-99999 border-r border-gray-200',
      {
        'lg:w-[290px]': isExpanded || isMobileOpen || isHovered,
        'lg:w-[90px]': !isExpanded && !isHovered,
        'translate-x-0 w-[290px]': isMobileOpen,
        '-translate-x-full': !isMobileOpen,
        'lg:translate-x-0': true,
      },
    ]"
    @mouseenter="!isExpanded && (isHovered = true)"
    @mouseleave="isHovered = false"
  >
    <!-- Logo -->
    <div :class="['py-8 flex', !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start']">
      <router-link to="/">
        <img v-if="isExpanded || isHovered || isMobileOpen" class="dark:hidden" src="/images/logo/logo.png" alt="Logo" width="150" height="40" />
        <img v-if="isExpanded || isHovered || isMobileOpen" class="hidden dark:block" src="/images/logo/logo-dark.png" alt="Logo" width="150" height="40" />
        <img v-else src="/images/logo/logo-icon.svg" alt="Logo" width="32" height="32" />
      </router-link>
    </div>

    <!-- Menu -->
    <div class="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
      <nav class="mb-6">
        <div class="flex flex-col gap-4">
          <div v-for="(menuGroup, groupIndex) in menuGroups" :key="groupIndex">
            <h2 :class="['mb-4 text-xs uppercase flex leading-[20px] text-gray-400', !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start']">
              <template v-if="isExpanded || isHovered || isMobileOpen">{{ menuGroup.title }}</template>
              <HorizontalDots v-else />
            </h2>

            <ul class="flex flex-col gap-4">
              <li v-for="(item, itemIndex) in menuGroup.items" :key="item.name">
                <button v-if="item.subItems" @click="toggleSubmenu(groupIndex, itemIndex)"
                  :class="['menu-item group w-full', { 'menu-item-active': isSubmenuOpen(groupIndex, itemIndex), 'menu-item-inactive': !isSubmenuOpen(groupIndex, itemIndex) }, !isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start']">
                  <span :class="[isSubmenuOpen(groupIndex, itemIndex) ? 'menu-item-icon-active' : 'menu-item-icon-inactive']">
                    <component :is="item.icon" />
                  </span>
                  <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text">{{ item.name }}</span>
                  <ChevronDownIcon v-if="isExpanded || isHovered || isMobileOpen" :class="['ml-auto w-5 h-5 transition-transform duration-200', { 'rotate-180 text-brand-500': isSubmenuOpen(groupIndex, itemIndex) }]" />
                </button>

                <router-link v-else-if="item.path" :to="item.path"
                  :class="['menu-item group', { 'menu-item-active': isActive(item.path), 'menu-item-inactive': !isActive(item.path) }]">
                  <span :class="[isActive(item.path) ? 'menu-item-icon-active' : 'menu-item-icon-inactive']">
                    <component :is="item.icon" />
                  </span>
                  <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text">{{ item.name }}</span>
                </router-link>

                <transition @enter="startTransition" @after-enter="endTransition" @before-leave="startTransition" @after-leave="endTransition">
                  <div v-show="isSubmenuOpen(groupIndex, itemIndex) && (isExpanded || isHovered || isMobileOpen)">
                    <ul class="mt-2 space-y-1 ml-9">
                      <li v-for="subItem in item.subItems" :key="subItem.name">
                        <router-link :to="subItem.path" :class="['menu-dropdown-item', { 'menu-dropdown-item-active': isActive(subItem.path), 'menu-dropdown-item-inactive': !isActive(subItem.path) }]">
                          {{ subItem.name }}
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </transition>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <SidebarWidget v-if="isExpanded || isHovered || isMobileOpen" />
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { GridIcon, CalenderIcon, UserCircleIcon, PieChartIcon, ChevronDownIcon, HorizontalDots, PageIcon, TableIcon, ListIcon, PlugInIcon } from "../../icons";
import SidebarWidget from "./SidebarWidget.vue";
import BoxCubeIcon from "@/icons/BoxCubeIcon.vue";
import { useSidebar } from "@/composables/useSidebar";
import { userRoleId } from '@/composables/useAuth';

const route = useRoute();
const { isExpanded, isMobileOpen, isHovered, openSubmenu } = useSidebar();

// MENU GROUPS (original template + role pages)
const allMenuGroups = [
  {
    title: "Menu",
    items: [
      { icon: UserCircleIcon, name: "User Profile", path: "/profile" },
    ],
  },
  {
    title: "Roles Pages",
    items: [
      // Super Admin
      {
        roleId: 1,
        icon: GridIcon,
        name: "Super Admin",
        subItems: [
          { name: "Dashboard", path: "/super-admin/dashboard", pro: false },
          { name: "Schools", path: "/super-admin/schools", pro: false },
          { name: "Super Admins", path: "/super-admin/super-admins", pro: false },
        ]
      },
      // School Admin
      {
        roleId: 2,
        icon: UserCircleIcon,
        name: "School Admin",
        subItems: [
          { name: "Dashboard", path: "/school-admin/dashboard", pro: false },
          { name: "Teachers", path: "/school-admin/teachers", pro: false },
          { name: "Grades", path: "/school-admin/grades", pro: false },
        ]
      },
      // Teacher
      {
        roleId: 3,
        icon: ListIcon,
        name: "Teacher",
        subItems: [
          { name: "Dashboard", path: "/teacher/dashboard", pro: false },
          { name: "My Classes", path: "/teacher/classes", pro: false },
          { name: "Assignments", path: "/teacher/assignments", pro: false },
        ]
      }
    ]
  }
];

// FILTER MENU BY ROLE
const menuGroups = computed(() => {
  return allMenuGroups.map(group => {
    if (group.title === "Roles Pages") {
      return {
        ...group,
        items: group.items.filter(item => item.roleId === userRoleId.value)
      };
    }
    return group;
  });
});

const isActive = path => route.path === path;

const toggleSubmenu = (groupIndex, itemIndex) => {
  const key = `${groupIndex}-${itemIndex}`;
  openSubmenu.value = openSubmenu.value === key ? null : key;
};

const isAnySubmenuRouteActive = computed(() =>
  menuGroups.value.some(group =>
    group.items.some(item => item.subItems?.some(subItem => isActive(subItem.path)))
  )
);

const isSubmenuOpen = (groupIndex, itemIndex) => {
  const key = `${groupIndex}-${itemIndex}`;
  return (
    openSubmenu.value === key ||
    (isAnySubmenuRouteActive.value &&
      menuGroups.value[groupIndex].items[itemIndex].subItems?.some(subItem => isActive(subItem.path)))
  );
};

const startTransition = el => {
  el.style.height = "auto";
  const height = el.scrollHeight;
  el.style.height = "0px";
  el.offsetHeight;
  el.style.height = height + "px";
};

const endTransition = el => {
  el.style.height = "";
};
</script>
