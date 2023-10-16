<template>
  <div class="cart card mb-4" style="min-height: 85vh">
    <div class="row g-0 mh-100 flex-grow-1">
      <!-- <div>
      <h2>Cart</h2>
      <h5 class="text-muted">5 items</h5>
    </div>
    <div class="card my-4">
      <div class="row g-0 align-items-center">
        <div class="col-4 p-4">
          <img
            src="https://www.vegrecipesofindia.com/wp-content/uploads/2017/07/cream-cheese-sandwich-recipe-1.jpg"
            class="img-fluid rounded-start"
            alt="..."
          />
        </div>
        <div class="card-body col-8">
          <div class="row">
            <div class="col-3 item">Sandwich</div>
            <div class="col-3 item">
              <i class="bi bi-dash-circle me-2 text-danger"></i> 2
              <i class="bi bi-plus-circle ms-2 text-success"></i>
            </div>
            <div class="col-3 item text-muted">{{ formatPrice(100) }}</div>
            <div class="col-3 text-danger">
              <i class="bi bi-trash3 text-danger"></i>
            </div>
          </div>
        </div>
      </div>
    </div> -->

      <div class="col-12 mh-100 p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="heading">Cart</h2>
          <h5 class="text-muted">{{ totalItems }} items</h5>
        </div>
        <hr />
        <div class="row g-0 align-items-center" v-for="(item, index) in items" :key="index">
          <div class="col-4 p-4">
            <img src="https://www.vegrecipesofindia.com/wp-content/uploads/2017/07/cream-cheese-sandwich-recipe-1.jpg"
              class="img-fluid rounded-start" alt="..." />
          </div>
          <div class="col-8">
            <div class="row">
              <div class="col-3 item text-uppercase">
                {{ item.item.itemName }}
              </div>
              <div class="col-3 item">
                <i class="bi bi-dash-circle me-2 text-danger" @click="removeCartItem(item.item._id)"></i>
                <span>{{ item.quantity }}</span>
                <i class="bi bi-plus-circle ms-2 text-success" @click="addCartItem(item.item._id)"></i>
              </div>
              <div class="col-3 item text-muted">
                {{ formatPrice(item.price * item.quantity) }}
              </div>
              <div class="col-3 text-danger">
                <i class="bi bi-trash3 text-danger"></i>
              </div>
            </div>
          </div>
          <hr />
        </div>
      </div>
      <!-- <div class="col-md-1" style="height: 200px">
        <div class="vr"></div>
      </div> -->
      <div class="col-12 bg-light mh-100 p-4 w-100">
        <!-- <div> -->
        <h4 class="heading">Summary</h4>
        <hr />
        <div class="d-flex flex-column align-items-center">
          <div class="w-50">
            <div class="text-uppercase text-muted d-flex flex-row justify-content-between w-100">
              <div>Total Amount</div>
              <div>{{ formatPrice(+cartTotal) }}</div>
            </div>
            <button type="button" class="btn btn-dark text-uppercase w-100 my-4" @click="handleOrderPlaced">
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: null,
      totalItems: null,
      cartTotal: null,
    };
  },
  async mounted() {
    const response = await fetch(
      `${process.env.VUE_APP_IP_ADDRESS}:3000/employee/${this.$store.getters['auth/user'].empId}/cart`,
      {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const responseData = await response.json(); mode
    this.items = responseData.data.items;
    this.totalItems = responseData.data.totalItems;
    this.cartTotal = responseData.data.cartTotal;

    console.log(this.items);
  },
  methods: {
    formatPrice(price) {
      return price.toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
      });
    },
    handleOrderPlaced() {
      fetch(`${process.env.VUE_APP_IP_ADDRESS}:3000/employee/order`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employee: this.$store.getters['auth/user'].empId,
          items: this.items,
          totalAmount: this.cartTotal,
        }),
      });
    },
    removeCartItem(itemId) {

    },
    addCartItem(itemId) {

    }
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500&display=swap');

.cart {
  font-family: 'Oswald', sans-serif;
}

.item {
  text-transform: uppercase;
}
</style>
