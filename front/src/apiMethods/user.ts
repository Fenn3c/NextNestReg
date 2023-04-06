import axios from 'axios'

export const signUp = async (
    login: string,
    email: string,
    password: string,
    passwordConfirmation: string
) => {
    return await axios.post('/users/create', { login, email, password, passwordConfirmation })
}


export const signIn = async (
    email: string,
    password: string
) => {
    return await axios.post<{accessToken: string}>('/auth/signin', { email, password })
}