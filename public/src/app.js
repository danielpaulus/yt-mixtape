import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './assets/tailwind.css';
Vue.config.productionTip = false;

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('service-worker.js');
  });
}

new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>',
});
