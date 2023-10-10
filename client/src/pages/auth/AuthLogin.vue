<template>
  <div class="row">
    <div class="col-12 d-flex justify-content-center align-items-center">
      <div class="card m-4 p-4 col-lg-6 col-md-8 col-12">
        <h4 class="text-center fw-bold">LOGIN</h4>
        <div class="card-body">
          <div class="alert alert-danger alert-dismissible fade show" role="alert" v-if="errors.login">
            {{ errors.login }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
          <form class="row g-3" @submit.prevent="onSubmit()" novalidate>
            <div class="col-12">
              <label for="email" class="form-label">Email</label>
              <input type="email" class="form-control" id="email" name="email" v-model.trim="email" required />
              <div class="text-danger mt-2" v-if="errors.email" style="text-transform: capitalize;">
                <i class="bi bi-info-circle"></i> {{ errors.email }}
              </div>
            </div>
            <div class="col-12">
              <label for="password" class="form-label">Password</label>
              <input type="password" class="form-control" id="password" name="password" v-model.trim="password" required
                minlength="6" />
              <div class="text-danger mt-2" v-if="errors.password" style="text-transform: capitalize;">
                <i class="bi bi-info-circle"></i> {{ errors.password }}
              </div>
            </div>
            <div class="col-12 d-grid mt-4">
              <button type="submit" class="btn btn-primary" :disabled="!formIsValid">Sign In</button>
            </div>
            <hr />
            <div class="mt-0 text-secondary float-right">
              Don't have an account?
              <router-link class="text-primary text-decoration-none" to="signup">Signup</router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Validator } from '../../services/Validator'

export default {
  data() {
    return {
      email: '',
      password: '',
      errors: {},
    };
  },
  computed: {
    formIsValid() {
      if (this.email === '' || this.password === '') {
        return false
      } else if (!this.errors.email && !this.errors.password) {
        return true
      }
      return false
    }
  },
  watch: {
    email(curVal) {
      const errors = Validator('email', curVal)
      this.errors.email = errors.email
    },
    password(curVal) {
      const errors = Validator('password', curVal)
      this.errors.password = errors.password
    }
  },
  methods: {
    async onSubmit() {
      try {
        this.formIsValid = true

        const actionPayload = {
          email: this.email,
          password: this.password,
        };

        await this.$store.dispatch('login', actionPayload);

        const role = this.$store.getters.userRole;

        this.errors.login = null
        this.$router.push(`/${role}`);
      } catch (err) {
        this.errors.login = err.error
      }
    },
  },
};
</script>
