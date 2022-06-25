<template>
    <div class="col-md-12 gx-0" ref="list" id="messages_wrapper">
        <div v-intersection="{rootElem:'#messages_wrapper', callback: loadMoreMessages}" class="observer"></div>
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
                needScrollDown: false,
                waitingNewMessages: false,
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
            messagesDown(height = null) {
                const el = this.$refs.list;

                if (!height) {
                    height = el.scrollHeight;
                }

                el.scroll(0, height);
                this.waitingNewMessages = false;
            },
            async loadMoreMessages() {
                if (this.messages.length === 0 || !this.interlocutor) {
                    return;
                }

                const lastMessage = this.messages[this.messages.length - 1];
                this.waitingNewMessages = true;
                this.$emit('load-messages', lastMessage);

            }
        },
        updated() {
            if (this.needDown) {
                this.messagesDown();
                this.$emit('messages-down');
            } else if (this.waitingNewMessages) {
                this.messagesDown(20);
            }
        }
    }
</script>

<style scoped>

</style>