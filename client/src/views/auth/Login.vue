<template>
  <error-toast v-if="isError" :error="error"></error-toast>
  <div class="auth-container d-flex justify-content-center align-items-center">
    <!-- <div class="d-flex justify-content-center align-items-center"> -->
    <div class="card m-4 p-4 col-xl-4 col-lg-5 col-md-8 col-sm-10 col-11 shadow bg-body rounded">
      <h4 class="text-center fw-bold">LOGIN</h4>
      <div class="card-body">
        <!-- <div class="alert alert-danger alert-dismissible fade show" role="alert" v-if="fieldErrors.login">
          {{ fieldErrors.login }}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div> -->
        <form class="row g-3" @submit.prevent="onSubmit()" novalidate>
          <div class="col-12">
            <label for="email" class="form-label">Email <span class="text-danger">*</span></label>
            <input type="email" class="form-control" id="email" name="email" v-model.trim="email" required
              @change="handleValidations" />
            <div class="text-danger mt-2" v-if="fieldErrors.email" style="text-transform: capitalize">
              <i class="bi bi-info-circle"></i> {{ fieldErrors.email }}
            </div>
          </div>
          <div class="col-12">
            <label for="password" class="form-label">Password <span class="text-danger">*</span></label>
            <div class="d-flex align-items-center">
              <input :type="passwordType" class="form-control" id="password" name="password" v-model.trim="password"
                @change="handleValidations" required minlength="6" />
              <span class="icon is-small is-right" style="margin-left: -2rem">
                <i class="bi" :class="{
                  'bi-eye': !showPassword,
                  'bi-eye-slash': showPassword,
                }" @click="toggleShow"></i>
              </span>
            </div>
            <div class="text-danger mt-2" v-if="fieldErrors.password" style="text-transform: capitalize">
              <i class="bi bi-info-circle"></i> {{ fieldErrors.password }}
            </div>
          </div>
          <div class="col-12 d-grid mt-4">
            <button type="submit" class="authButton btn text-light" :disabled="!formIsValid">
              <div v-if="isLoading">
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span class="visually-hidden">Loading...</span>
              </div>
              <span v-else>Sign In</span>
            </button>
          </div>
          <hr />
          <div class="mt-0 text-secondary float-right">
            Don't have an account?
            <router-link class="authLink text-decoration-none" to="signup">Signup</router-link>
          </div>
        </form>
      </div>
    </div>
    <!-- </div> -->
  </div>
</template>

<script>
import { Validator } from '../../utils/Validator';
import ErrorToast from '../../components/ErrorToast.vue';

export default {
  data() {
    return {
      email: '',
      password: '',
      fieldErrors: {},
      showPassword: false,
      isLoading: false,
      isError: false,
      error: null,
    };
  },
  computed: {
    formIsValid() {
      if (this.email === '' || this.password === '') {
        return false;
      } else if (!this.fieldErrors.email && !this.fieldErrors.password) {
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
      this.isLoading = true;
      const actionPayload = {
        email: this.email,
        password: this.password,
      };

      const res = await this.$store.dispatch('auth/login', actionPayload);
      console.log(res);
      if (res) {
        this.fieldErrors.login = res;
        this.error = res;
        this.isError = true;
        this.isLoading = false;
      } else {
        if (this.$store.getters['auth/isAuthenticated']) {
          this.isLoading = false;
        }

        const role = this.$store.getters['auth/userRole'];
        this.error = null;
        this.isError = false;
        this.$router.push(`/${role === 'employee' ? 'user' : 'admin'}`);
      }
    },
    handleValidations(event) {
      const error = Validator(event.target.name, event.target.value);
      this.fieldErrors[event.target.name] = error[event.target.name];
    },
  },
  components: {
    ErrorToast,
  },
};
</script>

<style>
.auth-container {
  min-height: 100vh !important;
}

.authButton.btn {
  background-color: #006363;
  font-size: 14px;
  text-transform: uppercase;
  background-color: #006363 !important;
  padding: 10px 30px;
  /* border-radius: 40px; */
  color: #fff;
  font-weight: 700;
  box-shadow: 0px 4px 15px -5px rgba(0, 0, 0, 0.3);
}

.authButton.btn:active,
.authButton.btn:hover {
  border-color: #006363 !important;
  color: #006363 !important;
  background-color: white !important;
  transition: background-color 0.5s;
}

.authLink {
  color: #006363 !important;
}

input {
  font-family: 'Roboto', sans-serif;
}
</style>
