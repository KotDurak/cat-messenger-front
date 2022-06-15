<template>
    <div class="col-md-9">
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
        props: {
            messages: {
                type: Array,
                default: []
            },
            interlocutor: {
                type: Object
            },
            user: {
                type: Object
            }
        },
        methods: {

        },
    }
</script>

<style scoped>

</style>