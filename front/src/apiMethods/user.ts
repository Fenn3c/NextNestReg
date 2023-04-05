import axios from 'axios'

export const register = async (
    login: string,
    email: string,
    password: string,
    passwordConfirmation: string
) => {
    return await axios.post('/users/create', { login, email, password, passwordConfirmation })
}


export const login = async (
    email: string,
    password: string
) => {
    return await axios.post<{accessToken: string}>('/users/login', { email, password })
}