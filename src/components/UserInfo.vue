<template>
    <div style="display: flex">
        <h4 class="text-success">{{name}}</h4>
        <drop-down-menu :items="menu_items" :view_default="false" style="margin-left: 10px">
            <BootstrapIcon
                    icon="gear"
            />
        </drop-down-menu>
        <modal-dialog v-model:show="showDeleteDialog">
            <dialog-confirm
                    @confirm="confirmDelete"
                    :text="removeUserText"
            />
        </modal-dialog>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'
    export default {
        props: {
            user_id: {
                type: String,
                default: null
            },
            name: String
        },
        data() {
            return {
                menu_items: [
                    {
                        title: 'О пользователе',
                        callback: () => console.log('About')
                    },
                    {
                        title: 'Удалить контакт',
                        callback: () => {
                            this.showDeleteDialog = true
                        }
                    },
                    {
                        title: 'В черный список',
                        callback: () => console.log('Black list', this.user_id)
                    }
                ],
                showDeleteDialog: false,
                showBlackListDialog: false,
            }
        },
        methods: {
            ...mapActions({
               deleteContact: 'contacts/deleteContact'
            }),
            async confirmDelete(confirm) {
                if (!confirm) {
                    return
                }

                this.showDeleteDialog = false
                await this.deleteContact(this.user_id)
                this.$socket.emit('delete_contact', {
                    sender_id: this.senderId,
                    chat_id: this.user_id
                })

                this.$emit('deleted', this.user_id)
            },

        },
        computed: {
            removeUserText() {
                return 'Удалить контакт ' + this.name + '?'
            },
            blackListUserText() {
                return `Занести пользователя ${this.name} в черный список?`
            },
            ...mapGetters({
                senderId: 'auth/getUserId'
            })
        }
    }
</script>

<style scoped>

</style>