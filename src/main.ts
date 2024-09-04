import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import i18n from '@/i18n.js'

const app = createApp(App)

app.use(createPinia())
app.use(ElementPlus)
app.use(router)

app.use(i18n)
app.mount('#app')
