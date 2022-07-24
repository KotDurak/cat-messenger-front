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
        <modal-dialog v-model:show="showBlackListDialog">
            <dialog-confirm
                    @confirm="confirmBlackList"
                    :text="blackListUserText"
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
            name: String,
            user_info: {
                type:Object
            }
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
                        callback: () =>  {
                            this.showBlackListDialog = true
                        }
                    }
                ],
                showDeleteDialog: false,
                showBlackListDialog: false,
            }
        },
        methods: {
            ...mapActions({
               deleteContact: 'contacts/deleteContact',
               addUserInBlackList: 'contacts/addUserInBlackList',
            }),
            async confirmDelete(confirm) {
                this.showDeleteDialog = false

                if (!confirm) {
                    return
                }


                await this.deleteContact(this.user_id)
                this.$socket.emit('delete_contact', {
                    sender_id: this.senderId,
                    chat_id: this.user_id
                })

                this.$emit('deleted', this.user_id)
            },
            async confirmBlackList(confirm) {
                this.showBlackListDialog = false

                if (!confirm) {
                    return
                }

                this.addUserInBlackList(this.user_id)

            }
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