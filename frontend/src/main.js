import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize auth on startup
import { useAuthStore } from './stores/authStore'
const authStore = useAuthStore()
authStore.initAuth().finally(() => {
  app.mount('#app')
})
