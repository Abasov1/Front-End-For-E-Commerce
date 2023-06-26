import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { vue3Debounce } from 'vue-debounce'
import './vondor.js'
import './assets/vendor/font-awesome/css/fontawesome-all.min.css'
const app = createApp(App)
app.use(router)
app.use(store)
app.directive('debounce', vue3Debounce({ lock: true }))
app.mount('#app')
