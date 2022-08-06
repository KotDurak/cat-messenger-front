import {ref} from 'vue'

export default function useRegister() {
    const email = ref('')
    const password = ref('')
    const passwordConfirm = ref('')
    const nick = ref('')
    const gender = ref('')
    const birthDay = ref('')
    const errors = ref([])


    return {
        email,
        password,
        passwordConfirm,
        nick,
        gender,
        birthDay
    }
}