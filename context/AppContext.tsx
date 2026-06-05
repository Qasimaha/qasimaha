import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Group, User, Member, Expense, Category, Subscription } from '../types';

interface AppContextType {
  user: User | null;
  activeGroup: Group | null;
  groups: Group[];
  subscriptions: Subscription[];
  language: 'en' | 'ar';
  isDarkMode: boolean;
  setLanguage: (lang: 'en' | 'ar') => void;
  setDarkMode: (isDark: boolean) => void;
  login: (name: string, email: string) => void;
  logout: () => void;
  createGroup: (name: string, targetAmount: number, initialMembers?: { name: string; avatar: string }[]) => void;
  setActiveGroupById: (id: string) => void;
  addContribution: (amount: number) => boolean; // Returns success/fail
  addExpense: (amount: number, category: Category, note: string) => void;
  addMember: (name: string, avatar?: string) => void;
  leaveGroup: () => void;
  addSubscription: (sub: Subscription) => void;
  refundToWallet: (amount: number) => void;
  depositToWallet: (amount: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock initial data
const INITIAL_GROUPS: Group[] = [];

const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub_1',
    serviceName: 'Netflix',
    icon: 'N',
    color: 'bg-red-600',
    totalPrice: 45,
    myShare: 15,
    members: [
      { name: 'You' },
      { name: 'Faisal', avatar: 'https://i.pravatar.cc/150?u=c1' },
      { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?u=c4' }
    ],
    renewalDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'sub_2',
    serviceName: 'Spotify',
    icon: 'S',
    color: 'bg-green-500',
    totalPrice: 24,
    myShare: 12,
    members: [
      { name: 'You' },
      { name: 'Khalid', avatar: 'https://i.pravatar.cc/150?u=c3' }
    ],
    renewalDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'sub_3',
    serviceName: 'YouTube',
    icon: 'Y',
    color: 'bg-red-500',
    totalPrice: 30,
    myShare: 10,
    members: [
      { name: 'You' },
      { name: 'Nourah', avatar: 'https://i.pravatar.cc/150?u=c2' },
      { name: 'Omar', avatar: 'https://i.pravatar.cc/150?u=c5' }
    ],
    renewalDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(INITIAL_SUBSCRIPTIONS);
  const [language, setLanguageState] = useState<'en' | 'ar'>('en');
  const [isDarkMode, setDarkModeState] = useState<boolean>(false);

  // Load from local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('Qasimaha_user');
    const storedGroups = localStorage.getItem('Qasimaha_groups');
    const storedSubs = localStorage.getItem('Qasimaha_subs');
    const storedLanguage = localStorage.getItem('Qasimaha_language') as 'en' | 'ar' | null;
    const storedDarkMode = localStorage.getItem('Qasimaha_darkMode');
    
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedGroups) setGroups(JSON.parse(storedGroups));
    if (storedSubs) setSubscriptions(JSON.parse(storedSubs));
    if (storedLanguage) setLanguageState(storedLanguage);
    if (storedDarkMode) setDarkModeState(JSON.parse(storedDarkMode));
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (user) localStorage.setItem('Qasimaha_user', JSON.stringify(user));
    else localStorage.removeItem('Qasimaha_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('Qasimaha_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('Qasimaha_subs', JSON.stringify(subscriptions));
  }, [subscriptions]);

  const activeGroup = activeGroupId ? groups.find(g => g.id === activeGroupId) || null : null;

  const login = (name: string, email: string) => {
    // Initialize with a mock balance of 5000 SAR for demo
    const newUser: User = { 
        id: name.toLowerCase().replace(/\s/g, '_'), 
        name, 
        email,
        personalBalance: 5000 
    };
    setUser(newUser);
    
    // Demo data for received groups
    setGroups(prev => {
      const hasReceived = prev.some(g => g.createdBy !== newUser.id);
      if (!hasReceived) {
        return [...prev, {
          id: 'demo-received-1',
          name: 'Dubai Weekend (Demo)',
          targetAmount: 3000,
          createdAt: new Date().toISOString(),
          createdBy: 'other_user',
          members: [
            { userId: 'other_user', name: 'Khalid', contributionAmount: 1000, hasPaid: true, avatar: 'https://i.pravatar.cc/150?u=c3' },
            { userId: newUser.id, name: newUser.name, contributionAmount: 0, hasPaid: false }
          ],
          expenses: []
        }];
      }
      return prev;
    });
  };

