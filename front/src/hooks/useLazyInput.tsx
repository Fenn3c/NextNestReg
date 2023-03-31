import react, { useEffect } from 'react'


export function useLazyInput({
    callback,
    delay = 300,
    dependenciesArray = [],
}: {
    callback: () => void,
    dependenciesArray?: any[],
    delay?: number
}) {

    useEffect(() => {
        const timeout = setTimeout(() => {
            callback()
        }, delay)
        return () => {
            if (timeout)
                clearTimeout(timeout)
        }
    }, [...dependenciesArray])

}