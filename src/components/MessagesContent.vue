<template>
    <div class="chat-messages p-4" ref="list" id="messages_wrapper">
        <div v-intersection="{rootElem:'#messages_wrapper', callback: loadMoreMessages}" class="observer"></div>
        <user-message
                v-for="message in messages"
                :key="message._id"
                :user="message.from === user.id ? user : interlocutor"
                :message="message"
                :is-my="message.from === user.id"
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
                waitingNewMessages: false,
                scrollLock: false,
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

                if (this.scrollLock) {
                    return
                }

                const lastMessage = this.messages[this.messages.length - 1];
                this.waitingNewMessages = true;

                if (!this.needDown) {
                    this.$emit('load-messages', lastMessage);
                }

                this.$emit('update:need-down', false);
            }
        },
        updated() {
            if (this.needDown) {
                this.messagesDown();
                this.scrollLock = true;
                setTimeout(() => {
                    this.scrollLock = false
                }, 1500)
            } else if (this.waitingNewMessages) {
                const height = (this.$refs.list.scrollHeight * 5) / 100
                this.messagesDown(height);
            }
        },
    }
</script>

<style scoped>

</style>