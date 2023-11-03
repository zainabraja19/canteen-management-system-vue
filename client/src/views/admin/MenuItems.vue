<template>
  <error-toast v-if="isError" :error="error"></error-toast>
  <div v-if="isLoading" class="loading d-flex justify-content-center align-items-center mh-100">
    <div class="spinner-grow text-secondary" style="width: 3rem; height: 3rem;" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  <div v-else>

    <h2>Menu Items</h2>
    <!-- <hr /> -->
    <div class="table-responsive mt-4" v-if="totalMenuItems > 0">
      <div style="min-height: 450px;">
        <table class="table text-center table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Item Name</th>
              <th scope="col">Price</th>
              <!-- <th scope="col">isAvailable</th> -->
              <th scope="col">Available</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in   items  " :key="index">
              <th scope="row">{{ index + 1 }}</th>
              <td>{{ item.itemName }}</td>
              <td>{{ formatPrice(+item.price) }}</td>
              <td>{{ item.isAvailable ? 'Yes' : 'No' }}</td>
              <!-- <td>
            <div class="form-check form-switch d-flex justify-content-center">
              <input class="form-check-input" type="checkbox" role="switch" style="font-size: larger;"
                v-model="item.isAvailable">
            </div>
          </td> -->
              <td>
                <div data-bs-toggle="modal" data-bs-target="#editItemModal" @click="setSelectedItem(item)">
                  <i data-bs-toggle="tooltip" data-bs-placement="top" title="Edit details"
                    class="bi bi-pencil-square text-primary"></i>
                </div>
              </td>
              <!-- <td>
            <div data-bs-toggle="modal" data-bs-target="#deleteItemModal" @click="setSelectedItemId(item._id)">
              <i data-bs-toggle="tooltip" data-bs-placement="top" title="Remove Item"
                class="bi bi-trash3 text-danger"></i>
            </div>
          </td> -->
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pagination d-flex justify-content-center mt-4">
        <vue-awesome-paginate :clickable="true" :prev-text="'Previous'" :next-text="'Next'" :total-items="totalMenuItems"
          :items-per-page="10" :max-pages-shown="5" v-model="currentPage" :on-click="changePage">
          <template #prev-button>
            <span>
              <i class="bi bi-chevron-left"></i>
            </span>
          </template>

          <template #next-button>
            <span>
              <i class="bi bi-chevron-right"></i>
            </span>
          </template>
        </vue-awesome-paginate>
      </div>
      <!-- </div> -->
    </div>
    <div v-else>
      <span class="me-2 fs-5">
        <hr>
        <strong>
          There are no items present in the menu!
        </strong>
      </span>
      <span class="ms-2">
        <router-link to="/admin/addItem">
          <button type="button" class="btn btn-dark">
            Click here to add
          </button>
        </router-link>
      </span>
    </div>
    <!-- Modal -->
    <!-- <MenuModalEdit v-if="modalVisible" :item="selectedItem"></MenuModalEdit> -->
    <div class="modal fade" ref="my-modal" id="editItemModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Edit Item Details</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form class="row g-3 text-start px-3" novalidate @submit.prevent="handleEdit(selectedItem._id)">
              <div class="col-12">
                <label for="itemName" class="form-label"><strong>Item Name</strong></label>
                <input type="text" class="form-control" id="itemName" name="itemName" v-model.trim="itemName"
                  maxlength="50" />
              </div>
              <div class="col-12">
                <label for="price" class="form-label"><strong>Price</strong></label>
                <input type="number" class="form-control" id="price" name="price" v-model.trim="price" min="0" max="1000"
                  @input="validatePrice" />
                <p class="text-danger mt-2 mb-0" v-if="!isValidPrice">Price must be a valid number between 0 and
                  1000.</p>
              </div>
              <div class="col-12">
                <label for="itemName" class="form-label"><strong>Available</strong></label>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="isAvailable" id="isAvailable1" v-model="isAvailable"
                    value="true" />
                  <label class="form-check-label" for="isAvailable1"> Yes </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="isAvailable" id="isAvailable2" v-model="isAvailable"
                    value="false" />
                  <label class="form-check-label" for="isAvailable2"> No </label>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="submit" class="btn btn-dark" data-bs-dismiss="modal" :disabled="!isValidPrice">
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Delete modal -->
  <!-- <div class="modal fade" id="deleteItemModal" tabindex="-1" aria-labelledby="deleteItemModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="deleteItemModalLabel">Delete Item</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          Are you sure you want to delete this item?
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-dark" @click="handleDelete">Confirm</button>
        </div>
      </div>
    </div>
  </div> -->

  <!-- <div aria-live="polite" aria-atomic="true" class="d-flex justify-content-center align-items-center w-100">
    <div class="toast-container mt-4 top-0 start-50 translate-middle-x">
      <div class="toast" ref="el" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-body">
          Are you sure you want to delete this item?
          <div class="mt-2 pt-2 border-top d-flex justify-content-end">
            <button type="button" class="btn btn-danger btn-sm me-2" data-bs-dismiss="toast">Cancel</button>
            <button type="button" class="btn btn-dark btn-sm">Confirm</button>
          </div>
        </div>
      </div>
    </div>
  </div> -->
