<template>
  <nav class="navbar navbar-expand-lg bg-transparent">
    <div class="container-fluid my-1">
      <!-- <a class="navbar-brand" routerLink="/">Canteen Management System</a> -->
      <button class="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
        aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse " id="navbarSupportedContent">
        <ul class="navbar-nav mb-2 mb-lg-0" style="width: 25%">
          <li class="nav-item" v-if="!isLoggedIn">
            <router-link class="nav-link" to="/signup">Signup</router-link>
          </li>
          <li class="nav-item" v-if="!isLoggedIn">
            <router-link class="nav-link" to="/login">Login</router-link>
          </li>
          <li class="nav-item" v-if="isLoggedIn">
            <router-link class="nav-link" to="/" style="text-transform: capitalize">Home</router-link>
          </li>
          <li class="nav-item" v-if="isLoggedIn">
            <router-link class="nav-link" to="/employee/profile" style="text-transform: capitalize">Profile</router-link>
          </li>
          <li class="nav-item" v-if="isLoggedIn">
            <a class="nav-link" @click="handleLogout()">Logout</a>
          </li>
        </ul>
        <li class="text-light navbar-nav ms-auto me-3" v-if="isLoggedIn">
          <!-- <Router-link class="nav-link" to="employee/cart" style="font-size: 1.2rem"><button><i
                class="bi bi-cart-dash me-1"></i>
              Cart<span class="position-absolute translate-middle badge rounded-pill bg-danger">
                99+
              </span>
            </button></Router-link> -->
          <Router-link class="nav-link" to="/employee/cart"> <button type="button" class="btn btn-dark position-relative">
              <i class="bi bi-cart-dash me-1"></i>
              Cart
              <span
                class="position-absolute top-0 start-100 translate-middle badge rounded-pill p-1 bg-danger rounded-circle">
                {{ cartCount }}
              </span>
            </button>
          </Router-link>
        </li>
      </div>
    </div>
  </nav>
</template>

<script>
import { RouterLink } from 'vue-router';

export default {
  data() {
    return {
      cartCount: 0
    }
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
  },
  watch: {
    computedCartCount(newValue) {
      // Update the local cartCount when the computedCartCount changes
      this.cartCount = newValue;
    },
  },
  created() {
    this.$store.dispatch('employee/cartCount', { empId: this.$store.getters['auth/user'].empId })
    this.cartCount = this.$store.getters['employee/cartCount']
  },
  methods: {
    async handleLogout() {
      await this.$store.dispatch('auth/logout');
      await this.$router.push(`/`);
    },
  },
  components: { RouterLink },
};
</script>
