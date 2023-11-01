// import { FileType } from 'file-type';
// var mime = require('mime-types')

export default {
    async fetchMenu(context) {
        await fetch(`${process.env.VUE_APP_IP_ADDRESS}/employee/menu`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => res.json())
            .then(response => {
                context.commit('setMenu', { menu: response.data })
            }).catch(err => {
                console.log(err);
            });
    },
    async fetchProfilePicture(context, payload) {
        // const empId = this.$store.getters['auth/user'].empId
        return context.dispatch('fetchData', {
            ...payload,
            type: 'profilePicture'
        });

    },
    async fetchResume(context, payload) {
        return context.dispatch('fetchData', {
            ...payload,
            type: 'resume'
        });
    },
    async fetchData(context, payload) {
        await fetch(`${process.env.VUE_APP_IP_ADDRESS}/employee/${payload.empId}/${payload.type}`, { credentials: 'include' })
            .then(res => res.json())
            .then(async response => {
                if (!response.data && response.data.error) {
                    throw response.data.error
                } else {
                    const bufferData = response.data[payload.type].buffer
                    if (bufferData !== null) {
                        const buffer = Buffer.from(bufferData.data, 'base64');

                        const blob = new Blob([buffer], { type: response.data[payload.type].mimeType }
                        );
                        const url = window.URL.createObjectURL(blob)

                        context.commit(payload.type === 'resume' ? 'setResume' : 'setProfilePicture', { [payload.type]: url })
                    }
                }
            })
            .catch(err => {
                console.log(err);
            })
    },
    async cartCount(context, payload) {
        await fetch(`${process.env.VUE_APP_IP_ADDRESS}/employee/${payload.empId}/cartCount`, { credentials: 'include' })
            .then(res => res.json())
            .then(response => {
                if (!response.data && response.data.error) {
                    throw response.data.error
                } else {
                    context.commit('setCartCount', { count: response.data.count })
                }
            })
            .catch(err => {
                console.log(err);
            })
    },
    async fetchCart(context, payload) {
        await fetch(
            `${process.env.VUE_APP_IP_ADDRESS}/employee/${payload.empId}/cart`,
            {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
            .then(res => res.json())
            .then(responseData => {
                context.commit('setCart', {
                    items: responseData.data.items,
                    // totalItems: responseData.data.totalItems,
                    cartTotal: responseData.data.cartTotal
                })
            })
            .catch(err => {
                console.log(err);
            })

        // this.items = responseData.data.items;
        // this.totalItems = responseData.data.totalItems;
        // this.cartTotal = responseData.data.cartTotal;

        // console.log(this.items);

    },
    async addToCart(context, payload) {
        await fetch(
            `${process.env.VUE_APP_IP_ADDRESS}/employee/${payload.empId}/cart`,
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId: payload.itemId }),
            }
        ).then(res => res.json()).then(res => console.log(res));

        // const responseData = await response.json();
        await context.dispatch('fetchCart', {
            ...payload
        });

        await context.dispatch('cartCount', {
            ...payload
        });
    },
    async removeFromCart(context, payload) {
        await fetch(
            `${process.env.VUE_APP_IP_ADDRESS}/employee/${payload.empId}/cart`,
            {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId: payload.itemId, deleteCount: payload.deleteCount }),
            }
        );

        // const responseData = await response.json();
        await context.dispatch('fetchCart', {
            ...payload
        });

        await context.dispatch('cartCount', {
            ...payload
        });
    },
    async placeOrder(context, payload) {
        fetch(`${process.env.VUE_APP_IP_ADDRESS}/employee/${payload.empId}/order`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                items: payload.cartItems,
                totalAmount: payload.cartTotal,
            }),
        });

        await context.commit('setCart', {
            items: [],
            cartTotal: 0
        })

        await context.commit('setCartCount', {
            count: 0
        });
    },
    async fetchEmployeeOrders(context, payload) {
        fetch(`${process.env.VUE_APP_IP_ADDRESS}/employee/${payload.empId}/order?page=${payload.page}`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(res => res.json())
            .then(response => {
                context.commit('setEmpOrders', {
                    orders: response.data.orders,
                    totalOrders: response.data.totalOrders
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
};
