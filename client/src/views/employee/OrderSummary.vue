<template>
    <div class="mx-5">
        <component :is="renderComponent" />
    </div>
</template>

<script>
import OrderSuccess from '../../components/OrderSuccess.vue';
import Cart from '../../components/Cart.vue';
export default {
    data() {
        return {
            orderPlaced: false,
            // renderComponent: null
        };
    },
    computed: {
        computedOrderPlaced() {
            return this.$store.getters['employee/orderPlaced']
        },
        renderComponent() {
            if (!this.orderPlaced) {
                return Cart
            } else {
                return OrderSuccess
            }
        }
    },
    watch: {
        computedOrderPlaced: {
            handler(val) {
                this.orderPlaced = val
                // this.orderPlaced = true
            },
            immediate: true
        }
    }
}
</script>