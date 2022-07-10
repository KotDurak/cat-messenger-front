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
        }
    },
    actions: {
        async loadContacts({state, commit}, userId) {
            const contactsUrl = process.env.VUE_APP_API_SERVER + 'api/load-contacts/' + userId
            const response = await axios.get(contactsUrl);
            commit('setContacts', response.data.result)
        }
    }
}
