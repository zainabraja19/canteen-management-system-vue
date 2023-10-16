import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store/index.js';
import AuthSignup from './pages/auth/AuthSignup'
import AuthLogin from './pages/auth/AuthLogin'
import NotFound from './pages/NotFound'
import AdminHome from './pages/admin/AdminHome'
import Employee from './pages/employee/Employee';
import EmployeeHome from './components/employee/EmployeeHome'
import EmployeeProfile from './components/employee/EmployeeProfile'
import EmployeeCart from './components/employee/EmployeeCart'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: store.getters['auth/isAuthenticated'] ? `/${store.getters['auth/userRole']}` : '/login' },
        { path: '/signup', component: AuthSignup, meta: { requiresUnauth: true } },
        { path: '/login', component: AuthLogin, meta: { requiresUnauth: true } },
        {
            path: '/employee', component: Employee, meta: { requiresAuth: true, role: 'employee' }, children: [
                { path: '', component: EmployeeHome },
                { path: 'profile', component: EmployeeProfile },
                { path: 'cart', component: EmployeeCart }
            ]
        },
        { path: '/admin', component: AdminHome, meta: { requiresAuth: true, role: 'admin' } },
        { path: '/:notFound(.*)', component: NotFound },
    ]
})

router.beforeEach(function (to, _, next) {

    if (to.meta.requiresUnauth) {
        if (store.getters['auth/isAuthenticated']) {
            next(`/${store.getters['auth/userRole']}`);
        }
    } else {
        if (!store.getters['auth/isAuthenticated']) {
            next('/login');
            // return;
        } else if (to.meta.role && to.meta.role.indexOf(store.getters['auth/userRole']) === -1) {
            next('/');
            // return;
        }
    }

    next();
});



export default router