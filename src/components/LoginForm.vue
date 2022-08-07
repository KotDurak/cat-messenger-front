<template>
    <div>
        <h3>Логин</h3>
        <p class="text-danger auth-error" v-if="authError.length > 1">{{authError}}</p>
        <form @submit.prevent="login">
            <div class="row">
                <div class="col-md-12 mb-12">

                    <div class="form-outline">
                        <input type="text" v-model="userLogin" class="form-control form-control-lg" id="exampleInputEmail1" aria-describedby="emailHelp">
                        <label for="exampleInputEmail1" class="form-label">Адрес электронной почты или ник</label>
                    </div>

                </div>

                <div class="col-md-12 mb-12">

                    <div class="form-outline">
                        <input type="password" v-model="password" class="form-control form-control-lg" id="exampleInputPassword1">
                        <label for="exampleInputPassword1" class="form-label">Пароль</label>
                    </div>
                </div>

            </div>

            <div class="mt-4 pt-2">
                <button type="submit" class="btn btn-primary btn-lg">Вход</button>
            </div>

        </form>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    export default {
        name: "LoginForm",
        data() {
            return {
                userLogin: '',
                password:''
            }
        },
        methods: {
            login() {
                this.$emit('login', {
                    login: this.userLogin,
                    password: this.password,
                })
            }
        },
        computed: {
            ...mapGetters({
                authError: 'auth/getAuthError'
            })
        }
    }
</script>

<style scoped>

</style>