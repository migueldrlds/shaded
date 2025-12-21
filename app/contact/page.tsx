'use client';

import { useLanguage } from 'components/providers/language-provider';
import { useActionState, useEffect, useState } from 'react';

import { submitContactForm } from './actions';

const initialState = {
  message: '',
  success: false
};

export default function Contact() {
  const { t } = useLanguage();
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    comment: ''
  });

  // Apply global gray background to body for this page to Ensure full coverage
  useEffect(() => {
    const originalBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#d2d5d3';
    return () => { document.body.style.backgroundColor = originalBg; };
  }, []);

  // Effect to clear form on success and show alert
  useEffect(() => {
    if (state.success) {
      setFormData({ name: '', email: '', phone: '', comment: '' });
      alert(state.message || t('contact.successMessage'));
    } else if (state.message) {
      alert(state.message);
    }
  }, [state, t]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center pt-32 pb-20">

      <div className="w-full max-w-lg mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold uppercase tracking-tighter mb-4 text-[#2E2E2C]">
            {t('contact.title')}
          </h1>
          <p className="text-lg text-[#2E2E2C]/70">
            {t('contact.subtitle')}
          </p>
        </div>

        <form action={formAction} className="space-y-4">
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t('contact.namePlaceholder')}
              className="w-full bg-transparent border-b border-[#2E2E2C]/30 py-3 text-[#2E2E2C] placeholder-[#2E2E2C]/40 focus:outline-none focus:border-[#2E2E2C] transition-colors text-lg"
              required
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t('contact.emailPlaceholder')}
              className="w-full bg-transparent border-b border-[#2E2E2C]/30 py-3 text-[#2E2E2C] placeholder-[#2E2E2C]/40 focus:outline-none focus:border-[#2E2E2C] transition-colors text-lg"
              required
            />

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder={t('contact.phonePlaceholder')}
              className="w-full bg-transparent border-b border-[#2E2E2C]/30 py-3 text-[#2E2E2C] placeholder-[#2E2E2C]/40 focus:outline-none focus:border-[#2E2E2C] transition-colors text-lg"
            />

            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              placeholder={t('contact.commentPlaceholder')}
              rows={4}
              className="w-full bg-transparent border-b border-[#2E2E2C]/30 py-3 text-[#2E2E2C] placeholder-[#2E2E2C]/40 focus:outline-none focus:border-[#2E2E2C] transition-colors text-lg resize-none"
              required
            />
          </div>

          <div className="pt-8">
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#2E2E2C] text-[#d2d5d3] py-4 rounded-full font-medium hover:bg-black transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed text-lg tracking-wide"
            >
              {isPending ? 'Sending...' : t('contact.sendMessage')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

