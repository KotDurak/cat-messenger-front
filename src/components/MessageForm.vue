<template>
    <div class="row message-form">
        <div class="col-8 ">
            <cat-text-area
                    v-model="message"
                    :rows="2"
                    @keydown.enter.prevent="sendMessage"

            />
        </div>
        <div class="col-4">
            <a  @click.prevent="sendMessage" class="message-button">
                <BootstrapIcon
                        icon="send"
                        size="3x"
                        variant="info"
                        />
            </a>
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