<template>
    <div class="px-4 d-none d-md-block">
        <div class="d-flex align-items-center">
            <div class="flex-grow-1">
                <input type="search"
                       class="form-control my-3"
                       placeholder="Ник или email" aria-label="Search"
                       @input="searchEvent"
                       v-model="searchSting"
                />
            </div>
        </div>
        <div class="search_contacts_result" v-if="searchSting.length > 2">
            <a href="#"
               class="list-group-item list-group-item-action border-0"
               v-for="user in searchedUsers"
               :key="user.id"
               @click.prevent="createChat(user)"
            >
                <div class="d-flex align-items-start">
                    <img :src="getImgThumb()" class="rounded-circle mr-1"
                         alt="Vanessa Tucker" width="40" height="40">
                    <div class="flex-grow-1 ml-3">
                        {{user.nick}}
                        <div class="small"><span class="fas fa-circle chat-online"></span> {{ user.status == 1  ? 'Online' : 'Offline'}}</div>
                    </div>
                </div>
            </a>

        </div>
    </div>
</template>

<script>
    import {mapGetters, mapActions, mapMutations} from 'vuex'
    import axios from 'axios'
    import _ from 'lodash'
    import useDefaultImages from "@/hooks/useDefaultImages";
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
        },
        setup(props) {
            const {imgThumb, getImgThumb} = useDefaultImages()

            return {
                imgThumb,
                getImgThumb
            }
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