import { createApp } from 'vue'
import App from "@/App";
import 'bootstrap/dist/css/bootstrap.min.css'
import store from '@/store'

const app = createApp(App);

app.use(store)

app.mount('#app')
