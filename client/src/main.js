import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'jquery'; // Import jQuery
import 'bootstrap-icons/font/bootstrap-icons.css';

import VueAwesomePaginate from 'vue-awesome-paginate';
import 'vue-awesome-paginate/dist/style.css';

import store from './store/index';
// import Vuetify from 'vuetify/lib';

const app = createApp(App);

app.use(router);
app.use(store);
app.use(VueAwesomePaginate);
// const vuetify = new Vuetify({});
// app.use(vuetify);

app.mount('#app');
