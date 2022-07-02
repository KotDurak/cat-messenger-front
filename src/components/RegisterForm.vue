<template>
    <div class="login-form-wrapper">
        <form action="" @submit.prevent="registerUser">
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input v-model="email" type="email" class="form-control" id="email" aria-describedby="emailHelp">
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Пароль</label>
                <input type="password" v-model="password" class="form-control" id="password">
            </div>
            <div class="mb-3">
                <label for="exampleInputPassword1" class="form-label">Подтвердите пароль</label>
                <input type="password" v-model="passwordConfirm" class="form-control" id="exampleInputPassword1">
            </div>

            <div class="mb-3">
                <label for="nick-name">Ник</label>
                <input type="text" class="form-control"  v-model="nick" aria-label="First name" id="nick-name">
            </div>

            <div class="row">
                <div class="col">
                    <label for="age">Дата рождения</label>
                    <input v-model="birthDay" type="date" class="form-control" min="18" max="120" id="age">
                </div>
                <div class="col">
                    <label for="gender">Пол</label>
                    <select class="form-select" v-model="gender" id="gender">
                        <option selected value="0">Не указывать</option>
                        <option value="1">M</option>
                        <option value="2">Ж</option>
                    </select>
                </div>
            </div>

            <button type="submit" class="btn btn-primary">Регистрация</button>
        </form>
    </div>
</template>

<script>
    export default {
        name: "RegisterForm",
        data() {
            return {
                email:'',
                password:'',
                passwordConfirm:'',
                nick:'',
                birthDay: '',
                gender:0
            }
        },
        methods: {
            registerUser() {
                const user = {
                    email: this.email,
                    password: this.password,
                    passwordConfirm: this.passwordConfirm,
                    nick: this.nick,
                    age:  this.birthDay ? new Date(this.birthDay) : null,
                    gender: this.gender,
                };

                this.$emit('register', user);
            }
        }
    }
</script>

<style scoped>
    .login-form-wrapper{
        width: 700px;
    }
</style>