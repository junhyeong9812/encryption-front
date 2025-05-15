<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { RouterLink } from 'vue-router'
import type { SignupRequest } from '@/features/auth/types/auth.types'
import styles from '../styles/SignupPage.module.css'

const authStore = useAuthStore()

const signupForm = ref<SignupRequest>({
  name: '',
  email: '',
  password: '',
  phone: '',
  ssn: '',
  address: {
    zipCode: '',
    region: '',
    regionCode: '',
    city: '',
    cityCode: '',
    detail: '',
    address1: '',
    address2: '',
  },
})

const confirmPassword = ref('')

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
const phoneRegex = /^[0-9]{10,11}$/
const ssnRegex = /^[0-9]{13}$/
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/

const formErrors = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  ssn: '',
  zipCode: '',
  address1: '',
  form: '',
})

const isFormValid = computed(() => {
  const { name, email, password, phone } = signupForm.value
  return (
    name.length >= 2 &&
    emailRegex.test(email) &&
    passwordRegex.test(password) &&
    password === confirmPassword.value &&
    phoneRegex.test(phone.replace(/-/g, ''))
  )
})

const searchZipCode = () => {
  alert('우편번호 검색 기능은 Daum 우편번호 서비스 등을 연동하여 구현할 수 있습니다.')
  if (signupForm.value.address) {
    signupForm.value.address = {
      ...signupForm.value.address,
      zipCode: '06164',
      region: '서울',
      regionCode: '11',
      city: '강남구',
      cityCode: '11230',
      detail: '테헤란로 123',
      address1: '서울특별시 강남구 테헤란로 123',
      address2: '',
    }
  }
}

const handleSignup = async () => {
  formErrors.value = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    ssn: '',
    zipCode: '',
    address1: '',
    form: '',
  }

  if (signupForm.value.name.length < 2) {
    formErrors.value.name = '이름은 2자 이상이어야 합니다.'
    return
  }

  if (!emailRegex.test(signupForm.value.email)) {
    formErrors.value.email = '유효한 이메일 주소를 입력해주세요.'
    return
  }

  if (!passwordRegex.test(signupForm.value.password)) {
    formErrors.value.password = '비밀번호는 8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.'
    return
  }

  if (signupForm.value.password !== confirmPassword.value) {
    formErrors.value.confirmPassword = '비밀번호가 일치하지 않습니다.'
    return
  }

  if (!phoneRegex.test(signupForm.value.phone.replace(/-/g, ''))) {
    formErrors.value.phone = '유효한 전화번호를 입력해주세요. (10~11자리 숫자)'
    return
  }

  if (signupForm.value.ssn && !ssnRegex.test(signupForm.value.ssn.replace(/-/g, ''))) {
    formErrors.value.ssn = '유효한 주민등록번호를 입력해주세요. (13자리 숫자)'
    return
  }

  try {
    const formattedData = {
      ...signupForm.value,
      phone: signupForm.value.phone.replace(/-/g, ''),
      ssn: signupForm.value.ssn ? signupForm.value.ssn.replace(/-/g, '') : undefined,
      address: signupForm.value.address
        ? {
            ...signupForm.value.address,
            detail: signupForm.value.address.address2 || '',
          }
        : undefined,
    }
    await authStore.signup(formattedData)
  } catch (error: unknown) {
    formErrors.value.form = error as string
  }
}
</script>

