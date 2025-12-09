import { useState, useRef, useEffect, useCallback } from 'react';
import {
    createChatSession,
    sendChatMessage,
    type ChatSession
} from '../services/Classifier';
import type { Language } from '../translations';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatContext {
    material_type: string;
    is_recyclable: boolean;
    material_info: string;
}

interface UseChatSessionOptions {
    language: Language;
    onError?: (message: string) => void;
}

interface UseChatSessionReturn {
    session: ChatSession | null;
    messages: ChatMessage[];
    input: string;
    isLoading: boolean;
    isVisible: boolean;
    chatEndRef: React.RefObject<HTMLDivElement | null>;
    setInput: (value: string) => void;
    setVisible: (visible: boolean) => void;
    initializeSession: (context?: ChatContext) => Promise<void>;
    sendMessage: () => Promise<void>;
    handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    reset: () => void;
}

export function useChatSession({ language, onError }: UseChatSessionOptions): UseChatSessionReturn {
    const [session, setSession] = useState<ChatSession | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll when messages change
    useEffect(() => {
        if (messages.length > 0 || isLoading) {
            setTimeout(() => {
                chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }
    }, [messages, isLoading]);

    const initializeSession = useCallback(async (context?: ChatContext) => {
        setIsLoading(true);
        try {
            const sessionData = await createChatSession({
                material_type: context?.material_type || 'general',
                is_recyclable: context?.is_recyclable ?? true,
                material_info: context?.material_info || '',
                language: language
            });

            setSession(sessionData);
            setMessages([{
                role: 'assistant',
                content: sessionData.message
            }]);
            setIsVisible(true);
        } catch (err) {
            console.error('Error creating chat session:', err);
            onError?.('Failed to create chat session');
        } finally {
            setIsLoading(false);
        }
    }, [language, onError]);

    const sendMessage = useCallback(async () => {
        if (!input.trim() || !session || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setIsLoading(true);

        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

        try {
            const response = await sendChatMessage({
                session_id: session.session_id,
                message: userMessage
            });

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: response.response
            }]);
        } catch (err) {
            onError?.(err instanceof Error ? err.message : 'Chat error');
        } finally {
            setIsLoading(false);
        }
    }, [input, session, isLoading, onError]);

    const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }, [sendMessage]);

    const reset = useCallback(() => {
        setSession(null);
        setMessages([]);
        setInput('');
        setIsVisible(false);
        setIsLoading(false);
    }, []);

    const setVisible = useCallback((visible: boolean) => {
        setIsVisible(visible);
    }, []);

    return {
        session,
        messages,
        input,
        isLoading,
        isVisible,
        chatEndRef,
        setInput,
        setVisible,
        initializeSession,
        sendMessage,
        handleKeyPress,
        reset
    };
}