  const logout = () => {
    setUser(null);
    setActiveGroupId(null);
  };

  const setLanguage = (lang: 'en' | 'ar') => {
    setLanguageState(lang);
    localStorage.setItem('Qasimaha_language', lang);
    // Set HTML lang attribute and direction
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  const setDarkMode = (isDark: boolean) => {
    setDarkModeState(isDark);
    localStorage.setItem('Qasimaha_darkMode', JSON.stringify(isDark));
    // Apply dark mode to document
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const createGroup = (name: string, targetAmount: number, initialMembers: { name: string; avatar: string }[] = []) => {
    if (!user) return;
    
    const newMembers: Member[] = [
        {
            userId: user.id,
            name: user.name,
            contributionAmount: 0,
            hasPaid: false
        },
        ...initialMembers.map((m, idx) => ({
            userId: `user_${Date.now()}_${idx}`,
            name: m.name,
            contributionAmount: 0,
            hasPaid: false,
            avatar: m.avatar
        }))
    ];
    
    const newGroup: Group = {
      id: Date.now().toString(),
      name,
      targetAmount,
      createdAt: new Date().toISOString(),
      createdBy: user.id,
      members: newMembers,
      expenses: []
    };

    setGroups(prev => [...prev, newGroup]);
    setActiveGroupId(newGroup.id);
  };

  const setActiveGroupById = (id: string) => {
    setActiveGroupId(id);
  };

  const leaveGroup = () => {
    setActiveGroupId(null);
  };

  const addContribution = (amount: number): boolean => {
    if (!activeGroupId || !user) return false;

    if (user.personalBalance < amount) {
        return false;
    }

    // Deduct from wallet
    setUser(prev => prev ? ({ ...prev, personalBalance: prev.personalBalance - amount }) : null);

    setGroups(prevGroups => prevGroups.map(group => {
      if (group.id !== activeGroupId) return group;

      const updatedMembers = group.members.map(member => {
        if (member.userId === user.id) {
          return {
            ...member,
            contributionAmount: member.contributionAmount + amount,
            hasPaid: (member.contributionAmount + amount) > 0
          };
        }
        return member;
      });

      return { ...group, members: updatedMembers };
    }));
    
    return true;
  };

  const addExpense = (amount: number, category: Category, note: string) => {
    if (!activeGroupId || !user) return;

    const newExpense: Expense = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      amount,
      category,
      date: new Date().toISOString(),
      note
    };

    setGroups(prevGroups => prevGroups.map(group => {
      if (group.id !== activeGroupId) return group;
      return {
        ...group,
        expenses: [newExpense, ...group.expenses]
      };
    }));
  };

  const addMember = (name: string, avatar?: string) => {
    if (!activeGroupId) return;
    
    setGroups(prevGroups => prevGroups.map(group => {
      if (group.id !== activeGroupId) return group;
      
      const newMember: Member = {
        userId: `user_${Date.now()}`,
        name,
        contributionAmount: 0,
        hasPaid: false,
        avatar
      };
      
      return {
        ...group,
        members: [...group.members, newMember]
      };
    }));
  };

  const addSubscription = (sub: Subscription) => {
      setSubscriptions(prev => [...prev, sub]);
  };

  const refundToWallet = (amount: number) => {
      if (!user) return;
      setUser(prev => prev ? ({ ...prev, personalBalance: prev.personalBalance + amount }) : null);
  };

  const depositToWallet = (amount: number) => {
      if (!user) return;
      setUser(prev => prev ? ({ ...prev, personalBalance: prev.personalBalance + amount }) : null);
  };

  return (
    <AppContext.Provider value={{
      user,
      activeGroup,
      groups,
      subscriptions,
      language,
      isDarkMode,
      setLanguage,
      setDarkMode,
      login,
      logout,
      createGroup,
      setActiveGroupById,
      addContribution,
      addExpense,
      addMember,
      leaveGroup,
      addSubscription,
      refundToWallet,
      depositToWallet
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};