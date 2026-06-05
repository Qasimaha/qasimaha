import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PlusCircle, ArrowRight, Users, Briefcase, Check } from 'lucide-react';
import { formatSAR } from '../utils/currency';
import { t } from '../i18n';
import { Group } from '../types';
import { MOCK_CONTACTS } from '../constants';

type Tab = 'created' | 'received';

const GroupList: React.FC = () => {
  const { user, groups, createGroup, setActiveGroupById, logout, isDarkMode, language } = useApp();
  const [showCreate, setShowCreate] = useState(false);
  const [newTripName, setNewTripName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('created');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTripName && targetAmount) {
      const initialMembers = MOCK_CONTACTS.filter(c => selectedContacts.includes(c.id))
        .map(c => ({ name: c.name, avatar: c.avatar }));
        
      createGroup(newTripName, parseFloat(targetAmount), initialMembers);
      setShowCreate(false);
      setNewTripName('');
      setTargetAmount('');
      setSelectedContacts([]);
    }
  };
  
  const toggleContact = (id: string) => {
      setSelectedContacts(prev => 
        prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
      );
  };

  // Filter Logic
  const createdGroups = groups.filter(g => !g.createdBy || g.createdBy === user?.id);
  const receivedGroups = groups.filter(g => g.createdBy && g.createdBy !== user?.id);
  
  const displayedGroups = activeTab === 'created' ? createdGroups : receivedGroups;

  if (showCreate) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6 flex flex-col transition-colors`}>
        <div className="flex-1 max-w-md mx-auto w-full">
          <button 
            onClick={() => setShowCreate(false)} 
            className={`${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} mb-6 font-medium transition-colors`}
          >
            ← {t('groups.back', language)}
          </button>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            {t('groups.planTrip', language)}
          </h2>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
            {t('groups.createPotDesc', language)}
          </p>

          <form onSubmit={handleCreate} className={`space-y-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-2xl shadow-sm transition-colors`}>
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                {t('groups.tripName', language)}
              </label>
              <input
                type="text"
                required
                className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20' 
                    : 'border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200'
                } outline-none`}
                placeholder="e.g. Riyadh Season Weekend"
                value={newTripName}
                onChange={(e) => setNewTripName(e.target.value)}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                {t('groups.targetBudget', language)} (SAR)
              </label>
              <input
                type="number"
                required
                className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20' 
                    : 'border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200'
                } outline-none`}
                placeholder="5000"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
              />
            </div>

            <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  {t('groups.addMembers', language)}
                </label>
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                    {MOCK_CONTACTS.map(contact => {
                        const isSelected = selectedContacts.includes(contact.id);
                        return (
                            <div 
                                key={contact.id}
                                onClick={() => toggleContact(contact.id)}
                                className={`flex-shrink-0 w-20 flex flex-col items-center space-y-1 cursor-pointer transition-all ${isSelected ? 'opacity-100' : 'opacity-60'}`}
                            >
                                <div className={`relative w-12 h-12 rounded-full overflow-hidden border-2 ${isSelected ? 'border-brand-500' : 'border-transparent'}`}>
                                    <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
                                    {isSelected && (
                                        <div className="absolute inset-0 bg-brand-500/20 flex items-center justify-center">
                                            <Check size={16} className="text-white drop-shadow-md" />
                                        </div>
                                    )}
                                </div>
                                <span className={`text-[10px] text-center truncate w-full ${isSelected ? 'font-bold text-brand-600' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {contact.name.split(' ')[0]}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <button
              type="submit"
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-500/30 transition-all transform active:scale-95"
            >
              {t('groups.createPot', language)}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} pb-32 transition-colors`}>
      <header className={`${isDarkMode ? 'bg-gray-800 shadow-md' : 'bg-white shadow-sm'} px-6 py-4 flex justify-between items-center sticky top-0 z-10 transition-colors`}>
        <div className="flex items-center space-x-2">
           <div className={`w-8 h-8 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-brand-100'} flex items-center justify-center ${isDarkMode ? 'text-gray-300' : 'text-brand-700'} font-bold`}>
             {user?.name.charAt(0)}
           </div>
           <span className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
             Hi, {user?.name.split(' ')[0]}
           </span>
        </div>
        <button 
          onClick={logout} 
          className={`text-xs ${isDarkMode ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
        >
          {t('common.logout', language)}
        </button>
      </header>

      <main className="p-6 max-w-md mx-auto">
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
          {t('groups.sharedPots', language)}
        </h2>
        
        {/* Tabs */}
        <div className={`flex p-1 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-xl mb-6 transition-colors`}>
            <button 
                onClick={() => setActiveTab('created')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  activeTab === 'created' 
                    ? isDarkMode ? 'bg-gray-700 text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm'
                    : isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                {t('groups.created', language)}
            </button>
            <button 
                onClick={() => setActiveTab('received')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  activeTab === 'received' 
                    ? isDarkMode ? 'bg-gray-700 text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm'
                    : isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                {t('groups.received', language)}
            </button>
        </div>

        {displayedGroups.length === 0 ? (
           <div className={`text-center py-12 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} rounded-2xl border border-dashed transition-colors`}>
             <Briefcase className={`mx-auto ${isDarkMode ? 'text-gray-600' : 'text-gray-300'} mb-3`} size={48} />
             <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
               No {activeTab} trips yet.
             </p>
             {activeTab === 'created' && (
                 <button
                  onClick={() => setShowCreate(true)}
                  className="px-6 py-2 bg-brand-600 text-white rounded-full font-medium shadow hover:bg-brand-700 transition-colors"
                >
                  {t('groups.startTrip', language)}
                </button>
             )}
           </div>
        ) : (
          <div className="space-y-4">
            {displayedGroups.map(group => {
               const contributed = group.members.reduce((sum, m) => sum + m.contributionAmount, 0);
               return (
                <div 
                  key={group.id}
                  onClick={() => setActiveGroupById(group.id)}
                  className={`${isDarkMode ? 'bg-gray-800 border-gray-700 active:bg-gray-700' : 'bg-white border-gray-100 active:bg-gray-50'} p-5 rounded-2xl shadow-sm border transition-colors cursor-pointer group`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white group-hover:text-brand-400' : 'text-gray-800 group-hover:text-brand-700'} transition-colors`}>
                      {group.name}
                    </h3>
                    <ArrowRight size={18} className={`${isDarkMode ? 'text-gray-600 group-hover:text-brand-500' : 'text-gray-300 group-hover:text-brand-500'} transition-colors`} />
                  </div>
                  <div className="flex justify-between items-end">
                    <div className={`flex items-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} space-x-4`}>
                      <span className="flex items-center"><Users size={14} className="mr-1"/> {group.members.length}</span>
                      <span>Target: {formatSAR(group.targetAmount)}</span>
                    </div>
                    <span className={`font-mono font-bold ${isDarkMode ? 'text-brand-400 bg-brand-500/10' : 'text-brand-600 bg-brand-50'} px-2 py-1 rounded text-sm transition-colors`}>
                      {formatSAR(contributed)}
                    </span>
                  </div>
                </div>
               );
            })}
          </div>
        )}
        
        {activeTab === 'created' && (
            <button
              onClick={() => setShowCreate(true)}
              className={`w-full mt-6 py-4 border-2 border-dashed ${isDarkMode ? 'border-gray-700 text-gray-400 hover:border-brand-500 hover:text-brand-400' : 'border-gray-300 text-gray-500 hover:border-brand-500 hover:text-brand-600'} rounded-2xl font-medium transition-colors flex items-center justify-center gap-2`}
            >
              <PlusCircle size={20} />
              {t('groups.createNewGroup', language)}
            </button>
        )}
      </main>
    </div>
  );
};

export default GroupList;
