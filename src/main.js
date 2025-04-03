import './assets/styles/main.css'
import 'github-markdown-css/github-markdown-light.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')
