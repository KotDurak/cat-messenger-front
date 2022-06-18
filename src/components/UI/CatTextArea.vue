<template>
    <textarea
            :value="modelValue"
            @input="updateTextArea"
            :cols="cols"
            :rows="rows"
            class="form-control"
    >

    </textarea>
</template>

<script>
    export default {
        name: "cat-text-area",
        props: {
            modelValue: {
                type: [String, Number]
            },
            cols: {
                type: Number,
                default:30
            },
            rows: {
                type: Number,
                default: 10
            }
        },
        methods: {
            updateTextArea(event) {
                this.$emit('update:modelValue', event.target.value);
            }
        }
    }
</script>

<style scoped>

</style>