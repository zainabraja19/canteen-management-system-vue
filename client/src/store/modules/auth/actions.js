let timer;

export default {
    async login(context, payload) {
        return context.dispatch('auth', {
            ...payload,
            mode: 'login'
        });
    },
    async signup(context, payload) {
        return context.dispatch('auth', {
            ...payload,
            mode: 'signup'
        });
    },
    async auth(context, payload) {
        const response = await fetch(`http://localhost:3000/auth/${payload.mode}`, {
            method: 'POST',
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
        const expirationDuration = new Date(responseData.data.expiresIn).getTime() - new Date().getTime() - 100
        timer = setTimeout(function () {
            context.dispatch('autoLogout');
        }, expirationDuration);

        if (responseData.data.role === "admin") {
            localStorage.setItem('userData', JSON.stringify({ role: "admin" }))
        } else {
            localStorage.setItem('userData', JSON.stringify(responseData.data));
        }
        localStorage.setItem('tokenExpiration', expirationDuration);

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
            console.log(payload.error);
            throw { error: errors }

        }
        throw { error: errorMessage }
    },
    logout(context) {
        localStorage.removeItem('userData');
        localStorage.removeItem('tokenExpiration');

        clearTimeout(timer);

        context.commit('setUser', {
            user: null
        });
    },
    autoLogin(context) {
        const user = JSON.parse(localStorage.getItem('userData'));
        const tokenExpiration = localStorage.getItem('tokenExpiration');

        if (+tokenExpiration < 0) {
            return;
        }

        timer = setTimeout(function () {
            context.dispatch('autoLogout');
        }, +tokenExpiration);

        if (user) {
            context.commit('setUser', {
                user
            });
        }
    },
    autoLogout(context) {
        context.dispatch('logout');
        context.commit('setAutoLogout');
    }
};
