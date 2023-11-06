<template>
    <div aria-live="polite" aria-atomic="true" class="position">
        <div class="toast-container position-absolute top-0 start-50  translate-middle-x">
            <div class="toast align-items-center bg-success bg-gradient text-white  mt-3" ref="el" role="alert"
                aria-live="assertive" aria-atomic="true" data-bs-delay="2000">
                <div class="d-flex">
                    <div class="toast-body">
                        {{ toastMessage }}
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
    data() {
        return {
            toast: null,
            toastMessages: null
        }
    },
    computed: {
        computedToastMessage() {
            console.log(this.$store.getters['toastMessage']);
            return this.$store.getters['toastMessage']
        }
    },
    watch: {
        computedToastMessage(val) {
            this.toastMessages = val
        }
    },
    props: ['toastMessage'],
    // props: ['error'],
    // computed: {
    //     errors() {
    //         if (!this.error.status && this.error.message) {
    //             return `${this.error.message}`;
    //         }
    //         if (this.error.status === 401) {
    //             this.handleLogout();
    //             return `${this.error.message} Please login again!`;
    //         } else if (this.error.status === 400) {
    //             console.log('400', this.error.message);
    //             return `${this.error.message}`;
    //         }
    //         console.log('other', this.error);
    //         return 'Something went wrong. Please try after some time!';
    //     },
    // },
    mounted() {
        console.log(this.toastMessage);
        this.toastMessages = this.$store.getters['toastMessage']
        this.toast = new Toast(this.$refs.el);
        // var toast = new Toast(this.$refs.el);
        this.toast.show();
    },
    updated() {
        console.log(this.toastMessage);

        console.log("in");
        // var toast = new Toast(this.$refs.el);
        this.toast.show();
        // this.$store.commit('setShowToast', { showToast: false, toastMessage: null })
    },
}
</script>
