import { useEffect } from 'react'
import './PayPalDonateButton.css'

interface PayPalDonateButtonProps {
    donateText: string
}

declare global {
    interface Window {
        PayPal?: {
            Donation: {
                Button: (config: {
                    env: string
                    hosted_button_id: string
                    image: {
                        src: string
                        alt: string
                        title: string
                    }
                }) => {
                    render: (selector: string) => void
                }
            }
        }
    }
}

export default function PayPalDonateButton({ donateText }: PayPalDonateButtonProps) {
    useEffect(() => {
        const existingScript = document.getElementById('paypal-donate-sdk')
        if (existingScript) {
            document.body.removeChild(existingScript)
        }

        const script = document.createElement('script')
        script.id = 'paypal-donate-sdk'
        script.src = 'https://www.paypalobjects.com/donate/sdk/donate-sdk.js'
        script.charset = 'UTF-8'
        script.async = true

        script.onload = () => {
            if (window.PayPal?.Donation) {
                const container = document.getElementById('donate-button')
                if (container) {
                    container.innerHTML = ''
                }

                window.PayPal.Donation.Button({
                    env: 'production',
                    hosted_button_id: 'YT33LTPVK7RDY',
                    image: {
                        src: 'https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif',
                        alt: 'Donate with PayPal button',
                        title: 'PayPal - The safer, easier way to pay online!',
                    }
                }).render('#donate-button')
            }
        }

        document.body.appendChild(script)

        return () => {
            const existingScript = document.getElementById('paypal-donate-sdk')
            if (existingScript) {
                document.body.removeChild(existingScript)
            }
            const container = document.getElementById('donate-button')
            if (container) {
                container.innerHTML = ''
            }
        }
    }, [])

    return (
        <div className="footer-donate">
            <span className="footer-donate-text">{donateText}</span>
            <div id="donate-button"></div>
        </div>
    )
}
