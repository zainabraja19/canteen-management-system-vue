<template>
  <div class="row">
    <div class="col-12 d-flex justify-content-center align-items-center">
      <div class="card m-4 p-4 col-lg-6 col-md-8 col-12">
        <!-- <div class="card-header p-3 text-center">LOGIN</div> -->
        <h4 class="text-center fw-bold">LOGIN</h4>
        <div class="card-body">
          <div class="alert alert-danger alert-dismissible fade show" role="alert" v-if="error">
            {{ error }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
          <form class="row g-3" @submit.prevent="onSubmit($event)" novalidate>
            <div class="col-12">
              <label for="email" class="form-label">Email</label>
              <input type="email" class="form-control" id="email" name="email" v-model.trim="email" required />
              <!-- <div class="text-danger mt-2" v-if="error.email" style="text-transform: capitalize;">
                <i class="bi bi-info-circle"></i> {{ error.email }}
              </div> -->

              <!-- <div class="text-danger" *ngIf="!email?.valid && (email?.dirty || email?.touched)">
                                <div *ngIf="email.errors.required">
                                    <i class="bi bi-info-circle"></i> Email is required!
                                </div>
                                <div *ngIf="email.errors.email">
                                    <i class="bi bi-info-circle"></i> Please enter a valid email!
                                </div>
                            </div> -->
            </div>
            <div class="col-12">
              <label for="password" class="form-label">Password</label>
              <input type="password" class="form-control" id="password" name="password" v-model.trim="password" required
                minlength="7" />
              <!-- <div class="text-danger mt-2" v-if="error.password" style="text-transform: capitalize;">
                <i class="bi bi-info-circle"></i> {{ error.password }}
              </div> -->
              <!-- <div class="text-danger" *ngIf="!password?.valid && (password?.dirty || password?.touched)">
                                <div *ngIf="password.errors.required">
                                    <i class="bi bi-info-circle"></i> Password is required!
                                </div>
                            </div> -->
            </div>
            <div class="col-12 d-grid mt-4">
              <button type="submit" class="btn btn-primary">Sign In</button>
            </div>
            <hr />
            <div class="mt-0 text-secondary float-right">
              Don't have an account?
              <router-link class="text-primary text-decoration-none" to="signup">Signup</router-link>
              <!-- <a class="text-primary text-decoration-none">Sign Up</a> -->
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      error: '',
      formIsValid: false
    };
  },
  // watch: {
  //   email(curVal, oldValue) {
  //     if (curVal === '' && curVal !== oldValue) {
  //       this.error.email = "Email is required"
  //     } else {
  //       this.error.email = null
  //       // this.formIsValid = true
  //     }
  //   },
  //   password(curVal, oldValue) {
  //     if (curVal === '' && curVal !== oldValue) {
  //       this.error.password = "Password is required"
  //       // this.formIsValid = false
  //     } else if (curVal.length < 7) {
  //       this.error.password = "Password should contain minimum 7 characters!"
  //       // this.formIsValid = false
  //     } else {
  //       this.error.password = null
  //       // this.formIsValid = true
  //     }
  //   }
  // },
  methods: {
    async onSubmit(event) {
      try {
        this.formIsValid = true
        console.log(event.target);
        console.log(this.email, this.password);
        const actionPayload = {
          email: this.email,
          password: this.password,
        };

        await this.$store.dispatch('login', actionPayload);

        const role = this.$store.getters.userRole;
        this.$router.push(`/${role}`);
      } catch (err) {
        this.error = err.error
      }
    },
  },
};
</script>
