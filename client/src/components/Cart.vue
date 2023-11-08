<template>
    <error-toast v-if="isError" :error="error"></error-toast>
    <div v-if="isLoading" class="loading d-flex justify-content-center align-items-center mh-100">
        <div class="spinner-grow text-secondary" style="width: 3rem; height: 3rem" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    <div class="mx-5" v-else>
        <div class="cart card mb-4" v-if="cartCount > 0">
            <div class="row g-0 flex-grow-1">
                <div class="col-12 p-4">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h2 class="heading">Cart</h2>
                        <h5 class="text-muted">
                            {{ cartCount }} item<span v-if="cartCount > 1">s</span>
                        </h5>
                    </div>
                    <hr class="mb-1" />
                    <div class="row g-0 align-items-center" v-for="(item, index) in cartItems" :key="index">
                        <div class="col-4 p-2">
                            <img src="https://www.vegrecipesofindia.com/wp-content/uploads/2017/07/cream-cheese-sandwich-recipe-1.jpg"
                                class="img-fluid rounded-start w-25 h-25" alt="..." />
                        </div>
                        <div class="col-8">
                            <div class="row">
                                <div class="col-3 item text-uppercase">
                                    {{ item.item.itemName }}
                                </div>
                                <div class="col-3 item">
                                    <!-- <button type="button" :disabled="item.quantity === 1"> -->
                                    <i type="button" class="bi bi-dash-circle me-2 text-danger"
                                        @click="removeCartItem(item.item._id, item.item.itemName, 1)"></i>
                                    <!-- </button> -->
                                    <span>{{ item.quantity }}</span>
                                    <i class="bi bi-plus-circle ms-2 text-success" @click="
                                        item.quantity < 10 ? addCartItem(item.item._id, item.item.itemName) : null
                                        "></i>
                                </div>
                                <div class="col-3 item text-muted">
                                    {{ formatPrice(item.item.price * item.quantity) }}
                                </div>
                                <div class="col-3 text-danger">
                                    <i class="bi bi-trash3 text-danger"
                                        @click="removeCartItem(item.item._id, item.item.itemName, item.quantity)"></i>
                                </div>
                            </div>
                        </div>
                        <hr v-if="index < cartItems.length - 1" class="mb-1" />
                    </div>
                </div>
                <div class="col-12 bg-light p-4 w-100" style="max-height: min-content">
                    <!-- <div> -->
                    <h4 class="heading">Summary</h4>
                    <hr />
                    <div class="d-flex flex-column align-items-center">
                        <div class="w-25">
                            <div class="text-uppercase text-muted d-flex flex-row justify-content-between w-100">
                                <div>Total Amount</div>
                                <div>{{ formatPrice(+cartTotal) }}</div>
                            </div>
                            <button type="button" class="place-order btn btn-dark text-uppercase w-100 my-4"
                                @click="handleOrderPlaced">
                                Place Order
                            </button>
                        </div>
                        {{ cart }}
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="fs-5">
            <div class="d-flex flex-column align-items-center justify-content-center mt-4 fs-5" style="min-height: 70vh">
                <i class="bi bi-cart-dash"></i>
                <strong>Your cart is currently empty.</strong>
                <router-link to="/"><button class="go-back btn mt-3">Return to menu</button></router-link>
            </div>
        </div>
    </div>
</template>
  
