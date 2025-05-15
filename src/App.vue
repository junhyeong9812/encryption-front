<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
// CSS 모듈 import
import styles from './App.module.css'

const authStore = useAuthStore()
const route = useRoute()

const handleLogout = () => {
  authStore.logout()
}
</script>

<template>
  <!-- 로그인/회원가입 페이지에서는 레이아웃을 표시하지 않음 -->
  <template v-if="route.path === '/login' || route.path === '/signup'">
    <RouterView />
  </template>

  <!-- 그 외 페이지에서는 레이아웃 표시 -->
  <template v-else>
    <div :class="styles.appContainer">
      <header :class="styles.appHeader">
        <div :class="styles.logoContainer">
          <img alt="App logo" class="logo" src="@/assets/logo.svg" width="40" height="40" />
          <h1 :class="styles.appTitle">개인정보 암호화 시스템</h1>
        </div>

        <nav :class="styles.mainNav">
          <RouterLink to="/" :class="styles.navLink" active-class="active">홈</RouterLink>
          <RouterLink to="/about" :class="styles.navLink" active-class="active">소개</RouterLink>

          <div v-if="authStore.isAuthenticated" :class="styles.userMenu">
            <span :class="styles.userName">{{ authStore.user?.maskedName }}님</span>
            <button @click="handleLogout" :class="styles.logoutBtn">로그아웃</button>
          </div>
        </nav>
      </header>

      <main :class="styles.appContent">
        <RouterView />
      </main>

      <footer :class="styles.appFooter">
        <p>&copy; 2025 개인정보 암호화 시스템. All rights reserved.</p>
      </footer>
    </div>
  </template>
</template>
