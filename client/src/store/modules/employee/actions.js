export default {
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
        console.log(payload);
        await fetch(`${process.env.VUE_APP_IP_ADDRESS}:3000/employee/${payload.empId}/${payload.type}`, { credentials: 'include' })
            .then(res => res.json())
            .then(response => {
                console.log(response.data);
                if (!response.data && response.data.error) {
                    throw response.data.error
                } else {
                    context.commit(payload.type === 'resume' ? 'setResume' : 'setProfilePicture', { [payload.type]: response.data[payload.type] })
                }
            })
            .catch(err => {
                console.log(err);
            })
    },
    async cartCount(context, payload) {
        await fetch(`${process.env.VUE_APP_IP_ADDRESS}:3000/employee/${payload.empId}/cartCount`, { credentials: 'include' })
            .then(res => res.json())
            .then(response => {
                console.log(response.data);
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
            `${process.env.VUE_APP_IP_ADDRESS}:3000/employee/${payload.empId}/cart`,
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
                    cart: {
                        items: responseData.data.items,
                        totalItems: responseData.data.totalItems,
                        cartTotal: responseData.data.cartTotal
                    }
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
            `${process.env.VUE_APP_IP_ADDRESS}:3000/employee/${payload.empId}/cart`,
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId: payload.itemId }),
            }
        );

        // const responseData = await response.json();
        context.dispatch('fetchCart', {
            ...payload
        });

        context.dispatch('cartCount', {
            ...payload
        });
    },
    async removeFromCart(context, payload) {
        await fetch(
            `${process.env.VUE_APP_IP_ADDRESS}:3000/employee/${payload.empId}/cart`,
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
        context.dispatch('fetchCart', {
            ...payload
        });

        context.dispatch('cartCount', {
            ...payload
        });
    },
    // async signup(context, payload) {
    //     return context.dispatch('auth', {
    //         ...payload,
    //         mode: 'signup'
    //     });
    // },
    // autoLogout(context) {
    //     context.dispatch('logout');
    //     context.commit('setAutoLogout');
    // }
};
