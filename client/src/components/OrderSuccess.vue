<template>
  <error-toast v-if="isError" :error="error"></error-toast>
  <div class="d-flex justify-content-center align-items-center" style="min-height: 80vh">
    <div class="card p-4 col-xl-5 col-lg-6 col-md-9 col-sm-11 col-12 shadow bg-body rounded text-center">
      <h1 class="text-center"><i class="bi bi-check2-circle"></i></h1>
      <h5><strong>Your order has been placed.</strong></h5>
      <p class="mt-3 px-5">
        Thank you for placing order. You can collect it from Canteen in
        <strong>approx 15 minutes</strong>
      </p>
      <div class="btn-group px-4 my-2 row row-cols-1 row-cols-sm-2 g-2 g-sm-4" role="group" aria-label="Basic example">
        <div class="col">
          <router-link to="/" type="button" class="go-back btn rounded w-100"><i
              class="bi bi-box-arrow-left me-2"></i>Return to
            menu</router-link>
        </div>
        <!-- </router-link> -->
        <div class="col-12">
          <button type="button" class="btn print-receipt rounded w-100" @click="generateInvoice">
            <i class="bi bi-file-earmark-arrow-down me-2"></i>Print Receipt
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ErrorToast from './ErrorToast.vue';

export default {
  data() {
    return {
      isLoading: true,
      isError: false,
      error: null,
      currentOrderId: null
    };
  },
  async mounted() {
    this.currentOrderId = await this.$store.getters['employee/currentOrderId']
  },
  methods: {
    async generateInvoice() {
      const res = await this.$store.dispatch('employee/generateInvoice', {
        empId: await this.$store.getters['auth/user'].empId,
        orderId: this.currentOrderId,
      });

      if (res) {
        if (res.error) {
          this.isError = true;
          this.error = res;
        } else {
          // if (this.cartItems) {
          //     this.isLoading = false;
          // }

          this.error = null;
          this.isError = false;

          this.downloadInvoice(res.data);
        }
      }
    },
    downloadInvoice(url) {
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice #${this.currentOrderId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    },
  },
  async unmounted() {
    await this.$store.commit('employee/setOrderPlaced', { orderPlaced: false });
    await this.$store.commit('employee/setOrderId', { currentOrderId: null });
  },
  components: {
    ErrorToast,
  },
};
</script>

<style scoped>
h1 .bi.bi-check2-circle {
  font-size: 3rem;
  color: #006363;
}

.print-receipt .bi.bi-file-earmark-arrow-down {
  /* font-size: 15px; */
  font-weight: bold;
}

/* .go-back-link {
    border: 1px solid #006363;
    background-color: #006363;
    color: #fff !important;
    padding: 8px;
    box-shadow: 0px 4px 15px -5px rgba(0, 0, 0, 0.3);
} */

/* .go-back {
    font-size: 0.9rem;
    text-transform: uppercase;
    font-weight: 700;
    border: none;
} */

.print-receipt,
.go-back {
  font-size: 0.9rem;
  text-transform: uppercase;
  background: #006363;
  padding: 8px;
  /* border-radius: 40px; */
  color: #fff;
  font-weight: 700;
  box-shadow: 0px 4px 15px -5px rgba(0, 0, 0, 0.3);
}

.print-receipt.btn:active,
.print-receipt.btn:hover,
.go-back.btn:hover,
.go-back.btn:active {
  outline: #006363;
  border-color: #006363 !important;
  color: #006363 !important;
  background-color: white !important;
  transition: background-color 0.5s;
}
</style>
