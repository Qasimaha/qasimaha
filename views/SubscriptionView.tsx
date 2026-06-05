import React, { useState } from 'react';
import { t } from '../i18n';
import { useApp } from '../context/AppContext';
import { MOCK_CONTACTS, SERVICES } from '../constants';
import { formatSAR } from '../utils/currency';
import { Check, Plus, ArrowRight, X } from 'lucide-react';
import { Subscription } from '../types';

const SubscriptionView: React.FC = () => {
    const { subscriptions, addSubscription, isDarkMode, language } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [step, setStep] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [customPrice, setCustomPrice] = useState<string>('');
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  const selectedService = SERVICES.find(s => s.id === selectedServiceId);
  const price = customPrice ? parseFloat(customPrice) : (selectedService?.defaultPrice || 0);
  const splitCount = selectedFriends.length + 1; // Me + friends
  const costPerPerson = price / splitCount;

  const handleAdd = () => {
      if (!selectedService) return;
      
      const sub: Subscription = {
          id: Date.now().toString(),
          serviceName: selectedService.name,
          icon: selectedService.icon,
          color: selectedService.color,
          totalPrice: price,
          myShare: costPerPerson,
          members: [
              { name: 'You' },
              ...MOCK_CONTACTS.filter(c => selectedFriends.includes(c.id)).map(c => ({ name: c.name, avatar: c.avatar }))
          ],
          renewalDate: new Date(Date.now() + 30*24*60*60*1000).toISOString()
      };
      
      addSubscription(sub);
      resetForm();

      // Trigger animation
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 2000);
  };

  const resetForm = () => {
      setShowAdd(false);
      setStep(1);
      setSelectedServiceId(null);
      setCustomPrice('');
      setSelectedFriends([]);
  };

  const toggleFriend = (id: string) => {
    setSelectedFriends(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} pb-32 p-6 transition-colors`}>
       <div className="flex justify-between items-center mb-6">
         <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t('nav.subs', language)}</h1>
         <button 
           onClick={() => setShowAdd(true)} 
           className={`bg-black text-white px-4 py-2 rounded-full text-sm font-bold flex items-center transition-all duration-300 ${isAnimating ? 'bg-green-600 scale-105' : 'hover:bg-gray-900'}`}
         >
             {isAnimating ? <Check size={16} className="mr-1"/> : <Plus size={16} className="mr-1"/>}
             {isAnimating ? t('common.added', language) : t('subs.addNew', language)}
         </button>
       </div>

       {subscriptions.length === 0 ? (
           <div className={`text-center py-12 rounded-2xl border border-dashed ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
             <p className="text-gray-500 mb-2">{t('subs.noActiveSubs', language)}</p>
             <p className="text-xs text-gray-400">{t('subs.trackSharedAccounts', language)}</p>
           </div>
       ) : (
           <div className="space-y-4">
               {subscriptions.map(sub => (
                   <div key={sub.id} className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} p-5 rounded-2xl shadow-sm border`}>
                       <div className="flex justify-between items-start mb-4">
                           <div className="flex items-center space-x-3">
                               <div className={`w-10 h-10 ${sub.color} rounded-xl flex items-center justify-center text-white font-bold`}>
                                   {sub.icon}
                               </div>
                               <div>
                                   <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{sub.serviceName}</h3>
                                   <p className="text-xs text-gray-500">{t('subs.renews', language)} {new Date(sub.renewalDate).toLocaleDateString()}</p>
                               </div>
                           </div>
                           <div className="text-right">
                               <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{formatSAR(sub.myShare)}</p>
                               <p className="text-xs text-gray-500">{t('subs.myShare', language)}</p>
                           </div>
                       </div>
                       <div className={`flex items-center justify-between text-xs ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} p-3 rounded-lg`}>
                           <div className="flex -space-x-2">
                               {sub.members.slice(0, 4).map((m, i) => (
                                   m.avatar ? (
                                    <img key={i} src={m.avatar} className={`w-6 h-6 rounded-full border-2 ${isDarkMode ? 'border-gray-800' : 'border-white'}`} alt={m.name} />
                                   ) : (
                                    <div key={i} className={`w-6 h-6 rounded-full ${isDarkMode ? 'bg-gray-600 border-gray-800 text-gray-300' : 'bg-gray-300 border-white text-gray-600'} border-2 flex items-center justify-center text-[8px] font-bold`}>
                                        {m.name.charAt(0)}
                                    </div>
                                   )
                               ))}
                           </div>
                           <span className="text-gray-500">{t('subs.total', language)}: {formatSAR(sub.totalPrice)}</span>
                       </div>
                   </div>
               ))}
           </div>
       )}

       {/* ADD MODAL */}
       {showAdd && (
           <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 sm:p-0">
               <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 shadow-2xl h-[90vh] sm:h-auto overflow-y-auto`}>
                   <div className="flex justify-between items-center mb-6">
                       <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t('subs.addSubscription', language)}</h3>
                       <button onClick={resetForm}><X className="text-gray-400" /></button>
                   </div>

                   {step === 1 && (
                       <div className="space-y-4">
                           <p className={`font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('subs.selectService', language)}</p>
                           <div className="grid grid-cols-2 gap-3">
                               {SERVICES.map(s => (
                                   <button 
                                     key={s.id} 
                                     onClick={() => { setSelectedServiceId(s.id); setCustomPrice(s.defaultPrice.toString()); setStep(2); }}
                                     className={`p-4 border rounded-xl flex items-center space-x-3 transition-all text-left ${isDarkMode ? 'border-gray-700 bg-gray-900 hover:border-brand-500 hover:bg-brand-900' : 'border-gray-200 bg-white hover:border-brand-500 hover:bg-brand-50'}`}
                                   >
                                       <div className={`w-8 h-8 ${s.color} rounded-lg flex items-center justify-center text-white font-bold`}>{s.icon}</div>
                                       <div>
                                           <p className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{s.name}</p>
                                           <p className="text-xs text-gray-500">{formatSAR(s.defaultPrice)}</p>
                                       </div>
                                   </button>
                               ))}
                           </div>
                       </div>
                   )}

                   {step === 2 && (
                       <div className="space-y-6">
                           <div>
                               <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>{t('subs.monthlyPrice', language)} ({formatSAR(0).split(' ')[1]})</label>
                               <input 
                                 type="number" 
                                 value={customPrice} 
                                 onChange={e => setCustomPrice(e.target.value)}
                                 className={`w-full text-2xl font-bold border-b ${isDarkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300'} focus:border-brand-500 focus:outline-none py-2`} 
                               />
                           </div>
                           
                           <div>
                               <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>{t('subs.selectFriends', language)}</label>
                               <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                                   {MOCK_CONTACTS.map(contact => {
                                       const isSelected = selectedFriends.includes(contact.id);
                                       return (
                                           <div 
                                               key={contact.id}
                                               onClick={() => toggleFriend(contact.id)}
                                               className={`flex-shrink-0 w-16 flex flex-col items-center space-y-1 cursor-pointer transition-all ${isSelected ? 'opacity-100' : 'opacity-60'} ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                                           >
                                               <div className={`relative w-10 h-10 rounded-full overflow-hidden border-2 ${isSelected ? 'border-brand-500' : (isDarkMode ? 'border-gray-700' : 'border-transparent')}`}>
                                                   <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
                                                   {isSelected && (
                                                       <div className="absolute inset-0 bg-brand-500/20 flex items-center justify-center">
                                                           <Check size={14} className="text-white drop-shadow-md" />
                                                       </div>
                                                   )}
                                               </div>
                                               <span className={`text-[9px] text-center truncate w-full ${isSelected ? 'font-bold text-brand-600' : 'text-gray-500'}`}>{contact.name.split(' ')[0]}</span>
                                           </div>
                                       );
                                   })}
                               </div>
                           </div>

                           <div className={`p-4 rounded-xl text-center ${isDarkMode ? 'bg-brand-900' : 'bg-brand-50'}`}>
                               <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t('subs.costPerPerson', language)}</p>
                               <p className={`text-2xl font-bold ${isDarkMode ? 'text-brand-400' : 'text-brand-700'}`}>{formatSAR(costPerPerson)}</p>
                               <p className="text-xs text-gray-500">{t('subs.splitBetween', language, { count: splitCount })}</p>
                           </div>

                           <button onClick={handleAdd} className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold shadow-lg">
                               {t('subs.confirmSubscription', language)}
                           </button>
                       </div>
                   )}
               </div>
           </div>
       )}
    </div>
  );
};

export default SubscriptionView;