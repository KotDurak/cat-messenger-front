<template>
    <div class="form-wrapper">
            <h3>Регистрация</h3>
            <p v-if="authError.length > 1" class="text-danger auth-error">{{authError}}</p>
            <Form @submit="registerUser" :validation-schema="schema">
                <div class="row">
                    <div class="col-md-6 mb-4">

                        <div class="form-outline">
                            <Field v-model="nick" name="nick" type="text" id="firstName" class="form-control form-control-lg"/>
                            <label class="form-label" for="firstName">Ник</label>
                            <ErrorMessage class="text-danger" name="nick"/>
                        </div>

                    </div>
                    <div class="col-md-6 mb-4">

                        <div class="form-outline">
                            <Field v-model="email" name="email" type="text" id="lastName" class="form-control form-control-lg"/>
                            <label class="form-label" for="lastName">Email</label>
                            <ErrorMessage name="email" class="text-danger"/>
                        </div>

                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6 mb-4">

                        <div class="form-outline">
                            <Field v-model="password"  name="password" type="password" id="password" class="form-control form-control-lg"/>
                            <label class="form-label" for="firstName">Пароль</label>
                            <ErrorMessage name="password" class="text-danger"/>
                        </div>

                    </div>
                    <div class="col-md-6 mb-4">

                        <div class="form-outline">
                            <Field v-model="passwordConfirm" name="passwordConfirm" type="password" id="confirm_password" class="form-control form-control-lg"/>
                            <label class="form-label" for="lastName">Подтвердите пароль</label>
                            <ErrorMessage name="passwordConfirm" class="text-danger"/>
                        </div>

                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6 mb-4 d-flex align-items-center">

                        <div class="form-outline datepicker w-100">
                            <input v-model="birthDay" class="form-control form-control-lg" type="date"/>
                            <label class="form-label">Дата рождения</label>
                        </div>

                    </div>
                    <div class="col-md-6 mb-4">

                        <h6 class="mb-2 pb-1">Пол: </h6>

                        <div class="form-check form-check-inline">
                            <input v-model="gender" class="form-check-input" type="radio" name="inlineRadioOptions" id="maleGender"
                                   value="1"/>
                            <label class="form-check-label" for="maleGender">Мужской</label>
                        </div>

                        <div class="form-check form-check-inline">
                            <input  v-model="gender" class="form-check-input" type="radio" name="inlineRadioOptions" id="femaleGender"
                                   value="2"/>
                            <label class="form-check-label" for="femaleGender">Женский</label>
                        </div>

                        <div class="form-check form-check-inline">
                            <input v-model="gender" class="form-check-input" type="radio" name="inlineRadioOptions" id="otherGender"
                                   value="0"/>
                            <label class="form-check-label" for="otherGender">Другое</label>
                        </div>

                    </div>
                </div>

                <div class="mt-4 pt-2">
                    <input class="btn btn-primary btn-lg" type="submit" value="Регистрация"/>
                </div>

            </Form>
    </div>
</template>

<script>
    import useRegister from "@/hooks/useRegister";
    import {Form, Field, ErrorMessage} from 'vee-validate'
    import * as yup from 'yup'
    import {mapGetters} from 'vuex'
    export default {
        components: {
            Form,
            Field,
            ErrorMessage,
        },
        data() {
            const schema = yup.object({
                nick:yup.string().required('Заполните ник').min(5, 'Минимум 5 символов'),
                email: yup.string().required('Зполните email').email('Email не валиден'),
                password: yup.string().required('Заполните пароль').min(6, 'Минимум 6 символов'),
                passwordConfirm: yup.string().required().oneOf([yup.ref('password')], 'Пароли не совпадают')
            })

            return {
                schema,
            }
        },
        methods: {
            registerUser() {
                const user = {
                    email: this.email,
                    password: this.password,
                    passwordConfirm: this.passwordConfirm,
                    nick: this.nick,
                    birth_day: this.birthDay ? new Date(this.birthDay) : null,
                    gender: this.gender,
                };

                this.$emit('register', user);
            },
        },
        computed: {
          ...mapGetters({
              authError: 'auth/getAuthError'
          })
        },
        setup(props) {
            const {
                nick,
                email,
                password,
                passwordConfirm,
                birthDay,
                gender,
                errors
            } = useRegister()

            return {
                nick,
                email,
                password,
                passwordConfirm,
                birthDay,
                gender,
                errors
            }
        }
    }
</script>

<style scoped>

</style>