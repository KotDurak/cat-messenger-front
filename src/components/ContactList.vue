<template>
    <div class="col-md-3">
        <h3>Контакты</h3>
        <ul class="list-group">
            <li
                v-for="contact in contacts"
                :key="contact.id"
                class="list-group-item contact-item"
                @click="loadMessages(contact.id)"
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
        },
        methods: {
            async loadMessages(id) {
                this.$emit('load-messages', id);
            }
        }
    }
</script>

<style scoped>
    .contact-item{
        cursor: pointer;
    }
</style>