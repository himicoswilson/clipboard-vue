import './assets/main.css'
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {
  faTrashCan as farTrashCan,
  faClone as farClone,
  faFloppyDisk as farFloppyDisk
} from '@fortawesome/free-regular-svg-icons'
import { faClone, faFloppyDisk, faPlus } from '@fortawesome/free-solid-svg-icons'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

/* add icons to the library */
library.add(farTrashCan, faClone, farClone, faFloppyDisk, farFloppyDisk, faPlus)

/* 注册 font awesome icon 全局组件 */
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(createPinia())
app.use(router)

app.mount('#app')
