<template>
  <div class="container">
    <main-header :title="name"/>
    <div class="row">
      <contact-list
          :contacts="contacts"
          @load-messages="loadMessages"
          v-if="isAuth"
      />
      <div class="col-md-3" v-else>
        <button class="btn btn-success" @click="loginWithLoad">Логин</button>
      </div>
      <messages-content
              :messages="messages"
              :interlocutor="interlocutor"
              :user="getUser"
              class="messages-content"
      />
    </div>
  </div>
</template>

<script>
  import MainHeader from "@/components/MainHeader";
  import ContactList from "@/components/ContactList";
  import MessagesContent from "@/components/MessagesContent";
  import fakeContacts from "@/fake-data/contacts";
  import fakeMessages from '@/fake-data/messages';
  import {mapState, mapActions, mapGetters, mapMutations} from 'vuex';

  export default {
    components: {MessagesContent, ContactList, MainHeader},
    data() {
      return {
        name: 'Cat Messenger',
        contacts: [],
        messages: [],
        interlocutor:{}
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
      },
      async loadInterlocuter(id) {
        this.interlocutor = {
          id: id,
          name: 'Tigr',
          photo: 'https://icdn.lenta.ru/images/2021/12/30/17/20211230175542538/square_1280_9852fabcde7147edee00deeafde2a2e0.jpg'
        };
      },
      async loginWithLoad() {
        await this.login()
        await this.loadContacts();
      },
      ...mapMutations({
          setUser: 'setUser'
      }),
      ...mapActions({
          login: 'login'
      }),
    },
    computed: {
      ...mapState({
          user: state => state.user,
          isAuth: state => state.isAuth,
      }),
      ...mapGetters({
        getUser: 'getUser',
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
