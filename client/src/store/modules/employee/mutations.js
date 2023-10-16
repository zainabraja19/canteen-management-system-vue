
export default {
    setProfilePicture(state, payload) {
        console.log(state, payload);
        state.profilePicture = payload.profilePicture;
        console.log(state);
    },
    setResume(state, payload) {
        state.resume = payload.resume
    },
    setCart(state, payload) {
        state.cart = payload.cart
    },
    setCartCount(state, payload) {
        state.cartCount = payload.count
    }
}