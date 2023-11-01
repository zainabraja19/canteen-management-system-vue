<template>
  <div>
    <h2>Orders</h2>
    <hr />
    <div v-if="totalOrders > 0" class="table-responsive mt-4">
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
    <h4 v-else>No orders found!</h4>
  </div>
</template>

<script>
import OrderDetails from '../../components/OrderDetails.vue';
export default {
  data() {
    return {
      orders: null,
      totalOrders: 0,
      currentPage: 1,
      perPage: 10,
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
    },
    computedTotalOrders(val) {
      this.totalOrders = val
    }
  },
  methods: {
    changePage(newPage) {
      this.currentPage = newPage;
      this.fetchData()
    },
    async fetchData() {
      await this.$store.dispatch('employee/fetchEmployeeOrders', {
        empId: this.$store.getters['auth/user'].empId,
        page: this.currentPage
      });
      this.totalOrders = this.$store.getters['employee/totalOrders']
    },
  },
  components: {
    OrderDetails,
  },
};
</script>
