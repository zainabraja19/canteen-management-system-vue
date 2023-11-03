<template>
  <error-toast v-if="isError" :error="error"></error-toast>
  <div v-if="isLoading" class="loading d-flex justify-content-center align-items-center mh-100">
    <div class="spinner-grow text-secondary" style="width: 3rem; height: 3rem;" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  <div v-else>
    <h2>Orders</h2>
    <!-- <hr /> -->
    <div v-if="totalOrders > 0" class="table-responsive mt-1">
      <div style="min-height: 450px;">
        <table class="table text-center">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Employee ID</th>
              <th scope="col">Name</th>
              <!-- <th scope="col">Items</th> -->
              <th scope="col">Total</th>
              <th scope="col">Order Date</th>
              <th scope="col">Status</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <!-- <tr v-for="(order, index) in orders" :key="index"> -->
            <OrderDetails :order="order" :index="index" role="employee" v-for="(order, index) in orders" :key="index">
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
            </span>
          </template></vue-awesome-paginate>
      </div>
    </div>
    <div v-else class="fs-5">
      <hr><strong>No orders remaining!</strong>
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
      error: null
    };
  },
  async mounted() {
    this.fetchData()
  },
  computed: {
    computedOrders() {
      return this.$store.getters['employee/employeeOrders'];
    },
    computedTotalOrders() {
      return this.$store.getters['employee/totalOrders']
    },
  },
  watch: {
    computedOrders(val) {
      console.log(val);
      this.orders = val;
      this.isLoading = false
    },
    computedTotalOrders(val) {
      this.totalOrders = val
    },
  },
  methods: {
    changePage(newPage) {
      this.isLoading = true
      this.currentPage = newPage;
      this.fetchData()
    },
    async fetchData() {
      try {
        await this.$store.dispatch('employee/fetchEmployeeOrders', {
          empId: this.$store.getters['auth/user'].empId,
          page: this.currentPage
        });
        this.totalOrders = this.$store.getters['employee/totalOrders']

        this.error = null
        this.isError = false
      } catch (err) {
        this.error = err
        this.isError = true
      }
    },
  },
  components: {
    OrderDetails,
    ErrorToast
  },
};
</script>
