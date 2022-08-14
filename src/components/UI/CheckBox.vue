<template>
    <input ref="checkbox" v-bind="$attrs" type="checkbox" :id="id" @change="updateValue">
    <label v-if="$slots.default" :for="id">
        <slot/>
    </label>
</template>

<script>
    export default {
        name: "check-box",
        props: {
            modelValue: {
                type: Number
            },
            id: {
                type: String,
            }
        },
        methods: {
            updateValue(event) {
                const val = event.target.checked ? 1 : 0


                this.$emit('update:modelValue', val)
            }
        },
        mounted() {
            if (this.modelValue == 1) {
                this.$refs.checkbox.checked = true
            }
        }
    }
</script>

<style scoped>

</style>