// import { FileType } from 'file-type';
// var mime = require('mime-types')
const baseUrl = process.env.VUE_APP_IP_ADDRESS

export default {
    async editDetails(context, payload) {
        console.log(payload);
        try {
            const res = await fetch(`${baseUrl}/employee`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload.newData)
            })

            const response = await res.json()

            if (!response.data && response.error) {
                throw { message: response.error, status: response.status }
            }

            context.commit('auth/setUser', { user: response.data }, { root: true })
        } catch (err) {
            console.log(err);
            if (!err.status) {
                return { message: err.message, status: 500 }
            }
            return err
        }
    },
    async fetchMenu(context) {
        try {
            const res = await fetch(`${baseUrl}/employee/menu`, {
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
        } catch (err) {
            console.log(err);
            if (!err.status) {
                return { message: err.message, status: 500 }
            }
            return err
        }

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
        try {
            const res = await fetch(`${baseUrl}/employee/${payload.empId}/${payload.type}`, { credentials: 'include' })

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

                if (payload.type === 'resume') {
                    context.commit('setResume', { resume: { url, name: response.data['resume'].originalName } })
                } else {
                    context.commit('setProfilePicture', { profilePicture: url })
                }
                // context.commit(payload.type === 'resume' ? 'setResume' : 'setProfilePicture', { [payload.type]: url })
                // }
            } else {
                context.commit(payload.type === 'resume' ? 'setResume' : 'setProfilePicture', { [payload.type]: null })
            }
        } catch (err) {
            console.log(err);
            if (!err.status) {
                return { message: err.message, status: 500 }
            }
            return err
        }
    },
    async cartCount(context, payload) {
        try {
            const res = await fetch(`${baseUrl}/employee/${payload.empId}/cartCount`, { credentials: 'include' })
            const response = await res.json()

            if (!response.data && response.error) {
                throw { message: response.error, status: response.status }
            }
            console.log(response.data);
            context.commit('setCartCount', { count: response.data.count })
        } catch (err) {
            console.log(err);
            if (!err.status) {
                return { message: err.message, status: 500 }
            }
            return err
        }
    },
    async fetchCart(context, payload) {
        try {
            const res = await fetch(
                `${baseUrl}/employee/${payload.empId}/cart`,
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
        } catch (err) {
            console.log(err);
            if (!err.status) {
                return { message: err.message, status: 500 }
            }
            return err
        }

    },
    async addToCart(context, payload) {
        try {
            const res = await fetch(
                `${baseUrl}/employee/${payload.empId}/cart`,
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
        } catch (err) {
            console.log(err);
            if (!err.status) {
                return { message: err.message, status: 500 }
            }
            return err
        }

    },
    async removeFromCart(context, payload) {
        try {
            const res = await fetch(
                `${baseUrl}/employee/${payload.empId}/cart`,
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
        } catch (err) {
            console.log(err);
            if (!err.status) {
                return { message: err.message, status: 500 }
            }
            return err
        }

    },
    async placeOrder(context, payload) {
        try {
            const res = await fetch(`${baseUrl}/employee/${payload.empId}/order`, {
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
        } catch (err) {
            console.log(err);
            if (!err.status) {
                return { message: err.message, status: 500 }
            }
            return err
        }
    },
    async fetchEmployeeOrders(context, payload) {
        try {
            const res = await fetch(`${baseUrl}/employee/${payload.empId}/order?page=${payload.page}`, {
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
        } catch (err) {
            console.log(err);
            if (!err.status) {
                return { message: err.message, status: 500 }
            }
            return err
        }
    },
    async cancelOrder(context, payload) {
        try {
            const res = await fetch(`${baseUrl}/employee/${payload.empId}/order`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderId: payload.orderId
                }),
            });

            const response = await res.json()
            console.log(response);
            if (!response.data && response.error) {
                throw { message: response.error, status: response.status }
            }
        } catch (err) {
            console.log(err);
            if (!err.status) {
                return { message: err.message, status: 500 }
            }
            return err
        }
    }
}; 
