export default {
    async fetchMenu(context) {
        await fetch(`${process.env.VUE_APP_IP_ADDRESS}/admin/menu`, {
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
    async fetchOrders(context, payload) {
        console.log("in");
        await fetch(`${process.env.VUE_APP_IP_ADDRESS}/admin/orders?page=${payload.page}`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(res => res.json())
            .then(response => {
                console.log(response.data);
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
        await fetch(`${process.env.VUE_APP_IP_ADDRESS}/admin/item`, {
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
    }
}