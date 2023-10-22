<template>
  <div class="order-alert d-flex justify-content-center">
    <div
      class="alert alert-success alert-dismissible alert-transparent"
      role="alert"
    >
      Your order is placed successfully!
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
        @click="hideOrderPlacedToast"
      ></button>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    setTimeout(() => {
      this.hideOrderPlacedToast();
    }, 3000);
  },
  methods: {
    async hideOrderPlacedToast() {
      // Hide the Bootstrap toast
      await this.$store.commit('employee/setOrderPlaced', {
        orderPlaced: false,
      });
    },
  },
};
</script>

<style scoped>
.order-alert {
  position: fixed;
  /* top: 0;
    left: 0; */
  bottom: 0%;
  right: 1%;
  z-index: 10000;
}

/* .alert {
  background-color: rgba(136, 219, 182, 0.8) !important;
  color: #fff;
  border: 1px solid rgba(36, 219, 182, 1) !important;
} */
</style>
