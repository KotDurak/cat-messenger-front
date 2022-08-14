<template>
    <div data-testid="message-wrapper" class="pb-4" :class="{'chat-message-right': isMy, 'chat-message-left': !isMy}" >
        <div>
            <img :src="getImgThumb()" class="rounded-circle mr-1" alt="Chris Wood" width="40" height="40">
            <div class="text-muted small text-nowrap mt-2">{{messageTime}}</div>
            <div class="text-muted small text-nowrap">{{messageDate}}</div>
        </div>
        <div data-testid="base-message" class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
            <div class="font-weight-bold mb-1">{{senderName}}</div>
            {{message.message}}
            <indicator-check v-if="isMy" :checked="message.read || false"/>
        </div>
    </div>

</template>

<script>
    import moment from 'moment'
    import useDefaultImages from "@/hooks/useDefaultImages";
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
        computed: {
            senderName() {
                return this.isMy ? this.user.nick : this.user.user_data.name
            },
            messageTime() {
                return moment(this.message.time).format('hh.mm a')
            },
            messageDate() {
                return moment(this.message.time).format('YYYY.MM.DD')
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
    .my-message{
        justify-content: flex-end;
    }

    .chat-message{
        border: 1px solid teal;
        margin-top:20px;
        padding: 10px;
    }
</style>