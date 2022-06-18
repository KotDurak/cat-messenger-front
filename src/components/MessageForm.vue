<template>
    <div class="row message-form">
        <div class="col-8">
            <cat-text-area
                    v-model="message"
                    :rows="2"

            />
        </div>
        <div class="col-4">
            <button  @click="sendMessage" class="message-button"></button>
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
                const message = this.message.trim();

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
        margin-top: 20px;
    }

    .message-button{
        background-color: #0dcaf0;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: none;
        position: relative;
    }

    .message-button:after {
        content: '';
        position: absolute;
        border-style: solid;
        border-width: 19px 12px 0;
        border-color: #fff transparent transparent transparent;
        display: block;
        width: 8px;
        z-index: 1;
        top: 26%;
        left: 34%;
        transform: rotate(269deg);
    }
</style>