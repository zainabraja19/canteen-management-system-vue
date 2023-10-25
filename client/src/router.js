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
        { path: '/', redirect: store.getters['auth/isAuthenticated'] ? `/${store.getters['auth/userRole']}` : '/login' },
        { path: '/signup', component: AuthSignup, meta: { requiresUnauth: true } },
        { path: '/login', component: AuthLogin, meta: { requiresUnauth: true } },
        {
            path: '/employee', component: Employee, meta: { requiresAuth: true, role: 'employee' }, children: [
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
        // else {
        //     next()
        // }
    }
    next()
});



export default router