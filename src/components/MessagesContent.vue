<template>
    <div class="col-md-12 gx-0" ref="list">
        <user-message
            v-for="message in messages"
            :key="message.id"
            :user="message.user_id === user.id ? user : interlocutor"
            :message="message"
            :is-my="message.user_id === user.id"
        />
    </div>
</template>

<script>
    import UserMessage from "@/components/UserMessage";
    export default {
        name: "MessagesContent",
        components: {UserMessage},
        date() {
            return {
                needScrollDown: false
            }
        },
        props: {
            messages: {
                type: Array,
                default: []
            },
            needDown:{
              type: Boolean,
              default: false
            },
            interlocutor: {
                type: Object
            },
            user: {
                type: Object
            }
        },
        methods: {
            messagesDown() {
                const el = this.$refs.list;
                el.scroll(0, el.scrollHeight);
                console.log('message down');
            }
        },
        watch: {
            needDown(newVal, oldVal) {
               if (newVal) {
                   this.messagesDown();
                   this.$emit('messages-down')
               }
            }
        }
    }
</script>

<style scoped>

</style>