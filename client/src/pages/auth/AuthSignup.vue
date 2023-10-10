<template>
    <div class="row">
        <div class="col-12 d-flex justify-content-center align-items-center">
            <div class="card m-4 p-4 col-xl-5 col-lg-6 col-md-8 col-12">
                <h4 class="text-center fw-bold">SIGNUP</h4>
                <div class="card-body">
                    <form class="row g-3" @submit.prevent="onSubmit()">
                        <div class="col-12">
                            <label for="empId" class="form-label">Employee ID</label>
                            <input type="text" class="form-control" id="empId" name="empId" v-model.trim="empId" />
                            <div class="text-danger mt-2" v-if="error.empId" style="text-transform: capitalize;">
                                <i class="bi bi-info-circle"></i> {{ error.empId }}
                            </div>
                        </div>
                        <div class="col-12">
                            <label for="name" class="form-label">Name</label>
                            <input type="text" class="form-control" id="name" name="name" v-model.trim="name" />
                            <div class="text-danger mt-2" v-if="error.name" style="text-transform: capitalize;">
                                <i class="bi bi-info-circle"></i> {{ error.name }}
                            </div>
                        </div>
                        <div class="col-12">
                            <label for="email" class="form-label">Email</label>
                            <input type="" class="form-control" id="email" name="email" v-model.trim="email" email />
                            <div class="text-danger mt-2" v-if="error.email" style="text-transform: capitalize;">
                                <i class="bi bi-info-circle"></i> {{ error.email }}
                            </div>
                        </div>
                        <div class="col-12">
                            <label for="phone" class="form-label">Phone</label>
                            <input type="text" class="form-control" id="phone" name="phone" v-model.trim="phone" />
                            <div class="text-danger mt-2" v-if="error.phone" style="text-transform: capitalize;">
                                <i class="bi bi-info-circle"></i> {{ error.phone }}
                            </div>
                        </div>
                        <div class="col-12">
                            <label for="password" class="form-label">Password</label>
                            <input type="password" class="form-control" id="password" name="password"
                                v-model.trim="password" minlength="6" />
                            <div class="text-danger mt-2" v-if="error.password" style="text-transform: capitalize;">
                                <i class="bi bi-info-circle"></i> {{ error.password }}
                            </div>
                        </div>
                        <div class="col-12 d-grid mt-4">
                            <button type="submit" class="btn btn-primary" :disabled="!formIsValid">
                                Sign Up
                            </button>
                        </div>
                        <hr />
                        <div class="mt-0 text-secondary float-right">
                            Already registered?
                            <router-link class="text-primary text-decoration-none" to="login">Login</router-link>
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
            empId: '',
            name: '',
            email: '',
            phone: '',
            password: '',
            error: {},
        }
    },
    computed: {
        formIsValid() {
            if (this.empId === '' || this.name === '' || this.email === '' || this.phone === '' || this.password === '') {
                return false
            } else if (!this.error.empId && !this.error.name && !this.error.email && !this.error.phone && !this.error.password) {
                return true
            }
            return false
        }
    },
    watch: {
        empId(curVal) {
            const error = Validator('empId', curVal)
            this.error.empId = error.empId
        },
        name(curVal) {
            const error = Validator('name', curVal)
            this.error.name = error.name
        },
        email(curVal) {
            const error = Validator('email', curVal)
            this.error.email = error.email
        },
        phone(curVal) {
            const error = Validator('phone', curVal)
            this.error.phone = error.phone
        },
        password(curVal) {
            const error = Validator('password', curVal)
            this.error.password = error.password
        }
    },
    methods: {
        async onSubmit() {
            try {
                this.formIsValid = true

                const actionPayload = {
                    empId: this.empId,
                    name: this.name,
                    email: this.email,
                    phone: this.phone,
                    password: this.password
                }
                await this.$store.dispatch('signup', actionPayload);

                this.$router.push(`/login`);
            } catch (err) {
                this.error = err.error
            }
        }
    }
}
</script>