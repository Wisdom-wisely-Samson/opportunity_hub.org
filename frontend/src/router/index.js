import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    // Public
    { path: '/', component: () => import('@/pages/public/HomePage.vue'), meta: { layout: 'default' } },
    { path: '/opportunities', component: () => import('@/pages/public/OpportunitiesPage.vue'), meta: { layout: 'default' } },
    { path: '/opportunities/:id', component: () => import('@/pages/public/OpportunityDetailPage.vue'), meta: { layout: 'default' } },
    { path: '/about', component: () => import('@/pages/public/AboutPage.vue'), meta: { layout: 'default' } },
    { path: '/contact', component: () => import('@/pages/public/ContactPage.vue'), meta: { layout: 'default' } },
    { path: '/privacy-policy', component: () => import('@/pages/public/PrivacyPolicyPage.vue'), meta: { layout: 'default' } },
    { path: '/terms-of-service', component: () => import('@/pages/public/TermsOfServicePage.vue'), meta: { layout: 'default' } },
    { path: '/cookie-policy', component: () => import('@/pages/public/CookiePolicyPage.vue'), meta: { layout: 'default' } },

    // Auth
    { path: '/login', component: () => import('@/pages/auth/LoginPage.vue'), meta: { layout: 'auth', guestOnly: true } },
    { path: '/register', component: () => import('@/pages/auth/RegisterPage.vue'), meta: { layout: 'auth', guestOnly: true } },
    { path: '/forgot-password', component: () => import('@/pages/auth/ForgotPasswordPage.vue'), meta: { layout: 'auth', guestOnly: true } },
    { path: '/reset-password/:token', component: () => import('@/pages/auth/ResetPasswordPage.vue'), meta: { layout: 'auth' } },
    { path: '/verify-email/:token', component: () => import('@/pages/auth/VerifyEmailPage.vue'), meta: { layout: 'auth' } },

    // Refugee
    { path: '/refugee/dashboard', component: () => import('@/pages/refugee/RefugeeDashboard.vue'), meta: { requiresAuth: true, role: 'refugee', layout: 'refugee' } },
    { path: '/refugee/profile', component: () => import('@/pages/refugee/RefugeeProfile.vue'), meta: { requiresAuth: true, role: 'refugee', layout: 'refugee' } },
    { path: '/refugee/cv', component: () => import('@/pages/refugee/UploadCV.vue'), meta: { requiresAuth: true, role: 'refugee', layout: 'refugee' } },
    { path: '/refugee/saved', component: () => import('@/pages/refugee/SavedOpportunities.vue'), meta: { requiresAuth: true, role: 'refugee', layout: 'refugee' } },
    { path: '/refugee/applications', component: () => import('@/pages/refugee/MyApplications.vue'), meta: { requiresAuth: true, role: 'refugee', layout: 'refugee' } },

    // Organization
    { path: '/org/dashboard', component: () => import('@/pages/organization/OrgDashboard.vue'), meta: { requiresAuth: true, role: 'organization', layout: 'org' } },
    { path: '/org/profile', component: () => import('@/pages/organization/OrgProfile.vue'), meta: { requiresAuth: true, role: 'organization', layout: 'org' } },
    { path: '/org/opportunities/create', component: () => import('@/pages/organization/CreateOpportunity.vue'), meta: { requiresAuth: true, role: 'organization', layout: 'org' } },
    { path: '/refugee/opportunities/create', component: () => import('@/pages/organization/CreateOpportunity.vue'), meta: { requiresAuth: true, role: 'refugee', layout: 'refugee' } },
    { path: '/org/opportunities/:id/edit', component: () => import('@/pages/organization/CreateOpportunity.vue'), meta: { requiresAuth: true, role: 'organization', layout: 'org' } },
    { path: '/org/opportunities', component: () => import('@/pages/organization/ManageOpportunities.vue'), meta: { requiresAuth: true, role: 'organization', layout: 'org' } },
    { path: '/org/applicants', component: () => import('@/pages/organization/ApplicantsPage.vue'), meta: { requiresAuth: true, role: 'organization', layout: 'org' } },

    // Admin
    { path: '/admin/dashboard', component: () => import('@/pages/admin/AdminDashboard.vue'), meta: { requiresAuth: true, role: 'admin', layout: 'admin' } },
    { path: '/admin/users', component: () => import('@/pages/admin/AdminUsers.vue'), meta: { requiresAuth: true, role: 'admin', layout: 'admin' } },
    { path: '/admin/organizations', component: () => import('@/pages/admin/AdminOrganizations.vue'), meta: { requiresAuth: true, role: 'admin', layout: 'admin' } },
    { path: '/admin/opportunities', component: () => import('@/pages/admin/AdminOpportunities.vue'), meta: { requiresAuth: true, role: 'admin', layout: 'admin' } },
    { path: '/admin/reports', component: () => import('@/pages/admin/AdminReports.vue'), meta: { requiresAuth: true, role: 'admin', layout: 'admin' } },

    // 404
    { path: '/:pathMatch(.*)*', component: () => import('@/pages/NotFound.vue') },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    const role = authStore.user?.role
    if (role === 'refugee') return next('/refugee/dashboard')
    if (role === 'organization') return next('/org/dashboard')
    if (role === 'admin') return next('/admin/dashboard')
    return next('/')
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next(`/login?redirect=${encodeURIComponent(to.path)}&authError=${encodeURIComponent('Please sign in to continue.')}`)
  }

  if (to.meta.role && authStore.user?.role !== to.meta.role) {
    const role = authStore.user?.role
    if (role === 'refugee') return next('/refugee/dashboard')
    if (role === 'organization') return next('/org/dashboard')
    if (role === 'admin') return next('/admin/dashboard')
    return next('/')
  }

  next()
})

export default router
