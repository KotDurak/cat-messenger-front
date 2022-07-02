<template>
    <div class="search_contacts_block">
        <div class="search_contacts">
            <input type="search"
                   class="form-control rounded"
                   placeholder="Search" aria-label="Search"
                   aria-describedby="search-addon"
                   @input="searchUsers"
            />
            <BootstrapIcon
                    icon="search"
                    size="2x"
                    flip-h />
        </div>
        <div class="search_contacts_result">
            <ul class="list-group">
                <li
                        class="list-group-item searched_contact"
                        v-for="user in users"
                        :key="user.id"
                        @click="$emit('add-user', user)"
                >
                    {{user.nick}}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import axios from 'axios'
    import _ from 'lodash'
    export default {
        name: "SearchContacts",
        data() {
          return {
              users: []
          }
        },
        methods: {
            searchUsers:_.debounce(function(e) {
                console.log(e.target.value)
                const url = process.env.VUE_APP_SOCKET_SERVER + 'api/contacts/search/' + this.getUserId + '/'  + e.target.value

                axios.get(url).then(response =>  {
                    this.users = response.data.users
                }, error => {
                    console.log(error)
                })
            }, 1000)
        },
        computed: {
            ...mapGetters({
                getUserId: 'auth/getUserId'
            }),
        }
    }
</script>

<style scoped>
    .search_contacts_block{
        margin-bottom: 20px;
    }

    .search_contacts{
        display: flex;
        justify-content: space-between;
    }

    .search_contacts > input{
        width: 85%;
    }

    .searched_contact{
        cursor: pointer;
    }

    .search_contacts_result{
        margin-top:5px;
    }
</style>