<template>
  <div class="cart card mb-4" style="min-height: 85vh" v-if="cartCount > 0">
    <div class="row g-0 mh-100 flex-grow-1">
      <div class="col-12 mh-100 p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="heading">Cart</h2>
          <h5 class="text-muted">{{ cartCount }} items</h5>
        </div>
        <hr class="mb-1" />
        <div
          class="row g-0 align-items-center"
          v-for="(item, index) in cartItems"
          :key="index"
        >
          <div class="col-4 p-2">
            <img
              src="https://www.vegrecipesofindia.com/wp-content/uploads/2017/07/cream-cheese-sandwich-recipe-1.jpg"
              class="img-fluid rounded-start w-25 h-25"
              alt="..."
            />
          </div>
          <div class="col-8">
            <div class="row">
              <div class="col-3 item text-uppercase">
                {{ item.item.itemName }}
              </div>
              <div class="col-3 item">
                <!-- <button type="button" :disabled="item.quantity === 1"> -->
                <i
                  type="button"
                  class="bi bi-dash-circle me-2 text-danger"
                  @click="
                    item.quantity > 1 ? removeCartItem(item.item._id, 1) : null
                  "
                ></i>
                <!-- </button> -->
                <span>{{ item.quantity }}</span>
                <i
                  class="bi bi-plus-circle ms-2 text-success"
                  @click="
                    item.quantity < 10 ? addCartItem(item.item._id) : null
                  "
                ></i>
              </div>
              <div class="col-3 item text-muted">
                {{ formatPrice(item.price * item.quantity) }}
              </div>
              <div class="col-3 text-danger">
                <i
                  class="bi bi-trash3 text-danger"
                  @click="removeCartItem(item.item._id, item.quantity)"
                ></i>
              </div>
            </div>
          </div>
          <hr class="mb-1" />
        </div>
      </div>
      <div class="col-12 bg-light mh-100 p-4 w-100">
        <!-- <div> -->
        <h4 class="heading">Summary</h4>
        <hr />
        <div class="d-flex flex-column align-items-center">
          <div class="w-50">
            <div
              class="text-uppercase text-muted d-flex flex-row justify-content-between w-100"
            >
              <div>Total Amount</div>
              <div>{{ formatPrice(+cartTotal) }}</div>
            </div>
            <button
              type="button"
              class="place-order btn btn-dark text-uppercase w-100 my-4"
              @click="handleOrderPlaced"
            >
              Place Order
            </button>
          </div>
          {{ cart }}
        </div>
      </div>
    </div>
  </div>
  <div class="text-center align-items-center" v-else>Cart is empty!</div>
</template>

<script>
import { formatPrice } from '../../utils/FormatPrice';
// import { mapGetters } from "vuex"
export default {
  data() {
    return {
      // cart: {
      //   items: null,
      //   totalItems: null,
      //   cartTotal: null,
      // },
      // cart: null,
      cartItems: null,
      cartTotal: null,
      cartCount: null,
    };
  },
  async mounted() {
    // await this.$store.dispatch('employee/cartCount', {
    //   empId: await this.$store.getters['auth/user'].empId,
    // });
    this.cartCount = await this.$store.getters['employee/cartCount'];
    console.log(this.cartCount);

    await this.$store.dispatch('employee/fetchCart', {
      empId: await this.$store.getters['auth/user'].empId,
    });

    this.cartItems = await this.$store.getters['employee/cartItems'];
    this.cartTotal = await this.$store.getters['employee/cartTotal'];
  },
  computed: {
    cart() {
      // Your computed logic here
      return this.$store.getters['employee/cart'];
    },
    computedCartCount() {
      return this.$store.getters['employee/cartCount'];
    },
    computedCartTotal() {
      return this.$store.getters['employee/cartTotal'];
    },
    computedCartItems() {
      return this.$store.getters['employee/cartItems'];
    },
  },
  watch: {
    cart: {
      handler(newValue) {
        console.log(newValue);
      },
      immediate: true,
      deep: true,
    },
    computedCartCount(newValue) {
      this.cartCount = newValue;
    },
    computedCartTotal(newValue) {
      this.cartTotal = newValue;
    },
    computedCartItems(newValue) {
      this.cartItems = newValue;
    },
  },

  // computed: {
  //   ...mapGetters({ cart: 'employee/cart' }),
  // },
  // watch: {
  //   cart: {
  //     handler(newValue) {
  //       console.log(newValue);
  //     },
  //     immediate: true,
  //     deep: true
  //   }
  // },
  methods: {
    formatPrice,
    async handleOrderPlaced() {
      await this.$store.dispatch('employee/placeOrder', {
        empId: this.$store.getters['auth/user'].empId,
        cartItems: this.cartItems,
        cartTotal: this.cartTotal,
      });

      await this.$store.commit('employee/setOrderPlaced', {
        orderPlaced: true,
      });

      this.$router.push('/');
    },
    removeCartItem(itemId, deleteCount) {
      console.log(itemId);
      this.$store.dispatch('employee/removeFromCart', {
        empId: this.$store.getters['auth/user'].empId,
        itemId,
        deleteCount,
      });
    },
    addCartItem(itemId) {
      console.log(itemId);
      this.$store.dispatch('employee/addToCart', {
        empId: this.$store.getters['auth/user'].empId,
        itemId,
      });
    },
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

.place-order {
  opacity: 0.85;
}

.place-order:hover {
  /* Styles for the hover effect */
  /* background-color: #fff;
  color: #000; */
  background-color: #000;
  opacity: 1;
  transition: background-color 0.7s;
  /* border: #fff; */
}

.place-order:active {
  /* Styles for the click effect */
  transition: transform 0.6s;
  transform: scale(0.95);
}
</style>
