import '@mdi/font/css/materialdesignicons.css'
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'

const APP = createApp(App)
APP.use(vuetify)
APP.use(router)
APP.mount('#app')