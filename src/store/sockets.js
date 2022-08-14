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
        SOCKET_newMessage({state, commit, rootState, rootGetters, dispatch}, data) {
            const contacts = rootGetters['contacts/contacts'];
            const chatId = data.chat._id
            const hasContact = contacts.some(c => c.id == chatId)
            const authUserId = rootGetters['auth/getUserId'];

            if (!hasContact && authUserId !== data.sender.id) {
                commit('contacts/addContact', {
                    id: chatId,
                    name: data.sender.nick,
                    unread: 1
                }, {root: true})

                return;
            }

            const interlocutor = rootGetters['contacts/getInterlocutor']

            if (!interlocutor) {
                commit('contacts/addUnread', data.chat._id, {root: true})
                return;
            }

            if (interlocutor.user_data.find_by_user) {
                interlocutor.user_data.find_by_user = false
                interlocutor.id = data.chat._id.toString()
                const contactIndex = contacts.findIndex(c => c.id == data.message.to)
                const newContacts = contacts.slice()
                newContacts[contactIndex]['id'] = data.chat._id
                commit('contacts/setContacts', newContacts, {root: true})
                commit('contacts/setInterlocutor', interlocutor)
            }

            if (data.message) {
                if (interlocutor.id == data.chat._id) {

                    commit('messages/addMessage', {
                        id: data.message._id.toString(),
                        message: data.message.message.toString(),
                        from: data.message.from,
                        time: data.message.time,
                    }, {root: true})

                    dispatch('contacts/refreshUnread', {
                        chat_id: data.chat._id,
                        user_id: authUserId
                    }, {root: true})
                } else {
                    commit('contacts/addUnread', data.chat._id, {root: true})
                }
            }
        },
        removeNotice({state, commit, rootGetters}, noticeId) {
            commit('setNotices', state.notices.filter(n => n.id != noticeId))
        },
        SOCKET_refreshUnread({state, commit, rootGetters}, data) {
            const chatId = data.chatId
            const userId = data.userId
            const interlocutor = rootGetters['contacts/getInterlocutor']

            if (!chatId || !interlocutor) {
                return
            }

            if (!interlocutor.id == chatId) {
                return
            }

            commit('messages/setReadMessages', userId, {root: true})
        }
    }
}
