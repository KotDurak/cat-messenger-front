<template>
    <div class="row">
        <div class="col-4">
            <drop-down-menu
                    :items="items"
                    v-if="user.nick">{{user.nick}}
            </drop-down-menu>
        </div>
        <div class="col-md-8">
            <h2 class="text-center">{{title}}</h2>
        </div>
    </div>
</template>

<script>
    export default {
        name: "NavBar",
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
    }
</script>

<style scoped>

</style>