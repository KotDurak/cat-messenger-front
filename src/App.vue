<template>
  <div class="container">
    <main-header :title="name" :user="getUser()"/>
    <div class="row">
      <contact-list
          :contacts="contacts"
          @load-messages="loadMessages"
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
  import fakeContacts from "@/fake-data/contacts";
  import fakeMessages from '@/fake-data/messages';
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
        contacts: [],
        messages: [],
        interlocutor:null,
        message: '',
        needDown:false,
        showLogin: false,
        showRegister: false,
      }
    },
    methods: {
      async loadContacts() {
        if (!this.isUserAuth) {
          this.contacts = []
        } else {
          this.contacts = fakeContacts
        }
      },
      async loadMessages(id) {
        await this.loadInterlocuter(id);

        if (id === 3) {
          this.messages = [
            {id:800, user_id: 3, message: 'Откройте дверь'}
          ];
        } else {
          this.messages = fakeMessages;
        }

        if (this.messages.length > 0) {
          this.needDown = true
        }

      },
      async loadMoreMessages() {
        console.log('Load more messages')
      },
      async loadInterlocuter(id) {
        this.interlocutor = {
          id: id,
          name: 'Tigr',
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
        })


      },
      async registerUser(user) {
        const data =  await this.$store.dispatch('auth/register', user);
        await this.loginWithLoad({
          login: user.nick,
          password: user.password,
        })
      },
      loadMoreMessages(lastMessage) {
          const newMessages = [];

          for (let i = 0; i < 10; i++) {
            newMessages.push({
              id: new Date().getTime() + i + lastMessage.id,
              message: `Message auto genereted ${i}`,
              user_id: 888,
            });
          }

          this.messages = [...newMessages ,...this.messages]
      },
      sendMessage(message) {
        const user = this.getUser();

        this.messages.push({
          id: Date.now(),
          message: message,
          user_id: user.id,
        });

        this.needDown = true;
      },
      ...mapGetters({
        getUser: 'auth/getUser'
      })
    },
    computed: {
      ...mapGetters({
        isUserAuth : 'auth/isUserAuth'
      }),
    },
    async mounted() {
      const user = JSON.parse(localStorage.getItem('user'))
      const data =  await this.$store.dispatch('auth/autologin', user)

      if (data.id) {
         await this.loadContacts();
         this.$socket.emit('user_login', {tigr: 'skotina', user_id: data.id})
      }
    }
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
