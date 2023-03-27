import React, { useState } from 'react'


export default function useInput(validator: (value: string) => string): [
    value: string,
    error: string,
    dirty: boolean,
    handler: React.ChangeEventHandler<HTMLInputElement>
] {
    const [value, setValue] = useState('')
    const [error, setError] = useState('Поле пустое')
    const [dirty, setDirty] = useState(false)
    

    const handler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
        setError(validator(e.target.value))
        setDirty(true)
    }


    return [value, error, dirty, handler];

}