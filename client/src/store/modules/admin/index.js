import mutations from './mutations'
import actions from './actions'
import getters from './getters'

export default ({
    namespaced: true,
    state() {
        return {
            orders: null,
            menu: null,
            totalOrders: 0
        };
    },
    mutations,
    actions,
    getters
})