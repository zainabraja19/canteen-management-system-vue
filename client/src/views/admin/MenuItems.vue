<template>
  <div class="table-responsive">
    <table class="table text-center table-hover">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Item Name</th>
          <th scope="col">Price</th>
          <th scope="col">isAvailable</th>
          <th scope="col"></th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items" :key="index">
          <th scope="row">{{ index + 1 }}</th>
          <td>{{ item.itemName }}</td>
          <td>{{ formatPrice(+item.price) }}</td>
          <td>{{ item.isAvailable ? 'Yes' : 'No' }}</td>
          <td @click="setSelectedItem(item)">
            <MenuModalEdit :item="selectedItem"></MenuModalEdit>

          </td>
          <td>
            <i data-bs-toggle="tooltip" data-bs-placement="top" title="Remove Item" class="bi bi-trash3 text-danger"></i>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- Modal -->
</template>

<script>
import { formatPrice } from '../../utils/FormatPrice';
import MenuModalEdit from '../../components/MenuModalEdit.vue';
import { Tooltip } from 'bootstrap';
export default {
  data() {
    return {
      items: null,
      price: null,
      selectedItem: '',
      isEdit: false
    };
  },
  async mounted() {
    await this.$store.dispatch('admin/fetchMenu');
    this.items = await this.$store.getters['admin/menu'];

    new Tooltip(document.body, {
      selector: "[data-bs-toggle='tooltip']",
    });
  },
  methods: {
    formatPrice,
    async addToCart(id) {
      console.log(id);
      await this.$store.dispatch('admin/addToCart', {
        empId: this.$store.getters['auth/user'].empId,
        itemId: id,
      });
    },
    setSelectedItem(item) {
      this.isEdit = true
      this.selectedItem = item
    }
  },
  components: {
    MenuModalEdit,
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
