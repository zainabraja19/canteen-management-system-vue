<template>
  <tr
    class="accordion accordion-flush"
    id="accordionFlushExample"
    data-bs-toggle="collapse"
    :data-bs-target="'#orderDetails' + index"
  >
    <th scope="row">{{ order.orderId }}</th>
    <td>{{ order.employee.empId }}</td>
    <td>{{ order.employee.name }}</td>
    <td v-if="role === 'admin'">{{ order.employee.phone }}</td>
    <td>{{ formatPrice(+order.totalAmount) }}</td>
    <td>{{ formatDateTime(order.orderDate) }}</td>
    <td v-if="role === 'employee'">
      <span
        class="badge text-light"
        :class="{
          'text-bg-success': order.completed,
          'text-bg-warning': !order.completed,
        }"
        >{{ order.completed ? 'Completed' : 'Processing' }}</span
      >
    </td>
    <td>
      <div :data-bs-target="'#orderDetails' + index">
        <i class="bi bi-chevron-down"></i>
      </div>
    </td>
  </tr>
  <tr
    class="accordion-collapse collapse"
    :id="'orderDetails' + index"
    data-bs-parent=".table"
  >
    <td colspan="7">
      <div class="accordion-body table-responsive pt-2 px-4">
        <h5 class="text-start">Details</h5>
        <table class="table table-success table-bordered">
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
      </div>
    </td>
  </tr>
</template>

<script>
import { formatPrice } from '../utils/FormatPrice';
import { formatDateTime } from '../utils/FormatDate';

export default {
  props: ['order', 'index', 'role'],
  data() {
    return { showAccordion: false };
  },
  methods: {
    formatPrice,
    formatDateTime,
    toggleAccordion() {
      this.showAccordion = !this.showAccordion;
    },
  },
};
</script>
