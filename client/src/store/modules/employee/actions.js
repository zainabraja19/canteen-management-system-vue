// import { FileType } from 'file-type';
// var mime = require('mime-types')

export default {
    async fetchMenu(context) {
        const res = await fetch(`${process.env.VUE_APP_IP_ADDRESS}/employee/menu`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const response = await res.json()

        if (!response.data && response.error) {
            throw { message: response.error, status: response.status }
        }

        context.commit('setMenu', { menu: response.data })
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
        const res = await fetch(`${process.env.VUE_APP_IP_ADDRESS}/employee/${payload.empId}/${payload.type}`, { credentials: 'include' })

        const response = await res.json()

        if (!response.data && response.error) {
            throw { message: response.error, status: response.status }
        }

        if (response.data[payload.type]) {
            const bufferData = response.data[payload.type].buffer
            // if (bufferData !== null) {
            const buffer = Buffer.from(bufferData.data, 'base64');

            const blob = new Blob([buffer], { type: response.data[payload.type].mimeType }
            );
            const url = window.URL.createObjectURL(blob)

            context.commit(payload.type === 'resume' ? 'setResume' : 'setProfilePicture', { [payload.type]: url })
            // }
        } else {
            context.commit(payload.type === 'resume' ? 'setResume' : 'setProfilePicture', { [payload.type]: null })
        }

    },
    async cartCount(context, payload) {
        const res = await fetch(`${process.env.VUE_APP_IP_ADDRESS}/employee/${payload.empId}/cartCount`, { credentials: 'include' })
        const response = await res.json()

        if (!response.data && response.error) {
            throw { message: response.error, status: response.status }
        }
        console.log(response.data);
        context.commit('setCartCount', { count: response.data.count })
    },
    async fetchCart(context, payload) {
        const res = await fetch(
            `${process.env.VUE_APP_IP_ADDRESS}/employee/${payload.empId}/cart`,
            {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
        const response = await res.json()

        if (!response.data && response.error) {
            throw { message: response.error, status: response.status }
        }
        context.commit('setCart', {
            items: response.data.items,
            // totalItems: response.data.totalItems,
            cartTotal: response.data.cartTotal
        })
    },
    async addToCart(context, payload) {
        const res = await fetch(
            `${process.env.VUE_APP_IP_ADDRESS}/employee/${payload.empId}/cart`,
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId: payload.itemId }),
            }
        )

        const response = await res.json()

        if (!response.data && response.error) {
            throw { message: response.error, status: response.status }
        }

        await context.dispatch('fetchCart', {
            ...payload
        });

        await context.dispatch('cartCount', {
            ...payload
        });
    },
    async removeFromCart(context, payload) {
        const res = await fetch(
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

        const response = await res.json()

        if (!response.data && response.error) {
            throw { message: response.error, status: response.status }
        }
        // const responseData = await response.json();
        await context.dispatch('fetchCart', {
            ...payload
        });

        await context.dispatch('cartCount', {
            ...payload
        });
    },
    async placeOrder(context, payload) {
        const res = await fetch(`${process.env.VUE_APP_IP_ADDRESS}/employee/${payload.empId}/order`, {
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

        const response = await res.json()

        if (!response.data && response.error) {
            throw { message: response.error, status: response.status }
        }

        await context.commit('setCart', {
            items: [],
            cartTotal: 0
        })

        await context.commit('setCartCount', {
            count: 0
        });
    },
    async fetchEmployeeOrders(context, payload) {
        const res = await fetch(`${process.env.VUE_APP_IP_ADDRESS}/employee/${payload.empId}/order?page=${payload.page}`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const response = await res.json()

        if (!response.data && response.error) {
            throw { message: response.error, status: response.status }
        }

        context.commit('setEmpOrders', {
            orders: response.data.orders,
            totalOrders: response.data.totalOrders
        })
        context.commit('setErrors', null)
    },
    // handleErrors(context, payload) {
    // let errorMessage = 'Something went wrong. Please try again!'
    // let errors = {}

    // if (payload.error.status === 401) {
    //     errors.type = "Unauthorized"
    //     errors.message = payload.error.message
    //     console.log(errors);

    //     // context.commit('setErrors', errors)
    //     throw errors
    // } else if (payload.error.status === 400) {
    //     errors
    // }

    // if (errors) {
    //     errorMessage = errors
    //     Object.keys(errors).map(error => {
    //         if (errors[error].type == "required") {
    //             errors[error] = `${ error } is required!`
    //         }
    //     })
    //     throw { error: errors }

    // }
    // throw { error: errorMessage }
    // }
}; 
