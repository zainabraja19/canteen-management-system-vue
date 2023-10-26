<template>
  <!-- <div class="row">
    <div class="col-12 d-flex justify-content-center align-items-center"> -->
  <!-- <div class="shadow bg-body rounded sticky-top"> -->
  <!-- <div data-bs-toggle="modal" data-bs-target="#editItemModal">
    <i data-bs-toggle="tooltip" data-bs-placement="top" title="Edit details" class="bi bi-pencil-square text-primary"></i>
  </div> -->
  <div data-bs-toggle="modal" data-bs-target="#editItemModal">
    <i data-bs-toggle="tooltip" data-bs-placement="top" title="Edit details" class="bi bi-pencil-square text-primary"></i>
  </div>
  <div class="modal fade" id="editItemModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Edit Item Details</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form class="row g-3 text-start px-3" novalidate>
            <div class="col-12">
              <label for="itemName" class="form-label"><strong>Item Name</strong></label>
              <input type="text" class="form-control" id="itemName" name="itemName" v-model.trim="itemName" />
            </div>
            <div class="col-12">
              <label for="price" class="form-label"><strong>Price</strong></label>
              <input type="number" class="form-control" id="price" name="price" v-model.trim="price" />
            </div>
            <div class="col-12">
              <label for="itemName" class="form-label"><strong>Available</strong></label>
              <div class="form-check">
                <input class="form-check-input" type="radio" name="isAvailable" id="isAvailable1" v-model="isAvailable"
                  value="true" />
                <label class="form-check-label" for="isAvailable1">
                  Yes
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" name="isAvailable" id="isAvailable2" v-model="isAvailable"
                  value="false" />
                <label class="form-check-label" for="isAvailable2">
                  No
                </label>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Close
          </button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>

  <!-- </div>
  </div> -->
</template>

<script>
export default {
  props: ['item'],
  data() {
    return {

    }
  },
  computed: {
    itemName() {
      return this.item.itemName
    },
    price() {
      return this.item.price
    },
    isAvailable() { return this.item.isAvailable }
  },
  mounted() {
    console.log(this.item);

  }
  //   data() {
  //     return {
  //       email: '',
  //       password: '',
  //       errors: {},
  //     };
  //   },
  //   computed: {
  //     formIsValid() {
  //       if (this.email === '' || this.password === '') {
  //         return false;
  //       } else if (!this.errors.email && !this.errors.password) {
  //         return true;
  //       }
  //       return false;
  //     },
  //   },
  //   // watch: {
  //   //   email(curVal) {
  //   //     const errors = Validator('email', curVal);
  //   //     this.errors.email = errors.email;
  //   //   },
  //   //   password(curVal) {
  //   //     const errors = Validator('password', curVal);
  //   //     this.errors.password = errors.password;
  //   //   },
  //   // },
  //   methods: {
  //     async onSubmit() {
  //       try {
  //         const actionPayload = {
  //           email: this.email,
  //           password: this.password,
  //         };
  //         await this.$store.dispatch('auth/login', actionPayload);
  //         const role = this.$store.getters['auth/userRole'];
  //         this.errors.login = null;
  //         this.$router.push(`/${role}`);
  //       } catch (err) {
  //         this.errors.login = err.error;
  //       }
  //     },
  //     handleValidations(event) {
  //       const error = Validator(event.target.name, event.target.value);
  //       this.errors[event.target.name] = error[event.target.name];
  //     },
  //   },
};
</script>

<style>
.authButton {
  background-color: #006363 !important;
}
</style>
