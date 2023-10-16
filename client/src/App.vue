<template>
  <div>
    <the-header></the-header>
    <div class="container">
      <div class="row mt-4">
        <div class="col-md-12 w-100">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TheHeader from './components/layout/TheHeader.vue';
export default {
  components: {
    TheHeader,
  },
  computed: {
    didAutoLogout() {
      return this.$store.getters.didAutoLogout;
    },
  },
  created() {
    this.$store.dispatch('auth/autoLogin');
    // const user = this.$store.getters.user;
    // if (user) {
    //   this.$store.commit('setUserProfilePicture', {
    //     profile: user.profilePicture,
    //   });
    // }
  },
  watch: {
    didAutoLogout(curValue, oldValue) {
      if (curValue && curValue !== oldValue) {
        this.$router.replace('/login');
      }
    },
  },
};
</script>
