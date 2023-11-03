export default {
    menu(state) {
        return state.menu
    },
    profilePicture(state) {
        return state.profilePicture
    },
    resume(state) {
        return state.resume
    },
    cartCount(state) {
        return state.cartCount
    },
    cartTotal(state) {
        return state.cartTotal
    },
    cartItems(state) {
        return state.cartItems
    },
    orderPlaced(state) {
        return state.orderPlaced
    },
    employeeOrders(state) {
        return state.empOrders
    },
    totalOrders(state) {
        return state.totalOrders
    },
    errors(state) {
        console.log(state);
        return state.errors
    }
}