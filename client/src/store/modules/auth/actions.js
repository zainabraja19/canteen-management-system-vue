let timer;

export default {
    async signup(context, payload) {
        const response = await fetch(`${process.env.VUE_APP_IP_ADDRESS}:3000/auth/signup`, {
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
    },
    async login(context, payload) {
        const response = await fetch(`${process.env.VUE_APP_IP_ADDRESS}:3000/auth/login`, {
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

        // context.dispatch('employee/fetchProfilePicture', {
        //     empId: responseData.data.empId,
        // }, { root: true });

        // context.dispatch('employee/fetchResume', {
        //     empId: responseData.data.empId,
        // }, { root: true });
        // console.log("prof", responseData.data.profilePicture);

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
    async logout(context) {
        await fetch(`${process.env.VUE_APP_IP_ADDRESS}:3000/auth/logout`, { credentials: 'include' })

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
    autoLogin(context) {
        const user = JSON.parse(localStorage.getItem('userData'));
        const tokenExpiration = localStorage.getItem('tokenExpiration');

        if (!tokenExpiration || +tokenExpiration < 0) {
            return;
        }

        timer = setTimeout(function () {
            context.dispatch('autoLogout');
        }, +tokenExpiration);

        if (user) {
            context.commit('setUser', {
                user
            });
            // context.commit('employee/setUserProfilePicture', {
            //     profilePicture: user.profilePicture,
            // }, { root: true });
        }
    },
    autoLogout(context) {
        context.dispatch('logout');
        context.commit('setAutoLogout');
    }
};
