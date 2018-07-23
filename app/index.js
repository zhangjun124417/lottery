import Vue from 'vue';
import VueRouter from 'vue-router';
import vueOptionEvents from 'vue-option-events';
import {
  map,
  assign
} from 'lodash';

import routes from './route';
import App from './app';
import vueTitle from './utils/vue-title';

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(vueOptionEvents);
Vue.use(vueTitle);

const router = new VueRouter({
  routes: map(routes, (route, path) => assign({ path }, route)),
  mode: 'history',
  linkActiveClass: 'active',
  base: '/',
  scrollBehavior(to, from, savedPosition) {
    return savedPosition
      || (to.hash && { selector: to.hash })
      || { x: 0, y: 0 };
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  render: h => h('app')
});
