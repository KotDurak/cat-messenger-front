<template>
  <div class="container">
    <main-header :title="name"/>
    <h1>{{message}}</h1>
    <div class="row">
      <contact-list
          :contacts="contacts"
          @load-messages="loadMessages"
          v-if="isAuth"
      />
      <div class="col-md-3" v-else>
        <button class="btn btn-success" @click="openLogin">Логин</button>
        <button class="btn btn-success" style="margin-left: 20px" @click="openRegister">Регистрация</button>
      </div>
      <div class="col-md-9" v-if="isAuth">
        <messages-content
                :messages="messages"
                :interlocutor="interlocutor"
                :user="getUser()"
                class="messages-content"
                ref="messages"
                :need-down="needDown"
                @messages-down="this.needDown = false"
        />
        <message-form
                v-if="interlocutor !== null"
                @send-message="sendMessage"
        />
      </div>
    </div>
    <modal-dialog v-model:show="showLogin">
      <login-form @login="loginWithLoad"/>
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

  export default {
    components: {LoginForm, MessageForm, MessagesContent, ContactList, MainHeader},
    data() {
      return {
        name: 'Cat Messenger',
        contacts: [],
        messages: [],
        interlocutor:null,
        message: '',
        needDown:false,
        showLogin: false
      }
    },
    methods: {
      async loadContacts() {
        if (!this.isAuth) {
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
          this.needDown= true
        }

      },
      async loadInterlocuter(id) {
        this.interlocutor = {
          id: id,
          name: 'Tigr',
          photo: 'https://icdn.lenta.ru/images/2021/12/30/17/20211230175542538/square_1280_9852fabcde7147edee00deeafde2a2e0.jpg'
        };
      },
      openLogin() {
        this.showLogin = true;
      },
      openRegister() {
        console.log('Open register')
      },
      async loginWithLoad(user) {
        this.setLogin(user);
        await this.login()
        await this.loadContacts();
        this.showLogin = false;
      },
      ...mapMutations({
          setUser: 'setUser',
          setLogin: 'setLoginData',
      }),
      ...mapActions({
          login: 'login'
      }),
      ...mapGetters({
        getUser: 'getUser',
      }),
      sendMessage(message) {
        const user = this.getUser();

        this.messages.push({
          id: Date.now(),
          message: message,
          user_id: user.id,
        });

        this.needDown = true;
      }
    },
    computed: {
      ...mapState({
          user: state => state.user,
          isAuth: state => state.isAuth,
      }),
    },
    mounted() {
      this.loadContacts();
    }
  }
</script>

<style>
  .messages-content{
    max-height: 400px;
    overflow-y: scroll;
  }
</style>
