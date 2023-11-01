import mutations from './mutations'
import actions from './actions'
import getters from './getters'

export default ({
    namespaced: true,
    state() {
        return {
            orders: null,
            menu: null,
            totalMenuItems: 0,
            totalOrders: 0
        };
    },
    mutations,
    actions,
    getters
})