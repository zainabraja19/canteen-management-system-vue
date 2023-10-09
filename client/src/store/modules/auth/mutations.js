export default {
    setUser(state, payload) {
        console.log("in mutations", state, payload)
        state.user = payload.user;
        // state.role = payload.user ? payload.user.role : null
        state.didAutoLogout = false;
    },
    setAutoLogout(state) {
        state.didAutoLogout = true;
    }
};