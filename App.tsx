import React, { useState, useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import AuthView from './views/AuthView';
import GroupDashboard from './views/GroupDashboard';
import GroupList from './views/GroupList';
import HomeView from './views/HomeView';
import AnalyticsView from './views/AnalyticsView';
import SubscriptionView from './views/SubscriptionView';
import BottomNav from './components/BottomNav';

type Tab = 'home' | 'pots' | 'subs' | 'analytics';

// Inner component to handle conditional rendering based on auth state
const AppContent: React.FC = () => {
  const { user, activeGroup, leaveGroup, isDarkMode, language } = useApp();
  const [currentTab, setCurrentTab] = useState<Tab>('home');

  // Apply dark mode and language settings to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [isDarkMode, language]);

  if (!user) {
    return <AuthView />;
  }

  const handleTabChange = (tab: Tab) => {
    setCurrentTab(tab);
    // If we are currently viewing a specific group, we leave it to go to the main tab view
    if (activeGroup) {
      leaveGroup();
    }
  };

  let content;
  if (activeGroup) {
    content = <GroupDashboard />;
  } else if (currentTab === 'home') {
    content = <HomeView setCurrentTab={setCurrentTab} />;
  } else if (currentTab === 'subs') {
    content = <SubscriptionView />;
  } else if (currentTab === 'analytics') {
    content = <AnalyticsView />;
  } else {
    content = <GroupList />;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors`}>
      {content}
      <BottomNav currentTab={currentTab} onTabChange={handleTabChange} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AppProvider>
  );
};

export default App;
