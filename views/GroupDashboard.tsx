import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import VirtualCard from '../components/VirtualCard';
import ExpenseBreakdown from '../components/charts/ExpenseBreakdown';
import { formatSAR } from '../utils/currency';
import { Category, RefundResult } from '../types';
import { MOCK_CONTACTS } from '../constants';
import { Plus, Receipt, User as UserIcon, LogOut, Calculator, TrendingUp, AlertCircle, CheckCircle, Wallet, UserPlus, Search, Bell, Check } from 'lucide-react';

const GroupDashboard: React.FC = () => {
  const { activeGroup, addContribution, addExpense, leaveGroup, addMember, refundToWallet, user } = useApp();
  
  // Local state for modals/forms
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showRefund, setShowRefund] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [sentReminders, setSentReminders] = useState<Set<string>>(new Set());
  
  // Form states
  const [contributionAmount, setContributionAmount] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<Category>(Category.FOOD);
  const [expenseNote, setExpenseNote] = useState('');
  const [searchMember, setSearchMember] = useState('');
  const [walletAdded, setWalletAdded] = useState(false);

  if (!activeGroup) return null;

  // Derived Stats
  const totalContributed = activeGroup.members.reduce((sum, m) => sum + m.contributionAmount, 0);
  const totalSpent = activeGroup.expenses.reduce((sum, e) => sum + e.amount, 0);
  const balance = totalContributed - totalSpent;
  const progressPercentage = Math.min((totalContributed / activeGroup.targetAmount) * 100, 100);

  // Handlers
  const handleContribute = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const amount = parseFloat(contributionAmount);
    if (amount > 0) {
      const success = addContribution(amount);
      if (success) {
          setContributionAmount('');
          setShowAddMoney(false);
      } else {
          setErrorMsg('Insufficient funds in personal wallet.');
      }
    }
  };

  const handleExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(expenseAmount);
    if (amount > 0) {
      addExpense(amount, expenseCategory, expenseNote);
      setExpenseAmount('');
      setExpenseNote('');
      setShowAddExpense(false);
    }
  };

  const handleAddMember = (name: string, avatar?: string) => {
      addMember(name, avatar);
      setShowAddMember(false);
      setSearchMember('');
  };

  const handleAddToWallet = () => {
      setWalletAdded(true);
      setTimeout(() => setWalletAdded(false), 3000);
  };
  
  const handleRemind = (userId: string) => {
      setSentReminders(prev => new Set(prev).add(userId));
  };

  const handleRefund = () => {
      // Find my share of the refund
      const myRefund = calculateRefunds().find(r => r.userId === user?.id);
      if (myRefund && myRefund.refundAmount > 0) {
          refundToWallet(myRefund.refundAmount);
          alert(`Refunded ${formatSAR(myRefund.refundAmount)} to your personal wallet!`);
          leaveGroup();
      } else {
          alert('No refund available for you.');
          leaveGroup();
      }
  };

  // Refund Calculation
  const calculateRefunds = (): RefundResult[] => {
    if (totalContributed === 0) return [];
    
    return activeGroup.members.map(member => {
      const share = member.contributionAmount / totalContributed;
      return {
        userId: member.userId,
        userName: member.name,
        refundAmount: balance * share,
        percentage: share * 100
      };
    });
  };

  const refunds = calculateRefunds();

  // Filter contacts excluding already added members
  const availableContacts = MOCK_CONTACTS.filter(
      contact => !activeGroup.members.some(m => m.name === contact.name) && 
                 contact.name.toLowerCase().includes(searchMember.toLowerCase())
  );

  return (
    <div className="pb-32"> {/* Padding for bottom safe area + footer */}
      
      {/* Header */}
      <header className="bg-white px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-20">
        <div>
          <h1 className="text-xl font-bold text-gray-900 truncate max-w-[200px]">{activeGroup.name}</h1>
          <p className="text-xs text-gray-500">Target: {formatSAR(activeGroup.targetAmount)}</p>
        </div>
        <button onClick={leaveGroup} className="p-2 text-gray-500 hover:text-red-600 transition-colors">
          <LogOut size={20} />
        </button>
      </header>

      <div className="p-6 space-y-6 max-w-2xl mx-auto">
        
        {/* Virtual Card Area */}
        <section>
          <VirtualCard group={activeGroup} totalContributed={totalContributed} totalSpent={totalSpent} />
          
          {/* Add to Wallet Button */}
          <div className="mt-4 flex justify-center">
              <button 
                onClick={handleAddToWallet}
                className="bg-black text-white px-5 py-2.5 rounded-full flex items-center space-x-2 shadow-lg hover:bg-gray-800 transition-all active:scale-95"
              >
                  <Wallet size={16} />
                  <span className="text-sm font-medium">
                      {walletAdded ? 'Added to Wallet' : 'Add to Apple Wallet'}
                  </span>
              </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Collected</span>
              <span className="font-semibold text-brand-700">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-brand-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => setShowAddMoney(true)}
            className="flex items-center justify-center space-x-2 bg-brand-50 text-brand-700 py-3 rounded-xl font-semibold border border-brand-200 hover:bg-brand-100 transition-colors"
          >
            <Plus size={20} />
            <span>Add Funds</span>
          </button>
          <button 
            onClick={() => setShowAddExpense(true)}
            className="flex items-center justify-center space-x-2 bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
          >
            <CreditCardIcon size={20} />
            <span>Use Card</span>
          </button>
        </section>

        {/* Analytics & Expenses */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold text-gray-800 flex items-center">
              <TrendingUp size={18} className="mr-2 text-brand-600"/>
              Analytics (SAR)
            </h2>
          </div>
          <div className="p-4">
            <ExpenseBreakdown expenses={activeGroup.expenses} />
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-gray-500">Total In</p>
                <p className="font-bold text-green-600">{formatSAR(totalContributed)}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-gray-500">Total Out</p>
                <p className="font-bold text-red-500">{formatSAR(totalSpent)}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-gray-500">Left</p>
                <p className="font-bold text-brand-700">{formatSAR(balance)}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Members List */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100">
           <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold text-gray-800 flex items-center">
              <UserIcon size={18} className="mr-2 text-gray-500"/>
              Contribution Status
            </h2>
            <button 
                onClick={() => setShowAddMember(true)}
                className="text-brand-600 hover:text-brand-700 text-sm font-medium flex items-center bg-brand-50 px-3 py-1.5 rounded-full"
            >
                <UserPlus size={14} className="mr-1"/> Add
            </button>
          </div>
          <ul className="divide-y divide-gray-50">
            {activeGroup.members.map(member => {
               const paid = member.contributionAmount > 0;
               const isReminded = sentReminders.has(member.userId);
               return (
                <li key={member.userId} className="px-5 py-3 flex justify-between items-center">
                    <div className="flex items-center">
                        {member.avatar ? (
                            <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover mr-3 border border-gray-100" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 mr-3">
                                {member.name.charAt(0)}
                            </div>
                        )}
                        <div>
                            <span className="font-medium text-gray-900 block">{member.name}</span>
                            {!paid && <span className="text-[10px] text-red-500 font-bold bg-red-50 px-1.5 py-0.5 rounded">Didn't Pay</span>}
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className={`font-mono font-medium ${paid ? 'text-green-600' : 'text-gray-400'}`}>
                        {formatSAR(member.contributionAmount)}
                        </span>
                        {!paid && (
                            <button 
                                onClick={() => handleRemind(member.userId)}
                                disabled={isReminded}
                                className={`text-xs px-2 py-1 rounded transition-colors flex items-center ${isReminded ? 'bg-green-100 text-green-700 cursor-default' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                {isReminded ? <><Check size={12} className="mr-1"/> Sent</> : 'Remind'}
                            </button>
                        )}
                    </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Recent Activity */}
        <section>
          <h2 className="font-bold text-gray-800 mb-3 ml-1">Recent Activity</h2>
          <div className="space-y-3">
            {activeGroup.expenses.length === 0 ? (
              <p className="text-center text-gray-400 py-6 italic">No transactions yet</p>
            ) : (
              activeGroup.expenses.map(expense => (
                <div key={expense.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                  <div className="flex items-start space-x-3">
                    <div className="bg-red-50 p-2 rounded-lg text-red-500 mt-1">
                      <Receipt size={16} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{expense.category}</p>
                      <p className="text-xs text-gray-500">{expense.note || expense.userName}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{new Date(expense.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="font-bold text-red-500">-{formatSAR(expense.amount)}</span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Refund Button */}
        <button 
          onClick={() => setShowRefund(true)}
          className="w-full bg-white border border-gray-200 text-gray-700 py-4 rounded-xl font-medium shadow-sm flex items-center justify-center gap-2 hover:bg-gray-50"
        >
          <Calculator size={20} />
          Refund Remaining Balance
        </button>

      </div>

      {/* MODAL: Add Contribution */}
      {showAddMoney && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-4">Add Contribution</h3>
            <p className="text-sm text-gray-500 mb-4">Funds will be deducted from your personal wallet.</p>
            {errorMsg && <p className="text-red-500 text-sm mb-2">{errorMsg}</p>}
            <form onSubmit={handleContribute}>
              <div className="mb-4">
                <label className="text-sm text-gray-500 mb-1 block">Amount ({formatSAR(0).split(' ')[1]})</label>
                <input 
                  type="number" 
                  step="0.01"
                  autoFocus
                  className="w-full text-3xl font-bold border-b-2 border-brand-500 focus:outline-none py-2"
                  placeholder="0.00"
                  value={contributionAmount}
                  onChange={e => setContributionAmount(e.target.value)}
                />
                <p className="text-xs text-gray-400 mt-2">Available in Wallet: {formatSAR(user?.personalBalance || 0)}</p>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowAddMoney(false)} className="flex-1 py-3 text-gray-600 font-medium">Cancel</button>
                <button type="submit" className="flex-1 bg-brand-600 text-white rounded-xl font-bold shadow-lg shadow-brand-500/30">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Expense */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-4">Record Expense</h3>
            <form onSubmit={handleExpense} className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Amount ({formatSAR(0).split(' ')[1]})</label>
                <input 
                  type="number" 
                  step="0.01"
                  autoFocus
                  className="w-full text-3xl font-bold border-b-2 border-red-500 focus:outline-none py-2 text-red-600"
                  placeholder="0.00"
                  value={expenseAmount}
                  onChange={e => setExpenseAmount(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Category</label>
                <select 
                  className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200"
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value as Category)}
                >
                  {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Note</label>
                <input 
                  type="text" 
                  className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200"
                  placeholder="e.g. Dinner at Al-Baik"
                  value={expenseNote}
                  onChange={e => setExpenseNote(e.target.value)}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddExpense(false)} className="flex-1 py-3 text-gray-600 font-medium">Cancel</button>
                <button type="submit" className="flex-1 bg-gray-900 text-white rounded-xl font-bold shadow-lg">Pay</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* MODAL: Add Member Selection */}
      {showAddMember && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 sm:p-0">
            <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-sm h-[80vh] sm:h-[600px] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
                
                <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold">Add Member</h3>
                    <button onClick={() => setShowAddMember(false)} className="bg-gray-100 p-2 rounded-full text-gray-500">
                        <LogOut className="rotate-180" size={16}/>
                    </button>
                </div>
                
                <div className="p-4 border-b border-gray-100">
                     <div className="relative">
                        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input 
                            type="text"
                            placeholder="Search contacts..."
                            className="w-full bg-gray-50 pl-10 pr-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-brand-500"
                            value={searchMember}
                            onChange={(e) => setSearchMember(e.target.value)}
                        />
                     </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                    {availableContacts.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">
                            <p>No contacts found.</p>
                        </div>
                    ) : (
                        availableContacts.map(contact => (
                            <button 
                                key={contact.id}
                                onClick={() => handleAddMember(contact.name, contact.avatar)}
                                className="w-full p-3 flex items-center space-x-4 hover:bg-gray-50 rounded-xl transition-colors text-left"
                            >
                                <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full object-cover" />
                                <div>
                                    <p className="font-bold text-gray-800">{contact.name}</p>
                                    <p className="text-xs text-gray-500">In your contacts</p>
                                </div>
                                <div className="ml-auto bg-brand-50 text-brand-600 p-2 rounded-full">
                                    <Plus size={16} />
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
      )}

      {/* MODAL: Refund Simulation */}
      {showRefund && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 sm:p-0">
           <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 shadow-2xl h-[80vh] sm:h-auto overflow-y-auto">
             <div className="flex justify-between items-start mb-6">
                <div>
                   <h3 className="text-2xl font-bold text-gray-800">Refund Simulation</h3>
                   <p className="text-sm text-gray-500">Distributing {formatSAR(balance)} based on contribution %</p>
                </div>
                <button onClick={() => setShowRefund(false)} className="bg-gray-100 p-2 rounded-full"><LogOut className="rotate-180" size={20}/></button>
             </div>
             
             {balance <= 0 ? (
               <div className="text-center py-8">
                 <AlertCircle size={48} className="mx-auto text-gray-300 mb-4"/>
                 <p className="text-gray-500">No remaining balance to refund.</p>
               </div>
             ) : (
               <div className="space-y-4">
                 {refunds.map(refund => (
                   <div key={refund.userId} className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
                      <div>
                        <p className="font-bold text-gray-800">{refund.userName}</p>
                        <p className="text-xs text-green-600">Contributed {Math.round(refund.percentage)}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-700">+{formatSAR(refund.refundAmount)}</p>
                        <p className="text-xs text-green-600">Refund</p>
                      </div>
                   </div>
                 ))}
                 <div className="mt-6 bg-blue-50 p-4 rounded-xl flex items-start gap-3">
                    <CheckCircle className="text-blue-600 shrink-0 mt-0.5" size={20} />
                    <p className="text-sm text-blue-800">
                      This calculation ensures everyone gets back a fair share of the leftover pot based on how much they originally put in.
                    </p>
                 </div>
               </div>
             )}
             
             <button onClick={handleRefund} className="w-full mt-6 bg-gray-900 text-white py-4 rounded-xl font-bold">Close & Refund to Wallet</button>
           </div>
        </div>
      )}

    </div>
  );
};

// Helper icon component to avoid collision
const CreditCardIcon = ({size}: {size: number}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/><line x1="2" x2="22" y1="6" y2="6"/><line x1="2" x2="22" y1="14" y2="14"/></svg>
)

export default GroupDashboard;