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
          <div class="messages-window row align-items-end">
            <messages-content
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

  export default {
    components: {RegisterForm, ModalDialog, LoginForm, MessageForm, MessagesContent, ContactList, MainHeader},
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
        logout: 'auth/logout'
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
        addMessage: 'messages/addMessage'
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
          await this.fetchMessages();
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
          user_data: user
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
          find_by_user: this.interlocutor.user_data.find_by_user || false
        })

        this.needDown = true;
      },
      createChat(user) {
        const contact = {
          id: user.id,
          nick: user.nick,
          online: user.status === 1,
          find_by_user: true
        }

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
    },
    mounted() {
      this.connectToSocket()
    },
    sockets: {
      newMessage(data) {
        const chatId = data.chat._id
        const hasContact = this.contacts.some(c => c.id == chatId)

        if (!hasContact && this.getUserId !== data.sender.id) {
          this.addContact({
            id: chatId,
            name: data.sender.nick,
            unreadCount:1,
          })
          return;
        }

        if (!this.interlocutor) {
          console.log('message from', data)
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
          } else {
            console.log('message from', data.chat._id)
          }

        }
      },
      connect() {
        if (this.needCheckConnect) {
          this.connectToSocket()
        }
      },
      userLogin(data) {
        console.log('login', data)
      },
      userDisconnect(data) {
        console.log('disconnect', data)
      }
    },
  }
</script>

<style>
  .messages-window{
    height: 400px;
  }

  .messages-content{
    max-height: 400px;
    overflow-y: auto;
  }
</style>
