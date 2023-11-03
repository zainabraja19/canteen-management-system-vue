<template>
    <div aria-live="polite" aria-atomic="true" class="position-relative">
        <div class="toast-container position-absolute top-0 end-0">
            <div class="toast align-items-center bg-danger bg-gradient  text-white" ref="el" role="alert"
                aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        {{ errors }}
                    </div>
                    <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
            <!-- {{ errors }} -->
        </div>
    </div>
</template>

<script>
import { Toast } from 'bootstrap';

export default {
    props: ['error'],
    computed: {
        errors() {
            if (this.error.status === 401) {
                this.handleLogout()
                return `${this.error.message} Please login again!`
            } else if (this.error.status === 400) {
                console.log("400", this.error.message);
                return `${this.error.message} Please try again!`
            }
            console.log("other", this.error.message);
            return "Something went wrong. Please try again!"
        }
    },
    mounted() {
        var toast = new Toast(this.$refs.el)
        toast.show()
    },
    methods: {
        async handleLogout() {
            console.log("in");
            await this.$store.dispatch('auth/logout');
            await this.$router.push(`/`);
        }
    }
}
</script>