const baseUrl = process.env.VUE_APP_IP_ADDRESS

export default {
    async fetchMenu(context, payload) {
        await fetch(`${baseUrl}/admin/menu?page=${payload.page}`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => res.json())
            .then(response => {
                context.commit('setMenu', { menu: response.data.menu, totalMenuItems: response.data.totalItems })
            }).catch(err => {
                console.log(err);
            });
    },
    async fetchOrders(context, payload) {
        await fetch(`${baseUrl}/admin/orders?page=${payload.page}&filter=${payload.filter}`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(res => res.json())
            .then(response => {
                context.commit('setOrders', {
                    orders: response.data.orders,
                    totalOrders: response.data.totalOrders
                })
            })
            .catch(err => {
                console.log(err)
            })

    },
    async addNewItem(context, payload) {
        await fetch(`${baseUrl}/admin/item`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(response => {
                console.log(response.data);
            })
            .catch(err => {
                console.log(err)
            })
    },
    async editItem(context, payload) {
        await fetch(`${baseUrl}/admin/item/${payload.id}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload.newData)
        })
            .then(res => res.json())
            .then(response => {
                console.log(response.data);
            })
            .catch(err => {
                console.log(err)
            })
    },
    // async deleteItem(context, payload) {
    //     console.log(payload);
    //     await fetch(`${baseUrl}/admin/item/${payload.id}`, {
    //         method: 'DELETE',
    //         credentials: 'include',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //     })
    //         .then(res => res.json())
    //         .then(response => {
    //             console.log(response.data);
    //         })
    //         .catch(err => {
    //             console.log(err)
    //         })
    // }
}