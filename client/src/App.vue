<template>
  <the-header v-if="isLoggedIn"></the-header>
  <!-- <transition name="fade" mode="out-in" :duration="transitionDuration"> -->
  <order-placed v-if="isLoggedIn && orderPlaced"></order-placed>
  <!-- </transition> -->
  <!-- <div class="main-container"> -->
  <div class="container h-100">
    <div class="row">
      <div class="col-md-12 w-100">
        <router-view></router-view>
      </div>
    </div>
  </div>
  <!-- </div> -->
</template>

<script>
import TheHeader from './components/TheHeader.vue';
import OrderPlaced from './components/OrderPlacedToast.vue';
export default {
  components: {
    TheHeader,
    OrderPlaced,
  },
  data() {
    return {
      orderPlaced: false,
      transitionDuration: '1ms',
    };
  },
  computed: {
    didAutoLogout() {
      return this.$store.getters['auth/didAutoLogout'];
    },
    isOrderPlaced() {
      return this.$store.getters['employee/orderPlaced'];
    },
    isLoggedIn() {
      return this.$store.getters['auth/isAuthenticated'];
    },
  },
  created() {
    this.$store.dispatch('auth/autoLogin');
  },
  watch: {
    didAutoLogout(curValue, oldValue) {
      if (curValue && curValue !== oldValue) {
        this.$router.push('/login');
      }
    },
    isOrderPlaced(newVal) {
      this.orderPlaced = newVal;
    },
  },
};
</script>
