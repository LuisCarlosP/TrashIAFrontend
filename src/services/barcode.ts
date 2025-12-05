export interface RecyclingInfo {
    material: string;
    recyclable: boolean | null;
    bin: string | null;
    tip: string;
    bin_type?: string;
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
const API_KEY = import.meta.env.VITE_API_KEY || '';

export const fetchProductByBarcode = async (
    barcode: string
): Promise<ProductInfo> => {
    const response = await fetch(`${API_URL}/barcode/${barcode}`, {
        headers: {
            'X-API-Key': API_KEY,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Producto no encontrado');
    }

    return response.json();
};
