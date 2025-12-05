import { useState, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faBarcode,
    faSpinner,
    faStop,
    faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons'
import { BarcodeScanner, ProductResult } from '../../components/scanner'
import { fetchProductByBarcode, type ProductInfo } from '../../services/barcode'
import './ScannerPage.css'

interface ScannerPageProps {
    t: {
        scannerTitle: string
        scannerSubtitle: string
        startScan: string
        stopScan: string
        scanning: string
        loading: string
        productNotFound: string
        cameraError: string
        recyclingInfo: string
        scanAgain: string
        recyclableBin: string
        recyclableMaterial: string
        unknownMaterial: string
        yellowBin: string
        greenBin: string
        blueBin: string
        unknownBin: string
        yellowTip: string
        greenTip: string
        blueTip: string
        unknownTip: string
    }
    lang: string
}

export default function ScannerPage({ t }: ScannerPageProps) {
    const [isScanning, setIsScanning] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [product, setProduct] = useState<ProductInfo | null>(null)

    const handleScan = useCallback(async (code: string) => {
        setIsScanning(false)
        setIsLoading(true)
        setError(null)

        try {
            const productData = await fetchProductByBarcode(code)
            setProduct(productData)
        } catch (err) {
            setError(err instanceof Error ? err.message : t.productNotFound)
        } finally {
            setIsLoading(false)
        }
    }, [t.productNotFound])

    const handleError = useCallback((errorMessage: string) => {
        setIsScanning(false)
        setError(errorMessage || t.cameraError)
    }, [t.cameraError])

    const handleScanAgain = () => {
        setProduct(null)
        setError(null)
        setIsScanning(true)
    }

    const toggleScanning = () => {
        if (isScanning) {
            setIsScanning(false)
        } else {
            setProduct(null)
            setError(null)
            setIsScanning(true)
        }
    }

    return (
        <div className="scanner-page">
            <div className="scanner-content">
                <header className="scanner-header">
                    <h1>{t.scannerTitle}</h1>
                    <p>{t.scannerSubtitle}</p>
                </header>

                {!product && (
                    <div className="scanner-container">
                        <BarcodeScanner
                            onScan={handleScan}
                            onError={handleError}
                            isScanning={isScanning}
                        />

                        <div className="scanner-controls">
                            <button
                                className={`btn-scan ${isScanning ? 'scanning' : ''}`}
                                onClick={toggleScanning}
                                disabled={isLoading}
                            >
                                <FontAwesomeIcon icon={isScanning ? faStop : faBarcode} />
                                {isScanning ? t.stopScan : t.startScan}
                            </button>
                        </div>

                        {isLoading && (
                            <div className="scanner-loading">
                                <FontAwesomeIcon icon={faSpinner} spin className="spinner" />
                                <p>{t.loading}</p>
                            </div>
                        )}

                        {error && (
                            <div className="scanner-error">
                                <FontAwesomeIcon icon={faExclamationTriangle} className="error-icon" />
                                <p>{error}</p>
                            </div>
                        )}
                    </div>
                )}

                {product && (
                    <ProductResult
                        product={product}
                        onScanAgain={handleScanAgain}
                        translations={t}
                    />
                )}
            </div>
        </div>
    )
}
