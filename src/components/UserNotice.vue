<template>
    <div class="alert_wrapper">
        <div class="alert alert-dismissible" :class="alert_class" role="alert">
            {{message}}
            <button type="button"  @click="removeAlert" class="close" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            message: String,
            type: {
                type: String,
                default: 'info'
            },
            id: [String, Number]
        },
        computed: {
            alert_class() {
                return 'alert-' + this.type
            }
        },
        methods: {
            removeAlert() {
                this.$emit('remove', this.id)
            }
        },
        mounted() {
            setTimeout(() => {
                this.removeAlert()
            }, 2000)
        }
    }
</script>

<style scoped>

</style>