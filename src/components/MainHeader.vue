<template>
    <div class="row cat-messenger_header">
        <div class="col-2">
            <drop-down-menu
                    :items="items"
                    v-if="user.nick"
                    class="self_user_menu">
                    <span class="profile-menu-header">{{user.nick}}</span>
            </drop-down-menu>
        </div>
        <div class="col-md-4 col-notices">
            <NoticesList class="list-notices"
                         :notices="notices"
                         @remove_notice="removeNotice"
            />
        </div>
        <div class="col-md-4">
            <h2 class="text-center">{{title}}</h2>
        </div>
         <modal-dialog v-model:show="showExitDialog">
             <dialog-confirm :text="confirmExitText" @confirm="exitConfirm"></dialog-confirm>
         </modal-dialog>
    </div>
</template>

<script>
    import NoticesList from "@/components/NoticesList";
    import {mapGetters, mapActions} from 'vuex'
    import useSelfInfo from "@/hooks/useSelfInfo";
    export default {
        name: "NavBar",
        components: {NoticesList},
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
        methods: {
          ...mapActions({
              removeNotice: 'sockets/removeNotice',
              logout: 'auth/logout',
          }),
          exitConfirm(confirm) {
              this.showExitDialog = false

              if (confirm) {
                  this.$socket.emit('user_logout', {})
                  this.logout()
              }
          }
        },
        computed: {
            ...mapGetters({
                notices: 'sockets/getNotices'
            })
        },
        setup(props) {
            const {menu_items, showExitDialog, confirmExitText} = useSelfInfo()
            return {
                items: menu_items,
                showExitDialog,
                confirmExitText
            }
        }
    }
</script>

<style scoped>
    .cat-messenger_header{
        margin-top:20px;
    }

    .col-notices{
        position: relative;
    }

    .list-notices{
        position: absolute;
        max-height: 80vh;
        overflow-y: auto;
        z-index: 99;
    }

    .profile-menu-header{
        font-size: 1.2rem;
        font-weight: 600;
    }
</style>