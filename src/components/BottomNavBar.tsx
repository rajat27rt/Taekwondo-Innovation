import { Radio, TrendingUp, History, Share2 } from 'lucide-react';

interface BottomNavBarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isRecording?: boolean;
}

export default function BottomNavBar({ 
  currentTab, 
  setCurrentTab, 
  isRecording = false 
}: BottomNavBarProps) {
  const tabs = [
    { id: 'live', label: 'Live', icon: Radio },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'history', label: 'History', icon: History },
    { id: 'export', label: 'Export', icon: Share2 }
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center h-20 px-4 pb-4 bg-[#091328]/80 backdrop-blur-xl shadow-[0_-4px_24px_rgba(0,0,0,0.4)] z-50 border-t border-[#192540]/30">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={`relative flex flex-col items-center justify-center transition-all cursor-pointer w-20 py-1 ${
              isActive 
                ? 'text-[#81ecff]' 
                : 'text-[#a3aac4] hover:text-[#dee5ff]'
            }`}
          >
            {isActive && (
              <div className="absolute inset-0 bg-[#192540]/60 rounded-xl -z-10 scale-105 border border-[#81ecff]/10" />
            )}
            
            <div className="relative">
              <Icon className="h-6 w-6" />
              {tab.id === 'live' && isRecording && (
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-bounce"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
            </div>
            
            <span className="font-body text-[10px] uppercase tracking-[0.05rem] font-medium mt-1">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
