import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store/index.js';
import AuthSignup from './pages/auth/AuthSignup'
import AuthLogin from './pages/auth/AuthLogin'
import NotFound from './pages/NotFound'
import AdminHome from './pages/admin/AdminHome'
import EmployeeHome from './pages/employee/EmployeeHome'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: store.getters.isAuthenticated ? `/${store.getters.userRole}` : '/login' },
        { path: '/signup', component: AuthSignup, meta: { requiresUnauth: true } },
        { path: '/login', component: AuthLogin, meta: { requiresUnauth: true } },
        { path: '/employee', component: EmployeeHome, meta: { requiresAuth: true, role: 'employee' } },
        { path: '/admin', component: AdminHome, meta: { requiresAuth: true, role: 'admin' } },
        { path: '/:notFound(.*)', component: NotFound },
    ]
})

router.beforeEach(function (to, _, next) {
    console.log("router", store.getters, store.getters.userRole);

    if (to.meta.requiresUnauth) {
        if (store.getters.isAuthenticated) {
            next(`/${store.getters.userRole}`);
        } else {
            next();
        }
    } else {
        if (!store.getters.isAuthenticated) {
            next('/login');
            return; // Stop execution here
        } else if (to.meta.role && to.meta.role.indexOf(store.getters.userRole) === -1) {
            next('/');
            return; // Stop execution here
        }
        // If none of the conditions above are met, proceed to the next route
    }

    next();
});



export default router