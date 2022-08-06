import AuthService from '@//services/auth.service'
const user = JSON.parse(localStorage.getItem('user'))

const initialState = user
? {status: {loggedIn: true}, user}
: {status: {loggedIn: false}, user: null}

initialState.error = ''

export const auth = {
    namespaced: true,
    state: initialState,
    actions: {
        login({commit}, user) {
            return AuthService.login(user).then(user => {
                commit('loginSuccess', user)
                return Promise.resolve(user)
            }, error => {
                commit('loginFailure')
                return Promise.reject(error)
            })
        },
        logout({commit}) {
            AuthService.logout()
            commit('authLogout')
        },
        register({commit}, user) {
            return AuthService.register(user)
                .then(response => {
                    commit('registerSuccess')
                    return Promise.resolve(response.data)
                }, error => {
                    commit('registerFailure');
                    return Promise.reject(error);
                })
        },
        autologin({commit}, user) {
            if (!user || !user.accessToken) {
                return
            }

            return AuthService.autologin(user)
                .then(response => {
                    user.nick = response.data.user.nick
                    commit('loginSuccess', user)
                    return Promise.resolve(user)
                }, error => {
                    commit('registerFailure');
                    return Promise.reject(error);
                })
        }
    },
    mutations: {
        loginSuccess(state, user) {
            state.status.loggedIn = true
            state.user = user
        },
        loginFailure(state) {
            state.status.loggedIn = false
            state.user = null
        },
        authLogout(state) {
            state.status.loggedIn = false
            state.user = null
        },
        registerSuccess(state) {
            state.status.loggedIn = false
        },
        registerFailure(state) {
            state.status.loggedIn = false
        },
        addError(state, error) {
            state.error = error
        },
        clearErrors(state) {
            state.error = ''
        }
    },
    getters: {
        isUserAuth(state) {
            return state.status.loggedIn
        },
        getUser(state) {
            return state.user || {}
        },
        getUserId(state) {
            if (state.user) {
                return state.user.id
            }

            return null
        },
        getAuthError(state) {
            return  state.error.trim()
        }
    }
}