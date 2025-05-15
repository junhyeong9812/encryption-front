<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
// CSS 모듈 import
import styles from '../styles/HomePage.module.css'

const authStore = useAuthStore()
const welcomeMessage = ref('환영합니다')

onMounted(() => {
  // 사용자 정보가 있으면 환영 메시지 설정
  if (authStore.user?.maskedName) {
    welcomeMessage.value = `${authStore.user.maskedName}님 환영합니다!`
  }
})
</script>

<template>
  <div :class="styles.homeContainer">
    <section :class="styles.welcomeSection">
      <h1 :class="styles.welcomeTitle">{{ welcomeMessage }}</h1>
      <p :class="styles.welcomeText">개인정보 암호화 시스템에 접속하셨습니다.</p>
    </section>

    <section :class="styles.featuresSection">
      <h2 :class="styles.featuresTitle">주요 기능</h2>

      <div :class="styles.featureCards">
        <div :class="styles.featureCard">
          <div :class="styles.cardIcon">
            <i :class="styles.iconLock"></i>
          </div>
          <h3 :class="styles.featureCardTitle">개인정보 암호화</h3>
          <p :class="styles.featureCardText">
            민감한 개인정보를 안전하게 보호합니다. 이름, 주민등록번호, 연락처 등 개인식별정보가
            완벽하게 암호화됩니다.
          </p>
        </div>

        <div :class="styles.featureCard">
          <div :class="styles.cardIcon">
            <i :class="styles.iconShield"></i>
          </div>
          <h3 :class="styles.featureCardTitle">보안 인증</h3>
          <p :class="styles.featureCardText">
            안전한 토큰 기반 인증 시스템으로 사용자 계정과 세션을 보호합니다.
          </p>
        </div>

        <div :class="styles.featureCard">
          <div :class="styles.cardIcon">
            <i :class="styles.iconUser"></i>
          </div>
          <h3 :class="styles.featureCardTitle">개인정보 관리</h3>
          <p :class="styles.featureCardText">
            사용자는 자신의 개인정보를 언제든지 안전하게 확인하고 필요한 경우 수정할 수 있습니다.
          </p>
        </div>
      </div>
    </section>

    <section :class="styles.dashboardSummary" v-if="authStore.isAuthenticated">
      <h2 :class="styles.dashboardTitle">대시보드 요약</h2>

      <div :class="styles.dashboardCards">
        <div :class="styles.dashboardCard">
          <h3 :class="styles.dashboardCardTitle">내 정보</h3>
          <p :class="styles.dashboardCardText">
            <strong>이메일:</strong> {{ authStore.user?.email || '정보 없음' }}<br />
            <strong>이름:</strong> {{ authStore.user?.maskedName || '정보 없음' }}
          </p>
          <button :class="styles.btnAction">정보 관리</button>
        </div>

        <div :class="styles.dashboardCard">
          <h3 :class="styles.dashboardCardTitle">보안 설정</h3>
          <p :class="styles.dashboardCardText">계정 보안 설정을 확인하고 관리하세요.</p>
          <button :class="styles.btnAction">보안 설정</button>
        </div>
      </div>
    </section>
  </div>
</template>
