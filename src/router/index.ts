import { createRouter, createWebHistory } from 'vue-router'
import { userRoleId } from '@/composables/useAuth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },

  routes: [
    // --------------------
    // Public routes
    // --------------------
    {
      path: '/',
      component: () => import('../views/ParentLanding.vue'),
      meta: { title: 'Landing Page' },
    },
    {
      path: '/reward-teacher',
      component: () => import('../views/RewardTeacher.vue'),
      meta: { title: 'Teacher Rewarding' },
    },
    {
      path: '/rate-teacher',
      component: () => import('../views/RateTeacher.vue'),
      meta: { title: 'Teacher Rating' },
    },
    {
      path: '/calendar',
      component: () => import('../views/Tables/BasicTables.vue'),
      meta: { title: 'Calendar' },
    },
    {
      path: '/profile',
      component: () => import('../views/Others/UserProfile.vue'),
      meta: { title: 'Profile' },
    },
    {
      path: '/signin',
      component: () => import('../views/Auth/Signin.vue'),
      meta: { title: 'Signin' },
    },
    {
      path: '/signup',
      component: () => import('../views/Auth/Signup.vue'),
      meta: { title: 'Signup' },
    },

    // --------------------
    // Super Admin (role = 1)
    // --------------------
    {
      path: '/super-admin/dashboard',
      component: () => import('../views/super-admin/Dashboard.vue'),
      meta: { role: 1, title: 'Super Admin Dashboard' },
    },
    {
      path: '/super-admin/schools',
      component: () => import('../views/super-admin/Schools.vue'),
      meta: { role: 1, title: 'Schools' },
    },
    {
      path: '/super-admin/super-admins',
      component: () => import('../views/super-admin/SuperAdmins.vue'),
      meta: { role: 1, title: 'Super Admins' },
    },
    {
      path: '/super-admin/schools/:id',
      name: 'SuperAdminSchoolDetail',
      component: () => import('../views/super-admin/SchoolDetail.vue'),
    },
    {
      path: '/super-admin/grades',
      component: () => import('../views/super-admin/Grades.vue'),
      meta: { role: 1, title: 'Grades' },
    },


    // --------------------
    // School Admin (role = 2)
    // --------------------
    {
      path: '/school-admin/dashboard',
      component: () => import('../views/school-admin/Dashboard.vue'),
      meta: { role: 2, title: 'School Admin Dashboard' },
    },
    {
      path: '/school-admin/teachers',
      component: () => import('../views/school-admin/Teachers.vue'),
      meta: { role: 2, title: 'Teachers' },
    },
    {
      path: '/school-admin/grades',
      component: () => import('../views/school-admin/Grades.vue'),
      meta: { role: 2, title: 'Grades' },
    },

    // --------------------
    // Teacher (role = 3)
    // --------------------
    {
      path: '/teacher/dashboard',
      component: () => import('../views/teacher/Dashboard.vue'),
      meta: { role: 3, title: 'Teacher Dashboard' },
    },
    {
      path: '/teacher/ratings',
      component: () => import('../views/teacher/Ratings.vue'),
      meta: { role: 3, title: 'Ratings' },
    },
    {
      path: '/teacher/rewards',
      component: () => import('../views/teacher/Rewards.vue'),
      meta: { role: 3, title: 'Rewards' },
    },
    {
      path: '/teacher/withdrawals',
      component: () => import('../views/teacher/Withdrawals.vue'),
      meta: { role: 3, title: 'Withdrawals' },
    },


    // --------------------
    // Errors
    // --------------------
    {
      path: '/error-404',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: { title: '404 Error' },
    },

    // Catch-all
    {
      path: '/:pathMatch(.*)*',
      redirect: '/error-404',
    },
  ],
})

/* ===========================
   GLOBAL AUTH & TITLE GUARD
   =========================== */
router.beforeEach((to, from, next) => {
  // Set page title
  if (to.meta?.title) {
    document.title = `Vue.js ${to.meta.title} | Teachers reward system`
  }

  const requiredRole = to.meta?.role as number | undefined

  // Role-protected route
  if (requiredRole) {
    // Not logged in
    if (!userRoleId.value) {
      return next('/signin')
    }

    // Wrong role
    if (userRoleId.value !== requiredRole) {
      return next('/error-404')
    }
  }

  next()
})

export default router
