import getNoun from "./getNoun"

export const emptyValidator = (value: string) => {
    if (value) {
        return ''
    } else {
        return 'Пустое поле'
    }
}

export const minMaxValidator = (value: string, min: number, max?: number) => {
    if (value.length < min)
        return `Минимально ${min} ${getNoun(min, 'символ', 'символа', 'символов')}`
    if (max && value.length > max)
        return `Максимально ${max} ${getNoun(min, 'символ', 'символа', 'символов')}`
}

export const loginValidator = (value: string) => {
    const minMaxValid = minMaxValidator(value, 5, 16)
    if (minMaxValid)
        return minMaxValid

    return emptyValidator(value)
}

export const passwordValidator = (value: string) => {
    if (!value.match(/(?=.*[0-9])/))
        return 'Пароль должен содержать цифры'

    if (!value.match(/(?=.*[a-z])/))
        return 'Пароль должен содержать строчные буквы'

    if (!value.match(/(?=.*[A-Z])/))
        return 'Пароль должен содержать заглавные буквы'

    if (!value.match(/(?=.*[!@#$%^&*])/))
        return 'Пароль должен содержать символы'


    const minMaxValid = minMaxValidator(value, 8, 32)
    if (minMaxValid)
        return minMaxValid

    return emptyValidator(value)
}


export const emailValidator = (value: string) => {
    if (!value
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ))
        return 'Неверный формат почты'

    const minMaxValid = minMaxValidator(value, 5, 32)
    if (minMaxValid)
        return minMaxValid

    return emptyValidator(value)
}