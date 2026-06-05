import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Expense, Category } from '../../types';
import { CATEGORY_COLORS } from '../../constants';
import { formatSAR } from '../../utils/currency';

interface ExpenseBreakdownProps {
  expenses: Expense[];
}

const ExpenseBreakdown: React.FC<ExpenseBreakdownProps> = ({ expenses }) => {
  // Aggregate data
  const dataMap: Record<string, number> = {};
  
  expenses.forEach(exp => {
    dataMap[exp.category] = (dataMap[exp.category] || 0) + exp.amount;
  });

  const data = Object.keys(dataMap).map(key => ({
    name: key,
    value: dataMap[key]
  })).filter(item => item.value > 0);

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
        No expenses yet
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name as Category] || '#ccc'} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => formatSAR(value)}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseBreakdown;
