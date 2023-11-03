export default {
    user(state) {
        return state.user;
    },
    userRole(state) {
        return state.role
    },
    isAuthenticated(state) {
        return state.isAuthenticated;
    },
    didAutoLogout(state) {
        return state.didAutoLogout;
    }
};