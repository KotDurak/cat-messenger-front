<template>
  <div class="container">
    <main-header :title="name"/>
    <div class="row">
      <contact-list
          :contacts="contacts"
      />
      <messages-content/>
    </div>
  </div>
</template>

<script>
  import MainHeader from "@/components/MainHeader";
  import ContactList from "@/components/ContactList";
  import MessagesContent from "@/components/MessagesContent";
  import fakeContacts from "@/fake-data/contacts";
  export default {
    components: {MessagesContent, ContactList, MainHeader},
    data() {
      return {
        name: 'Cat Messenger',
        contacts: []
      }
    },
    methods: {
      async loadContacts() {
        this.contacts = fakeContacts
      }
    },
    mounted() {
      this.loadContacts();
    }
  }
</script>

<style>

</style>
