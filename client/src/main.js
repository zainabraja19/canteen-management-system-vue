import { createApp } from 'vue';
import App from './App.vue'
import router from './router';

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import 'bootstrap-icons/font/bootstrap-icons.css';
import store from './store/index';

const app = createApp(App)

app.use(router)
app.use(store)

app.mount('#app');
