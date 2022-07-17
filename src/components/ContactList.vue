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
                <span class="contact_name" :class="{'online': contact.online}">{{contact.name}}</span>
                <span class="unread_count text-danger" v-show="contact.unread">({{contact.unread}})</span>
            </li>
        </ul>
    </div>
</template>

<script>
    import SearchContacts from "@/components/SearchContacts";

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
            }
        }
    }
</script>

<style scoped>
    .contact-item{
        cursor: pointer;
    }

    .unread_count{
        font-weight: 700;
        position: absolute;
        right: 10px;
    }

    .online:before{
        background: #029e03;
        clip-path: circle(50%);
        height: 10px;
        width: 10px;
        content:'';
        position: absolute;
        left: 5px;
        top: 15px;
    }
</style>