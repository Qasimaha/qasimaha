import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SERVICES, LOGO_URL } from '../constants';
import { formatSAR } from '../utils/currency';
import { t } from '../i18n';
import { ArrowRight, Sparkles, ExternalLink, CreditCard, Eye, EyeOff, Plus, Wifi, Globe, Moon, Sun, LogOut } from 'lucide-react';

interface HomeViewProps {
  setCurrentTab: (tab: 'home' | 'pots' | 'subs' | 'analytics') => void;
}

const HomeView: React.FC<HomeViewProps> = ({ setCurrentTab }) => {
  const { user, groups, setActiveGroupById, depositToWallet, isDarkMode, language, setLanguage, setDarkMode, logout } = useApp();
  
  // States
  const [hideBalance, setHideBalance] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGroupClick = (groupId: string) => {
    setActiveGroupById(groupId);
  };

  const handleApplePay = (e: React.FormEvent) => {
      e.preventDefault();
      const amount = parseFloat(topUpAmount);
      if (amount > 0) {
          setIsProcessing(true);
          // Simulate Apple Pay processing delay
          setTimeout(() => {
              depositToWallet(amount);
              setIsProcessing(false);
              setShowTopUp(false);
              setTopUpAmount('');
          }, 1500);
      }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} pb-32 transition-colors`}>
      {/* Header */}
      <header className={`${isDarkMode ? 'bg-gray-800 shadow-md' : 'bg-white shadow-sm'} px-6 py-6 sticky top-0 z-10 transition-colors`}>
        <div className="flex justify-between items-center">
          <div>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
              {t('home.welcomeBack', language)}
            </p>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {t('home.hi', language)}{user?.name.split(' ')[0]}
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              title={t('common.language', language)}
            >
              <Globe size={18} />
            </button>
            <button
              onClick={() => setDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              title={t('common.darkMode', language)}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={logout}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              title={t('common.logout', language)}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="p-6 space-y-8">
        
        {/* Personal Wallet Card */}
        <section>
          <div className={`w-full h-48 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-900'} rounded-2xl shadow-xl p-6 text-white relative overflow-hidden flex flex-col justify-between transform transition-all hover:scale-[1.01]`}>
              {/* Decorative circles */}
              <div className={`absolute top-0 right-0 w-32 h-32 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-800'} rounded-full -mr-10 -mt-10 opacity-50 blur-xl`}></div>
              <div className={`absolute bottom-0 left-0 w-24 h-24 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-700'} rounded-full -ml-8 -mb-8 opacity-50 blur-xl`}></div>
              
              <div className="flex justify-between items-start z-10">
                  <div className="flex items-center space-x-2">
                     <CreditCard size={20} className="text-gray-400"/>
                     <span className="text-sm text-gray-400 font-medium">{t('home.personalWallet', language)}</span>
                  </div>
                  <Wifi className="w-6 h-6 opacity-75 rotate-90 text-gray-400" />
              </div>
              
              <div className="z-10 mt-2">
                  <div className="flex items-center space-x-2 mb-1">
                     <p className="text-xs text-gray-400">{t('home.availableBalance', language)}</p>
                     <button onClick={() => setHideBalance(!hideBalance)} className="text-gray-400 hover:text-white transition-colors">
                        {hideBalance ? <EyeOff size={14} /> : <Eye size={14} />}
                     </button>
                  </div>
                  <h2 className="text-3xl font-mono font-bold">
                      {hideBalance ? '****' : formatSAR(user?.personalBalance || 0)}
                  </h2>
              </div>

              <div className="flex justify-between items-end z-10">
                  <p className="text-sm tracking-widest uppercase">{user?.name}</p>
                  <span className="font-bold text-lg tracking-wider italic opacity-50">VISA</span>
              </div>
          </div>
          
          <div className="mt-4 flex justify-center">
              <button 
                onClick={() => setShowTopUp(true)}
                className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-black hover:bg-gray-800 text-white'} px-5 py-3 rounded-xl flex items-center space-x-2 shadow-lg transition-all active:scale-95 w-full justify-center`}
              >
                  <Plus size={18} />
                  <span className="font-medium">{t('home.addMoney', language)}</span>
              </button>
          </div>
        </section>
        
        {/* Pot Snippets */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('home.yourActivePots', language)}
            </h2>
            <button 
              onClick={() => setCurrentTab('pots')}
              className="text-xs text-brand-600 font-medium hover:underline"
            >
              {t('home.viewAll', language)}
            </button>
          </div>
          
          {groups.length === 0 ? (
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} p-6 rounded-2xl border border-dashed text-center transition-colors`}>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm mb-3`}>
                {t('home.noActivePots', language)}
              </p>
              <button 
                onClick={() => setCurrentTab('pots')}
                className="text-brand-600 font-bold text-sm"
              >
                {t('home.createPot', language)}
              </button>
            </div>
          ) : (
            <div className="flex overflow-x-auto space-x-4 pb-2 -mx-6 px-6 no-scrollbar">
              {groups.slice(0, 5).map(group => {
                const myContribution = group.members.find(m => m.userId === user?.id)?.contributionAmount || 0;
                const totalContributed = group.members.reduce((sum, m) => sum + m.contributionAmount, 0);
                const totalSpent = group.expenses.reduce((sum, e) => sum + e.amount, 0);
                const balance = totalContributed - totalSpent;

                return (
                  <div 
                    key={group.id}
                    onClick={() => handleGroupClick(group.id)}
                    className={`min-w-[240px] ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} p-4 rounded-2xl border shadow-sm flex flex-col justify-between h-32 active:scale-95 transition-transform`}
                  >
                    <div>
                       <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} truncate`}>
                         {group.name}
                       </h3>
                       <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                         {t('home.balance', language)}<span className="text-brand-600 font-medium">{formatSAR(balance)}</span>
                       </p>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} px-2 py-1 rounded text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {t('home.myShare', language)}{formatSAR(myContribution)}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Services */}
        <section>
          <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
            {t('home.splitSubscriptions', language)}
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {SERVICES.map(service => (
              <button 
                key={service.id} 
                onClick={() => setCurrentTab('subs')}
                className="flex flex-col items-center space-y-2 active:opacity-70 transition-opacity"
              >
                <div className={`w-14 h-14 ${service.color} rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md`}>
                  {service.icon}
                </div>
                <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {service.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Ads Banner */}
        <section className="relative overflow-hidden rounded-2xl bg-[#003580] text-white shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
          <div className="p-5 relative z-10">
             <div className="flex items-start justify-between">
               <div>
                  <span className="bg-yellow-400 text-[#003580] text-[10px] font-bold px-2 py-0.5 rounded mb-2 inline-block">AD</span>
                  <h3 className="font-bold text-lg leading-tight mb-1">
                    {t('home.bookStay', language)}
                  </h3>
                  <p className="text-blue-200 text-xs mb-4">
                    {t('home.saveVillas', language)}
                  </p>
               </div>
               <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                  <ExternalLink size={24} className="text-white" />
               </div>
             </div>
             <button className="w-full bg-white text-[#003580] font-bold py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
               {t('home.exploreDeals', language)}
             </button>
          </div>
        </section>
      </main>

      {/* Top Up Modal */}
      {showTopUp && (
        <div className={`fixed inset-0 ${isDarkMode ? 'bg-black/80' : 'bg-black/60'} z-50 flex items-end sm:items-center justify-center p-4 sm:p-0 backdrop-blur-sm transition-colors`}>
           <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-t-3xl sm:rounded-2xl w-full max-w-sm p-6 shadow-2xl h-auto animate-in slide-in-from-bottom duration-300 transition-colors`}>
               <div className="flex justify-between items-center mb-6">
                   <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                     {t('home.topUpWallet', language)}
                   </h3>
                   <button 
                     onClick={() => setShowTopUp(false)} 
                     className={`${isDarkMode ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
                   >
                     {t('common.close', language)}
                   </button>
               </div>
               
               <form onSubmit={handleApplePay}>
                   <div className="mb-6">
                       <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2 block`}>
                         {t('home.amount', language)} ({formatSAR(0).split(' ')[1]})
                       </label>
                       <input 
                           type="number" 
                           step="1"
                           autoFocus
                           className={`w-full text-4xl font-bold border-b-2 ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'border-black'} focus:outline-none py-2 text-center transition-colors`}
                           placeholder="0"
                           value={topUpAmount}
                           onChange={e => setTopUpAmount(e.target.value)}
                       />
                   </div>
                   
                   <button 
                       type="submit" 
                       disabled={isProcessing || !topUpAmount}
                       className={`w-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-black hover:bg-gray-900'} text-white py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed transition-colors`}
                   >
                       {isProcessing ? (
                           <span className="animate-pulse">{t('home.processing', language)}</span>
                       ) : (
                           <>
                             <span>{t('home.payWith', language)}</span>
                             <span className="font-semibold"> Pay</span>
                           </>
                       )}
                   </button>
               </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default HomeView;
