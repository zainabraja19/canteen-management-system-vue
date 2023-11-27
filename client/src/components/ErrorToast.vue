<template>
  <div aria-live="polite" aria-atomic="true" class="position">
    <div class="toast-container position-absolute top-0 start-50  translate-middle-x">
      <div class="toast align-items-center bg-danger bg-gradient text-white mt-3" ref="el" role="alert"
        aria-live="assertive" aria-atomic="true" data-bs-delay="2000">
        <div class="d-flex">
          <div class="toast-body">
            {{ errors }}
          </div>
          <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
      <!-- {{ errors }} -->
    </div>
  </div>
</template>

<script>
import { Toast } from 'bootstrap';

export default {
  props: ['error'],
  data() {
    return {
      toast: null
    }
  },
  computed: {
    errors() {
      if (!this.error.status && this.error.message) {
        return `${this.error.message}`;
      }
      if (this.error.status === 401) {
        this.handleLogout();
        return `${this.error.message} Please login again!`;
      } else if (this.error.status === 400) {
        return `${this.error.message}`;
      }
      return 'Something went wrong. Please try after some time!';
    },
  },
  mounted() {
    this.toast = new Toast(this.$refs.el);
    // var toast = new Toast(this.$refs.el);
    this.toast.show();
  },
  updated() {
    // var toast = new Toast(this.$refs.el);
    this.toast.show();
  },
  methods: {
    async handleLogout() {
      await this.$store.dispatch('auth/logout');
      await this.$router.push(`/`);
    },
  },
};
</script>

<style scoped>
.toast-body {
  text-transform: capitalize;
}
</style>