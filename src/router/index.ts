import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// 페이지 컴포넌트 - page 폴더에서 임포트
import HomePage from '@/pages/HomePage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import SignupPage from '@/pages/SignupPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: { guest: true },
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupPage,
      meta: { guest: true },
    },
  ],
})

// 네비게이션 가드 설정
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // 인증 상태 검증
  if (!authStore.isAuthenticated && !to.meta.guest) {
    try {
      // 인증 상태 확인 시도 (액세스 토큰 검증)
      await authStore.checkAuth()
      next()
    } catch (error) {
      // 인증 실패시 로그인 페이지로 이동
      next({ name: 'login', query: { redirect: to.fullPath } })
    }
  } else if (authStore.isAuthenticated && to.meta.guest) {
    // 이미 로그인된 사용자가 로그인 페이지에 접근하면 홈으로 리다이렉트
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
