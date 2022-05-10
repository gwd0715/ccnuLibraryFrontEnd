import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import './css/app.css'
import 'element-plus/dist/index.css'

createApp(App).use(ElementPlus,{zIndex: 1}).mount('#app')
