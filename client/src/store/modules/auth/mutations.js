export default {
    setUser(state, payload) {
        state.user = payload.user;
        state.didAutoLogout = false;
        state.isAuthenticated = !!payload.user
    },
    setAutoLogout(state) {
        state.didAutoLogout = true;
        state.isAuthenticated = false
    },
};