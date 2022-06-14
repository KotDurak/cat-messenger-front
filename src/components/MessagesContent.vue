<template>
    <div class="col-md-9">
        <div v-for="message in messages" :key="message.id">
            {{message.message}}
        </div>
    </div>
</template>

<script>
    export default {
        name: "MessagesContent",
        props: {
            messages: {
                type: Array,
                default: []
            }
        }
    }
</script>

<style scoped>

</style>