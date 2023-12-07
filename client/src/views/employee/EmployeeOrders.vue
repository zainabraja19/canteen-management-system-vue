<template>
  <error-toast v-if="isError" :error="error"></error-toast>
  <div v-if="isLoading" class="loading d-flex justify-content-center align-items-center mh-100">
    <div class="spinner-grow text-secondary" style="width: 3rem; height: 3rem" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  <div class="mx-2 mx-lg-5" v-else>
    <div class="d-flex flex-column flex-sm-row fl justify-content-between">
      <h2>Orders</h2>
      <div>
        <select class="form-select" v-model="selectedOption" @change="handleFilterChange">
          <option value="all">All Orders</option>
          <option value="remaining">Remaining Orders</option>
          <option value="cancelled">Cancelled Orders</option>
          <option value="completed">Completed Orders</option>
        </select>
      </div>
    </div>
    <!-- <hr /> -->
    <div v-if="totalOrders > 0" class="table-responsive mt-1">
      <div style="min-height: 450px">
        <table class="table text-center align-middle">
          <thead>
            <tr>
              <th scope="col">Order ID</th>
              <th scope="col">Employee ID</th>
              <th scope="col">Name</th>
              <!-- <th scope="col">Items</th> -->
              <th scope="col">Order Total</th>
              <th scope="col">Order Date</th>
              <th scope="col">Status</th>
              <!-- <th scope="col"></th> -->
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <!-- <tr v-for="(order, index) in orders" :key="index"> -->
            <OrderDetails :order="order" :index="index" role="employee" v-for="(order, index) in orders" :key="index"
              @cancelOrder="handleCancelOrder">
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
        <strong>No {{ selectedOption != 'all' ? selectedOption : '' }} orders found.</strong>
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
      selectedOption: 'all',
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
    handleFilterChange() {
      this.currentPage = 1
      this.fetchData();
    },
    async fetchData() {
      const res = await this.$store.dispatch('employee/fetchEmployeeOrders', {
        empId: this.$store.getters['auth/user'].empId,
        page: this.currentPage,
        filter: this.selectedOption,
        id: this.$store.getters['auth/user']._id
      });
      this.totalOrders = await this.$store.getters['employee/totalOrders'];

      if (res) {
        this.isError = true;
        this.error = res;
      } else {
        this.error = null;
        this.isError = false;
      }
    },
    async handleCancelOrder(orderId) {
      await this.$store.commit('setShowToast', { showToast: false, toastMessage: null })
      const res = await this.$store.dispatch('employee/cancelOrder', {
        empId: this.$store.getters['auth/user'].empId,
        orderId
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
    },
  },
  components: {
    OrderDetails,
    ErrorToast,
  },
};
</script>

<style scoped>
.go-back {
  /* font-size: 0.9rem !important; */
  text-transform: uppercase !important;
  background-color: #006363 !important;
  /* padding: 10px 20px !important; */
  color: #fff !important;
  /* border-radius: 40px !important; */
  /* font-weight: 700 !important; */
  /* box-shadow: 0px 4px 15px -5px rgba(0, 0, 0, 0.3) !important; */
}

.go-back:active,
.go-back:hover {
  border-color: #006363 !important;
  color: #006363 !important;
  background-color: white !important;
  transition: background-color 0.5s;
}
</style>
