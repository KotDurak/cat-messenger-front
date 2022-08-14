<template>
    <div data-testid="indicator" class="text-right" :class="{'text-success': checked, 'unchecked': !checked}">
        <BootstrapIcon icon="check"/>
    </div>
</template>

<script>
    export default {
        name: "indicator-check",
        props: {
            checked: {
                type: Boolean,
                default: false
            }
        }
    }
</script>

<style scoped>
    .unchecked{
        opacity: 0.4;
    }
</style>