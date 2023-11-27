<template>
  <tr class="accordion accordion-flush" id="accordionFlushExample" data-bs-toggle="collapse"
    :data-bs-target="'#orderDetails' + index">
    <th scope="row">{{ order.orderId }}</th>
    <td>{{ order.employee.empId }}</td>
    <td>{{ order.employee.name }}</td>
    <td v-if="role === 'admin'">{{ order.employee.phone }}</td>
    <td>{{ formatPrice(+order.totalAmount) }}</td>
    <td>{{ formatDateTime(order.orderDate) }}</td>
    <td>
      <div v-if="role === 'employee'">
        <span v-if="order.cancelled" class="badge text-bg-light p-2 text-bg-danger ">
          Cancelled
        </span>
        <span v-else class="badge text-bg-light p-2" :class="{
          'text-success': order.completed,
          'text-warning': !order.completed,
        }">{{ order.completed ? 'Completed' : 'Processing' }}</span>
      </div>
      <div v-else>
        <!-- <div class="form-check form-switch d-flex justify-content-center"> -->
        <!-- <input class="form-check-input" type="checkbox" role="switch" data-on-text="Si" data-off-text="No"
          style="font-size: larger;" value="order.completed"> -->
        <span class="badge text-bg-light p-2" :class="{
          'text-success': order.completed,
          'text-warning': !order.completed,
        }">{{ order.completed ? 'Completed' : 'Processing' }}</span>
        <!-- </div> -->
      </div>
    </td>
    <!-- <td v-if="role === 'employee'">
      <button type="button" class="cancel-btn btn btn-outline-danger" data-bs-toggle="modal"
        data-bs-target="#cancelOrderModal" @click="setSelectedOrder(order.orderId)">Cancel Order</button>
    </td> -->
    <td>
      <div :data-bs-target="'#orderDetails' + index">
        <i class="bi bi-chevron-down"></i>
      </div>
    </td>
  </tr>
  <tr class="accordion-collapse collapse" :id="'orderDetails' + index" data-bs-parent=".table">
    <td colspan="7">
      <div class="accordion-body table-responsive pt-2 px-5">
        <h5 class="text-start">Details</h5>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Item Name</th>
              <th scope="col">Quantity</th>
              <th scope="col">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in order.items" :key="index">
              <th scope="row">{{ index + 1 }}</th>
              <td>{{ item.item.itemName }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ item.item.price }}</td>
            </tr>
          </tbody>
        </table>
        <div v-if="role === 'employee'" class="text-end my-2">
          <button type="button" class="cancel-btn btn btn-dark p-2" data-bs-toggle="modal"
            data-bs-target="#cancelOrderModal" @click="setSelectedOrder(order.orderId)">Download Invoice</button>
          <button v-if="!order.completed" type="button" class="cancel-btn btn btn-danger p-2 ms-2" data-bs-toggle="modal"
            data-bs-target="#cancelOrderModal" @click="setSelectedOrder(order.orderId)">Cancel Order</button>
        </div>
      </div>
    </td>
  </tr>

  <div class="modal fade" ref="my-modal" id="cancelOrderModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered bg-transparent ">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="cancelOrderModalLabel">Confirmation</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          Are you sure you want to cancel this order?
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Cancel
          </button>
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal"
            @click="emitCancelOrder(this.selectedOrder)">
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatPrice } from '../utils/FormatPrice';
import { formatDateTime } from '../utils/FormatDate';

export default {
  props: ['order', 'index', 'role'],
  emits: ["cancelOrder"],
  data() {
    return {
      showAccordion: false,
      selectedOrder: null,
    };
  },
  mounted() {
    console.log(this.order.items);
  },
  watch: {
    selectedOrder(val) {
      console.log(val);
    }
  },
  methods: {
    formatPrice,
    formatDateTime,
    toggleAccordion() {
      this.showAccordion = !this.showAccordion;
    },
    setSelectedOrder(id) {
      this.selectedOrder = id
    },
    async emitCancelOrder() {
      this.$emit('cancelOrder')
    }
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap');

td {
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
}

.cancel-btn.btn {
  padding: 1px 10px
}
</style>