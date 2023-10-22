<template>
  <div>
    <div class="d-flex justify-content-center align-items-center">
      <div
        class="card m-4 p-4 col-xl-4 col-lg-5 col-md-8 col-12 shadow bg-body rounded"
      >
        <h4 class="text-center fw-bold">Add New Item</h4>
        <div class="card-body">
          <form class="row g-3" @submit.prevent="handleSubmit" novalidate>
            <div class="col-12">
              <label for="itemName" class="form-label">Item Name</label>
              <input
                type="text"
                class="form-control"
                id="itemName"
                name="itemName"
                v-model.trim="itemName"
                required
              />
            </div>
            <div class="col-12">
              <label for="price" class="form-label">Price</label>
              <input
                type="number"
                class="form-control"
                id="price"
                name="price"
                v-model.trim="price"
                required
              />
            </div>
            <div class="col-12">
              <label for="price" class="form-label">Quantity Available</label>
              <input
                type="number"
                class="form-control"
                id="quantity"
                name="quantity"
                v-model.trim="quantity"
                required
              />
            </div>

            <div class="col-12 d-grid mt-4">
              <button
                type="submit"
                class="btn btn-dark text-light"
                :disabled="!formIsValid"
              >
                Add Item
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      itemName: '',
      price: '',
      quantity: '',
    };
  },
  computed: {
    formIsValid() {
      if (this.itemName === '' || this.price === '' || this.quantity === '') {
        return false;
      }
      return true;
    },
  },
  methods: {
    async handleSubmit() {
      await this.$store.dispatch('admin/addNewItem', {
        itemName: this.itemName,
        price: this.price,
      });

      this.$router.push(`/admin/menu`);
    },
  },
};
</script>
