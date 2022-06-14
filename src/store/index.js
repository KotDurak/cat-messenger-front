import {createStore} from 'vuex'

export default createStore({
    state: () => ({
        isAuth: false,
        user: {}
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
        }
    },
    actions: {
        async login({state, commit}) {
            commit('setUser', {
                id: 777,
                name: 'Cat Messenger'
            })

            commit('setIsAuth', true)
        }
    }
});
