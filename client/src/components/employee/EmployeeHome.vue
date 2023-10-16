<template>
  <!-- <div class="container"> -->
  <!-- <div class="row">
      <div class="col-md-4 col-sm-8 col-12 my-3">
        <div class="card" style="width: 18rem"></div>
      </div>
    </div> -->
  <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
    <div class="col" v-for="(item, index) in items" :key="index">
      <div class="card h-100">
        <div class="row g-0">
          <div class="col-4 col-sm-12">
            <!-- <img class="img-fluid rounded-start" alt="..." /> -->
            <img src="https://www.vegrecipesofindia.com/wp-content/uploads/2017/07/cream-cheese-sandwich-recipe-1.jpg"
              class="card-img-top img-fluid h-100" alt="..." />
          </div>
          <div class="col-8 col-sm-12">
            <div class="card-body d-flex flex-column justify-content-center h-100">
              <div class="d-flex justify-content-between">
                <h5 class="card-title">{{ item.itemName }}</h5>
                <h5 class="text-success">{{ formatPrice(item.price) }}</h5>
              </div>
              <!-- <div class="card-text my-2">
                            <div><b>Price:</b> {{ formatPrice(item.price) }}</div>
                            <div><b>Available:</b> {{ item.isAvailable }}</div>
                        </div> -->
              <a href="#" class="btn btn-dark w-100 mt-3" @click="addToCart(item._id)">Add to cart</a>
            </div>
          </div>
        </div>
        <!-- <img
            src="https://www.vegrecipesofindia.com/wp-content/uploads/2017/07/cream-cheese-sandwich-recipe-1.jpg"
            class="card-img-top img-fluid"
            alt="..."
          />
          <div class="card-body mt-2">
            <div class="d-flex justify-content-between">
              <h5 class="card-title">{{ item.itemName }}</h5>
              <h5 class="text-success">{{ formatPrice(item.price) }}</h5>
            </div>
            <a
              href="#"
              class="btn btn-dark w-100 mt-3"
              @click="addToCart(item._id)"
              >Add to cart</a
            >
          </div> -->
      </div>
    </div>
  </div>
  <!-- </div> -->
</template>

<script>
export default {
  data() {
    return {
      items: null,
      price: null,
    };
  },
  async mounted() {
    const response = await fetch(`${process.env.VUE_APP_IP_ADDRESS}:3000/employee/menu`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = await response.json();
    this.items = responseData.data;
    console.log(this.items);
  },
  methods: {
    formatPrice(price) {
      return price.toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
      });
    },
    async addToCart(id) {
      console.log(id);
      const response = await fetch(
        `${process.env.VUE_APP_IP_ADDRESS}:3000/employee/${this.$store.getters['auth/user'].empId}/cart`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ itemId: id }),
        }
      );

      const responseData = await response.json();

      console.log(responseData);

      this.$store.dispatch('employee/cartCount', { empId: this.$store.getters['auth/user'].empId })

    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500&display=swap');

h5 {
  font-family: 'Oswald', sans-serif;
  text-transform: uppercase;
}
</style>
