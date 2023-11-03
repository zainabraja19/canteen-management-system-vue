<template>
  <div class="auth-container d-flex justify-content-center align-items-center">
    <div class="row">
      <div class="col-12 d-flex justify-content-center align-items-center">
        <div class="card m-4 p-4 col-xl-4 col-lg-5 col-md-8 col-12 ">
          <h4 class="text-center fw-bold">SIGNUP</h4>
          <div class="card-body">
            <form class="row g-3" @submit.prevent="onSubmit()">
              <div class="col-12">
                <label for="empId" class="form-label">Employee ID <span class="text-danger">*</span></label>
                <input type="text" class="form-control" id="empId" name="empId" v-model.trim="empId"
                  @change="handleValidations" />
                <div class="text-danger mt-2" v-if="error.empId" style="text-transform: capitalize">
                  <i class="bi bi-info-circle"></i> {{ error.empId }}
                </div>
              </div>
              <div class="col-12">
                <label for="name" class="form-label">Name <span class="text-danger">*</span></label>
                <input type="text" class="form-control" id="name" name="name" v-model.trim="name"
                  @change="handleValidations" />
                <div class="text-danger mt-2" v-if="error.name" style="text-transform: capitalize">
                  <i class="bi bi-info-circle"></i> {{ error.name }}
                </div>
              </div>
              <div class="col-12">
                <label for="email" class="form-label">Email <span class="text-danger">*</span></label>
                <input type="" class="form-control" id="email" name="email" v-model.trim="email" email
                  @change="handleValidations" />
                <div class="text-danger mt-2" v-if="error.email" style="text-transform: capitalize">
                  <i class="bi bi-info-circle"></i> {{ error.email }}
                </div>
              </div>
              <div class="col-12">
                <label for="phone" class="form-label">Phone <span class="text-danger">*</span></label>
                <input type="text" class="form-control" id="phone" name="phone" v-model.trim="phone" maxlength="10"
                  @change="handleValidations" />
                <div class="text-danger mt-2" v-if="error.phone" style="text-transform: capitalize">
                  <i class="bi bi-info-circle"></i> {{ error.phone }}
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
                <div class="text-danger mt-2" v-if="error.password" style="text-transform: capitalize">
                  <i class="bi bi-info-circle"></i> {{ error.password }}
                </div>
              </div>
              <div class="col-12 d-grid mt-4">
                <button type="submit" class="btn authButton btn text-light" :disabled="!formIsValid">
                  <div v-if="isLoading">
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  <span v-else>Sign Up</span>
                </button>
              </div>
              <hr />
              <div class="mt-0 text-secondary float-right">
                Already registered?
                <router-link class="authLink text-decoration-none" to="login">Login</router-link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Validator } from '../../utils/Validator';

export default {
  data() {
    return {
      empId: '',
      name: '',
      email: '',
      phone: '',
      password: '',
      showPassword: false,
      error: {},
      isLoading: false
    };
  },
  computed: {
    formIsValid() {
      if (
        this.empId === '' ||
        this.name === '' ||
        this.email === '' ||
        this.phone === '' ||
        this.password === ''
      ) {
        return false;
      } else if (
        !this.error.empId &&
        !this.error.name &&
        !this.error.email &&
        !this.error.phone &&
        !this.error.password
      ) {
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
      this.isLoading = true

      try {
        const actionPayload = {
          empId: this.empId,
          name: this.name,
          email: this.email,
          phone: this.phone,
          password: this.password,
        };
        await this.$store.dispatch('auth/signup', actionPayload);

        if (this.$store.getters['auth/isAuthenticated']) {
          this.isLoading = false
        }

        this.$router.push(`/`);
      } catch (err) {
        this.isLoading = false
        this.error = err.error;
      }
    },
    handleValidations(event) {
      const error = Validator(event.target.name, event.target.value);
      this.error[event.target.name] = error[event.target.name];
    },
  },
};
</script>
