<template>
  <error-toast v-if="isError" :error="error"></error-toast>
  <div v-if="isLoading" class="loading d-flex justify-content-center align-items-center mh-100">
    <div class="spinner-grow text-secondary" style="width: 3rem; height: 3rem" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  <div class="mx-5" v-else>
    <div v-if="items.length > 0" class="row row-cols-1 row-cols-md-2 row-cols-lg-3  row-cols-xl-4  g-4">
      <div class="col" v-for="(item, index) in items" :key="index">
        <div class="card">
          <div class="row g-0">
            <div class="col-4">
              <!-- <img class="img-fluid rounded-start" alt="..." /> -->
              <img src="https://www.vegrecipesofindia.com/wp-content/uploads/2017/07/cream-cheese-sandwich-recipe-1.jpg"
                class="item-image img-fluid h-100 p-3" alt="..." />
            </div>
            <div class="col-8">
              <div class="card-body h-100 d-flex flex-column justify-content-center">
                <div class="d-flex justify-content-between">
                  <div class="card-title" style="
                      max-height: 20px;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                    ">
                    {{ item.itemName }}
                  </div>
                  <div class="item-price text-success">
                    {{ formatPrice(item.price) }}
                  </div>
                </div>
                <!-- {{ calculateItemQuantity(item._id) > 10 }} -->
                <button v-if="calculateItemQuantity(item._id) === 0" class="add-to-cart btn btn-dark w-100 mt-3"
                  @click="addToCart(item._id, item.itemName)">
                  Add to cart
                </button>
                <div class="add-to-cart d-flex justify-content-around align-items-center mt-3 w-100 rounded-2" v-else>
                  <button class="icon-btn btn" @click="removeFromCart(item._id, item.itemName, 1)">
                    <i class="bi bi-dash"></i>
                  </button>
                  <span class="text-light">{{
                    calculateItemQuantity(item._id)
                  }}</span>
                  <button class="icon-btn btn" @click="addToCart(item._id, item.itemName)"
                    :disabled="calculateItemQuantity(item._id) >= 10">
                    <i class="bi bi-plus"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="fs-5">
      <div class="d-flex flex-column align-items-center justify-content-center mt-4 fs-5" style="min-height: 70vh">
        <p>
          <strong style="max-width: 500px">Looks like there are no items available currently. Please check
            after some time.</strong>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { formatPrice } from '../../utils/FormatPrice';
import ErrorToast from '../../components/ErrorToast.vue';
// import SuccessToast from '../../components/SuccessToast.vue';

export default {
  data() {
    return {
      items: null,
      cartItems: null,
      isLoading: true,
      isError: false,
      error: null,
    };
  },
  computed: {
    computedCartItems() {
      return this.$store.getters['employee/cartItems'];
    },
  },
  watch: {
    computedCartItems(val) {
      this.cartItems = val;
    },
  },
  async mounted() {
    const cart = await this.$store.dispatch('employee/fetchCart', {
      empId: await this.$store.getters['auth/user'].empId,
    });

    const menu = await this.$store.dispatch('employee/fetchMenu');

    if (cart) {
      this.isError = true;
      this.error = cart;
    } else if (menu) {
      this.isError = true;
      this.error = menu;
    } else {
      this.cartItems = await this.$store.getters['employee/cartItems'];
      this.items = await this.$store.getters['employee/menu'];

      if (this.items) {
        this.isLoading = false;
      }
      this.error = null;
      this.isError = false;
    }
  },
  methods: {
    formatPrice,
    async addToCart(id, itemName) {
      await this.$store.commit('setShowToast', { showToast: false, toastMessage: null })
      const res = await this.$store.dispatch('employee/addToCart', {
        empId: this.$store.getters['auth/user'].empId,
        itemId: id,
      });

      if (res) {
        this.isError = true;
        this.error = res;
      } else {
        await this.$store.commit('setShowToast', { showToast: true, toastMessage: `${itemName} added to cart.` })

        this.error = null;
        this.isError = false;
      }
    },
    async removeFromCart(itemId, itemName, deleteCount) {
      await this.$store.commit('setShowToast', { showToast: false, toastMessage: null })
      const res = await this.$store.dispatch('employee/removeFromCart', {
        empId: this.$store.getters['auth/user'].empId,
        itemId,
        deleteCount,
      });

      if (res) {
        this.isError = true;
        this.error = res;
      } else {
        await this.$store.commit('setShowToast', { showToast: true, toastMessage: `${itemName} removed from cart.` })
        this.error = null;
        this.isError = false;
      }
    },
    calculateItemQuantity(currentItem) {
      let quantity = 0;
      Object.keys(this.cartItems).map((item) => {
        if (this.cartItems[item].item._id === currentItem) {
          quantity = this.cartItems[item].quantity;
        }
      });
      return quantity;
    },
  },
  components: {
    ErrorToast,
    // SuccessToast
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500&display=swap');

.card-title,
.item-price {
  font-family: 'Oswald', sans-serif;
  text-transform: uppercase;
}

.add-to-cart,
.icon-btn,
.icon-btn.btn:active {
  border-color: #006363;
  background-color: #006363;
  color: #fff;
}

.add-to-cart.btn:hover,
.add-to-cart.btn:active {
  /* Styles for the hover effect */
  /* background-color: #fff;
  color: #000; */
  background-color: #fff;
  border-color: #006363;
  color: #006363;
  transition: background-color 0.5s;
  /* border: #fff; */
}

.add-to-cart.btn:active {
  /* Styles for the click effect */
  transition: transform 0.6s;
  transform: scale(0.95);
}

/* .item-image {
  width: 120px
} */
</style>
