<template>
    <div>
        <search-contacts @create-chat="addUser"/>
        <a href="#"
           class="list-group-item list-group-item-action border-0"
           v-for="contact in contacts"
           :key="contact.id"
           @click.prevent="loadMessages(contact)"
        >
            <div class="badge bg-success float-right" v-show="contact.unread">{{contact.unread}}</div>
            <div class="d-flex align-items-start">
                <img :src="getImgThumb()" class="rounded-circle mr-1 img-thumbnail"
                     alt="Vanessa Tucker" width="40" height="40">
                <div class="flex-grow-1 ml-3">
                    {{contact.name}}
                    <div class="small"><span class="fas fa-circle chat-online"></span> {{ contact.online  ? 'Online' : 'Offline'}}</div>
                </div>
            </div>
        </a>
    </div>
</template>

<script>
    import SearchContacts from "@/components/SearchContacts";
    import useDefaultImages from '@/hooks/useDefaultImages'

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
        },
        setup(props) {
            const {imgThumb, getImgThumb} = useDefaultImages()

            return {
                imgThumb,
                getImgThumb
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