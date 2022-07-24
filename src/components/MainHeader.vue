<template>
    <div class="row cat-messenger_header">
        <div class="col-2">
            <drop-down-menu
                    :items="items"
                    v-if="user.nick">{{user.nick}}
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
    </div>
</template>

<script>
    import NoticesList from "@/components/NoticesList";
    import {mapGetters, mapActions} from 'vuex'
    export default {
        name: "NavBar",
        components: {NoticesList},
        data() {
          return {
              items: [
                  {
                      title: 'Выход',
                      callback: () => this.$emit('exit')
                  },
                  {
                      title: 'Информация',
                      callback: () => console.log('Show info about user')
                  }
              ]
          }
        },
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
              removeNotice: 'sockets/removeNotice'
          })
        },
        computed: {
            ...mapGetters({
                notices: 'sockets/getNotices'
            })
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
</style>