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
      <!-- <div v-if="role === 'employee'"> -->
      <span v-if="order.cancelled" class="badge text-bg-light p-2 text-danger ">
        Cancelled
      </span>
      <span v-else class="badge text-bg-light p-2" :class="{
        'text-success': order.completed,
        'text-warning': !order.completed,
      }">{{ order.completed ? 'Completed' : 'Processing' }}</span>
      <!-- </div> -->
      <!-- <div v-else> -->
      <!-- <span class="badge text-bg-light p-2" :class="{
        'text-success': order.completed,
        'text-warning': !order.completed,
      }">{{ order.completed ? 'Completed' : 'Processing' }}</span> -->
      <!-- </div> -->
    </td>
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
              <th scope="col">Price</th>
              <th scope="col">Quantity</th>
              <th scope="col">Item Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in order.items" :key="index">
              <th scope="row">{{ index + 1 }}</th>
              <td>{{ item.item.itemName }}</td>
              <td>{{ formatPrice(+item.item.price) }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ formatPrice(+item.item.price * +item.quantity) }}</td>
            </tr>
          </tbody>
        </table>
        <div v-if="role === 'employee'" class="text-end my-2">
          <button v-if="!order.cancelled" type="button" class="cancel-btn btn btn-outline-dark  p-2"
            @click="generateInvoice(order.orderId)">Download
            Invoice</button>
          <button v-if="!order.completed && !order.cancelled" type="button" class="cancel-btn btn btn-dark p-2 ms-2"
            data-bs-toggle="modal" data-bs-target="#orderStatusConfirmationModal"
            @click="setSelectedOrderForCancellation(order.orderId)">Cancel
            Order</button>
        </div>
        <div v-else class="text-end my-2">
          <button v-if="!order.completed && !order.cancelled" type="button" class="mark-complete-btn btn p-2"
            data-bs-toggle="modal" data-bs-target="#orderStatusConfirmationModal"
            @click="setSelectedOrderForCompletion(order.orderId)">Mark as
            complete</button>
        </div>
      </div>
    </td>
  </tr>
  <div class="modal fade" ref="orderStatusConfirmationModal" id="orderStatusConfirmationModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered bg-transparent ">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="cancelOrderModalLabel">Confirmation</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          Are you sure you want to {{ this.role === 'employee' ? 'cancel this order' : 'mark this order as complete' }}?
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Cancel
          </button>
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="emitOrderStatusAction">
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- <div class="text-center">
    <v-btn color="primary" @click="dialog = true">
      Open Dialog
    </v-btn>

    <v-dialog v-model="dialog" width="auto">
      <v-card>
        <v-card-text>
          Vuetify 3 vue 3 modal dialog using v-dialog component and v-model.
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="dialog = false">Close Dialog</v-btn>
        </v-card-actions>
      </v-card>setSelectedOrderForCancellation
    </v-dialog>
  </div> -->
</template>

<script>
import { formatPrice } from '../utils/FormatPrice';
import { formatDateTime } from '../utils/FormatDate';

export default {
  props: ['order', 'index', 'role'],
  emits: ['cancelOrder', 'completeOrder'],
  data() {
    return {
      showAccordion: false,
      selectedOrderForCancellation: null,
      selectedOrderForCompletion: null,
      dialog: false
    };
  },
  computed: {
    computedSelectedOrderForCancellation() {
      return this.$store.getters['employee/selectedOrderForCancellation']
    },
    computedSelectedOrderForCompletion() {
      return this.$store.getters['admin/selectedOrderForCompletion']
    }
  },
  watch: {
    computedSelectedOrderForCancellation(val) {
      this.selectedOrderForCancellation = val
    },
    computedSelectedOrderForCompletion(val) {
      this.selectedOrderForCompletion = val
    }
  },
  methods: {
    formatPrice,
    formatDateTime,
    toggleAccordion() {
      this.showAccordion = !this.showAccordion;
    },
    async setSelectedOrderForCancellation(id) {
      await this.$store.commit('employee/setSelectedOrderForCancellation', id)
    },
    async setSelectedOrderForCompletion(id) {
      await this.$store.commit('admin/setSelectedOrderForCompletion', id)
    },
    emitOrderStatusAction() {
      if (this.role === 'employee')
        this.$emit('cancelOrder', this.selectedOrderForCancellation)
      else
        this.$emit('completeOrder', this.selectedOrderForCompletion)
      // this.$emit(this.role === 'employee' ? `cancelOrder` : `completeOrder`, this.selectedOrderForCancellation);
    },
    async generateInvoice(orderId) {
      const res = await this.$store.dispatch('employee/generateInvoice', {
        empId: await this.$store.getters['auth/user'].empId,
        orderId,
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

          this.downloadInvoice(res.data, orderId);
        }
      }
    },
    downloadInvoice(url, orderId) {
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice #${orderId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    },
  }
}
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

.mark-complete-btn.btn {
  /* font-size: 0.9rem !important; */
  /* text-transform: uppercase !important; */
  background-color: #006363 !important;
  /* padding: 10px 20px !important; */
  color: #fff !important;
  /* border-radius: 10px !important; */
  /* font-weight: 700 !important; */
  /* box-shadow: 0px 4px 15px -5px rgba(0, 0, 0, 0.3) !important; */
}

.mark-complete-btn.btn:active,
.mark-complete-btn.btn:hover {
  border-color: #006363 !important;
  color: #006363 !important;
  background-color: white !important;
  transition: background-color 0.5s;
}
</style>