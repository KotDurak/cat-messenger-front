<template>
    <div>
        <form @submit.prevent="login">
            <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">Адрес электронной почты или номер</label>
                <input type="text" v-model="userLogin" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
            </div>
            <div class="mb-3">
                <label for="exampleInputPassword1" class="form-label">Пароль</label>
                <input type="password" v-model="password" class="form-control" id="exampleInputPassword1">
            </div>
            <button type="submit" class="btn btn-primary">Отправить</button>
        </form>
    </div>
</template>

<script>
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
        }
    }
</script>

<style scoped>

</style>