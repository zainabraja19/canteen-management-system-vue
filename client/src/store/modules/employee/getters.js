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
        console.log("orrrrrrrrrrrrr", state);
        return state.orderPlaced
    },
    employeeOrders(state) {
        return state.empOrders
    }
}