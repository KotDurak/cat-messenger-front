<template>
    <div class="py-2 px-4 border-bottom d-none d-lg-block">
        <div class="d-flex align-items-center py-1">
            <div class="position-relative">
                <img :src="getImgThumb()"
                     class="rounded-circle mr-1"
                     alt="Sharon Lessman" width="40" height="40">
            </div>
            <div class="flex-grow-1 pl-3" style="visibility: hidden">
                <strong>{{name}}</strong>
                <div class="text-muted small"><em>Typing...</em></div>
            </div>
            <div>
                <button class="btn btn-primary btn-lg mr-1 px-3" style="visibility: hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                         class="feather feather-phone feather-lg">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                </button>
                <button class="btn btn-info btn-lg mr-1 px-3 d-none d-md-inline-block" style="visibility: hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                         class="feather feather-video feather-lg">
                        <polygon points="23 7 16 12 23 17 23 7"></polygon>
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                    </svg>
                </button>
                <drop-down-menu :items="menu_items" :custom_button="true" :view_default="false" style="display: inline-block">
                    <button class="btn btn-light border btn-lg px-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                             class="feather feather-more-horizontal feather-lg">
                            <circle cx="12" cy="12" r="1"></circle>
                            <circle cx="19" cy="12" r="1"></circle>
                            <circle cx="5" cy="12" r="1"></circle>
                        </svg>
                    </button>
                </drop-down-menu>
            </div>
        </div>
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
        <modal-dialog v-model:show="showUserInfoDialog">
            <load-spinner v-show="isLoadingUserInfo"/>
            <UserData v-if="!isLoadingUserInfo" :data="userData"/>
        </modal-dialog>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'
    import useUserInfo from "@/hooks/useUserInfo";
    import UserData from "@/components/UserData";
    import useDefaultImages from "@/hooks/useDefaultImages";
    export default {
        components: {UserData},
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
        methods: {
            ...mapActions({
               deleteContact: 'contacts/deleteContact',
               addUserInBlackList: 'contacts/addUserInBlackList',
               removeUserFromBlackList: 'contacts/removeUserFromBlackList',
               getUserInfo: 'contacts/getUserInfo'
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
                const userId = this.user_info.user_data.user_id
                if (this.isInBlackList()) {
                     this.removeUserFromBlackList(userId)
                } else {
                    this.addUserInBlackList(userId)
                }
            },
            async loadUserInfo() {
                 const userData = await this.getUserInfo(this.user_info.user_data.user_id)
                 this.setUserData(userData)
            }
        },
        computed: {
            removeUserText() {
                return 'Удалить контакт ' + this.name + '?'
            },
            blackListUserText() {
                if (this.isInBlackList()) {
                    return `Удалить пользователя ${this.name} из черного списка?`
                }

                return `Занести пользователя ${this.name} в черный список?`
            },
            ...mapGetters({
                senderId: 'auth/getUserId'
            }),
        },
        watch: {
          async showUserInfoDialog(value) {
              if (value) {
                  this.setLoadingUserInfo(true)
                  await this.loadUserInfo()
                  this.setLoadingUserInfo(false)
              }
          }
        },
        setup(props) {

            const {
                menu_items,
                showDeleteDialog,
                showBlackListDialog,
                isInBlackList,
                showUserInfoDialog,
                isLoadingUserInfo,
                setLoadingUserInfo,
                userData,
                setUserData
            } = useUserInfo(props)


            const {getImgThumb, imgThumb} = useDefaultImages()

            return {
                menu_items,
                showBlackListDialog,
                showDeleteDialog,
                isInBlackList,
                showUserInfoDialog,
                isLoadingUserInfo,
                setLoadingUserInfo,
                userData,
                setUserData,
                getImgThumb,
                imgThumb
            }
        }
    }
</script>

<style scoped>

</style>