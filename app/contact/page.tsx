'use client';

import { useLanguage } from 'components/providers/language-provider';
import { useState } from 'react';

export default function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    comment: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí se manejaría el envío del formulario
    console.log('Form submitted:', formData);
    alert(t('contact.successMessage'));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#d2d5d3' }}>
      
      {/* Contenido principal */}
      <div className="relative z-10 pt-40 px-4 pb-8">
        <div className="max-w-2xl mx-auto">
          {/* Título de la página */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold uppercase mb-4" style={{ color: '#2E2E2C' }}>
              {t('contact.title')}
            </h1>
            <p className="text-lg opacity-80 mb-2" style={{ color: '#2E2E2C' }}>
              {t('contact.subtitle')}
            </p>
            <h2 className="text-xl font-semibold mb-8" style={{ color: '#2E2E2C' }}>
              {t('contact.contactForm')}
            </h2>
          </div>

          {/* Card con el formulario */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: '#2E2E2C' }}>
                  {t('contact.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  placeholder={t('contact.namePlaceholder')}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#2E2E2C' }}>
                  {t('contact.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  placeholder={t('contact.emailPlaceholder')}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2" style={{ color: '#2E2E2C' }}>
                  {t('contact.phone')}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  placeholder={t('contact.phonePlaceholder')}
                />
              </div>

              <div>
                <label htmlFor="comment" className="block text-sm font-medium mb-2" style={{ color: '#2E2E2C' }}>
                  {t('contact.comment')}
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent resize-none"
                  placeholder={t('contact.commentPlaceholder')}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200"
              >
                {t('contact.sendMessage')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

