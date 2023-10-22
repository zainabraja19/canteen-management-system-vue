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
            <!-- <th scope="col">Items</th> -->
            <th scope="col">Total</th>
            <th scope="col">Order Date</th>
            <!-- <th scope="col">Status</th> -->
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <!-- <tr v-for="(order, index) in orders" :key="index"> -->
          <OrderDetails
            :order="order"
            :index="index"
            role="admin"
            v-for="(order, index) in orders"
            :key="index"
          ></OrderDetails>
          <!-- </tr> -->
        </tbody>
      </table>
      <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center">
          <li class="page-item disabled">
            <a class="page-link" href="#" tabindex="-1" aria-disabled="true"
              >Previous</a
            >
          </li>
          <li class="page-item"><a class="page-link" href="#">1</a></li>
          <li class="page-item"><a class="page-link" href="#">2</a></li>
          <li class="page-item"><a class="page-link" href="#">3</a></li>
          <li class="page-item">
            <a class="page-link" href="#">Next</a>
          </li>
        </ul>
      </nav>
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
    };
  },
  async mounted() {
    await this.$store.dispatch('admin/fetchOrders');
  },
  computed: {
    computedOrders() {
      return this.$store.getters['admin/orders'];
    },
    statusClass() {
      return 'text-bg-success';
    },
  },
  watch: {
    computedOrders(val) {
      this.orders = val;
    },
  },

  components: {
    OrderDetails,
  },
};
</script>
