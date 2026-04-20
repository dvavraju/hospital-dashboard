import { createApp } from 'vue'
import './style.css'
import 'primeicons/primeicons.css'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import ToastService from 'primevue/toastservice'
import App from './App.vue'

// Set dark mode by default
document.documentElement.classList.add('app-dark')

const app = createApp(App)

app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark',
            cssLayer: false
        }
    }
})

app.use(ToastService)

app.mount('#app')
