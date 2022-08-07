<template>
  <main class="content">
    <div class="container">
      <main-header
              :title="name"
              :user="getUser()"
      />
      <div class="card" v-if="isUserAuth">
        <div class="row g-0">
          <contact-list
                  :contacts="contacts"
                  @load-messages="loadMessages"
                  @create-chat="createChat"
                  v-if="isUserAuth"
                  class="col-12 col-lg-5 col-xl-3 border-right"
          />
          <div class="col-12 col-lg-7 col-xl-9">
            <UserInfo
                    :name="interlocuterName"
                    :user_id="interlocutor.id"
                    :user_info="interlocutor"
                    v-if="interlocutor"
                    @deleted="deleteContact"
            />
            <div class="position-relative">
              <messages-content
                      v-if="interlocutor !== null"
                      :messages="messages"
                      :interlocutor="interlocutor"
                      :user="getUser()"
                      class="messages-content"
                      ref="messages"
                      v-model:need-down="needDown"
                      @messages-down="this.needDown = false"
                      @load-messages="loadMoreMessages"
              />
            </div>
            <message-form
                    v-if="interlocutor !== null"
                    @send-message="sendMessage"
            />
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-12 col-xl-12 border-right" v-else>
        <button class="btn btn-success" @click="openLogin">Логин</button>
        <button class="btn btn-success" style="margin-left: 20px" @click="openRegister">Регистрация</button>

        <modal-dialog v-model:show="showLogin">
          <login-form @login="loginWithLoad"/>
        </modal-dialog>
        <modal-dialog v-model:show="showRegister">
          <register-form
                  @register="registerUser"
          />
        </modal-dialog>
      </div>
    </div>
  </main>
</template>

