import axios from "axios";
const API_URL = process.env.VUE_APP_API_SERVER;

class AuthService{
    login(user) {
        return axios.post(API_URL + 'auth/login', {
            username: user.login,
            password: user.password
        }).then(response => {
            if (response.data.accessToken) {
                localStorage.setItem('user', JSON.stringify(response.data))
            }

            return response.data
        })
    }

    logout() {
        localStorage.removeItem('user')
    }

    register(user) {
        return axios.post(API_URL + 'auth/signup', {
            email: user.email,
            nick: user.nick,
            password: user.password,
            birth_day: user.birth_day,
            gender: user.gender
        })
    }
}

export default new AuthService()
