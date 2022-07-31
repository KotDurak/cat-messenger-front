import axios from "axios";
import authHeader from "@/services/auth-header";
const API_URL = process.env.VUE_APP_API_SERVER;

export const contacts = {
    namespaced: true,
    state: () => ({
        contacts: [],
        searchedUsers:[]
    }),
    getters: {
        contacts(state) {
            return state.contacts
        },
        searchedUsers(state) {
            return state.searchedUsers
        }
    },
    mutations: {
        setContacts(state, contacts) {
          state.contacts = contacts
        },

        setSearchedUsers(state, searchedUsers) {
            state.searchedUsers = searchedUsers
        },

        addContact(state, contact) {
            const existedContact = state.contacts.findIndex(c => c.user_id === contact.user_id)

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
        },
        setContactStatus(state, statusData) {
            const indexContact = state.contacts.findIndex(c => c.user_id == statusData.user_id)

            if (indexContact === -1) {
                return
            }

            state.contacts[indexContact]['online'] = statusData.online
        }
    },
    actions: {
        async loadContacts({state, commit}, userId) {
            const contactsUrl = API_URL + 'api/load-contacts/' + userId
            const response = await axios.get(contactsUrl);
            commit('setContacts', response.data.result)
        },

        async refreshUnread({commit}, data) {
            const url = API_URL + 'api/refresh-unread'
            const response = await axios.post(url, data)

            if(response.status != 200) {
                return
            }

            commit('refreshUnreadUnread', data.chat_id)
        },

        async deleteContact({state, commit}, chatId) {
            const url = API_URL + 'api/contacts/' + chatId

            const result = await  axios.delete(url, {
                headers: {
                    ...authHeader()
                }
            })
        },

        async getDeletedChatByUser({state, commit}, userId) {
            const url = API_URL + 'api/contacts/search-delete/' + userId

            const result = await axios.get(url, {
                headers: {
                    ...authHeader()
                }
            })

            return  result
        },

        async addUserInBlackList({state, commit}, userId) {
            const url = API_URL + 'api/contacts/add-black-list/' +userId

            const result = await axios.put(url, {}, {
                headers: {
                    ...authHeader()
                }
            })

            if (result.status != 200) {
                console.error('Error by add user in black list')
                return
            }

            setBlackListStatus(state, commit, userId, true)
        },

        async removeUserFromBlackList({state, commit}, userId) {
            const url = API_URL + 'api/contacts/remove-black-list/' + userId

            const result = await axios.delete(url, {
                headers: {
                    ...authHeader()
                }
            });

            if (result.status != 200) {
                console.log('Error by delete from black list')
                return false
            }

            setBlackListStatus(state, commit, userId, false);
            return true
        },

        async searchUsers({state, commit}, data) {
            const {query, user_id} = data
            const url = process.env.VUE_APP_SOCKET_SERVER + 'api/contacts/search/' + user_id + '/'  + query
            const result = await axios.get(url)
            const users = result.data.users || []
            commit('setSearchedUsers', users)
        },

        async getUserInfo({}, userId) {
            const url = process.env.VUE_APP_API_SERVER + 'api/contacts/'+ userId
            const result = await axios.get(url)

            if (result.status == 200) {
                return result.data
            }

            return {};
        },

        removeFromContacts({state, commit}, userId) {
            commit('setContacts', state.contacts.filter(contact => {
                return contact.id !== userId
            }))
        }
    }
}

function setBlackListStatus(state, commit, userId, status) {
    const contacts = state.contacts
    const indexUser = contacts.findIndex(contact => contact.user_id == userId)
    if (indexUser === -1) {
        return false
    }

    contacts[indexUser]['in_black_list'] = status
    commit('setContacts', contacts)
}
