<template>
    <div class="flex-grow-0 py-3 px-4 border-top">
        <div class="input-group">
            <input type="text"
                   class="form-control"
                   placeholder="Сообщение..."
                   v-model="message"
                   @keydown.enter.prevent="sendMessage"
            >
            <button class="btn btn-primary" @click.prevent="sendMessage">Отправить</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "MessageForm",
        data() {
          return {
              message: '',
          }
        },
        methods: {
            sendMessage() {
                const message = this.message.trim('\n');

                if (!message) {
                    return;
                }

                this.$emit('send-message', message)
                this.message = ''
            }
        }
    }
</script>

<style scoped>
    .message-form{
        margin-top: 30px;
    }

    .message-button{
        cursor: pointer;
    }

</style>