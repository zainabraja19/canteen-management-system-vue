const baseUrl = process.env.VUE_APP_IP_ADDRESS

export default {
    async fetchMenu(context, payload) {
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
    },
    async fetchOrders(context, payload) {
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

    },
    async addNewItem(context, payload) {
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
    },
    async editItem(context, payload) {
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