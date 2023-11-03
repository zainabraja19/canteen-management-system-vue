<template>
  <error-toast v-if="isError" :error="error"></error-toast>
  <div class="d-flex justify-content-center align-items-center" style="min-height: 80vh;">
    <div class="card m-4 p-4 col-xl-4 col-lg-5 col-md-7 col-12 shadow bg-body rounded">
      <h4 class="text-center fw-bold">Add New Item</h4>
      <div class="card-body">
        <form class="row g-3" @submit.prevent="handleSubmit" novalidate>
          <div class="col-12">
            <label for="itemName" class="form-label">Item Name <span class="text-danger">*</span></label>
            <input type="text" class="form-control" id="itemName" name="itemName" v-model.trim="itemName" required
              autocomplete="off" maxlength="50" />
          </div>
          <p class="text-danger mt-2 mb-0" v-if="itemName === ''"><i class="bi bi-info-circle"></i> Item Name is
            required
          </p>
          <div class="col-12">
            <label for="price" class="form-label">Price <span class="text-danger">*</span></label>
            <input type="number" class="form-control" id="price" name="price" v-model.trim="price" required min="0"
              max="1000" @input="validatePrice" />
          </div>
          <p class="text-danger mt-2 mb-0" v-if="!isValidPrice"><i class="bi bi-info-circle"></i>
            <span v-if="price === ''"> Price is required</span>
            <span v-else> Price must be a valid number between 0 and
              1000.</span>
          </p>
          <!-- <div class="col-12">
              <label for="price" class="form-label">Quantity Available</label>
              <input type="number" class="form-control" id="quantity" name="quantity" v-model.trim="quantity" required />
            </div> -->

          <div class="col-12 d-grid mt-4">
            <button type="submit" class="btn btn-dark text-light" :disabled="!formIsValid">
              <div v-if="isLoading">
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span class="visually-hidden">Loading...</span>
              </div>
              <span v-else>Add Item</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import ErrorToast from '../../components/ErrorToast.vue';

export default {
  data() {
    return {
      itemName: null,
      price: null,
      // quantity: '',
      isValidPrice: true,
      isLoading: false,
      isError: false,
      error: null
    };
  },
  computed: {
    formIsValid() {
      if (!this.itemName || this.itemName === '' || this.price === '' || !this.isValidPrice) {
        return false;
      }
      return true;
    },
  },
  methods: {
    async handleSubmit() {
      try {
        this.isLoading = true
        await this.$store.dispatch('admin/addNewItem', {
          itemName: this.itemName,
          price: this.price,
        });

        this.isLoading = false
        this.error = null
        this.isError = false

        this.$router.push(`/admin/menu`);
      } catch (err) {
        this.error = err
        this.isError = true
      }
    },
    validatePrice() {
      const pattern = /^[0-9]+\.?\d*$/;
      this.isValidPrice = pattern.test(this.price);

      if (this.isValidPrice) {
        const numericPrice = parseFloat(this.price);
        if (numericPrice < 0 || numericPrice > 1000) {
          this.isValidPrice = false
        }
      }
    },
  },
  components: {
    ErrorToast
  }
};
</script>
