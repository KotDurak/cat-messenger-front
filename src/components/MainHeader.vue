<template>
    <div class="row">
        <div class="col-4">
            <p v-if="user.name">{{user.name}}</p>
        </div>
        <div class="col-md-8">
            <h2 class="text-center">{{title}}</h2>
        </div>
    </div>
</template>

<script>
    export default {
        name: "NavBar",
        props: {
            title: {
                type: String,
                default:'Title'
            },
            user: {
                type: Object,
                default: {},
            }
        },
    }
</script>

<style scoped>

</style>