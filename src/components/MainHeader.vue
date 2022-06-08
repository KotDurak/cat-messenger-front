<template>
    <div class="row">
        <div class="col-md-12">
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
            }
        }
    }
</script>

<style scoped>

</style>