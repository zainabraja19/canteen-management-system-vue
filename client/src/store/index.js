import { createStore } from 'vuex';

import adminModule from './modules/admin/index.js';
import employeeModule from './modules/employee/index.js';
import authModule from './modules/auth/index.js';

const store = createStore({
    modules: {
        admin: adminModule,
        employee: employeeModule,
        auth: authModule
    },
    state: {
        showToast: false,
        toastMessage: null
    },
    mutations: {
        setShowToast(state, payload) {
            state.showToast = payload.showToast
            state.toastMessage = payload.toastMessage
        }
    },
    getters: {
        showToast(state) {
            return state.showToast
        },
        toastMessage(state) {
            return state.toastMessage
        }
    }
});

export default store;