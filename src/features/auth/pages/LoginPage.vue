<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { RouterLink } from 'vue-router'
import type { LoginRequest } from '@/features/auth/types/auth.types'
// CSS 모듈 import
import styles from '../styles/LoginPage.module.css'

const authStore = useAuthStore()

// 로그인 탭 관리
const activeTab = ref('user') // 'user' 또는 'admin'

// 로그인 폼 데이터
const userLoginForm = ref<LoginRequest>({
  email: '',
  password: '',
})

const adminLoginForm = ref<LoginRequest>({
  email: '',
  password: '',
})

// 폼 유효성 검사
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/

const isUserFormValid = computed(() => {
  return emailRegex.test(userLoginForm.value.email) && userLoginForm.value.password.length >= 8
})

const isAdminFormValid = computed(() => {
  return emailRegex.test(adminLoginForm.value.email) && adminLoginForm.value.password.length >= 8
})

// 에러 메시지
const userFormErrors = ref({
  email: '',
  password: '',
  form: '',
})

const adminFormErrors = ref({
  email: '',
  password: '',
  form: '',
})

// 로그인 처리
const handleUserLogin = async () => {
  // 폼 에러 초기화
  userFormErrors.value = {
    email: '',
    password: '',
    form: '',
  }

  // 이메일 유효성 검사
  if (!emailRegex.test(userLoginForm.value.email)) {
    userFormErrors.value.email = '유효한 이메일 주소를 입력해주세요.'
    return
  }

  // 비밀번호 유효성 검사
  if (userLoginForm.value.password.length < 8) {
    userFormErrors.value.password = '비밀번호는 8자 이상이어야 합니다.'
    return
  }

  try {
    await authStore.login(userLoginForm.value)
  } catch (error: unknown) {
    userFormErrors.value.form = error as string
  }
}

const handleAdminLogin = async () => {
  // 폼 에러 초기화
  adminFormErrors.value = {
    email: '',
    password: '',
    form: '',
  }

  // 이메일 유효성 검사
  if (!emailRegex.test(adminLoginForm.value.email)) {
    adminFormErrors.value.email = '유효한 이메일 주소를 입력해주세요.'
    return
  }

  // 비밀번호 유효성 검사
  if (adminLoginForm.value.password.length < 8) {
    adminFormErrors.value.password = '비밀번호는 8자 이상이어야 합니다.'
    return
  }

  try {
    // Admin API 호출 (예시로 일반 로그인 API 사용)
    await authStore.login(adminLoginForm.value)
  } catch (error: unknown) {
    adminFormErrors.value.form = error as string
  }
}

// 탭 전환
const switchToUserTab = () => {
  activeTab.value = 'user'
}

const switchToAdminTab = () => {
  activeTab.value = 'admin'
}
</script>

<template>
  <div :class="styles.loginContainer">
    <div :class="styles.loginCard">
      <div :class="styles.loginTabs">
        <div
          :class="[styles.tab, activeTab === 'user' ? styles.active : '']"
          @click="switchToUserTab"
        >
          사용자 로그인
        </div>
        <div
          :class="[styles.tab, activeTab === 'admin' ? styles.active : '']"
          @click="switchToAdminTab"
        >
          관리자 로그인
        </div>
      </div>

      <div :class="styles.loginContent">
        <!-- 사용자 로그인 폼 -->
        <form
          v-if="activeTab === 'user'"
          @submit.prevent="handleUserLogin"
          :class="styles.loginForm"
        >
          <h2>사용자 로그인</h2>

          <div :class="[styles.formAlert, styles.error]" v-if="userFormErrors.form">
            {{ userFormErrors.form }}
          </div>

          <div :class="styles.formGroup">
            <label :class="styles.formLabel" for="user-email">이메일</label>
            <input
              type="email"
              id="user-email"
              v-model="userLoginForm.email"
              placeholder="이메일을 입력하세요"
              :class="[styles.formInput, userFormErrors.email ? styles.isInvalid : '']"
            />
            <div :class="styles.invalidFeedback" v-if="userFormErrors.email">
              {{ userFormErrors.email }}
            </div>
          </div>

          <div :class="styles.formGroup">
            <label :class="styles.formLabel" for="user-password">비밀번호</label>
            <input
              type="password"
              id="user-password"
              v-model="userLoginForm.password"
              placeholder="비밀번호를 입력하세요"
              :class="[styles.formInput, userFormErrors.password ? styles.isInvalid : '']"
            />
            <div :class="styles.invalidFeedback" v-if="userFormErrors.password">
              {{ userFormErrors.password }}
            </div>
          </div>

          <div :class="styles.formActions">
            <button
              type="submit"
              :class="styles.btnLogin"
              :disabled="!isUserFormValid || authStore.isLoading"
            >
              {{ authStore.isLoading ? '로그인 중...' : '로그인' }}
            </button>
          </div>

          <div :class="styles.formLinks">
            <a href="#" :class="styles.link">비밀번호 찾기</a>
            <span :class="styles.divider">|</span>
            <RouterLink to="/signup" :class="styles.link">회원가입</RouterLink>
          </div>
        </form>

        <!-- 관리자 로그인 폼 -->
        <form
          v-if="activeTab === 'admin'"
          @submit.prevent="handleAdminLogin"
          :class="styles.loginForm"
        >
          <h2>관리자 로그인</h2>

          <div :class="[styles.formAlert, styles.error]" v-if="adminFormErrors.form">
            {{ adminFormErrors.form }}
          </div>

          <div :class="styles.formGroup">
            <label :class="styles.formLabel" for="admin-email">관리자 이메일</label>
            <input
              type="email"
              id="admin-email"
              v-model="adminLoginForm.email"
              placeholder="관리자 이메일을 입력하세요"
              :class="[styles.formInput, adminFormErrors.email ? styles.isInvalid : '']"
            />
            <div :class="styles.invalidFeedback" v-if="adminFormErrors.email">
              {{ adminFormErrors.email }}
            </div>
          </div>

          <div :class="styles.formGroup">
            <label :class="styles.formLabel" for="admin-password">비밀번호</label>
            <input
              type="password"
              id="admin-password"
              v-model="adminLoginForm.password"
              placeholder="비밀번호를 입력하세요"
              :class="[styles.formInput, adminFormErrors.password ? styles.isInvalid : '']"
            />
            <div :class="styles.invalidFeedback" v-if="adminFormErrors.password">
              {{ adminFormErrors.password }}
            </div>
          </div>

          <div :class="styles.formActions">
            <button
              type="submit"
              :class="styles.btnLogin"
              :disabled="!isAdminFormValid || authStore.isLoading"
            >
              {{ authStore.isLoading ? '로그인 중...' : '관리자 로그인' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
