<template>
  <the-header v-if="isLoggedIn"></the-header>
  <success-toast v-if="showToast" :toastMessage="toastMessage"></success-toast>
  <error-toast v-if="isError" :error="error"></error-toast>
  <div class="container-fluid" style="min-height: 80vh;">
    <router-view></router-view>
  </div>
</template>

<script>
import TheHeader from './components/TheHeader.vue';
import ErrorToast from './components/ErrorToast.vue';
import SuccessToast from './components/SuccessToast.vue';

export default {
  components: {
    TheHeader,
    ErrorToast,
    SuccessToast
  },
  data() {
    return {
      error: null,
      isError: false,
      showToast: false,
      toastMessage: null
    };
  },
  computed: {
    didAutoLogout() {
      return this.$store.getters['auth/didAutoLogout'];
    },
    isLoggedIn() {
      return this.$store.getters['auth/isAuthenticated'];
    },
    isShowToast() {
      const toast = {
        showToast: this.$store.getters['showToast'],
        toastMessage: this.$store.getters['toastMessage']
      }

      return toast;
    },
  },
  async created() {
    const res = await this.$store.dispatch('auth/autoLogin');
    if (res) {
      this.isError = true;
      this.error = res;
    } else {
      this.error = null;
      this.isError = false;
    }
  },
  watch: {
    isLoggedIn(val) {
      if (!val) {
        this.$router.push('/login')
      }
    },
    isShowToast: {
      handler(newVal) {
        this.showToast = newVal.showToast;
        this.toastMessage = newVal.toastMessage
      }
    },
  },
};
</script>

<style>
.loading {
  min-height: 80vh;
}
</style>