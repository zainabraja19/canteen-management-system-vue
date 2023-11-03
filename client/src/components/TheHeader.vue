<template>
  <div class="shadow bg-body rounded sticky-top mb-4">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <button class="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false"
          aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
          <ul class="navbar-nav justify-content-end ms-4 ms-lg-0 flex-grow-1">
            <div class="d-flex flex-column align-items-lg-center flex-lg-row">
              <li class="nav-item">
                <router-link class="nav-link" to="/">Home</router-link>
              </li>
              <li class="nav-item" v-if="role === 'employee'">
                <router-link class="nav-link" to="/user/orders">Orders</router-link>
              </li>
              <li class="nav-item" v-if="role === 'admin'">
                <router-link class="nav-link" to="/admin/menu">Menu</router-link>
              </li>
            </div>
            <div class="d-flex flex-column align-items-lg-center flex-lg-row ms-lg-auto">
              <li class="text-light navbar-nav ms-lg-auto me-3" v-if="role === 'employee'">
                <router-link class="nav-link" to="/user/cart">
                  <button type="button" class="btn btn-light position-relative">
                    <i class="bi bi-cart-dash me-1"></i>
                    Cart
                    <span
                      class="position-absolute top-0 start-100 translate-middle badge rounded-pill p-1 bg-danger rounded-circle">
                      {{ cartCount }}
                    </span>
                  </button>
                </router-link>
              </li>
              <li class="text-light navbar-nav ms-lg-auto me-3" v-if="role === 'admin'">
                <router-link class="nav-link" to="/admin/addItem">
                  <button type="button" class="btn btn-light position-relative">
                    Add New Item
                  </button>
                </router-link>
              </li>
              <!-- <li class="nav-item">
                <a class="nav-link" @click="handleLogout()" style="cursor: pointer">Logout</a>
              </li> -->
              <li class="nav-item dropdown" v-if="role === 'employee'">
                <a class="nav-link" href="#" id="navbarDarkDropdownMenuLink" role="button" data-bs-toggle="dropdown"
                  aria-expanded="false">
                  <img class="nav-profile" :src="profilePicture" />
                </a>
                <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-lg-end"
                  aria-labelledby="navbarDarkDropdownMenuLink">
                  <!-- <li><a class="dropdown-item" href="#">Action</a></li>
                  <li><a class="dropdown-item" href="#">Another action</a></li>
                  <li><a class="dropdown-item" href="#">Something else here</a></li> -->
                  <li>
                    <router-link class="dropdown-item" to="/user/profile">Profile</router-link>
                  </li>
                  <li>
                    <a class="dropdown-item" @click="handleLogout()" style="cursor: pointer">Logout</a>
                  </li>
                </ul>
              </li>
              <li>
                <a class="nav-link" v-if="role === 'admin'" @click="handleLogout()" style="cursor: pointer">Logout</a>
              </li>
            </div>
          </ul>
        </div>
      </div>
    </nav>
  </div>
  <error-toast v-if="isError" :error="error"></error-toast>
</template>

<script>
import { RouterLink } from 'vue-router';
import ErrorToast from './ErrorToast.vue';

export default {
  data() {
    return {
      cartCount: 0,
      profilePicture: null,
      isError: false,
      error: null
    };
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters['auth/isAuthenticated'];
    },
    role() {
      return this.$store.getters['auth/userRole'];
    },
    computedCartCount() {
      return this.$store.getters['employee/cartCount'];
    },
    computeProfilePicture() {
      return this.$store.getters['employee/profilePicture'];
    },
  },
  mounted() {
    this.fetchData();
  },
  watch: {
    isLoggedIn(val) {
      console.log(val);
      this.fetchData();
    },
    computedCartCount(newValue) {
      // Update the local cartCount when the computedCartCount changes
      this.cartCount = newValue;
    },
    computeProfilePicture(val) {
      this.profilePicture = val;
    },
  },
  methods: {
    async handleLogout() {
      try {
        await this.$store.dispatch('auth/logout');

        this.error = null
        this.isError = false

        await this.$router.push(`/`);
      } catch (err) {
        this.error = err
        this.isError = true
      }
    },
    async fetchData() {
      try {
        if (this.isLoggedIn && this.role === 'employee') {
          await this.$store.dispatch('employee/cartCount', {
            empId: this.$store.getters['auth/user'].empId,
          });
          this.cartCount = await this.$store.getters['employee/cartCount'];
          await this.$store.dispatch('employee/fetchProfilePicture', {
            empId: this.$store.getters['auth/user'].empId,
          });
        }

        this.error = null
        this.isError = false
      } catch (err) {
        this.error = err
        this.isError = true

      }
    },
  },
  components: {
    RouterLink,
    ErrorToast
  },
};
</script>

<style scoped>
.nav-profile {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: 1px solid #7a7a7a;
  padding: 0.1rem;
}
</style>