<script>
  import MainHeader from "@/components/MainHeader";
  import ContactList from "@/components/ContactList";
  import MessagesContent from "@/components/MessagesContent";
  import {mapState, mapActions, mapGetters, mapMutations} from 'vuex';
  import MessageForm from "@/components/MessageForm";
  import LoginForm from "@/components/LoginForm";
  import ModalDialog from "@/components/UI/ModalDialog";
  import RegisterForm from "@/components/RegisterForm";
  import UserInfo from "@/components/UserInfo";
  import UserNotice from "@/components/UserNotice";

  export default {
    components: {
      UserNotice,
      UserInfo, RegisterForm, ModalDialog, LoginForm, MessageForm, MessagesContent, ContactList, MainHeader},
    data() {
      return {
        name: 'Cat Messenger',
        message: '',
        needDown:false,
        showLogin: false,
        showRegister: false,
        needCheckConnect: false
      }
    },
    methods: {
      ...mapActions({
        loadContactsById: 'contacts/loadContacts',
        fetchMessages: 'messages/fetchMessages',
        fetchMoreMessages: 'messages/fetchMoreMessages',
        refreshUnread: 'contacts/refreshUnread',
        getDeletedChatByUser: 'contacts/getDeletedChatByUser',
        removeFromContacts: 'contacts/removeFromContacts'
      }),
      ...mapGetters({
        getUser: 'auth/getUser',
        getMessagesCount: 'messages/getCount'
      }),
      ...mapMutations({
        addContact: 'contacts/addContact',
        setPage: 'messages/setPage',
        setChatId: 'messages/setChatId',
        setMessages: 'messages/setMessages',
        addMessage: 'messages/addMessage',
        addUnread: 'contacts/addUnread',
        setContactStatus: 'contacts/setContactStatus',
        addError: 'auth/addError',
        clearErrors: 'auth/clearErrors',
        setInterlocutor: 'contacts/setInterlocutor'
      }),
      async loadContacts() {
        if (!this.isUserAuth) {
        } else {
          this.loadContactsById(this.getUserId)
        }
      },
      async loadMessages(user) {
        await this.loadInterlocuter(user);
        if (user.find_by_user) {
          this.setMessages([])
        } else {
          this.setChatId(user.id)
          this.setPage(1);
          await this.fetchMessages();

          this.refreshUnread({
            chat_id: user.id,
            user_id: this.getUserId
          })
        }

        if (this.getMessagesCount() > 0) {
          this.needDown = true
        }
      },
      loadMoreMessages() {
        this.fetchMoreMessages()
      },
      async loadInterlocuter(user) {
        this.setInterlocutor({
          id: user.id || user.user_id,
          nick: user.nick,
          type: 'user',
          user_data: user,
          restore_by_send: user.restore_by_send || false
        })

      },
      openLogin() {
        this.showLogin = true;
      },
      openRegister() {
        this.showRegister = true;
      },
      async loginWithLoad(user) {
          this.$store.dispatch('auth/login', user).then(async () => {
          await this.loadContacts();
          this.showLogin = false;
          this.showRegister = false;
          this.$socket.emit('user_login', {user_id: this.getUserId});
          this.clearErrors()
        }).catch(error => {
             if (error.response.data.message) {
               this.addError(error.response.data.message)
               return
             }

             throw error
          })
      },
      async registerUser(user) {
        this.$store.dispatch('auth/register', user).then(() => {
           this.loginWithLoad({
            login: user.nick,
            password: user.password,
          })
        }).catch(error => {
            if (error.response.status === 400) {
              if(error.response.data.message) {
                this.addError(error.response.data.message)
                return
              }
            }

            throw error
        })

      },
      sendMessage(message) {
        const user = this.getUser();
        const data = {
          message: message,
          from: user.id,
          to:this.interlocutor.id,
          type: this.interlocutor.type,
          find_by_user: this.interlocutor.user_data.find_by_user || false,
          restore_by_send: this.interlocutor.restore_by_send
        };

        this.$socket.emit('send_message', data)

        this.needDown = true;
      },
      async createChat(user) {
        const contact = {
          user_id: user.id,
          nick: user.nick,
          online: user.status === 1,
          find_by_user: user.type === 'user',
          type: user.type,
          in_black_list: user.in_black_list
        }

        if (user.type === 'user') {
          contact.id = user.id
        }

        if (user.type === 'user') {
          let result = await this.getDeletedChatByUser(user.id);

          if (result.data.id) {
            contact.id = result.data.id
            contact.restore_by_send = true
            contact.find_by_user = false
          }
        }
        this.addContact(contact);
      },
      async connectToSocket() {
        const user = JSON.parse(localStorage.getItem('user'))

        if (!user) {
          return
        }

        try {
          const data =  await this.$store.dispatch('auth/autologin', user)

          if (data && data.id) {
            await this.loadContacts();
            this.$socket.emit('user_login', {user_id: user.id})
            this.needCheckConnect = true
          }
        } catch (e) {
          this.$store.dispatch('auth/logout')
          return
        }
      },
      deleteContact(userId) {
        this.interlocutor = null
        this.removeFromContacts(userId)
      }
    },
    computed: {
      ...mapState({
        messages: state => state.messages.messages,
        totalPages: state => state.messages.totalPages,
        page: state => state.messages.page,
        limit: state => state.messages.limit
      }),
      ...mapGetters({
        isUserAuth : 'auth/isUserAuth',
        getUserId: 'auth/getUserId',
        contacts: 'contacts/contacts',
        interlocutor: 'contacts/getInterlocutor'
      }),
      interlocuterName() {
        if (!this.interlocutor || !this.interlocutor.user_data) {
          return ''
        }

        return this.interlocutor.user_data.name
      }
    },
    mounted() {
      this.connectToSocket()
    },
    watch: {
      'interlocutor.id'(newChat, oldChat) {
        if (!oldChat) {
          return
        }
        this.refreshUnread({
          chat_id: oldChat,
          user_id: this.getUserId
        })
      }
    },
    sockets: {
      connect() {
        if (this.needCheckConnect) {
          this.connectToSocket()
        }
      },
      userLogin(data) {
          this.setContactStatus({user_id: data.user_id, online:true})
      },
      userDisconnect(data) {
          this.setContactStatus({user_id: data.user_id, online: false})
      },
      deleteChat(data) {
        console.log(data)
      },
    },
  }
</script>

<style>
  .messages-window{
    height: 70vh;
  }

  .messages-content{
    max-height: 70vh;
    overflow-y: auto;
  }

  body{margin-top:20px;}

  .chat-online {
    color: #34ce57
  }

  .chat-offline {
    color: #e4606d
  }

  .chat-messages {
    display: flex;
    flex-direction: column;
    max-height: 800px;
    overflow-y: scroll
  }

  .chat-message-left,
  .chat-message-right {
    display: flex;
    flex-shrink: 0
  }

  .chat-message-left {
    margin-right: auto
  }

  .chat-message-right {
    flex-direction: row-reverse;
    margin-left: auto
  }
  .py-3 {
    padding-top: 1rem!important;
    padding-bottom: 1rem!important;
  }
  .px-4 {
    padding-right: 1.5rem!important;
    padding-left: 1.5rem!important;
  }
  .flex-grow-0 {
    flex-grow: 0!important;
  }
  .border-top {
    border-top: 1px solid #dee2e6!important;
  }

  .form-wrapper{
    width: 800px;
  }

  .auth-error{
    font-size: 1.2rem;
  }

  @media (max-width: 768px) {
    .form-wrapper{
      width: 100%;
    }
  }
</style>
