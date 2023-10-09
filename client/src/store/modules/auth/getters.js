export default {
    user(state) {
        return state.user;
    },
    userRole(state) {
        console.log(state.user);
        return state.user ? state.user.role : null
    },
    isAuthenticated(state) {
        return !!state.user;
    },
    didAutoLogout(state) {
        return state.didAutoLogout;
    }
};