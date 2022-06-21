import {createStore} from 'vuex'

export default createStore({
    state: () => ({
        isAuth: false,
        user: {},
        loginData: {},
    }),
    getters: {
        getUser(state) {
            return state.user;
        },
        getIsAuth(state) {
            return state.isAuth;
        }
    },
    mutations: {
        setUser(state, user) {
            state.user = user
        },
        setIsAuth(state, isAuth) {
            state.isAuth = isAuth
        },
        setLoginData(state, loginData) {
            state.loginData = loginData
        }
    },
    actions: {
        async login({state, commit}) {
            const {login, password} = state.loginData;
            //TODO Сделать процесс авторизации на сервере, получения пользовтеля

            commit('setUser', {
                id: 777,
                name: login,
            })

            commit('setIsAuth', true)
        }
    }
});
