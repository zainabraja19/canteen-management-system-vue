import mutations from './mutations';
import actions from './actions';
import getters from './getters';

export default {
  namespaced: true,
  state() {
    return {
      menu: null,
      profilePicture: null,
      resume: null,
      cart: null,
      cartItems: [],
      cartTotal: 0,
      cartCount: 0,
      orderPlaced: false,
      orderStatus: 'incomplete',
      selectedOrderForCancellation: null,
      itemToRemoveFromCart: null,
      currentOrderId: null,
      empOrders: null,
      totalOrders: 0,
      statusLoading: true,
      errors: '',
    };
  },
  mutations,
  actions,
  getters,
};
