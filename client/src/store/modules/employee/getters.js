export default {
    profilePicture(state) {
        console.log(state);
        return state.profilePicture
    },
    resume(state) {
        return state.resume
    },
    cartCount(state) {
        return state.cartCount
    },
    cart(state) {
        return state.cart
    }
}