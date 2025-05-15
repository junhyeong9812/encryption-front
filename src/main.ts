import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import 'bootstrap/dist/css/bootstrap.min.css'

import App from './App.vue'
import router from './router'

// Pinia 스토어 초기화
const pinia = createPinia()

// Pinia persist 플러그인 설정
// 로컬 스토리지에 상태 저장 기능 추가
pinia.use(piniaPluginPersistedstate)

// Vue 앱 생성 및 마운트
const app = createApp(App)
app.use(pinia)
app.use(router)

app.mount('#app')
