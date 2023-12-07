<template>
    <div class="mx-sm-3 mx-md-4 mx-lg-5">
        <!-- <div v-if="isLoading" class="loading d-flex justify-content-center align-items-center mh-100">
            <div class="spinner-grow text-secondary" style="width: 3rem; height: 3rem" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div> -->
        <component :is="renderComponent" />
    </div>
</template>

<script>
import OrderSuccess from '../../components/OrderSuccess.vue';
import Cart from '../../components/Cart.vue';
import Payment from '../../components/Payment.vue'

export default {
    data() {
        return {
            isLoading: true,
            orderStatus: null,
        };
    },
    computed: {
        computedOrderStatus() {
            return this.$store.getters['employee/orderStatus']
        },
        loading() {
            return this.$store.getters['employee/statusLoading']
        },
        renderComponent() {
            if (this.orderStatus === 'incomplete') {
                return Cart
            } else if (this.orderStatus === 'processing') {
                return Payment
            } else {
                return OrderSuccess
            }
        }
    },
    watch: {
        computedOrderStatus: {
            handler(val) {
                // this.$store.commit('employee/setStatusLoading', true)
                this.orderStatus = val
            },
            immediate: true
        },
        loading(val) {
            this.isLoading = val
        }
    }
}
</script>