<template>
  <div class="auth-container d-flex justify-content-center align-items-center">
    <!-- <div class="d-flex justify-content-center align-items-center"> -->
    <div
      class="card m-4 p-4 col-xl-4 col-lg-5 col-md-8 col-12 shadow bg-body rounded"
    >
      <h4 class="text-center fw-bold">LOGIN</h4>
      <div class="card-body">
        <div
          class="alert alert-danger alert-dismissible fade show"
          role="alert"
          v-if="errors.login"
        >
          {{ errors.login }}
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
          ></button>
        </div>
        <form class="row g-3" @submit.prevent="onSubmit()" novalidate>
          <div class="col-12">
            <label for="email" class="form-label">Email</label>
            <input
              type="email"
              class="form-control"
              id="email"
              name="email"
              v-model.trim="email"
              required
              @change="handleValidations"
            />
            <div
              class="text-danger mt-2"
              v-if="errors.email"
              style="text-transform: capitalize"
            >
              <i class="bi bi-info-circle"></i> {{ errors.email }}
            </div>
          </div>
          <div class="col-12">
            <label for="password" class="form-label">Password</label>
            <div class="d-flex align-items-center">
              <input
                :type="passwordType"
                class="form-control"
                id="password"
                name="password"
                v-model.trim="password"
                @change="handleValidations"
                required
                minlength="6"
              />
              <span class="icon is-small is-right" style="margin-left: -2rem">
                <i
                  class="bi"
                  :class="{
                    'bi-eye': !showPassword,
                    'bi-eye-slash': showPassword,
                  }"
                  @click="toggleShow"
                ></i>
              </span>
            </div>
            <div
              class="text-danger mt-2"
              v-if="errors.password"
              style="text-transform: capitalize"
            >
              <i class="bi bi-info-circle"></i> {{ errors.password }}
            </div>
          </div>
          <div class="col-12 d-grid mt-4">
            <button
              type="submit"
              class="authButton btn text-light"
              :disabled="!formIsValid"
            >
              Sign In
            </button>
          </div>
          <hr />
          <div class="mt-0 text-secondary float-right">
            Don't have an account?
            <router-link class="authLink text-decoration-none" to="signup"
              >Signup</router-link
            >
          </div>
        </form>
      </div>
    </div>
    <!-- </div> -->
  </div>
</template>

<script>
import { Validator } from '../../utils/Validator';

export default {
  data() {
    return {
      email: '',
      password: '',
      errors: {},
      showPassword: false,
    };
  },
  computed: {
    formIsValid() {
      if (this.email === '' || this.password === '') {
        return false;
      } else if (!this.errors.email && !this.errors.password) {
        return true;
      }
      return false;
    },
    passwordType() {
      return this.showPassword ? 'text' : 'password';
    },
  },
  methods: {
    toggleShow() {
      this.showPassword = !this.showPassword;
    },
    async onSubmit() {
      try {
        const actionPayload = {
          email: this.email,
          password: this.password,
        };

        await this.$store.dispatch('auth/login', actionPayload);

        const role = this.$store.getters['auth/userRole'];

        this.errors.login = null;
        this.$router.push(`/${role}`);
      } catch (err) {
        this.errors.login = err.error;
      }
    },
    handleValidations(event) {
      const error = Validator(event.target.name, event.target.value);
      this.errors[event.target.name] = error[event.target.name];
    },
  },
};
</script>

<style>
.auth-container {
  min-height: 100vh !important;
}
.authButton {
  background-color: #006363 !important;
}
.authLink {
  color: #006363 !important;
}
</style>
