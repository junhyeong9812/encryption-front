import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 80, // 포트 설정
    host: true, // 0.0.0.0을 의미 (내 IP로 외부 기기에서도 접근 가능)
    open: true, // 브라우저 자동 실행 (선택)
  },
})
