<template>
  <div class="container">
    <main-header
            :title="name"
            :user="getUser()"
            @exit="logoutUser"
    />
    <div class="row">
      <contact-list
          :contacts="contacts"
          @load-messages="loadMessages"
          @create-chat="createChat"
          v-if="isUserAuth"
      />
      <div class="col-md-3" v-else>
        <button class="btn btn-success" @click="openLogin">Логин</button>
        <button class="btn btn-success" style="margin-left: 20px" @click="openRegister">Регистрация</button>
      </div>
      <div class="col-md-9" v-if="isUserAuth">
          <UserInfo
                  :name="interlocuterName"
                  :user_id="interlocutor.id"
                  v-if="interlocutor"
                  @deleted="deleteContact"
          />
          <div class="messages-window row align-items-end">
            <messages-content
                    v-if="this.interlocutor !== null"
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
    <modal-dialog v-model:show="showLogin">
      <login-form @login="loginWithLoad"/>
    </modal-dialog>
    <modal-dialog v-model:show="showRegister">
      <register-form
            @register="registerUser"
      />
    </modal-dialog>
  </div>
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

  export default {
    components: {UserInfo, RegisterForm, ModalDialog, LoginForm, MessageForm, MessagesContent, ContactList, MainHeader},
    data() {
      return {
        name: 'Cat Messenger',
        interlocutor:null,
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
        logout: 'auth/logout',
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
       setContactStatus: 'contacts/setContactStatus'
      }),
      logoutUser() {
        this.$socket.emit('user_logout', {})
        this.logout()

      },
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
        this.interlocutor = {
          id: user.id,
          nick: user.nick,
          type: 'user',
          user_data: user,
          restore_by_send: user.restore_by_send || false
        };

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
        })
      },
      async registerUser(user) {
        const data =  await this.$store.dispatch('auth/register', user);
        await this.loginWithLoad({
          login: user.nick,
          password: user.password,
        })
      },
      sendMessage(message) {
        const user = this.getUser();
        this.$socket.emit('send_message', {
          message: message,
          from: user.id,
          to:this.interlocutor.id,
          type: this.interlocutor.type,
          find_by_user: this.interlocutor.user_data.find_by_user || false,
          restore_by_send: this.interlocutor.restore_by_send
        })

        this.needDown = true;
      },
      async createChat(user) {
        const contact = {
          id: user.id,
          nick: user.nick,
          online: user.status === 1,
          find_by_user: user.type === 'user',
          type: user.type,
        }

        if (user.type === 'user') {
          let result = await this.getDeletedChatByUser(user.id);

          if (result.data.id) {
            contact.id = result.data.id
            contact.restore_by_send = true
            contact.find_by_user = false
          }
        }
        console.log(contact)
        this.addContact(contact);
      },
      async connectToSocket() {
        const user = JSON.parse(localStorage.getItem('user'))
        const data =  await this.$store.dispatch('auth/autologin', user)

        if (data && data.id) {
          await this.loadContacts();
          this.$socket.emit('user_login', {user_id: user.id})
          this.needCheckConnect = true
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
        contacts: 'contacts/contacts'
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
      newMessage(data) {
        const chatId = data.chat._id
        const hasContact = this.contacts.some(c => c.id == chatId)

        if (!hasContact && this.getUserId !== data.sender.id) {
          this.addContact({
            id: chatId,
            name: data.sender.nick,
            unread:1,
          })
          return;
        }

        if (!this.interlocutor) {
          this.addUnread(data.chat._id)
          return;
        }

        if (this.interlocutor.user_data.find_by_user) {
          this.interlocutor.user_data.find_by_user = false
          this.interlocutor.id = data.chat._id.toString()
          const contactIndex = this.contacts.findIndex(c => c.id == data.message.to)
          const newContacts = this.contacts.slice();
          newContacts[contactIndex]['id'] = data.chat._id
          this.contacts = newContacts
        }

        if (data.message) {
          if (this.interlocutor.id == data.chat._id) {
            this.addMessage({
              id: data.message._id.toString(),
              message: data.message.message.toString(),
              from: data.message.from,
              time: data.message.time,
            });
            this.refreshUnread({
              chat_id: data.chat._id,
              user_id: this.getUserId
            })
          } else {
            this.addUnread(data.chat._id)
          }

        }
      },
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
      }
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
</style>
