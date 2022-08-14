import axios from "axios"
const API_URL = process.env.VUE_APP_API_SERVER

export const messages = {
    namespaced: true,
    state: () => ({
        messages: [],
        page:1,
        limit: 50,
        totalPages: 0,
        chatId: null
    }),
    getters: {
        getCount(state) {
            return state.messages.length
        },
    },
    mutations: {
        setChatId(state, chatId) {
            state.chatId = chatId
        },
        setMessages(state, messages) {
            state.messages = messages
        },
        setPage(state, page) {
            state.page = page
        },
        setTotalPages(state, totalPages) {
            state.totalPages = totalPages
        },
        addMessage(state, message) {
            state.messages.push(message)
        },
        setReadMessages(state, userFrom) {
            state.messages.forEach(m => {
                if (m.from === userFrom)  {
                    m.read = true
                }
            })
        }
    },
    actions: {
        async fetchMessages({state, commit}) {
            try {
                const response = await getMessagesRequest(state.chatId, state.page, state.limit)
                commit('setTotalPages', Math.ceil(response.data.meta.count / state.limit))
                commit('setMessages', response.data.data.reverse())
            } catch (e) {
                console.log('Error')
            }
        },
        async fetchMoreMessages({state, commit}) {
            try {
                const nextPage = state.page + 1;
                if (nextPage > state.totalPages) {
                    console.log('Limit pages')
                    return;
                }

                commit('setPage', nextPage)
                const response = await getMessagesRequest(state.chatId, nextPage, state.limit)

                commit('setTotalPages', Math.ceil(response.data.meta.count / state.limit))
                commit('setMessages', [...response.data.data.reverse(),...state.messages])
            } catch (e) {
                console.log('Error')
            }
        },
    }
}

async function getMessagesRequest(chatId, page, limit) {
    const url = API_URL + 'api/messages/' + chatId

    return axios.get(url, {
        params: {
            page: page,
            size: limit
        }
    })
}