<template>
  <div :class="styles.signupContainer">
    <div :class="styles.signupCard">
      <h2 :class="styles.signupTitle">회원가입</h2>
      <div :class="[styles.formAlert, styles.error]" v-if="formErrors.form">
        {{ formErrors.form }}
      </div>
      <form @submit.prevent="handleSignup" :class="styles.signupForm">
        <div :class="styles.formGroup">
          <label :class="styles.formLabel" for="name">이름 *</label>
          <input
            type="text"
            id="name"
            v-model="signupForm.name"
            :class="[styles.formInput, formErrors.name ? styles.isInvalid : '']"
            placeholder="이름을 입력하세요"
          />
          <div :class="styles.invalidFeedback" v-if="formErrors.name">{{ formErrors.name }}</div>
        </div>
        <div :class="styles.formGroup">
          <label :class="styles.formLabel" for="email">이메일 *</label>
          <input
            type="email"
            id="email"
            v-model="signupForm.email"
            :class="[styles.formInput, formErrors.email ? styles.isInvalid : '']"
            placeholder="이메일을 입력하세요"
          />
          <div :class="styles.invalidFeedback" v-if="formErrors.email">{{ formErrors.email }}</div>
        </div>
        <div :class="styles.formGroup">
          <label :class="styles.formLabel" for="password">비밀번호 *</label>
          <input
            type="password"
            id="password"
            v-model="signupForm.password"
            :class="[styles.formInput, formErrors.password ? styles.isInvalid : '']"
            placeholder="비밀번호를 입력하세요"
          />
          <div :class="styles.invalidFeedback" v-if="formErrors.password">
            {{ formErrors.password }}
          </div>
          <div :class="styles.formHint">
            비밀번호는 8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.
          </div>
        </div>
        <div :class="styles.formGroup">
          <label :class="styles.formLabel" for="confirm-password">비밀번호 확인 *</label>
          <input
            type="password"
            id="confirm-password"
            v-model="confirmPassword"
            :class="[styles.formInput, formErrors.confirmPassword ? styles.isInvalid : '']"
            placeholder="비밀번호를 다시 입력하세요"
          />
          <div :class="styles.invalidFeedback" v-if="formErrors.confirmPassword">
            {{ formErrors.confirmPassword }}
          </div>
        </div>
        <div :class="styles.formGroup">
          <label :class="styles.formLabel" for="phone">전화번호 *</label>
          <input
            type="tel"
            id="phone"
            v-model="signupForm.phone"
            :class="[styles.formInput, formErrors.phone ? styles.isInvalid : '']"
            placeholder="전화번호를 입력하세요 (예: 01012345678)"
          />
          <div :class="styles.invalidFeedback" v-if="formErrors.phone">{{ formErrors.phone }}</div>
        </div>
        <div :class="styles.formGroup">
          <label :class="styles.formLabel" for="ssn">주민등록번호 (선택)</label>
          <input
            type="text"
            id="ssn"
            v-model="signupForm.ssn"
            :class="[styles.formInput, formErrors.ssn ? styles.isInvalid : '']"
            placeholder="주민등록번호를 입력하세요 (예: 8501011234567)"
          />
          <div :class="styles.invalidFeedback" v-if="formErrors.ssn">{{ formErrors.ssn }}</div>
        </div>
        <div :class="styles.addressSection">
          <h3 :class="styles.addressTitle">주소 (선택)</h3>
          <div :class="[styles.formGroup, styles.zipcodeGroup]">
            <label :class="styles.formLabel" for="zipcode">우편번호</label>
            <div :class="styles.zipcodeInput">
              <input
                type="text"
                id="zipcode"
                v-model="signupForm.address.zipCode"
                readonly
                :class="[styles.formInput, styles.zipcodeInputField]"
                placeholder="우편번호"
              />
              <button type="button" :class="styles.btnSearch" @click="searchZipCode">검색</button>
            </div>
          </div>
          <div :class="styles.formGroup">
            <label :class="styles.formLabel" for="address1">기본주소</label>
            <input
              type="text"
              id="address1"
              v-model="signupForm.address.address1"
              readonly
              :class="styles.formInput"
              placeholder="기본주소"
            />
          </div>
          <div :class="styles.formGroup">
            <label :class="styles.formLabel" for="address2">상세주소</label>
            <input
              type="text"
              id="address2"
              v-model="signupForm.address.address2"
              :class="styles.formInput"
              placeholder="상세주소를 입력하세요"
            />
          </div>
        </div>
        <div :class="styles.formActions">
          <button
            type="submit"
            :class="styles.btnSignup"
            :disabled="!isFormValid || authStore.isLoading"
          >
            {{ authStore.isLoading ? '처리 중...' : '회원가입' }}
          </button>
          <div :class="styles.loginLink">
            이미 계정이 있으신가요? <RouterLink to="/login" :class="styles.link">로그인</RouterLink>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
