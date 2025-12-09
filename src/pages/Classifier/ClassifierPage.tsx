import { useState, useRef, useEffect, type DragEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRecycle, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import {
  predictImage,
  type PredictionResponse,
  createChatSession,
  sendChatMessage,
  type ChatSession
} from '../../services/Classifier';
import { saveClassification } from '../../services/history';
import {
  UploadSection,
  CameraSection,
  PredictionCard,
  ChatSection,
  Loading,
  ErrorMessage
} from '../../components';
import type { Language } from '../../translations';
import './ClassifierPage.css';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

interface ClassifierPageProps {
  language: Language;
  t: {
    // Upload Section
    dragImageHere: string;
    orClickToSelect: string;
    fileRequirements: string;
    selectImage: string;
    takePhoto: string;
    // Camera Section
    cameraActive: string;
    cameraInfo: string;
    capturePhoto: string;
    cancel: string;
    // Analyze Section
    imageLoaded: string;
    analyzeWaste: string;
    analyzing: string;
    // Results
    confidence: string;
    recyclable: string;
    notRecyclable: string;
    materialInfo: string;
    recyclingTips: string;
    analyzeAnother: string;
    // Material Classes
    cardboard: string;
    glass: string;
    metal: string;
    paper: string;
    plastic: string;
    trash: string;
    // Material Messages
    cardboardMessage: string;
    glassMessage: string;
    metalMessage: string;
    paperMessage: string;
    plasticMessage: string;
    trashMessage: string;
    // Recycling Advice
    cardboardAdvice: string;
    glassAdvice: string;
    metalAdvice: string;
    paperAdvice: string;
    plasticAdvice: string;
    trashAdvice: string;
    notRecyclableAdvice: string;
    defaultAdvice: string;
    // Errors
    invalidFileFormat: string;
    formatNotAllowed: string;
    fileTooLarge: string;
    cameraAccessError: string;
    cameraNotReady: string;
    unknownError: string;
    // Chat
    askQuestion: string;
    chatTitle: string;
    chatPlaceholder: string;
    chatLoading: string;
    chatError: string;
  };
}

export default function ClassifierPage({ language, t }: ClassifierPageProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Chat states
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatMessages.length > 0 || chatLoading) {
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [chatMessages, chatLoading]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!validateFile(file)) return;
      displayImagePreview(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (!validateFile(file)) return;
      displayImagePreview(file);
    } else {
      setError(t.invalidFileFormat);
    }
  };

  const validateFile = (file: File): boolean => {
    if (!file.type.startsWith('image/')) {
      setError(t.formatNotAllowed);
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(`${t.fileTooLarge} ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      return false;
    }

    return true;
  };

  const displayImagePreview = (file: File) => {
    setImageFile(file);
    setError(null);
    setPrediction(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!imageFile) return;

    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const result = await predictImage(imageFile, language);
      setPrediction(result);
      setLoading(false);

      // Guardar en historial
      await saveClassification(
        result.class,
        result.confidence,
        result.is_recyclable,
        imageFile
      );

      await initializeChatSession(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.unknownError);
      setLoading(false);
    }
  };

  const initializeChatSession = async (predictionData: PredictionResponse) => {
    try {
      const session = await createChatSession({
        material_type: predictionData.class,
        is_recyclable: predictionData.is_recyclable,
        material_info: predictionData.message,
        language: language
      });

      setChatSession(session);
      setChatMessages([{
        role: 'assistant',
        content: session.message
      }]);
    } catch (err) {
      console.error('Error creating chat session:', err);
    }
  };

  const handleToggleChat = async () => {
    if (!showChat && !chatSession && prediction) {
      setChatLoading(true);
      try {
        const session = await createChatSession({
          material_type: prediction.class,
          is_recyclable: prediction.is_recyclable,
          material_info: prediction.message,
          language: language
        });

        setChatSession(session);
        setChatMessages([{
          role: 'assistant',
          content: session.message
        }]);
      } catch (err) {
        console.error('Error creating chat session:', err);
      } finally {
        setChatLoading(false);
      }
    }
    setShowChat(!showChat);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !chatSession || chatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setChatLoading(true);

    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await sendChatMessage({
        session_id: chatSession.session_id,
        message: userMessage
      });

      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: response.response
      }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.chatError);
    } finally {
      setChatLoading(false);
    }
  };

  const handleChatKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      setShowCamera(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
      }, 100);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError(t.cameraAccessError);
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && videoRef.current.videoWidth > 0) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
            stopCamera();
            displayImagePreview(file);
          }
        }, 'image/jpeg', 0.95);
      }
    } else {
      setError(t.cameraNotReady);
    }
  };

  const reset = () => {
    setSelectedImage(null);
    setImageFile(null);
    setPrediction(null);
    setError(null);
    setChatSession(null);
    setChatMessages([]);
    setShowChat(false);
    stopCamera();
  };

  const getClassName = (className: string): string => {
    const classTranslations: Record<string, keyof typeof t> = {
      'cardboard': 'cardboard',
      'glass': 'glass',
      'metal': 'metal',
      'paper': 'paper',
      'plastic': 'plastic',
      'trash': 'trash'
    };
    const key = classTranslations[className];
    return key ? t[key] : className;
  };

  const getMaterialMessage = (className: string): string => {
    const messageKeys: Record<string, keyof typeof t> = {
      'cardboard': 'cardboardMessage',
      'glass': 'glassMessage',
      'metal': 'metalMessage',
      'paper': 'paperMessage',
      'plastic': 'plasticMessage',
      'trash': 'trashMessage'
    };
    const key = messageKeys[className];
    return key ? t[key] : '';
  };

  const getRecyclingAdvice = (className: string, isRecyclable: boolean): string => {
    const adviceKeys: Record<string, keyof typeof t> = {
      'cardboard': 'cardboardAdvice',
      'glass': 'glassAdvice',
      'metal': 'metalAdvice',
      'paper': 'paperAdvice',
      'plastic': 'plasticAdvice',
      'trash': 'trashAdvice'
    };

    if (!isRecyclable) {
      return t.notRecyclableAdvice;
    }

    const key = adviceKeys[className];
    return key ? t[key] : t.defaultAdvice;
  };

  return (
    <div className="classifier-page">
      <main className="classifier-content">
        {!selectedImage && !showCamera && (
          <UploadSection
            isDragging={isDragging}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onFileSelect={handleImageSelect}
            onStartCamera={startCamera}
            translations={{
              dragImageHere: t.dragImageHere,
              orClickToSelect: t.orClickToSelect,
              fileRequirements: t.fileRequirements,
              selectImage: t.selectImage,
              takePhoto: t.takePhoto
            }}
          />
        )}

        {showCamera && (
          <CameraSection
            videoRef={videoRef}
            onCapture={capturePhoto}
            onStop={stopCamera}
            translations={{
              cameraActive: t.cameraActive,
              cameraInfo: t.cameraInfo,
              capturePhoto: t.capturePhoto,
              cancel: t.cancel
            }}
          />
        )}

        {/* Loading state - full page centered like map */}
        {selectedImage && loading && !prediction && (
          <div className="loading-container">
            <Loading message={t.analyzing} />
          </div>
        )}

        {selectedImage && !loading && (
          <div className={`results-section ${showChat ? 'chat-active' : ''}`}>
            {!showChat && (
              <div className="image-preview">
                <img src={selectedImage} alt="Imagen seleccionada" />
              </div>
            )}

            {!prediction && !showChat && (
              <div className="analyze-section">
                <p className="analyze-instruction">{t.imageLoaded}</p>
                <button className="btn btn-analyze" onClick={analyzeImage}>
                  <FontAwesomeIcon icon={faRecycle} />
                  {t.analyzeWaste}
                </button>
              </div>
            )}

            {error && <ErrorMessage message={error} />}

            {prediction && !showChat && (
              <PredictionCard
                prediction={prediction}
                getClassName={getClassName}
                getMaterialMessage={getMaterialMessage}
                getRecyclingAdvice={getRecyclingAdvice}
                translations={{
                  confidence: t.confidence,
                  recyclable: t.recyclable,
                  notRecyclable: t.notRecyclable,
                  materialInfo: t.materialInfo,
                  recyclingTips: t.recyclingTips
                }}
              />
            )}

            {prediction && (
              <ChatSection
                showChat={showChat}
                chatMessages={chatMessages}
                chatInput={chatInput}
                chatLoading={chatLoading}
                chatEndRef={chatEndRef}
                onToggleChat={handleToggleChat}
                onInputChange={setChatInput}
                onSendMessage={handleSendMessage}
                onKeyPress={handleChatKeyPress}
                translations={{
                  askQuestion: t.askQuestion,
                  chatTitle: t.chatTitle,
                  chatPlaceholder: t.chatPlaceholder,
                  chatLoading: t.chatLoading
                }}
              />
            )}

            <button className="btn btn-reset" onClick={reset}>
              <FontAwesomeIcon icon={faRotateRight} />
              {t.analyzeAnother}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
