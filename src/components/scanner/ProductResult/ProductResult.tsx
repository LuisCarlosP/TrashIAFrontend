import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRecycle } from '@fortawesome/free-solid-svg-icons'
import type { ProductInfo } from '../../../services/barcode'
import './ProductResult.css'

interface ProductResultProps {
    product: ProductInfo
    onScanAgain: () => void
    translations: {
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
}

export default function ProductResult({ product, onScanAgain, translations }: ProductResultProps) {
    const getBinText = (info: { bin: string | null, bin_type?: string }) => {
        if (info.bin_type) {
            switch (info.bin_type) {
                case 'yellow': return translations.yellowBin;
                case 'green': return translations.greenBin;
                case 'blue': return translations.blueBin;
                case 'unknown': return translations.unknownBin;
            }
        }
        return info.bin;
    }

    const getTipText = (info: { tip: string, bin_type?: string }) => {
        if (info.bin_type) {
            switch (info.bin_type) {
                case 'yellow': return translations.yellowTip;
                case 'green': return translations.greenTip;
                case 'blue': return translations.blueTip;
                case 'unknown': return translations.unknownTip;
            }
        }
        return info.tip;
    }

    const getMaterialText = (material: string) => {
        if (material === 'Recyclable Material') return translations.recyclableMaterial;
        if (material === 'Unknown') return translations.unknownMaterial;
        return material;
    }

    return (
        <div className="product-result">
            <div className="product-header">
                {product.image_url && (
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className="product-image"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none'
                        }}
                    />
                )}
                <div className="product-info">
                    <h2>{product.name}</h2>
                    {product.brand && <p className="product-brand">{product.brand}</p>}
                    <p className="product-barcode">{product.barcode}</p>
                </div>
            </div>

            {product.recycling_info.length > 0 && (
                <div className="recycling-section">
                    <h3>
                        <FontAwesomeIcon icon={faRecycle} />
                        {translations.recyclingInfo}
                    </h3>
                    <div className="recycling-items">
                        {product.recycling_info.map((info, index) => {
                            const binText = getBinText(info);
                            const tipText = getTipText(info);
                            const materialText = getMaterialText(info.material);

                            return (
                                <div
                                    key={index}
                                    className={`recycling-item ${(!info.bin || info.recyclable === null) ? 'unknown' : ''}`}
                                >
                                    <div className="recycling-material">
                                        <span className="material-name">{materialText}</span>
                                        {binText && (
                                            <span className="bin-badge">
                                                {binText}
                                            </span>
                                        )}
                                    </div>
                                    <p className="recycling-tip">{tipText}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            <button className="btn-scan-again" onClick={onScanAgain}>
                <FontAwesomeIcon icon={faRecycle} />
                {translations.scanAgain}
            </button>
        </div>
    )
}
