import React from 'react';
import { formatSAR } from '../utils/currency';
import { Group } from '../types';
import { CreditCard, Wifi } from 'lucide-react';

interface VirtualCardProps {
  group: Group;
  totalContributed: number;
  totalSpent: number;
}

const VirtualCard: React.FC<VirtualCardProps> = ({ group, totalContributed, totalSpent }) => {
  const balance = totalContributed - totalSpent;

  return (
    <div className="w-full relative h-56 bg-gradient-to-br from-brand-800 via-brand-600 to-brand-500 rounded-2xl shadow-xl overflow-hidden text-white p-6 transform transition-all hover:scale-[1.01]">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-black opacity-10 rounded-full blur-2xl"></div>

      <div className="flex flex-col justify-between h-full relative z-10">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <h3 className="font-bold text-lg tracking-wider opacity-90">Qasimaha</h3>
            <span className="text-xs opacity-75">Shared Wallet</span>
          </div>
          <Wifi className="w-8 h-8 opacity-75 rotate-90" />
        </div>

        <div className="flex items-center space-x-2 my-4">
           <div className="w-12 h-9 bg-yellow-200 rounded flex items-center justify-center bg-opacity-80">
             <div className="w-8 h-6 border border-yellow-600 rounded opacity-50"></div>
           </div>
           <CreditCard className="w-6 h-6 opacity-50" />
        </div>

        <div className="mt-auto">
          <p className="text-xs uppercase opacity-70 mb-1">Current Balance</p>
          <h2 className="text-3xl font-mono font-bold tracking-tight">
            {formatSAR(balance)}
          </h2>
          <div className="flex justify-between items-end mt-2">
             <p className="text-sm font-medium tracking-wide truncate max-w-[70%]">{group.name}</p>
             <p className="text-xs opacity-70">VALID THRU 12/28</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualCard;
