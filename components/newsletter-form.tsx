'use client';

import { useState } from 'react';
import { useLanguage } from './providers/language-provider';

export default function NewsletterForm() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {



      await new Promise(resolve => setTimeout(resolve, 1000));

      setMessage(t('newsletter.success'));
      setEmail('');
    } catch (error) {
      setMessage(t('newsletter.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto md:mx-0">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder={t('newsletter.email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isSubmitting}
          className="w-full px-4 py-3 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/60 disabled:opacity-50 bg-white/10 backdrop-blur-sm"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-8 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors duration-200 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? t('newsletter.subscribing') : t('newsletter.subscribe')}
        </button>
      </form>
      {message && (
        <p className={`text-sm mt-4 text-center md:text-left ${message.includes('error') ? 'text-red-300' : 'text-green-300'}`}>
          {message}
        </p>
      )}
    </div>
  );
}

