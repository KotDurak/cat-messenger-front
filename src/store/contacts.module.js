import axios from "axios";

export const contacts = {
    namespaced: true,
    state: () => ({
        contacts: []
    }),
    getters: {
        contacts(state) {
            return state.contacts
        }
    },
    mutations: {
        setContacts(state, contacts) {
          state.contacts = contacts
        },

        addContact(state, contact) {
            const existedContact = state.contacts.findIndex(c => c.id === contact.id)

            if (existedContact === -1) {
                if (!contact.name && contact.nick) {
                    contact.name = contact.nick
                    contact.is_new = true
                }

                state.contacts = [contact, ...state.contacts];
            }
        },

        addUnread(state, chatId) {

            const indexContact = state.contacts.findIndex(c => c.id == chatId)

            if (indexContact === -1) {
                return
            }

           if(!state.contacts[indexContact]['unread']) {
               state.contacts[indexContact]['unread'] = 1
           } else {
               state.contacts[indexContact]['unread'] += 1
           }
        },

        refreshUnreadUnread(state, chatId) {
            const indexContact = state.contacts.findIndex(c => c.id == chatId)

            if (indexContact === -1) {
                return
            }

            state.contacts[indexContact]['unread'] = 0
        }
    },
    actions: {
        async loadContacts({state, commit}, userId) {
            const contactsUrl = process.env.VUE_APP_API_SERVER + 'api/load-contacts/' + userId
            const response = await axios.get(contactsUrl);
            commit('setContacts', response.data.result)
        },

        async refreshUnread({commit}, data) {
            const url = process.env.VUE_APP_API_SERVER + 'api/refresh-unread'
            const response = await axios.post(url, data)

            if(response.status != 200) {
                return
            }

            commit('refreshUnreadUnread', data.chat_id)
        }
    }
}
