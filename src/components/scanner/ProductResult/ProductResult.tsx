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
    }
}

export default function ProductResult({ product, onScanAgain, translations }: ProductResultProps) {
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
                        {product.recycling_info.map((info, index) => (
                            <div
                                key={index}
                                className={`recycling-item ${(!info.bin || info.recyclable === null) ? 'unknown' : ''}`}
                            >
                                <div className="recycling-material">
                                    <span className="material-name">{info.material}</span>
                                    {info.bin && (
                                        <span className="bin-badge">
                                            {translations.recyclableBin} {info.bin}
                                        </span>
                                    )}
                                </div>
                                <p className="recycling-tip">{info.tip}</p>
                            </div>
                        ))}
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
