import React, { useEffect, useState } from 'react'

type UseInputSettings = {
    validators: ((value: string) => string | undefined)[],
    asyncValidators: ((value: string) => Promise<string | undefined>)[],
    lazyInputDelay?: number
    
}
export const generateUseInputSettings = (
    validators?: UseInputSettings['validators'], 
    asyncValidators?: UseInputSettings['asyncValidators'], 
    lazyInputDelay?: UseInputSettings['lazyInputDelay']
    ): UseInputSettings => ({
    validators: validators ?? [],
    asyncValidators: asyncValidators ?? [],
    lazyInputDelay: lazyInputDelay ?? 200
})

export default function useInput(
    {
        validators,
        asyncValidators,
        lazyInputDelay
    }: UseInputSettings
): [
        value: string,
        errors: string[],
        dirty: boolean,
        loading: boolean,
        handler: React.ChangeEventHandler<HTMLInputElement>
    ] {
    const [value, setValue] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [errors, setErrors] = useState<string[]>([])
    const [dirty, setDirty] = useState<boolean>(false)


    const validate = (value: string): string[] => {
        const validationErrors: string[] = []
        validators.forEach(validator => {
            const validationError = validator(value)
            if (validationError)
                validationErrors.push(validationError)
        });
        return validationErrors
    }



    const handler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
        setDirty(true)
        const validationErrors = validate(e.target.value)
        if (validationErrors.length) {
            setErrors(validationErrors)
        } else {
            setErrors([])
        }
    }

    useEffect(() => {
        if (!asyncValidators.length) return
        if (errors.length) return
        if (!dirty) return

        setLoading(true)
        const asyncValidate = async (value: string): Promise<string[]> => {
            const validationErrors: string[] = []
            await Promise.all(asyncValidators.map(asyncValidator => asyncValidator(value))).then(
                validations => {
                    const filteredValidations = validations.filter(item => typeof item !== 'undefined') as string[]
                    validationErrors.push(...filteredValidations)
                }
            ).catch(e => {
                validationErrors.push(e.message)
            })
            return validationErrors
        }


        const timeout = setTimeout(async () => {
            const asyncValidationErrors = await asyncValidate(value)
            if (asyncValidationErrors.length) {
                setErrors(asyncValidationErrors)
                setLoading(false)
                return
            }
            setErrors([])
            setLoading(false)
        }, lazyInputDelay)

        return () => {
            clearTimeout(timeout)
            setLoading(false)
        }

    }, [value, errors, asyncValidators, lazyInputDelay, dirty])


    return [value, errors, dirty, loading, handler];

}