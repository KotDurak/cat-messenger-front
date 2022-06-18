<template>
    <div>
        <div class="row gx-0" :class="{'my-message': isMy}">
            <div class="col-9 chat-message">
                {{message.message}}
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            message: {
                type: Object
            },
            user: {
                type: Object
            },
            isMy: {
                type: Boolean,
                default: false
            }
        },
    }
</script>

<style scoped>
    .my-message{
        justify-content: flex-end;
    }

    .chat-message{
        border: 1px solid teal;
        margin-top:20px;
        padding: 10px;
    }
</style>