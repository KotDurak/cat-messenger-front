<template>
    <div>
        <p class="modal-text">
            {{text}}
        </p>
        <div class="modal-footer">
            <button
                    type="button"
                    @click="$emit('confirm', true)"
                    class="btn btn-success"
                    data-dismiss="modal">
                {{button_yes}}
            </button>
            <button
                    type="button"
                    @click="$emit('confirm', false)"
                    class="btn btn-danger">
                {{button_no}}
            </button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "dialog-confirm",
        props: {
            title: {
                type: String,
                default: 'Внимание'
            },
            text: {
                type: String,
                default: 'Подтвердите действие'
            },
            button_yes: {
                type: String,
                default: 'Да'
            },
            button_no: {
                type: String,
                default: 'Нет'
            }
        },
    }
</script>

<style scoped>

</style>