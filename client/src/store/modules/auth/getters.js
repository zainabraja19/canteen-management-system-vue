export default {
    user(state) {
        return state.user;
    },
    userRole(state) {
        return state.user ? state.user.role : null
    },
    isAuthenticated(state) {
        return state.isAuthenticated;
    },
    didAutoLogout(state) {
        return state.didAutoLogout;
    }
};