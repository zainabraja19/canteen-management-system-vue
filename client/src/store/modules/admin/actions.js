const baseUrl = process.env.VUE_APP_IP_ADDRESS

export default {
    async fetchMenu(context, payload) {
        try {
            const res = await fetch(`${baseUrl}/admin/menu?page=${payload.page}`, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            const response = await res.json()

            if (!response.data && response.error) {
                throw { message: response.error, status: response.status }
            }

            context.commit('setMenu', { menu: response.data.menu, totalMenuItems: response.data.totalItems })
        } catch (err) {
            console.log(err);
            if (!err.status) {
                return { message: err.message, status: 500 }
            }
            return err
        }

    },
    async fetchOrders(context, payload) {
        try {
            const res = await fetch(`${baseUrl}/admin/orders?page=${payload.page}&filter=${payload.filter}`, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            const response = await res.json()

            if (!response.data && response.error) {
                throw { message: response.error, status: response.status }
            }

            context.commit('setOrders', {
                orders: response.data.orders,
                totalOrders: response.data.totalOrders
            })
        } catch (err) {
            console.log(err);
            if (!err.status) {
                return { message: err.message, status: 500 }
            }
            return err
        }

    },
    async addNewItem(context, payload) {
        try {
            const res = await fetch(`${baseUrl}/admin/item`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            })

            const response = await res.json()

            if (!response.data && response.error) {
                throw { message: response.error, status: response.status }
            }

            console.log(response.data);
        } catch (err) {
            console.log(err);
            if (!err.status) {
                return { message: err.message, status: 500 }
            }
            return err
        }

    },
    async editItem(context, payload) {
        try {
            const res = await fetch(`${baseUrl}/admin/item/${payload.id}`, {
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

            console.log(response.data);
        } catch (err) {
            console.log(err);
            if (!err.status) {
                return { message: err.message, status: 500 }
            }
            return err
        }

    },
    // async deleteItem(context, payload) {
    //     console.log(payload);
    //     const res = await fetch(`${baseUrl}/admin/item/${payload.id}`, {
    //         method: 'DELETE',
    //         credentials: 'include',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //     })
    //         
    //             console.log(response.data);
    //         })
    // }
}