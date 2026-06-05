import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { APP_NAME, LOGO_URL } from '../constants';
import { t } from '../i18n';
import { Wallet, Globe, Moon, Sun } from 'lucide-react';

const AuthView: React.FC = () => {
  const { login, language, setLanguage, isDarkMode, setDarkMode } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      login(name, email);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-brand-50'} flex flex-col items-center justify-center p-6 transition-colors`}>
      {/* Settings Bar */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className={`p-2 rounded-lg transition-colors ${
            isDarkMode 
              ? 'bg-gray-800 hover:bg-gray-700 text-white' 
              : 'bg-white hover:bg-gray-100 text-gray-700'
          }`}
          title={t('common.language', language)}
        >
          <Globe size={20} />
        </button>
        <button
          onClick={() => setDarkMode(!isDarkMode)}
          className={`p-2 rounded-lg transition-colors ${
            isDarkMode 
              ? 'bg-gray-800 hover:bg-gray-700 text-white' 
              : 'bg-white hover:bg-gray-100 text-gray-700'
          }`}
          title={t('common.darkMode', language)}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <div className={`w-full max-w-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8 transition-colors`}>
        <div className="flex flex-col items-center mb-8">
          {/* Logo */}
          <div className="mb-4">
            <img 
              src={LOGO_URL} 
              alt={APP_NAME}
              className="w-20 h-20 object-contain"
            />
          </div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {APP_NAME}
          </h1>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-2 text-center`}>
            {t('auth.subtitle', language)}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              {t('auth.fullName', language)}
            </label>
            <input
              type="text"
              required
              className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500' 
                  : 'border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500'
              }`}
              placeholder={t('auth.placeholder.name', language)}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              {t('auth.email', language)}
            </label>
            <input
              type="email"
              required
              className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500' 
                  : 'border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500'
              }`}
              placeholder={t('auth.placeholder.email', language)}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg shadow-brand-500/30"
          >
            {t('auth.getStarted', language)}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthView;