<script>
import { formatPrice } from '../utils/FormatPrice';
import ErrorToast from './ErrorToast.vue';
// import { mapGetters } from "vuex"
export default {
    data() {
        return {
            // cart: {
            //   items: null,
            //   totalItems: null,
            //   cartTotal: null,
            // },
            // cart: null,
            cartItems: null,
            cartTotal: null,
            cartCount: null,
            isLoading: true,
            isLoadingPlaceOrder: false,
            isError: false,
            error: null,
        };
    },
    async mounted() {
        this.cartCount = await this.$store.getters['employee/cartCount'];

        const res = await this.$store.dispatch('employee/fetchCart', {
            empId: await this.$store.getters['auth/user'].empId,
        });

        if (res) {
            this.isError = true;
            this.error = res;
        } else {
            this.cartItems = await this.$store.getters['employee/cartItems'];
            this.cartTotal = await this.$store.getters['employee/cartTotal'];

            if (this.cartItems) {
                this.isLoading = false;
            }

            this.error = null;
            this.isError = false;
        }
    },
    computed: {
        cart() {
            // Your computed logic here
            return this.$store.getters['employee/cart'];
        },
        computedCartCount() {
            return this.$store.getters['employee/cartCount'];
        },
        computedCartTotal() {
            return this.$store.getters['employee/cartTotal'];
        },
        computedCartItems() {
            return this.$store.getters['employee/cartItems'];
        },
    },
    watch: {
        cart: {
            handler(newValue) {
                console.log(newValue);
            },
            immediate: true,
            deep: true,
        },
        computedCartCount(newValue) {
            this.cartCount = newValue;
        },
        computedCartTotal(newValue) {
            this.cartTotal = newValue;
        },
        computedCartItems(newValue) {
            this.cartItems = newValue;
        },
    },
    methods: {
        formatPrice,
        async handleOrderPlaced() {
            const res = await this.$store.dispatch('employee/placeOrder', {
                empId: this.$store.getters['auth/user'].empId,
                cartItems: this.cartItems,
                cartTotal: this.cartTotal,
            });

            if (res) {
                this.isError = true;
                this.error = res;
            } else {
                await this.$store.commit('setShowToast', { showToast: true, toastMessage: "Order placed successfully." })
                await this.$store.commit('employee/setOrderPlaced', { orderPlaced: true })

                this.error = null;
                this.isError = false;

                // this.$router.push({ name: 'order-success' });
            }
        },
        async removeCartItem(itemId, itemName, deleteCount) {
            await this.$store.commit('setShowToast', { showToast: false, toastMessage: null })

            const res = await this.$store.dispatch('employee/removeFromCart', {
                empId: this.$store.getters['auth/user'].empId,
                itemId,
                deleteCount,
            });
            if (res) {
                this.isError = true;
                this.error = res;
            } else {
                await this.$store.commit('setShowToast', { showToast: true, toastMessage: `${itemName} removed from cart.` })
                this.error = null;
                this.isError = false;
            }
        },
        async addCartItem(itemId, itemName) {
            await this.$store.commit('setShowToast', { showToast: false, toastMessage: null })

            const res = await this.$store.dispatch('employee/addToCart', {
                empId: this.$store.getters['auth/user'].empId,
                itemId,
            });
            if (res) {
                this.isError = true;
                this.error = res;
            } else {
                await this.$store.commit('setShowToast', { showToast: true, toastMessage: `${itemName} added to cart.` })
                this.error = null;
                this.isError = false;
            }
        },
    },
    components: {
        ErrorToast,
    },
};
</script>
  
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500&display=swap');

.cart {
    font-family: 'Oswald', sans-serif;
}

.item {
    text-transform: uppercase;
}

.place-order.btn {
    background-color: #006363;
    color: #fff;
    border-color: #006363;
}

.place-order.btn:hover,
.place-order.btn:active {
    /* Styles for the hover effect */
    /* background-color: #fff;
    color: #000; */
    background-color: #fff;
    border-color: #006363;
    color: #006363;
    transition: background-color 0.5s;
    /* border: #fff; */
}

.place-order.btn:active {
    /* Styles for the click effect */
    transition: transform 0.6s;
    transform: scale(0.95);
}

.bi.bi-cart-dash {
    font-size: 5rem;
}

.go-back {
    font-size: 14px;
    text-transform: uppercase;
    background: #006363;
    padding: 15px 30px;
    border-radius: 40px;
    color: #fff;
    font-weight: 700;
    box-shadow: 0px 4px 15px -5px rgba(0, 0, 0, 0.3);
}

.go-back:active,
.go-back:hover {
    border-color: #006363 !important;
    color: #006363 !important;
    background-color: white !important;
    transition: background-color 0.5s;
}
</style>
  