</template>

<script>
import { formatPrice } from '../../utils/FormatPrice';
import ErrorToast from '../../components/ErrorToast.vue';
// import MenuModalEdit from '../../components/MenuModalEdit.vue';
import { Tooltip } from 'bootstrap';
export default {
  data() {
    return {
      items: null,
      totalMenuItems: 0,
      selectedItem: '',
      selectedItemId: null,
      modalVisible: false,
      itemName: '',
      price: 0,
      isAvailable: false,
      currentPage: 1,
      perPage: 10,
      isValidPrice: true,
      isLoading: true,
      isError: false,
      error: null
    };
  },
  computed: {
    computedIsAvailable: {
      get() {
        return this.isAvailable === 'true'; // Convert to a Boolean
      },
      set(val) {
        this.isAvailable = val ? 'true' : 'false'; // Convert to a string
      },
    },
    computedTotalMenuItems() {
      return this.$store.getters['admin/totalMenuItems']
    },
  },
  watch: {
    computedTotalMenuItems(val) {
      this.totalMenuItems = val
    }
  },
  async mounted() {
    this.fetchData()
    new Tooltip(document.body, {
      selector: "[data-bs-toggle='tooltip']",
    });

    // var toast = new Toast(this.$refs.el)
    // toast.show()
  },
  methods: {
    formatPrice,
    changePage(newPage) {
      this.isLoading = true
      this.currentPage = newPage;
      this.fetchData()
    },
    validatePrice() {
      if (this.price === '') {
        this.isValidPrice = true
        return
      }
      const pattern = /^[0-9]+\.?\d*$/;
      this.isValidPrice = pattern.test(this.price);

      if (this.isValidPrice) {
        const numericPrice = parseFloat(this.price);
        if (numericPrice < 0 || numericPrice > 1000) {
          this.isValidPrice = false
        }
      }
    },
    async fetchData() {
      try {
        await this.$store.dispatch('admin/fetchMenu', { page: this.currentPage });
        this.items = await this.$store.getters['admin/menu'];
        this.totalMenuItems = await this.$store.getters['admin/totalMenuItems']
        this.isLoading = false

        this.error = null
        this.isError = false
      } catch (err) {
        this.error = err
        this.isError = true
      }
    },
    setSelectedItem(item) {
      this.modalVisible = !this.modalVisible;
      this.selectedItem = item;
      this.itemName = item.itemName;
      this.price = item.price || 0;
      this.isAvailable = item.isAvailable || false;
    },
    setSelectedItemId(id) {
      this.selectedItemId = id
    },
    async handleEdit(id) {
      const newData = {};

      if (this.selectedItem.itemName !== this.itemName) {
        newData['itemName'] = this.itemName;
      }
      if (this.selectedItem.price !== this.price && this.isValidPrice) {
        newData['price'] = (Math.round(this.price * 100) / 100).toFixed(2);
      }
      if (this.selectedItem.isAvailable != this.isAvailable) {
        this.isAvailable = this.isAvailable === 'true' ? true : false;
        newData['isAvailable'] = this.isAvailable;
      }
      try {

        if (Object.keys(newData).length > 0)
          this.$store.dispatch('admin/editItem', {
            id,
            newData,
          });

        this.error = null
        this.isError = false
      } catch (err) {
        this.error = err
        this.isError = true
      }
      this.fetchData()
    },
    // async handleDelete() {
    //   // var toast = new Toast(this.$refs.el)
    //   // toast.show()
    //   this.$store.dispatch('admin/deleteItem', {
    //     id: this.selectedItemId
    //   })
    //   await this.$store.dispatch('admin/fetchMenu');
    //   this.items = await this.$store.getters['admin/menu'];
    // }
  },
  components: {
    ErrorToast
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
  background-color: #000;
  opacity: 1;
  transition: background-color 0.7s;
}

.add-to-cart:active {
  transition: transform 0.6s;
  transform: scale(0.95);
}

.form-check-input:checked {
  background-color: #198754;
  border-color: #198754;
}

/* .toast {
  opacity: 1;
} */
</style>
