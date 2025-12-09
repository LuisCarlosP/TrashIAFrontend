import { useState, useRef, useCallback } from 'react';

interface UseCameraOptions {
    onError?: (message: string) => void;
}

interface UseCameraReturn {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    isActive: boolean;
    start: () => Promise<void>;
    stop: () => void;
    capture: () => File | null;
}

export function useCamera({ onError }: UseCameraOptions = {}): UseCameraReturn {
    const [isActive, setIsActive] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const start = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });

            setIsActive(true);

            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    streamRef.current = stream;
                }
            }, 100);
        } catch (err) {
            console.error('Error accessing camera:', err);
            onError?.('Camera access denied or not available');
            setIsActive(false);
        }
    }, [onError]);

    const stop = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsActive(false);
    }, []);

    const capture = useCallback((): File | null => {
        if (!videoRef.current || videoRef.current.videoWidth === 0) {
            onError?.('Camera not ready');
            return null;
        }

        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) return null;

        ctx.drawImage(videoRef.current, 0, 0);

        // Convert to blob synchronously using toDataURL
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        const byteString = atob(dataUrl.split(',')[1]);
        const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);

        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([ab], { type: mimeString });
        const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });

        stop();
        return file;
    }, [onError, stop]);

    return {
        videoRef,
        isActive,
        start,
        stop,
        capture
    };
}
