export default {
  setMenu(state, payload) {
    state.menu = payload.menu;
  },
  setProfilePicture(state, payload) {
    state.profilePicture = payload.profilePicture;
  },
  setResume(state, payload) {
    state.resume = payload.resume;
  },
  setCart(state, payload) {
    state.cartItems = payload.items;
    state.cartTotal = payload.cartTotal;
  },
  setCartCount(state, payload) {
    state.cartCount = payload.count;
  },
  setOrderPlaced(state, payload) {
    state.orderPlaced = payload.orderPlaced;
  },
  setOrderStatus(state, payload) {
    state.orderStatus = payload.status;
  },
  setStatusLoading(state, payload) {
    state.statusLoading = payload;
  },
  setOrderId(state, payload) {
    state.currentOrderId = payload.orderId;
  },
  setSelectedOrderForCancellation(state, payload) {
    state.selectedOrderForCancellation = payload;
  },
  setItemToRemoveFromCart(state, payload) {
    state.itemToRemoveFromCart = payload;
  },
  setEmpOrders(state, payload) {
    state.empOrders = payload.orders;
    state.totalOrders = payload.totalOrders;
  },
  setErrors(state, payload) {
    state.errors = payload;
  },
};
