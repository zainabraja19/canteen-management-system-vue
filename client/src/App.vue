<template>
  <div>
    <the-header></the-header>
    <div class="container d-flex justify-content-center align-items-center">
      <div class="row mt-4">
        <div class="col-md-12">
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
    }
  },
  created() {
    console.log("here");
    this.$store.dispatch('autoLogin');
  },
  watch: {
    didAutoLogout(curValue, oldValue) {
      console.log("watcher", curValue, oldValue);
      if (curValue && curValue !== oldValue) {
        this.$router.replace('/login');
      }
    }
  }
};
</script>
