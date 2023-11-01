let timer;

export default {
    async signup(context, payload) {
        return context.dispatch('auth', {
            ...payload,
            type: 'signup'
        });

        // const response = await fetch(`${process.env.VUE_APP_IP_ADDRESS}/auth/signup`, {
        //     method: 'POST',
        //     credentials: 'include',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         ...payload
        //     })
        // })
        // const responseData = await response.json();

        // // Handle error
        // if (!responseData.data && responseData.error) {
        //     context.dispatch('handleError', {
        //         error: responseData.error,
        //     });
        // }
    },
    async login(context, payload) {
        return context.dispatch('auth', {
            ...payload,
            type: 'login'
        });
    },
    async auth(context, payload) {
        const response = await fetch(`${process.env.VUE_APP_IP_ADDRESS}/auth/${payload.type}`, {
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
        timer = setTimeout(function () {
            context.dispatch('autoLogout');
        }, expirationDuration);

        if (responseData.data.role === "admin") {
            localStorage.setItem('userData', JSON.stringify({ role: "admin" }))
        } else {
            localStorage.setItem('userData', JSON.stringify(responseData.data));
        }
        localStorage.setItem('tokenExpiration', new Date(responseData.data.expiresIn).getTime());

        context.commit('setUser', {
            user: responseData.data,
        });
    },
    handleError(context, payload) {
        let errorMessage = 'An error occurred. Please try again!'
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
        await fetch(`${process.env.VUE_APP_IP_ADDRESS}/auth/logout`, { credentials: 'include' })

        localStorage.removeItem('userData');
        localStorage.removeItem('tokenExpiration');

        clearTimeout(timer);

        context.commit('setUser', {
            user: null
        });
        // context.commit('employee/setProfilePicture', {
        //     profilePicture: null,
        // }, { root: true });
    },
    async autoLogin(context) {
        const user = JSON.parse(localStorage.getItem('userData'));
        const tokenExpiration = localStorage.getItem('tokenExpiration');

        if (!tokenExpiration || +tokenExpiration < 0) {
            // await context.dispatch('autoLogout');
            return
        }

        const expirationDuration = new Date(+tokenExpiration).getTime() - new Date().getTime()

        timer = setTimeout(function () {
            context.dispatch('autoLogout');
        }, expirationDuration);

        if (user) {
            context.commit('setUser', {
                user,
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
