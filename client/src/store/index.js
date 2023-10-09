import { createStore } from 'vuex';

import adminModule from './modules/admin/index.js';
import employeeModule from './modules/employee/index.js';
import authModule from './modules/auth/index.js';

const store = createStore({
    modules: {
        admin: adminModule,
        employee: employeeModule,
        auth: authModule
    }
});

export default store;