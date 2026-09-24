import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, Copy, Mail, Sparkles } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, initialService }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [service, setService] = useState(initialService || 'SEO Audit');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setSubmitted(true);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('fiorellacorazon1@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-[#141414] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#e5e5e5] dark:border-[#262626] relative overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-label="Contact Fiorella"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-2 rounded-full text-[#666666] dark:text-[#a3a3a3] hover:text-[#1a1a1a] dark:hover:text-white hover:bg-[#f8f8f8] dark:hover:bg-[#1f1f1f] transition-colors focus-visible:outline-2 focus-visible:outline-black dark:focus-visible:outline-white"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-14 h-14 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black text-[#1a1a1a] dark:text-white">Thank you, {name}!</h3>
            <p className="text-sm text-[#666666] dark:text-[#a3a3a3] max-w-sm mx-auto">
              Your inquiry has been received. I'll review your project details and get back to you within 24–48 hours.
            </p>
            <div className="pt-4">
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="bg-black dark:bg-white text-white dark:text-black text-xs font-bold px-6 py-2.5 rounded-full hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
              >
                Back to Portfolio
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3" />
                <span>Let's Connect</span>
              </div>
              <h3 className="text-2xl font-black text-[#1a1a1a] dark:text-white tracking-tight">
                Let's talk about your website
              </h3>
              <p className="text-xs sm:text-sm text-[#666666] dark:text-[#a3a3a3] mt-1">
                Tell me about your site and goals. No pressure, no spam.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-bold text-[#1a1a1a] dark:text-[#ededed] mb-1">
                    Your Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e5e5] dark:border-[#262626] bg-white dark:bg-[#1a1a1a] text-[#1a1a1a] dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent font-medium placeholder:text-[#999999] dark:placeholder:text-[#666666]"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-bold text-[#1a1a1a] dark:text-[#ededed] mb-1">
                    Email Address *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e5e5] dark:border-[#262626] bg-white dark:bg-[#1a1a1a] text-[#1a1a1a] dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent font-medium placeholder:text-[#999999] dark:placeholder:text-[#666666]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="contact-website" className="block text-xs font-bold text-[#1a1a1a] dark:text-[#ededed] mb-1">
                    Website URL (Optional)
                  </label>
                  <input
                    id="contact-website"
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://yoursite.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e5e5] dark:border-[#262626] bg-white dark:bg-[#1a1a1a] text-[#1a1a1a] dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent font-medium placeholder:text-[#999999] dark:placeholder:text-[#666666]"
                  />
                </div>
                <div>
                  <label htmlFor="contact-service" className="block text-xs font-bold text-[#1a1a1a] dark:text-[#ededed] mb-1">
                    Service of Interest
                  </label>
                  <select
                    id="contact-service"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e5e5] dark:border-[#262626] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-[#1a1a1a] text-[#1a1a1a] dark:text-white font-medium"
                  >
                    <option value="SEO Audit">SEO Audit</option>
                    <option value="Keyword Research">Keyword Research</option>
                    <option value="On-Page SEO">On-Page SEO</option>
                    <option value="Technical SEO">Technical SEO</option>
                    <option value="Content Optimization">Content Optimization</option>
                    <option value="SEO Strategy">Full SEO Strategy</option>
                    <option value="General Inquiry">General Question</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-bold text-[#1a1a1a] dark:text-[#ededed] mb-1">
                  How can I help you?
                </label>
                <textarea
                  id="contact-message"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share a brief overview of what you are trying to solve or improve..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e5e5] dark:border-[#262626] bg-white dark:bg-[#1a1a1a] text-[#1a1a1a] dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent resize-none font-medium placeholder:text-[#999999] dark:placeholder:text-[#666666]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 active:bg-neutral-900 text-white dark:text-black font-bold text-xs sm:text-sm py-3 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Send Message</span>
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Direct Email Option */}
            <div className="mt-5 pt-4 border-t border-[#e5e5e5] dark:border-[#262626] flex items-center justify-between text-xs text-[#666666] dark:text-[#a3a3a3]">
              <span>Or email directly:</span>
              <button
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1.5 font-bold text-[#1a1a1a] dark:text-white hover:underline"
              >
                <Mail className="w-3.5 h-3.5 text-black dark:text-white" />
                <span>fiorellacorazon1@gmail.com</span>
                <span className="text-[10px] bg-[#f8f8f8] dark:bg-[#262626] border border-[#e5e5e5] dark:border-[#333333] px-1.5 py-0.5 rounded text-[#1a1a1a] dark:text-white">
                  {copied ? 'Copied!' : 'Copy'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
