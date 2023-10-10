export default {
    setUser(state, payload) {
        state.user = payload.user;
        state.didAutoLogout = false;
    },
    setAutoLogout(state) {
        state.didAutoLogout = true;
    }
};