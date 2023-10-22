import mutations from './mutations'
import actions from './actions'
import getters from './getters'

export default ({
    namespaced: true,
    state() {
        return {
            menu: null,
            profilePicture: null,
            resume: null,
            cart: null,
            cartItems: [],
            cartTotal: 0,
            cartCount: 0,
            orderPlaced: false,
            empOrders: null
        };
    },
    mutations,
    actions,
    getters
})