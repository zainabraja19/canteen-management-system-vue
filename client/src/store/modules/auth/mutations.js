export default {
    setUser(state, payload) {
        state.user = payload.user;
        state.role = payload.user ? payload.user.role : null
        state.didAutoLogout = false;
        state.isAuthenticated = !!payload.user
    },
    setAutoLogout(state) {
        state.didAutoLogout = true;
        state.isAuthenticated = false
    },
};