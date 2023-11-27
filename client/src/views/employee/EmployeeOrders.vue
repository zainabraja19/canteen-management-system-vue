<template>
  <error-toast v-if="isError" :error="error"></error-toast>
  <div v-if="isLoading" class="loading d-flex justify-content-center align-items-center mh-100">
    <div class="spinner-grow text-secondary" style="width: 3rem; height: 3rem" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  <div class="mx-5" v-else>
    <h2>Orders</h2>
    <!-- <hr /> -->
    <div v-if="totalOrders > 0" class="table-responsive mt-1">
      <div style="min-height: 450px">
        <table class="table text-center align-middle">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Employee ID</th>
              <th scope="col">Name</th>
              <!-- <th scope="col">Items</th> -->
              <th scope="col">Total</th>
              <th scope="col">Order Date</th>
              <th scope="col">Status</th>
              <!-- <th scope="col"></th> -->
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <!-- <tr v-for="(order, index) in orders" :key="index"> -->
            <OrderDetails :order="order" :index="index" role="employee" v-for="(order, index) in orders" :key="index"
              @cancelOrder="handleCancelOrder(id)">
            </OrderDetails>
            <!-- </tr> -->
          </tbody>
        </table>
      </div>
      <div class="pagination d-flex justify-content-center mt-4">
        <vue-awesome-paginate :clickable="true" :prev-text="'Previous'" :next-text="'Next'" :total-items="totalOrders"
          :items-per-page="10" :max-pages-shown="5" v-model="currentPage" :on-click="changePage">
          <template #prev-button>
            <span>
              <i class="bi bi-chevron-left"></i>
            </span>
          </template>

          <template #next-button>
            <span>
              <i class="bi bi-chevron-right"></i>
            </span> </template></vue-awesome-paginate>
      </div>
    </div>
    <div v-else class="fs-5">
      <hr />
      <div class="d-flex flex-column align-items-center justify-content-center mt-4 fs-5" style="min-height: 60vh">
        <strong>You have not placed any orders yet.</strong>
        <router-link to="/"><button class="go-back btn mt-3">Return to menu</button></router-link>
      </div>
    </div>
  </div>
</template>

<script>
import OrderDetails from '../../components/OrderDetails.vue';
import ErrorToast from '../../components/ErrorToast.vue';
export default {
  data() {
    return {
      orders: null,
      totalOrders: 0,
      currentPage: 1,
      perPage: 10,
      isLoading: true,
      isError: false,
      error: null,
    };
  },
  async mounted() {
    this.fetchData();
  },
  computed: {
    computedOrders() {
      return this.$store.getters['employee/employeeOrders'];
    },
    computedTotalOrders() {
      return this.$store.getters['employee/totalOrders'];
    },
  },
  watch: {
    computedOrders(val) {
      this.orders = val;
      this.isLoading = false;
    },
    computedTotalOrders(val) {
      this.totalOrders = val;
    },
  },
  methods: {
    changePage(newPage) {
      this.isLoading = true;
      this.currentPage = newPage;
      this.fetchData();
    },
    async fetchData() {
      const res = await this.$store.dispatch('employee/fetchEmployeeOrders', {
        empId: this.$store.getters['auth/user'].empId,
        page: this.currentPage,
        id: this.$store.getters['auth/user']._id
      });
      this.totalOrders = this.$store.getters['employee/totalOrders'];

      if (res) {
        this.isError = true;
        this.error = res;
      } else {
        this.error = null;
        this.isError = false;
      }
    },
    async handleCancelOrder(id) {
      await this.$store.commit('setShowToast', { showToast: false, toastMessage: null })
      const res = await this.$store.dispatch('employee/cancelOrder', {
        empId: this.$store.getters['auth/user'].empId,
        orderId: id
      })

      if (res) {
        this.isError = true;
        this.error = res;
      } else {
        await this.$store.commit('setShowToast', { showToast: true, toastMessage: "Your order has been cancelled." })

        this.error = null;
        this.isError = false;
      }

      this.fetchData()
    }
  },
  components: {
    OrderDetails,
    ErrorToast,
  },
};
</script>

<style scoped>
.go-back.btn {
  font-size: 14px;
  text-transform: uppercase;
  background: #006363;
  padding: 15px 30px;
  border-radius: 40px;
  color: #fff;
  font-weight: 700;
  box-shadow: 0px 4px 15px -5px rgba(0, 0, 0, 0.3);
}

.go-back.btn:active,
.go-back.btn:hover {
  border-color: #006363 !important;
  color: #006363 !important;
  background-color: white !important;
  transition: background-color 0.5s;
}
</style>
