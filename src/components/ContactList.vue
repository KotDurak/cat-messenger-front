<template>
    <div class="col-md-3">
        <h3>Контакты</h3>
        <ul class="list-group">
            <li
                v-for="contact in contacts"
                :key="contact.id"
                class="list-group-item"
            >
                {{contact.name}}
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        props:{
            contacts: {
                type: Array,
                default: []
            }
        }
    }
</script>

<style scoped>

</style>