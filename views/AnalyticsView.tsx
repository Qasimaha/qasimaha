import React from 'react';
import { t } from '../i18n';
import { useApp } from '../context/AppContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { CATEGORY_COLORS, MOCK_CONTACTS } from '../constants';
import { formatSAR } from '../utils/currency';
import { Category } from '../types';

const AnalyticsView: React.FC = () => {
  const { user, groups, isDarkMode, language } = useApp();

  if (!user) return null;

  // 1. Calculate Total Spent across all groups + subscriptions
  let totalSpent = 0;
  const categoryMap: Record<string, number> = {};

  // Analyze Expenses
  groups.forEach(group => {
      // Find expenses made by me
      group.expenses.forEach(exp => {
          if (exp.userId === user.id) {
              totalSpent += exp.amount;
              categoryMap[exp.category] = (categoryMap[exp.category] || 0) + exp.amount;
          }
      });
      // Contributions are arguably spending if they aren't refunded yet, 
      // but "Spending" usually implies expenses. 
      // Let's track actual expenses paid by the user within groups.
  });

  const pieData = Object.keys(categoryMap).map(key => ({
    name: key,
    value: categoryMap[key]
  })).filter(item => item.value > 0);

  // 2. Contributions vs Expenses (Group wise)
  const groupData = groups.map(group => {
      const myContrib = group.members.find(m => m.userId === user.id)?.contributionAmount || 0;
      // My expenses in this group
      const myExpenses = group.expenses.filter(e => e.userId === user.id).reduce((sum, e) => sum + e.amount, 0);
      return {
          name: group.name.length > 10 ? group.name.substring(0, 10) + '...' : group.name,
          contributed: myContrib,
          spent: myExpenses
      };
  });

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} pb-32 p-6 transition-colors`}>
      <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>{t('analytics.title', language)}</h1>

      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} p-6 rounded-2xl shadow-sm border mb-6 text-center`}>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm mb-1`}>{t('analytics.totalSpent', language)}</p>
          <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{formatSAR(totalSpent)}</p>
      </div>

      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} p-6 rounded-2xl shadow-sm border mb-6`}>
          <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>{t('analytics.spendingByCategory', language)}</h3>
          {pieData.length === 0 ? (
              <p className="text-center text-gray-400 py-10">{t('analytics.noData', language)}</p>
          ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name as Category] || '#ccc'} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(val: number) => formatSAR(val)} />
                    <Legend />
                    </PieChart>
                </ResponsiveContainer>
              </div>
          )}
      </div>

      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} p-6 rounded-2xl shadow-sm border`}>
          <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>{t('analytics.groupContributions', language)}</h3>
           {groupData.length === 0 ? (
              <p className="text-center text-gray-400 py-10">{t('analytics.noData', language)}</p>
          ) : (
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={groupData}>
                        <XAxis dataKey="name" fontSize={10} />
                        <YAxis hide />
                        <Tooltip formatter={(val: number) => formatSAR(val)} />
                        <Legend />
                        <Bar dataKey="contributed" name={t('analytics.youPaidIn', language)} fill="#22c55e" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="spent" name={t('analytics.youSpent', language)} fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
          )}
      </div>
    </div>
  );
};

export default AnalyticsView;