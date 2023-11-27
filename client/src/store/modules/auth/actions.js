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
        const { type, ...restPayload } = payload;
        try {
            const res = await fetch(`${baseUrl}/auth/${type}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...restPayload
                })
            })
            const response = await res.json();
            // Handle error
            if (!response.data && response.error) {
                throw { message: response.error, status: 400 }
                // context.dispatch('handleError', {
                //     error: response.error,
                // });
            }
            // Auto logout when user session expires
            const expirationDuration = new Date(response.data.expiresIn).getTime() - Date.now()

            document.cookie = `user=${new Date(response.data.expiresIn).getTime()}; expires=${new Date(response.data.expiresIn).toGMTString()};`

            timer = setTimeout(function () {
                context.dispatch('autoLogout');
            }, expirationDuration);

            // if (response.data.role === "admin") {
            //     localStorage.setItem('userData', JSON.stringify({ role: "admin" }))
            // } else {
            //     localStorage.setItem('userData', JSON.stringify(response.data));
            // }

            context.commit('setUser', {
                user: response.data,
            });
        } catch (err) {
            if (!err.status) {
                return { message: err.message, status: 500 }
            }
            return err
        }

    },
    async logout(context) {
        try {
            const res = await fetch(`${baseUrl}/auth/logout`, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

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
        } catch (err) {
            if (!err.status) {
                return { message: err.message, status: 500 }
            }
            return err
        }

    },
    async autoLogin(context) {
        try {
            const res = await fetch(`${baseUrl}/auth/autoLogin`, { credentials: 'include' })

            const response = await res.json()
            if (!response.data) {
                if (response.error) {
                    throw { message: response.error, status: response.status }
                } else {
                    return context.dispatch('autoLogout');
                }
            }

            if (response.data) {
                const cookies = document.cookie.split("; ")

                const sessionCookie = cookies.find(cookie => cookie.startsWith(`connect.sid`))
                const timerCookie = cookies.find(cookie => cookie.startsWith(`user`));

                if (!sessionCookie || !timerCookie || +timerCookie < 0) {
                    // await context.dispatch('autoLogout');
                    return
                }

                const expiresAttribute = timerCookie.split("=")[1];

                const expirationDuration = new Date(+expiresAttribute).getTime() - new Date().getTime()

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
            }
        } catch (err) {
            if (!err.status) {
                return { message: err.message, status: 500 }
            }
            return err
        }

    },
    async autoLogout(context) {
        await context.dispatch('logout');
        context.commit('setAutoLogout');
    }
};
