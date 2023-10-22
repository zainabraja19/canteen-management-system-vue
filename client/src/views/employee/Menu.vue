<template>
  <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
    <div class="col" v-for="(item, index) in items" :key="index">
      <div class="card">
        <div class="row g-0">
          <div class="col-4">
            <!-- <img class="img-fluid rounded-start" alt="..." /> -->
            <img
              src="https://www.vegrecipesofindia.com/wp-content/uploads/2017/07/cream-cheese-sandwich-recipe-1.jpg"
              class="card-img-top img-fluid h-100 p-3"
              alt="..."
            />
          </div>
          <div class="col-8">
            <div
              class="card-body h-100 d-flex flex-column justify-content-center"
            >
              <div class="d-flex justify-content-between">
                <div
                  class="card-title"
                  style="
                    max-height: 20px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  "
                >
                  {{ item.itemName }}
                </div>
                <div class="item-price text-success">
                  {{ formatPrice(item.price) }}
                </div>
              </div>
              <a
                href="#"
                class="add-to-cart btn btn-dark w-100 mt-3"
                @click="addToCart(item._id)"
                >Add to cart</a
              >
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
      price: null,
    };
  },
  async mounted() {
    await this.$store.dispatch('employee/fetchMenu');
    this.items = await this.$store.getters['employee/menu'];
  },
  methods: {
    formatPrice,
    async addToCart(id) {
      console.log(id);
      await this.$store.dispatch('employee/addToCart', {
        empId: this.$store.getters['auth/user'].empId,
        itemId: id,
      });
    },
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
