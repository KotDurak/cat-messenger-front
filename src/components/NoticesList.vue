<template>
    <div class="notices_list">
        <UserNotice
                v-for="notice in notices"
                :key="notice.id"
                :message="notice.message"
                :type="notice.type"
                :id="notice.id"
                @remove="removeNotice"
        />
    </div>
</template>

<script>
    import UserNotice from "@/components/UserNotice";
    export default {
        components: {UserNotice},
        props: {
            notices: Array,
            default: []
        },
        methods: {
            removeNotice(notice) {
               this.$emit('remove_notice', notice)
            }
        }
    }
</script>

<style scoped>

</style>