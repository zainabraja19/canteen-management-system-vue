<template>
  <div>
    <h2>Orders</h2>
    <hr />
    <div v-if="orders" class="table-responsive mt-4">
      <table class="table text-center">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Employee ID</th>
            <th scope="col">Name</th>
            <th scope="col">Phone</th>
            <th scope="col">Total</th>
            <th scope="col">Order Date</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <OrderDetails :order="order" :index="index" role="admin" v-for="(order, index) in orders" :key="index">
          </OrderDetails>
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
    <h2 v-else>No orders remaining!</h2>
  </div>
</template>

<script>
import OrderDetails from '../../components/OrderDetails';

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
      return this.$store.getters['admin/orders'];
    },
    computedTotalOrders() {
      return this.$store.getters['admin/totalOrders']
    },
    statusClass() {
      return 'text-bg-success';
    },
  },
  watch: {
    computedOrders(val) {
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
      await this.$store.dispatch('admin/fetchOrders', { page: this.currentPage });
    },
  },
  components: {
    OrderDetails,
  },
};
</script>


<style>
.pagination .pagination-container {
  column-gap: 10px;
  align-items: center;
}

.pagination .paginate-buttons {
  height: 35px;
  width: 35px;
  cursor: pointer;
  border-radius: 4px !important;
  background-color: transparent;
  border: none;
  color: black;
  align-items: center;
}

.pagination .paginate-buttons span {
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination .back-button,
.pagination .next-button {
  background-color: black;
  color: white;
  border-radius: 8px;
  height: 35px;
  width: 35px;
}

.pagination .active-page {
  background-color: #e5e5e5;
}

.pagination .paginate-buttons:hover {
  background-color: #f5f5f5;
}

.pagination .active-page:hover {
  background-color: #e5e5e5;
}

.pagination .back-button svg {
  transform: rotate(180deg) translateY(-2px);
}

.pagination .next-button svg {
  transform: translateY(2px);
}

.pagination .back-button:hover,
.pagination .next-button:hover {
  background-color: rgb(45, 45, 45);
}

.pagination .back-button:active,
.pagination .next-button:active {
  background-color: rgb(85, 85, 85);
}
</style>