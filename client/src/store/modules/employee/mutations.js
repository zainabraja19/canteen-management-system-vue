
export default {
    setMenu(state, payload) {
        state.menu = payload.menu
    },
    setProfilePicture(state, payload) {
        // console.log(state, payload);
        state.profilePicture = payload.profilePicture;
        console.log(state);
    },
    setResume(state, payload) {
        state.resume = payload.resume
    },
    setCart(state, payload) {
        state.cartItems = payload.items
        state.cartTotal = payload.cartTotal
    },
    setCartCount(state, payload) {
        state.cartCount = payload.count
    },
    setOrderPlaced(state, payload) {
        state.orderPlaced = payload.orderPlaced
    },
    setEmpOrders(state, payload) {
        state.empOrders = payload.orders
        state.totalOrders = payload.totalOrders
    }
}