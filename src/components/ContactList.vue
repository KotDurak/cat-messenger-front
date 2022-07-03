<template>
    <div class="col-md-3">
        <h3>Контакты</h3>
        <search-contacts @create-chat="addUser"/>
        <ul class="list-group">
            <li
                v-for="contact in contacts"
                :key="contact.id"
                class="list-group-item contact-item"
                @click="loadMessages(contact)"
            >
                {{contact.nick}}
            </li>
        </ul>
    </div>
</template>

<script>
    import SearchContacts from "@/components/SearchContacts";
    import axios from 'axios'

    export default {
        components: {SearchContacts},
        props:{
            contacts: {
                type: Array,
                default: []
            }
        },
        methods: {
            async loadMessages(user) {
                this.$emit('load-messages', user)
            },
            addUser(user) {
                this.$emit('create-chat', user)
               // this.loadMessages(user)
            }
        }
    }
</script>

<style scoped>
    .contact-item{
        cursor: pointer;
    }
</style>