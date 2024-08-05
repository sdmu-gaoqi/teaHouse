import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import route from './route'
import Antd from 'ant-design-vue'
import store from './store/store'
import './styles/global.scss'
import './styles/tailwind.global.scss'
import 'store-operations-ui/dist/style.css'
import { changeTheme } from 'store-operations-ui'

document.title = '沐茗茶舍'

changeTheme({
  token: {
    colorPrimary: '#bb5717',
    colorTextBase: '#6a6d82',
    colorBgBase: '#fff'
  }
})

createApp(App).use(Antd).use(route).use(store).mount('#app')
