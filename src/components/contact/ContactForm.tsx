import { useState, type FormEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEnvelope,
  faUser,
  faPaperPlane,
  faCheck,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import emailjs from '@emailjs/browser';
import './ContactForm.css';

interface ContactFormProps {
  t: {
    contactTitle: string;
    contactSubtitle: string;
    contactNameLabel: string;
    contactNamePlaceholder: string;
    contactEmailLabel: string;
    contactEmailPlaceholder: string;
    contactMessageLabel: string;
    contactMessagePlaceholder: string;
    contactSendButton: string;
    contactSending: string;
    contactSuccess: string;
    contactError: string;
  };
}

export default function ContactForm({ t }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 4000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-wrapper">
        <div className="contact-content">
          <h2 className="contact-title">{t.contactTitle}</h2>
          <p className="contact-subtitle">{t.contactSubtitle}</p>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="contact-name">
                <FontAwesomeIcon icon={faUser} />
                {t.contactNameLabel}
              </label>
              <input
                type="text"
                id="contact-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t.contactNamePlaceholder}
                required
                disabled={status === 'sending'}
              />
            </div>

            <div className="form-field">
              <label htmlFor="contact-email">
                <FontAwesomeIcon icon={faEnvelope} />
                {t.contactEmailLabel}
              </label>
              <input
                type="email"
                id="contact-email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder={t.contactEmailPlaceholder}
                required
                disabled={status === 'sending'}
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="contact-message">
              <FontAwesomeIcon icon={faPaperPlane} />
              {t.contactMessageLabel}
            </label>
            <textarea
              id="contact-message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder={t.contactMessagePlaceholder}
              rows={4}
              required
              disabled={status === 'sending'}
            />
          </div>

          <button 
            type="submit" 
            className={`submit-btn ${status}`}
            disabled={status === 'sending'}
          >
            {status === 'sending' && (
              <>
                <FontAwesomeIcon icon={faSpinner} spin />
                {t.contactSending}
              </>
            )}
            {status === 'success' && (
              <>
                <FontAwesomeIcon icon={faCheck} />
                {t.contactSuccess}
              </>
            )}
            {status === 'error' && (
              <>
                <FontAwesomeIcon icon={faEnvelope} />
                {t.contactError}
              </>
            )}
            {status === 'idle' && (
              <>
                <FontAwesomeIcon icon={faPaperPlane} />
                {t.contactSendButton}
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
