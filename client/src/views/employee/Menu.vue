<template>
  <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
    <div class="col" v-for="(item, index) in items" :key="index">
      <div class="card">
        <div class="row g-0">
          <div class="col-4">
            <!-- <img class="img-fluid rounded-start" alt="..." /> -->
            <img src="https://www.vegrecipesofindia.com/wp-content/uploads/2017/07/cream-cheese-sandwich-recipe-1.jpg"
              class="card-img-top img-fluid h-100 p-3" alt="..." />
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
                @click="addToCart(item._id)">Add to cart</button>
              <div class="d-flex justify-content-around align-items-center mt-3 w-100 rounded-2 bg-dark" v-else>
                <button class="icon-btn btn btn-dark" @click="
                  removeFromCart(item._id, 1)
                  "><i class="bi bi-dash"></i></button>
                <span class="text-light">{{ calculateItemQuantity(item._id) }}</span>
                <button class="icon-btn btn btn-dark " @click=" addToCart(item._id)"
                  :disabled="calculateItemQuantity(item._id) >= 10"><i class="bi bi-plus"></i></button>
                <!-- <button class="btn btn-dark">
                  <i class="bi bi-dash" @click="
                    removeFromCart(item._id, 1)
                    "></i>
                  <span>{{ calculateItemQuantity(item._id) }}</span>
                  <i type="button" class="bi bi-plus"
                    @click="calculateItemQuantity(item._id) >= 10 ? null : addToCart(item._id)"
                    :disabled="calculateItemQuantity(item._id) >= 10"></i>
                </button> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatPrice } from '../../utils/FormatPrice';
export default {
  data() {
    return {
      items: null,
      cartItems: null
    };
  },
  computed: {
    computedCartItems() {
      return this.$store.getters['employee/cartItems'];
    },
  },
  watch: {
    computedCartItems(val) {
      this.cartItems = val
      console.log(this.cartItems);
    }
  },
  async mounted() {
    await this.$store.dispatch('employee/fetchCart', {
      empId: await this.$store.getters['auth/user'].empId,
    });

    this.cartItems = await this.$store.getters['employee/cartItems'];
    await this.$store.dispatch('employee/fetchMenu');
    this.items = await this.$store.getters['employee/menu'];


  },
  methods: {
    formatPrice,
    async addToCart(id) {
      await this.$store.dispatch('employee/addToCart', {
        empId: this.$store.getters['auth/user'].empId,
        itemId: id,
      });
    },
    async removeFromCart(itemId, deleteCount) {
      await this.$store.dispatch('employee/removeFromCart', {
        empId: this.$store.getters['auth/user'].empId,
        itemId,
        deleteCount,
      });
    },
    calculateItemQuantity(currentItem) {
      let quantity = 0
      Object.keys(this.cartItems).map(item => {
        if (this.cartItems[item].item._id === currentItem) {
          quantity = this.cartItems[item].quantity
        }
      })
      return quantity
    }
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

.add-to-cart {
  opacity: 0.85;
}

.add-to-cart:hover {
  /* Styles for the hover effect */
  /* background-color: #fff;
  color: #000; */
  background-color: #000;
  opacity: 1;
  transition: background-color 0.7s;
  /* border: #fff; */
}

.add-to-cart:active {
  /* Styles for the click effect */
  transition: transform 0.6s;
  transform: scale(0.95);
}
</style>
