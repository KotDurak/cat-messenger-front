<template>
    <div class="search_contacts_block">
        <div class="search_contacts">
            <input type="search"
                   class="form-control rounded"
                   placeholder="Ник или email" aria-label="Search"
                   aria-describedby="search-addon"
                   @input="searchEvent"
                   v-model="searchSting"
            />
            <BootstrapIcon
                    icon="search"
                    size="2x"
                    flip-h />
        </div>
        <div class="search_contacts_result" v-if="searchSting.length > 2">
            <ul class="list-group">
                <li
                        class="list-group-item searched_contact"
                        v-for="user in searchedUsers"
                        :key="user.id"
                        @click="createChat(user)"
                >
                    {{user.nick}}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapActions, mapMutations} from 'vuex'
    import axios from 'axios'
    import _ from 'lodash'
    export default {
        name: "SearchContacts",
        data() {
          return {
              users: [],
              searchSting: ''
          }
        },
        methods: {
            ...mapActions({
                searchUsers: 'contacts/searchUsers'
            }),
            ...mapMutations({
                setSearchedUsers: 'contacts/setSearchedUsers'
            }),
            searchEvent:_.debounce(function(e) {
                if (!e.target.value || e.target.value.leading < 2) {
                    return
                }

                this.searchUsers({
                    query: e.target.value,
                    user_id: this.getUserId
                })
            }, 1000),
            createChat(user) {
                this.$emit('create-chat', user)
                this.setSearchedUsers([])
            }
        },
        computed: {
            ...mapGetters({
                getUserId: 'auth/getUserId',
                searchedUsers: 'contacts/searchedUsers'
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