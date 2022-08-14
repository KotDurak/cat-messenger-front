<template>
    <div class="dialog" v-if="show" @click.stop="hideDialog" data-testid="modal">
        <div @click.stop class="dialog__content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    import toggleMixin from "@/mixins/toggleMixin";

    export default {
        name: "modal-dialog",
        mixins:[toggleMixin]
    }
</script>

<style scoped>
    .dialog{
        top:0;
        bottom:0;
        right:0;
        left:0;
        background: rgba(0,0,0,0.5);
        position: fixed;
        display: flex;
        z-index: 9999999;
        overflow-y: auto;
    }

    .dialog__content{
        margin:auto;
        background: white;
        border-radius: 12px;
        min-height: 50px;
        min-width: 300px;
        padding: 20px;
    }
</style>