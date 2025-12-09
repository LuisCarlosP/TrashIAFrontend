import './ChatSection.css'
import { useEffect, useRef, type RefObject } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments, faTimes, faPaperPlane, faSpinner } from '@fortawesome/free-solid-svg-icons'
import ReactMarkdown from 'react-markdown'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatSectionProps {
  showChat: boolean
  chatMessages: ChatMessage[]
  chatInput: string
  chatLoading: boolean
  chatEndRef: RefObject<HTMLDivElement | null>
  onToggleChat: () => void
  onInputChange: (value: string) => void
  onSendMessage: () => void
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void
  translations: {
    askQuestion: string
    chatTitle: string
    chatPlaceholder: string
    chatLoading: string
  }
}

export default function ChatSection({
  showChat,
  chatMessages,
  chatInput,
  chatLoading,
  chatEndRef,
  onToggleChat,
  onInputChange,
  onSendMessage,
  onKeyPress,
  translations: t
}: ChatSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle mobile keyboard - scroll input into view
  useEffect(() => {
    if (!showChat) return

    const handleResize = () => {
      // Scroll to bottom when keyboard opens/closes
      if (inputRef.current && document.activeElement === inputRef.current) {
        setTimeout(() => {
          inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
        }, 100)
      }
    }

    // Use VisualViewport for better mobile keyboard detection
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize)
      return () => window.visualViewport?.removeEventListener('resize', handleResize)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [showChat])

  // Scroll input into view when focused on mobile
  const handleInputFocus = () => {
    setTimeout(() => {
      inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 300)
  }

  if (!showChat) {
    return (
      <div className="chat-section">
        <button className="btn btn-chat-toggle" onClick={onToggleChat}>
          <FontAwesomeIcon icon={faComments} />
          {t.askQuestion}
        </button>
      </div>
    )
  }

  return (
    <div className={`chat-section ${showChat ? 'chat-fullscreen' : ''}`}>
      <div className="chat-container" ref={containerRef}>
        <div className="chat-header">
          <h3>
            <FontAwesomeIcon icon={faComments} />
            {t.chatTitle}
          </h3>
          <button className="chat-close" onClick={onToggleChat}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="chat-messages">
          {chatMessages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.role}`}>
              <div className="message-content">
                {msg.role === 'assistant' ? (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
          {chatLoading && (
            <div className="chat-message assistant">
              <div className="message-content">
                <FontAwesomeIcon icon={faSpinner} spin />
                {' '}{t.chatLoading}
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="chat-input-container">
          <input
            ref={inputRef}
            type="text"
            className="chat-input"
            placeholder={t.chatPlaceholder}
            value={chatInput}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={onKeyPress}
            onFocus={handleInputFocus}
            disabled={chatLoading}
          />
          <button
            className="btn btn-send-chat"
            onClick={onSendMessage}
            disabled={!chatInput.trim() || chatLoading}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </div>
    </div>
  )
}
