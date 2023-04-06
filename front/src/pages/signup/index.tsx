import { useEffect, useState } from 'react'
import { loginValidator, passwordValidator, emailValidator } from '../../utils/validators'
import useInput, { generateUseInputSettings } from '../../hooks/useInput'
import axios from 'axios'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { signUp } from '@/apiMethods/user'
import A from '@/components/Link'
import { redirect, useRouter } from 'next/navigation'


export const DELAY = 500;
const loginBlockClasses = `
        text-slate-400 flex items-center 
        text-center whitespace-nowrap mb-4
        before:content-[""]
        before:w-full
        before:h-px
        before:bg-slate-400
        before:mr-2
        after:content-[""]
        after:w-full
        after:h-px
        after:bg-slate-400
        after:ml-2
`
const getFirstError = (err: string[]) => {
    return err.length > 0 ? err[0] : ''
}


export default function () {
    const [formLoading, setFormLoading] = useState<boolean>(false)
    const [serverError, setServerError] = useState<string>('')
    const { push } = useRouter()


    const [
        loginValue,
        loginError,
        loginDirty,
        loginLoading,
        loginHandler
    ] = useInput({
        validators: [ // синхронные валидаторы
            loginValidator
        ],
        asyncValidators: [
            async (value: string) => {
                const { data } = await axios.post<{ userExists: boolean }>('/users/login-exists', { "login": value })
                console.log(data)
                if (data.userExists)
                    return 'Логин занят'
            }
        ],
        lazyInputDelay: DELAY
    })

    const [
        emailValue,
        emailError,
        emailDirty,
        emailLoading,
        emailHandler
    ] = useInput({
        validators: [ // синхронные валидаторы
            emailValidator
        ],
        asyncValidators: [
            async (value: string) => {
                const { data } = await axios.post<{ emailExists: boolean }>('/users/email-exists', { "email": value })
                console.log(data)
                if (data.emailExists)
                    return 'Почта занята'
            }
        ],
        lazyInputDelay: DELAY
    })


    const [
        passwordValue,
        passwordError,
        passwordDirty,
        passwordLoading,
        passwordHandler
    ] = useInput(generateUseInputSettings([passwordValidator], [], DELAY))


    const [
        passwordReapeatValue,
        passwordReapeatError,
        passwordReapeatDirty,
        passwordRepeatLoading,
        passwordReapeatHandler
    ] = useInput(generateUseInputSettings([passwordValidator], [], DELAY))

    const isLoading = loginLoading || emailLoading || formLoading;
    const passwordsEqual = passwordValue === passwordReapeatValue


    const formDirty = loginDirty || emailDirty || passwordDirty || passwordReapeatDirty

    const buttonActive =
        !Boolean(loginError.length)
        && !Boolean(emailError.length)
        && !Boolean(passwordError.length)
        && !Boolean(passwordReapeatError.length)
        && passwordsEqual
        && formDirty

    const submitHandler = async () => {
        setFormLoading(true)
        try {
            const result = await signUp(loginValue, emailValue, passwordValue, passwordReapeatValue)
            setFormLoading(false)
            push('/signin')

        } catch (e) {
            setServerError('Ошибка сервера. Обновите страницу.')
            console.log(e)
            setFormLoading(false)
        }
    }
    return (
        <div className='bg-slate-100 w-full h-screen flex justify-center items-center'>
            <div className=''>
                <h1 className='text-4xl font-bold text-center mb-2'>
                    Регистрация
                </h1>
                <p className='text-center mb-6 text-slate-400'>
                    Создайте аккаунт.
                    <A text=' Уже есть аккаунт?' href='/signin' />
                </p>
                <div className='bg-white rounded-xl shadow py-8 px-10 w-[468px]'>
                    {serverError &&
                        <p className='text-red-500 text-center'>
                            {serverError}
                        </p>}
                    <div className={formLoading ? 'opacity-50 pointer-events-none' : ''}>
                        <Input
                            value={loginValue}
                            onChange={loginHandler}
                            id="login"
                            label="Логин"
                            placeholder='Логин'
                            required
                            errorText={getFirstError(loginError)}
                            invalid={Boolean(loginError.length) && loginDirty}
                            loading={loginLoading}
                            disabled={formLoading}
                        />
                        <Input
                            value={emailValue}
                            onChange={emailHandler}
                            errorText={getFirstError(emailError)}
                            invalid={Boolean(emailError.length) && emailDirty}
                            id="email"
                            label="Почта"
                            placeholder='Почта'
                            required
                            loading={emailLoading}
                            disabled={formLoading}

                        />
                        <Input
                            value={passwordValue}
                            onChange={passwordHandler}
                            errorText={passwordError.join(' ')}
                            invalid={Boolean(passwordError.join(' ')) && passwordDirty}
                            id="password"
                            label="Пароль"
                            placeholder='Пароль'
                            type='password'
                            required
                            disabled={formLoading}

                        />
                        <Input
                            value={passwordReapeatValue}
                            onChange={passwordReapeatHandler}
                            // Выводим только проверку совпадения, чтобы не дублировать ошибки из пароля
                            errorText={!passwordsEqual ? 'Пароли не совпадают' : ''}
                            invalid={(Boolean(passwordReapeatError.join(' ')) || !passwordsEqual) && passwordReapeatDirty}
                            id="repeat-password"
                            label="Повторите пароль"
                            placeholder='Повторите пароль'
                            type='password'

                            disabled={formLoading}

                        />
                    </div>

                    <div className='flex justify-center'>
                        {/* <ReCaptcha
                            onTokenReceived={(t) => console.log(t)}
                            onTokenFailed={() => console.warn('Токен не пришел')}
                            sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY ?? 'InvalidKey'} /> */}
                    </div>
                    <Button className='w-full mt-4 mb-4'
                        disabled={!buttonActive}
                        loading={isLoading}
                        onClick={submitHandler}
                    >
                        Зарегистрироваться
                    </Button>
                    <div className={loginBlockClasses}>
                        Войти с помощью
                    </div>
                    <div className="flex justify-between gap-3">
                        <Button className='border bg-slate-50 hover:bg-slate-100 focus:bg-slate-100 w-full'>
                            <svg className='fill-slate-500' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.073 2H8.937C3.333 2 2 3.333 2 8.927V15.063C2 20.666 3.323 22 8.927 22H15.063C20.666 22 22 20.677 22 15.073V8.937C22 3.333 20.677 2 15.073 2ZM18.146 16.27H16.687C16.135 16.27 15.969 15.823 14.979 14.833C14.115 14 13.75 13.896 13.531 13.896C13.229 13.896 13.146 13.979 13.146 14.396V15.708C13.146 16.063 13.031 16.271 12.104 16.271C11.2043 16.2105 10.3319 15.9372 9.5586 15.4735C8.78527 15.0098 8.13317 14.3691 7.656 13.604C6.52317 12.194 5.73494 10.5391 5.354 8.771C5.354 8.552 5.437 8.354 5.854 8.354H7.312C7.687 8.354 7.822 8.521 7.969 8.906C8.677 10.99 9.885 12.802 10.375 12.802C10.563 12.802 10.645 12.719 10.645 12.25V10.104C10.583 9.125 10.063 9.042 10.063 8.688C10.0697 8.59463 10.1125 8.50753 10.1823 8.44518C10.2521 8.38283 10.3435 8.35012 10.437 8.354H12.729C13.042 8.354 13.146 8.51 13.146 8.885V11.781C13.146 12.094 13.281 12.198 13.375 12.198C13.563 12.198 13.708 12.094 14.052 11.75C14.7909 10.8489 15.3945 9.84508 15.844 8.77C15.8899 8.64086 15.9769 8.5303 16.0915 8.45519C16.2062 8.38008 16.3423 8.34454 16.479 8.354H17.938C18.375 8.354 18.468 8.573 18.375 8.885C17.8445 10.0734 17.1881 11.2015 16.417 12.25C16.26 12.49 16.197 12.615 16.417 12.896C16.562 13.115 17.073 13.542 17.417 13.948C17.9169 14.4466 18.332 15.0236 18.646 15.656C18.771 16.062 18.562 16.27 18.146 16.27Z" />
                            </svg>
                        </Button>
                        <Button className='border bg-slate-50 hover:bg-slate-100 focus:bg-slate-100 w-full'>
                            <svg className='fill-slate-500' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.064 7.51C3.89601 5.85324 5.17237 4.46051 6.75043 3.48747C8.32849 2.51443 10.1461 1.99942 12 2C14.695 2 16.959 2.99 18.69 4.605L15.823 7.473C14.786 6.482 13.468 5.977 12 5.977C9.395 5.977 7.19 7.737 6.405 10.1C6.205 10.7 6.091 11.34 6.091 12C6.091 12.66 6.205 13.3 6.405 13.9C7.191 16.264 9.395 18.023 12 18.023C13.345 18.023 14.49 17.668 15.386 17.068C15.9054 16.726 16.3501 16.2822 16.6932 15.7635C17.0363 15.2448 17.2706 14.6619 17.382 14.05H12V10.182H21.418C21.536 10.836 21.6 11.518 21.6 12.227C21.6 15.273 20.51 17.837 18.618 19.577C16.964 21.105 14.7 22 12 22C10.6866 22.0005 9.38604 21.7422 8.17254 21.2399C6.95905 20.7375 5.85645 20.0009 4.92776 19.0722C3.99907 18.1436 3.2625 17.041 2.76013 15.8275C2.25777 14.614 1.99948 13.3134 2 12C2 10.386 2.386 8.86 3.064 7.51Z" />
                            </svg>
                        </Button>
                        <Button className='border bg-slate-50 hover:bg-slate-100 focus:bg-slate-100 w-full'>
                            <svg className='fill-slate-500' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 16.84 5.44 20.87 10 21.8V15H8V12H10V9.5C10 7.57 11.57 6 13.5 6H16V9H14C13.45 9 13 9.45 13 10V12H16V15H13V21.95C18.05 21.45 22 17.19 22 12Z" />
                            </svg>
                        </Button>
                    </div>
                </div>

            </div>

        </div>
    )
}