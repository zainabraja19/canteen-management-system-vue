export default {
    setMenu(state, payload) {
        state.menu = payload.menu
        state.totalMenuItems = payload.totalMenuItems
    },
    setOrders(state, payload) {
        state.orders = payload.orders
        state.totalOrders = payload.totalOrders
    }
}