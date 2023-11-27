<template>
    <error-toast v-if="isError" :error="error"></error-toast>
    <div v-if="isLoading" class="loading d-flex justify-content-center align-items-center mh-100">
        <div class="spinner-grow text-secondary" style="width: 3rem; height: 3rem" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    <div class="mx-5 d-flex justify-content-center" v-else>
        <div class="col-10 cart mb-4" v-if="cartCount > 0">
            <div class="col-12 d-flex justify-content-between align-items-center px-3 py-2 ">
                <h3 class="heading">Cart</h3>
                <h5 class="text-muted">
                    {{ cartCount }} item<span v-if="cartCount > 1">s</span>
                </h5>
            </div>

            <div class="row g-0 flex-grow-1">
                <div class="col-12 px-3">
                    <!-- <hr /> -->
                    <!-- <div class="row g-0 align-items-center card" v-for="(item, index) in cartItems" :key="index">
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
                                    <i type="button" class="bi bi-dash-circle me-2 text-danger"
                                        @click="removeCartItem(item.item._id, item.item.itemName, 1)"></i>
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
                    </div> -->
                    <div class="table-responsive">
                        <table class="table align-middle">
                            <thead>
                                <tr>
                                    <th class="text-start flex-grow-1" colspan="4">Item</th>
                                    <th class="text-end">Price</th>
                                    <th class="text-end" colspan="2">Quantity</th>
                                    <th class="text-end">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in cartItems" :key="index">
                                    <td class="text-start flex-grow-1 " colspan="4">
                                        <img src="https://www.vegrecipesofindia.com/wp-content/uploads/2017/07/cream-cheese-sandwich-recipe-1.jpg"
                                            style="width: 5rem; height: 5rem;" class="img-fluid" alt="..." />
                                        <span class="ms-4 fs-6 fw-bold d-inline-flex flex-column justify-content-center ">
                                            <span>{{ item.item.itemName }}</span>
                                            <span type="button" class="text-decoration-underline text-muted"
                                                style="font-size: smaller;"
                                                @click="removeCartItem(item.item._id, item.item.itemName, item.quantity)">
                                                Remove
                                            </span>
                                        </span>
                                    </td>
                                    <td class="text-end">{{ formatPrice(item.item.price) }}</td>
                                    <td class="text-end" colspan="2">
                                        <i type="button" class="bi bi-dash-square me-2 text-dark"
                                            @click="removeCartItem(item.item._id, item.item.itemName, 1)"></i>
                                        <span class="fw-bold">{{ item.quantity }}</span>
                                        <i type="button" class="bi bi-plus-square ms-2 text-dark" @click="
                                            item.quantity < 10 ? addCartItem(item.item._id, item.item.itemName) : null
                                        ">
                                        </i>
                                    </td>
                                    <td class="text-end">{{ formatPrice(item.item.price * item.quantity) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!-- <div class="flex-row row g-0" v-for="(item, index) in cartItems" :key="index">
                        <div class="col-4 p-3">
                            <img src="https://www.vegrecipesofindia.com/wp-content/uploads/2017/07/cream-cheese-sandwich-recipe-1.jpg"
                                style="width: 120px; height: 120px;" class="img-fluid rounded-start" alt="..." />
                        </div>
                        <div class="col-8 p-3 d-flex justify-content-between align-items-center">
                            <div class="d-flex justify-content-between  item text-uppercase">
                                <div class="fs-5">{{ item.item.itemName }}</div>
                            </div>
                            <div class=" item">
                                <i type="button" class="bi bi-dash-circle me-2 text-dark"
                                    @click="removeCartItem(item.item._id, item.item.itemName, 1)"></i>
                                <span>{{ item.quantity }}</span>
                                <i class="bi bi-plus-circle ms-2 text-dark" @click="
                                    item.quantity < 10 ? addCartItem(item.item._id, item.item.itemName) : null
                                "></i>
                            </div>
                            <div class=" item text-muted">
                                {{ formatPrice(item.item.price * item.quantity) }}
                            </div>
                            <div class=" text-danger">
                                <i class="bi bi-trash3 text-danger"
                                    @click="removeCartItem(item.item._id, item.item.itemName, item.quantity)"></i>
                            </div>

                        </div>
                    </div> -->
                </div>
                <div>
                    <div class="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4 p-3 float-end " style="max-height: min-content">
                        <!-- <div> -->
                        <div class=" p-3">
                            <div class="d-flex justify-content-between align-items-center ">
                                <h4 class="heading">Summary</h4>
                            </div>
                            <hr class="mt-2" />
                            <div class="d-flex flex-column align-items-center">
                                <div class="w-100">
                                    <div
                                        class="text-uppercase text-muted d-flex flex-row justify-content-between w-100 mt-1">
                                        <div>Subtotal</div>
                                        <div class="fw-normal">{{ formatPrice(+cartTotal) }}</div>
                                    </div>
                                    <div
                                        class="text-uppercase text-muted d-flex flex-row justify-content-between w-100 mt-1">
                                        <div>Tax</div>
                                        <div class="fw-normal">{{ formatPrice(tax) }}</div>
                                    </div>
                                    <div
                                        class="text-uppercase text-muted d-flex flex-row justify-content-between w-100 mt-1">
                                        <div>Total</div>
                                        <div>{{ formatPrice(+cartTotal + tax) }}</div>
                                    </div>
                                    <div class="my-4 d-flex flex-column align-items-center ">
                                        <button type="button" class="place-order btn btn-dark text-uppercase w-100 my-1"
                                            @click="handleOrderPlaced">
                                            Place Order
                                        </button>
                                        <div class="my-1">OR</div>
                                        <!-- <button type="button" class="place-order btn btn-dark text-uppercase w-100 my-1"
                                            @click="handleOrderPlaced">
                                            Place Order
                                        </button> -->
                                        <router-link to="/" type="button" class="summary go-back btn rounded w-100">Return
                                            to
                                            menu</router-link>

                                    </div>
                                </div>
                                {{ cart }}
                            </div>
                        </div>
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
            tax: 0,
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
            console.log(this.cartItems);
            const extractedData = this.cartItems.map(obj => {
                return {
                    item: obj.item._id,
                    quantity: obj.quantity,
                    price: obj.item.price
                }
            });

            console.log(extractedData);
            const res = await this.$store.dispatch('employee/placeOrder', {
                empId: this.$store.getters['auth/user'].empId,
                id: this.$store.getters['auth/user']._id,
                cartItems: extractedData,
                cartTotal: this.cartTotal,
                totalItems: this.cartCount
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

/* .cart {
    font-family: 'Oswald', sans-serif;
} */

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

.bi.bi-cart-dash {
    font-size: 5rem;
}

.go-back {
    font-size: 1rem;
    font-weight: 400 !important;
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

.place-order.btn:active,
.go-back.btn:active {
    /* Styles for the click effect */
    transition: transform 0.6s;
    transform: scale(0.95);
}

.go-back.summary {
    background: #fff;
    padding: 0.375rem 0.75rem;
    border-radius: 40px;
    color: #006363;
    border-color: #006363;
    font-weight: 700;
    box-shadow: 0px 4px 15px -5px rgba(0, 0, 0, 0.3);
}
</style>
  