export interface RecyclingInfo {
    material: string;
    recyclable: boolean | null;
    bin: string | null;
    tip: string;
}

export interface ProductInfo {
    found: boolean;
    barcode: string;
    name: string;
    brand: string;
    image_url: string | null;
    packaging: string;
    categories: string;
    recycling_info: RecyclingInfo[];
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const fetchProductByBarcode = async (
    barcode: string,
    lang: string = 'es'
): Promise<ProductInfo> => {
    const response = await fetch(`${API_URL}/barcode/${barcode}?lang=${lang}`);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Producto no encontrado');
    }

    return response.json();
};
