import { createApp } from 'vue';
import App from './App.vue'
import router from './router';

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import 'bootstrap-icons/font/bootstrap-icons.css';
import store from './store/index';
// import Vue fststrapVue, BootstrapVueIcons } from 'bootstrap-vue'

// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'

// Vue.use(BootstrapVue)
// Vue.use(BootstrapVueIcons)

const app = createApp(App)

app.use(router)
app.use(store)

app.mount('#app');
