export const sockets = {
    namespaced: true,
    state: () => ({
       notices: []
    }),
    mutations: {
      setNotices(state, notices) {
            state.notices = notices
      }
    },
    getters: {
      getNotices(state) {
          return state.notices
      }
    },
    actions: {
        SOCKET_notice({state, commit}, data) {
            const newNotice = {
                id: new Date().getTime(),
                message: data.message,
                type: data.type,
            }
            commit('setNotices', [...[newNotice], ...state.notices])
        },
        removeNotice({state, commit}, noticeId)  {
            commit('setNotices', state.notices.filter(n => n.id != noticeId))
        }
    }
}