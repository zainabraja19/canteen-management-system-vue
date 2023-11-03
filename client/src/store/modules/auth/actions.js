let timer;
const baseUrl = process.env.VUE_APP_IP_ADDRESS

export default {
    async signup(context, payload) {
        return context.dispatch('auth', {
            ...payload,
            type: 'signup'
        });
    },
    async login(context, payload) {
        return context.dispatch('auth', {
            ...payload,
            type: 'login'
        });
    },
    async auth(context, payload) {
        const response = await fetch(`${baseUrl}/auth/${payload.type}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...payload
            })
        })
        const responseData = await response.json();

        // Handle error
        if (!responseData.data && responseData.error) {
            context.dispatch('handleError', {
                error: responseData.error,
            });
        }
        // Auto logout when user session expires
        const expirationDuration = new Date(responseData.data.expiresIn).getTime() - Date.now()

        console.log("inlogin", new Date(responseData.data.expiresIn).getTime(), expirationDuration);
        console.log("swhoerg;kieantkojkrdstjh");
        document.cookie = `user=${new Date(responseData.data.expiresIn).getTime()}; expires=${new Date(responseData.data.expiresIn).toGMTString()};`

        timer = setTimeout(function () {
            context.dispatch('autoLogout');
        }, expirationDuration);

        // if (responseData.data.role === "admin") {
        //     localStorage.setItem('userData', JSON.stringify({ role: "admin" }))
        // } else {
        //     localStorage.setItem('userData', JSON.stringify(responseData.data));
        // }

        context.commit('setUser', {
            user: responseData.data,
        });
    },
    handleError(context, payload) {
        let errorMessage = 'Something went wrong. Please try again!'
        let errors = payload.error

        if (errors) {
            errorMessage = errors
            Object.keys(errors).map(error => {
                if (errors[error].type == "required") {
                    errors[error] = `${error} is required!`
                }
            })
            throw { error: errors }

        }
        throw { error: errorMessage }
    },
    async logout(context) {
        const res = await fetch(`${baseUrl}/auth/logout`, { credentials: 'include' })

        const response = await res.json()

        if (!response.data && response.error) {
            throw { message: response.error, status: response.status }
        }

        var Cookies = document.cookie.split(';');

        for (var i = 0; i < Cookies.length; i++)
            document.cookie = Cookies[i] + "=;expires=" + new Date(0).toUTCString();

        clearTimeout(timer);

        context.commit('setUser', {
            user: null
        });
    },
    async autoLogin(context) {
        const res = await fetch(`${baseUrl}/auth/autoLogin`, { credentials: 'include' })

        const response = await res.json()

        if (!response.data) {
            if (response.error) {
                throw { message: response.error, status: response.status }
            } else {
                return context.dispatch('autoLogout');
            }
        }

        console.log(new Date(response.data.expiresIn).getTime() - Date.now());

        const cookies = document.cookie.split("; ")

        const sessionCookie = cookies.find(cookie => cookie.startsWith(`connect.sid`))
        const timerCookie = cookies.find(cookie => cookie.startsWith(`user`));

        if (!sessionCookie || !timerCookie || +timerCookie < 0) {
            // await context.dispatch('autoLogout');
            return
        }

        const expiresAttribute = timerCookie.split("=")[1];



        console.log(expiresAttribute);

        const expirationDuration = new Date(+expiresAttribute).getTime() - new Date().getTime()
        console.log("inautologin", expirationDuration);
        timer = setTimeout(function () {
            context.dispatch('autoLogout');
        }, expirationDuration);

        if (sessionCookie && response.data) {
            await context.commit('setUser', {
                user: response.data,
            });
            // context.commit('employee/setUserProfilePicture', {
            //     profilePicture: user.profilePicture,
            // }, { root: true });
        }
    },
    async autoLogout(context) {
        await context.dispatch('logout');
        context.commit('setAutoLogout');
    }
};
