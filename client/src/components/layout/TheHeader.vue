<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
            <a class="navbar-brand" routerLink="/">Canteen Management System</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                    <li class="nav-item" v-if="!isLoggedIn">
                        <router-link class="nav-link" to="signup">Signup</router-link>
                    </li>
                    <li class="nav-item" v-if="!isLoggedIn">
                        <router-link class="nav-link" to="login">Login</router-link>
                    </li>
                    <li class="nav-item" v-if="isLoggedIn">
                        <router-link class="nav-link" :to="role" style="text-transform: capitalize;">{{ role
                        }}</router-link>
                    </li>
                    <li class="nav-item" v-if="isLoggedIn">
                        <a class="nav-link" @click="handleLogout()">Logout</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    computed: {
        isLoggedIn() {
            console.log("computed", this.$store.getters.userRole);
            return this.$store.getters.isAuthenticated;
        },
        role() {
            return this.$store.getters.userRole
        }
    },
    methods: {
        handleLogout() {
            this.$store.dispatch('logout');
            this.$router.replace('/login');
        }
    }
}
</script>