import mutations from './mutations'
import actions from './actions'
import getters from './getters'

export default ({
    namespaced: true,
    state() {
        return {
            profilePicture: null,
            resume: null,
            cart: null,
            cartCount: 0
        };
    },
    mutations,
    actions,
    getters
})