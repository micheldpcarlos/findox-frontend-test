import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import './scss/index.scss';

/* Font Awesome related */
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faSort,
  faSortUp,
  faSortDown,
  faFilter,
  faCog,
  faUserPlus,
  faFileExcel,
  faCircle,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
library.add(
  faSort,
  faSortUp,
  faSortDown,
  faFilter,
  faCog,
  faUserPlus,
  faFileExcel,
  faCircle,
  faArrowLeft
);

import FloatingVue from 'floating-vue';
import 'floating-vue/dist/style.css';

const app = createApp(App);

app.use(FloatingVue);
app.use(createPinia());
app.use(router);
app.component('FontAwesomeIcon', FontAwesomeIcon);
app.mount('#app');
