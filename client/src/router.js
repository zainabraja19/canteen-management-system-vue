import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store/index.js';
import AuthSignup from './views/auth/Signup'
import AuthLogin from './views/auth/Login'
import NotFound from './views/NotFound'
import Admin from './views/admin/Admin'
import AdminItems from './views/admin/MenuItems'
import AdminOrders from './views/admin/Orders'
import AdminAddItem from './views/admin/AddItem'
import Employee from './views/employee/Employee';
import EmployeeHome from './views/employee/Menu'
import EmployeeProfile from './views/employee/Profile'
import EmployeeCart from './views/employee/Cart'
import EmployeeOrders from './views/employee/EmployeeOrders'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/'
        },
        { path: '/signup', component: AuthSignup, meta: { requiresUnauth: true } },
        { path: '/login', component: AuthLogin, meta: { requiresUnauth: true } },
        {
            path: '/user', component: Employee, meta: { requiresAuth: true, role: 'employee' }, children: [
                { path: '', component: EmployeeHome },
                { path: 'profile', component: EmployeeProfile },
                { path: 'cart', component: EmployeeCart },
                { path: 'orders', component: EmployeeOrders }
            ]
        },
        {
            path: '/admin', component: Admin, meta: { requiresAuth: true, role: 'admin' }, children: [
                { path: '', component: AdminOrders },
                { path: 'menu', component: AdminItems },
                { path: 'addItem', component: AdminAddItem }
            ]
        },
        { path: '/:notFound(.*)', component: NotFound },
    ]
})
let autoLoginExecuted = false;

router.beforeEach(async function (to) {
    console.log(to);
    if (!autoLoginExecuted) {
        await store.dispatch('auth/autoLogin');
        autoLoginExecuted = true;
    }

    const isAuthenticated = store.getters['auth/isAuthenticated'];
    const userRole = store.getters['auth/userRole'];

    await Promise.all([isAuthenticated, userRole]);

    const redirectPath = isAuthenticated ? `/${userRole === 'employee' ? 'user' : 'admin'}` : '/login';

    if (to.path === '/') {
        return redirectPath;

    }
    console.log(to.path);
    if (to.meta.requiresUnauth) {
        console.log(to.path);
        // If the route is for unauthenticated users, allow access if the user is not authenticated
        if (!isAuthenticated) {
            // return true;
        }
    }

    if (to.meta.requiresAuth) {
        // If the route requires authentication, redirect to login if the user is not authenticated
        if (!isAuthenticated) {
            return '/login';
        }

        // Check if the user has the required role to access the route
        const userRole = store.getters['auth/userRole'];
        if (to.meta.role && to.meta.role !== userRole) {
            return '/';
        }
    }

    return true;
});

export default router