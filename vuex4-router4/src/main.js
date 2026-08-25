import { createApp } from 'vue'
import { createPinia } from '@/pinia'
import App from './App.vue'
import router from './router'
import store from './store'
const pinia = createPinia()
createApp(App).use(store).use(router).use(pinia).mount('#app')


//vuex 缺点 ts兼容性不好 命名空间
//pinia 优点 ts兼容性好  不需要命名空间(可以创建多个store) mutation剔除掉了