import React, { useEffect } from 'react'
declare global {
    interface Window {
        grecaptcha: any
    }
}

type Props = {
    sitekey: string
    onTokenReceived?: (token: string) => void
    onTokenFailed?: () => void
}

export default function ReCaptcha({ sitekey, onTokenReceived, onTokenFailed }: Props) {
    
    useEffect(() => {
        const handleLoaded = () => {
            window.grecaptcha.ready(() => {
                window.grecaptcha
                    .execute(sitekey, { action: "homepage" })
                    .then((token: string) => {
                        onTokenReceived && onTokenReceived(token)
                    })
                    .catch((err: Error) => {
                        onTokenFailed && onTokenFailed()
                    })
            })
        }
        // Add reCaptcha
        const script = document.createElement("script")
        script.src = `https://www.google.com/recaptcha/api.js?render=${sitekey}`
        script.addEventListener("load", handleLoaded)
        document.body.appendChild(script)
    }, [onTokenFailed, onTokenReceived, sitekey])

    return (
        <div
            className="g-recaptcha"
            data-sitekey={sitekey}
            data-size="invisible"
        ></div>
    )

}