<template>
    <error-toast v-if="isError" :error="error"></error-toast>
    <div class="payment-container"></div>
</template>

<script>
import ErrorToast from './ErrorToast.vue';

export default {
    props: ['order_details', 'customer_details'],
    data() {
        return {
            script: `https://checkout.razorpay.com/v1/checkout.js`,
            cartItems: null,
            cartTotal: 0,
            totalItems: 0,
            isError: false,
            error: null,
        }
    },
    methods: {
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
        async handleOrderPlaced() {
            const extractedData = this.cartItems.map(obj => {
                return {
                    item: obj.item._id,
                    quantity: obj.quantity,
                    price: obj.item.price
                }
            });

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
                await this.$store.commit('employee/setOrderStatus', { status: 'complete' })

                this.error = null;
                this.isError = false;
            }
        },
    },
    async created() {
        await this.$store.commit('employee/setStatusLoading', false)
        this.cartCount = await this.$store.getters['employee/cartCount'];

        await this.$store.dispatch('employee/fetchCart', {
            empId: await this.$store.getters['auth/user'].empId,
        });

        this.cartItems = await this.$store.getters['employee/cartItems'];
        this.cartTotal = await this.$store.getters['employee/cartTotal'];

        if (this.cartItems) {
            this.isLoading = false;
        }

        const res = await fetch(`http://localhost:3000/employee/${this.$store.getters['auth/user'].empId}/order/initiatePayment`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: this.cartTotal * 100,
                currency: 'INR'
            }),
        });

        const response = await res.json();
        if (!response.data && response.error) {
            throw { message: response.error, status: response.status };
        }

        const result = await this.loadRazorPay()
        if (!result) {
            alert('Failed to load razorpay script')
            return
        }

        const options = {
            key: 'rzp_test_6yfmNPXjWI7l2K',
            amount: this.cartTotal * 100,
            currency: `INR`,
            name: `Canteen`,
            description: `Test`,
            order_id: response.id,
            display: {
                upiContactless: false, // Disable UPI QR option
            },
            // image: `Your business logo`,
            handler: async (data) => {
                // It is function executed on success
                const res = await this.$store.dispatch('employee/verifyPayment', {
                    data
                });

                if (res) {
                    this.isError = true;
                    this.error = res;
                } else {
                    this.error = null;
                    this.isError = false;

                    this.handleOrderPlaced()
                    // this.$router.push({ name: 'order-success' });
                }

            },
            prefill: {
                name: `Zainab`,
                email: `zraja@argusoft.com`,
                contact: `9926821818`
            },
            modal: {
                ondismiss: async () => {
                    await this.$store.commit('employee/setOrderStatus', { status: 'incomplete' })
                }
            }
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.on('payment.error', function (response) {
            alert(response.error.code);
            alert(response.error.description);
        })

        paymentObject.open();
    },
    components: {
        ErrorToast,
    },
}
</script>

<style scoped>
.payment-container {
    height: 80%;
}
</style>