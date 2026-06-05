import React from 'react';
import { Home, Layers, PieChart, Repeat } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n';

interface BottomNavProps {
  currentTab: 'home' | 'pots' | 'subs' | 'analytics';
  onTabChange: (tab: 'home' | 'pots' | 'subs' | 'analytics') => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const { activeGroup, isDarkMode, language } = useApp();

  const getIconClass = (tabName: string) => {
      const isActive = currentTab === tabName && !activeGroup;
      // Special case: 'pots' is active if we are in dashboard
      const isPotsActive = tabName === 'pots' && (currentTab === 'pots' || !!activeGroup);
      
      return (isActive || (tabName === 'pots' && isPotsActive)) 
        ? 'text-brand-600' 
        : isDarkMode ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600';
  }
  
  const getIconStroke = (tabName: string) => {
      const isActive = currentTab === tabName && !activeGroup;
      const isPotsActive = tabName === 'pots' && (currentTab === 'pots' || !!activeGroup);
      return (isActive || (tabName === 'pots' && isPotsActive)) ? 2.5 : 2;
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t py-3 pb-safe px-4 flex justify-between items-center z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] transition-colors`}>
      <button 
        onClick={() => onTabChange('home')}
        className={`flex flex-col items-center space-y-1 w-16 ${getIconClass('home')} transition-colors`}
        title={t('nav.home', language)}
      >
        <Home size={22} strokeWidth={getIconStroke('home')} />
        <span className="text-[10px] font-medium">{t('nav.home', language)}</span>
      </button>

      <button 
        onClick={() => onTabChange('pots')}
        className={`flex flex-col items-center space-y-1 w-16 ${getIconClass('pots')} transition-colors`}
        title={t('nav.pots', language)}
      >
        <Layers size={22} strokeWidth={getIconStroke('pots')} />
        <span className="text-[10px] font-medium">{t('nav.pots', language)}</span>
      </button>

      <button 
        onClick={() => onTabChange('subs')}
        className={`flex flex-col items-center space-y-1 w-16 ${getIconClass('subs')} transition-colors`}
        title={t('nav.subs', language)}
      >
        <Repeat size={22} strokeWidth={getIconStroke('subs')} />
        <span className="text-[10px] font-medium">{t('nav.subs', language)}</span>
      </button>

      <button 
        onClick={() => onTabChange('analytics')}
        className={`flex flex-col items-center space-y-1 w-16 ${getIconClass('analytics')} transition-colors`}
        title={t('nav.analytics', language)}
      >
        <PieChart size={22} strokeWidth={getIconStroke('analytics')} />
        <span className="text-[10px] font-medium">{t('nav.analytics', language)}</span>
      </button>
    </div>
  );
};

export default BottomNav;
