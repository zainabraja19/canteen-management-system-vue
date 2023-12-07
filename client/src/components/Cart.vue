<template>
    <error-toast v-if="isError" :error="error"></error-toast>
    <div v-if="isLoading" class="loading d-flex justify-content-center align-items-center mh-100">
        <div class="spinner-grow text-secondary" style="width: 3rem; height: 3rem" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    <div class="mx-sm-3 mx-md-4 mx-lg-5  d-flex justify-content-center" v-else>
        <div class="col-12 col-md-11 col-lg-10 cart mb-4" v-if="cartCount > 0">
            <div class="col-12 d-flex justify-content-between align-items-center px-3 py-2 ">
                <h3 class="heading">Cart</h3>
                <h5 class="text-muted">
                    {{ cartCount }} item<span v-if="cartCount > 1">s</span>
                </h5>
            </div>

            <div class="row g-0 flex-grow-1">
                <div class="col-12 px-3">
                    <div class="table-responsive">
                        <table class="table align-middle">
                            <thead>
                                <tr>
                                    <th class="flex-grow-1 col col-sm-8">Item</th>
                                    <th class="text-center col col-sm-1">Price</th>
                                    <th class="text-center col col-sm-2">Quantity</th>
                                    <th class="text-end col col-sm-1">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in cartItems" :key="index">
                                    <td class="col col-sm-8">
                                        <div class=" d-flex flex-column flex-sm-row ">
                                            <img src="../../public/food_logo.jpg" style="width: 5rem; height: 5rem;"
                                                class="img-fluid" alt="..." />
                                            <span
                                                class="item-name mt-2 mt-sm-0 ms-sm-4 fw-bold d-inline-flex flex-column justify-content-center overflow-hidden  ">
                                                <span>{{ item.item.itemName }}</span>
                                                <span type="button" class="text-decoration-underline text-muted"
                                                    style="font-size: smaller;"
                                                    @click="setItemToRemoveFromCart(item.item._id, item.item.itemName, item.quantity, true)"
                                                    data-bs-toggle="modal" data-bs-target="#removeItemFromCartModal">
                                                    Remove
                                                </span>
                                            </span>
                                        </div>
                                    </td>
                                    <td class="text-center col col-sm-1">{{ formatPrice(item.item.price) }}</td>
                                    <td class="text-center col col-sm-2">
                                        <i type="button" class="bi bi-dash-square me-2 text-dark"
                                            @click="setItemToRemoveFromCart(item.item._id, item.item.itemName, 1, false)"></i>
                                        <span class="fw-bold">{{ item.quantity }}</span>
                                        <i type="button" class="bi bi-plus-square ms-2 text-dark" @click="
                                            item.quantity < 10 ? addCartItem(item.item._id, item.item.itemName) : null
                                            ">
                                        </i>
                                    </td>
                                    <td class="text-end col col-sm-1">{{ formatPrice(item.item.price * item.quantity) }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div>
                    <div class="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4 p-3 float-end " style="max-height: min-content">
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
                                            @click="handlePayment">
                                            Checkout </button>
                                        <!-- <button type="button" class="place-order btn btn-dark text-uppercase w-100 my-1"
                                            @click="handleOrderPlaced">
                                            Place Order
                                        </button> -->
                                        <router-link to="/" type="button"
                                            class="summary go-back btn rounded w-100 mt-2">Return
                                            to
                                            menu</router-link>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal fade" ref="removeItemFromCartModal" id="removeItemFromCartModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered bg-transparent ">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="removeItemFromCartModalLabel">Confirmation</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            Are you sure you want to remove this item from cart?
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                Cancel
                            </button>
                            <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="removeCartItem">
                                Confirm
                            </button>
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
            cartItems: null,
            cartTotal: null,
            cartCount: null,
            tax: 0,
            isLoading: true,
            isLoadingPlaceOrder: false,
            isError: false,
            error: null,
            selectedItemToRemoveFromCart: null,
            removeCompleteItem: false
        };
    },
    async mounted() {
        await this.$store.commit('employee/setStatusLoading', false)
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
        computedCartCount() {
            return this.$store.getters['employee/cartCount'];
        },
        computedCartTotal() {
            return this.$store.getters['employee/cartTotal'];
        },
        computedCartItems() {
            return this.$store.getters['employee/cartItems'];
        },
        computedItemToRemoveFromCart() {
            return this.$store.getters['employee/selectedItemToRemoveFromCart']
        }
    },
    watch: {
        computedCartCount(newValue) {
            this.cartCount = newValue;
        },
        computedCartTotal(newValue) {
            this.cartTotal = newValue;
        },
        computedCartItems(newValue) {
            this.cartItems = newValue;
        },
        computedItemToRemoveFromCart: {
            handler(val) {
                this.selectedItemToRemoveFromCart = val
            },
            deep: true
        }
    },
    methods: {
        formatPrice,
        async setItemToRemoveFromCart(itemId, itemName, deleteCount, isDeleteAll) {
            await this.$store.commit('employee/setItemToRemoveFromCart', { itemId, itemName, deleteCount })
            if (!isDeleteAll)
                this.removeCartItem()
        },
        async loadRazorPay() {
            return new Promise(resolve => {
                const script = document.createElement('script')
                script.src = this.script
                script.onload = () => {
                    resolve(true)
                }
                script.onerror = () => {
                    resolve(false)
                }
                document.body.appendChild(script)
            })
        },
        async handlePayment() {
            await this.$store.commit('employee/setStatusLoading', true)
            await this.$store.commit('employee/setOrderStatus', { status: 'processing' })
        },
        async removeCartItem() {
            await this.$store.commit('setShowToast', { showToast: false, toastMessage: null })

            const res = await this.$store.dispatch('employee/removeFromCart', {
                empId: this.$store.getters['auth/user'].empId,
                itemId: this.selectedItemToRemoveFromCart.itemId,
                deleteCount: this.selectedItemToRemoveFromCart.deleteCount,
            });
            if (res) {
                this.isError = true;
                this.error = res;
            } else {
                await this.$store.commit('setShowToast', { showToast: true, toastMessage: `${this.selectedItemToRemoveFromCart.itemName} removed from cart.` })
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

/* .go-back {
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
} */

.place-order.btn:active,
.go-back.btn:active {
    /* Styles for the click effect */
    transition: transform 0.6s;
    transform: scale(0.95);
}

/* 
.go-back.summary {
    background: #fff;
    padding: 0.375rem 0.75rem;
    border-radius: 40px;
    color: #006363;
    border-color: #006363;
    font-weight: 700;
    box-shadow: 0px 4px 15px -5px rgba(0, 0, 0, 0.3);
} */

.go-back {
    /* font-size: 0.9rem !important; */
    text-transform: uppercase !important;
    background-color: #006363 !important;
    /* padding: 10px 20px !important; */
    color: #fff !important;
    /* border-radius: 40px !important; */
    /* font-weight: 700 !important; */
    /* box-shadow: 0px 4px 15px -5px rgba(0, 0, 0, 0.3) !important; */
}

.go-back:active,
.go-back:hover {
    border-color: #006363 !important;
    color: #006363 !important;
    background-color: white !important;
    transition: background-color 0.5s;
}

.item-name span:first-child {
    max-width: 15rem;
    overflow-wrap: break-word;
}

@media screen and (max-width: 575px) {
    .item-name span:first-child {
        max-width: 6rem;
        overflow-wrap: break-word;
    }
}
</style>
  