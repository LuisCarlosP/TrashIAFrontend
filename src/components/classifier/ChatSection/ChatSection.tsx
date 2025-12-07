import './ChatSection.css'
import type { RefObject } from 'react'
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
      <div className="chat-container">
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
            type="text"
            className="chat-input"
            placeholder={t.chatPlaceholder}
            value={chatInput}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={onKeyPress}
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
