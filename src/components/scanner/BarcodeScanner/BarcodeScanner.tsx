import { useEffect, useRef, useCallback } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import './BarcodeScanner.css'

interface BarcodeScannerProps {
    onScan: (code: string) => void
    onError: (error: string) => void
    isScanning: boolean
}

export default function BarcodeScanner({ onScan, onError, isScanning }: BarcodeScannerProps) {
    const scannerRef = useRef<Html5Qrcode | null>(null)
    const mountedRef = useRef(true)

    const stopScanner = useCallback(async () => {
        try {
            if (scannerRef.current && scannerRef.current.isScanning) {
                await scannerRef.current.stop()
            }
        } catch {
        }
    }, [])

    useEffect(() => {
        mountedRef.current = true
        scannerRef.current = new Html5Qrcode('barcode-scanner')

        return () => {
            mountedRef.current = false
            stopScanner()
        }
    }, [stopScanner])

    useEffect(() => {
        if (!scannerRef.current) return

        const startScanner = async () => {
            try {
                if (scannerRef.current?.isScanning) {
                    await scannerRef.current.stop()
                }

                await scannerRef.current?.start(
                    { facingMode: 'environment' },
                    {
                        fps: 10,
                        qrbox: (viewfinderWidth, viewfinderHeight) => {
                            const minEdge = Math.min(viewfinderWidth, viewfinderHeight)
                            return {
                                width: Math.floor(minEdge * 0.8),
                                height: Math.floor(minEdge * 0.4)
                            }
                        },
                    },
                    (decodedText) => {
                        if (mountedRef.current) {
                            stopScanner()
                            onScan(decodedText)
                        }
                    },
                    () => { }
                )
            } catch (err) {
                if (mountedRef.current) {
                    onError(err instanceof Error ? err.message : 'Error al acceder a la cámara')
                }
            }
        }

        if (isScanning) {
            startScanner()
        } else {
            stopScanner()
        }
    }, [isScanning, onScan, onError, stopScanner])

    return (
        <div className="scanner-video-container">
            <div id="barcode-scanner" />
        </div>
    )
}
