import { Activity, ShieldAlert } from 'lucide-react';
import { VISUAL_ASSETS } from '../data';

interface HeaderProps {
  isRecording?: boolean;
}

export default function Header({ isRecording = false }: HeaderProps) {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#060e20]/90 backdrop-blur-md border-b border-[#192540]/30 flex justify-between items-center px-6 h-16">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Activity className="h-6 w-6 text-[#81ecff]" />
          {isRecording && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tighter text-[#81ecff] font-headline">
            KINETIC LAB
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {isRecording && (
          <div className="hidden sm:flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full text-xs text-red-400 font-mono animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
            LIVE STREAMING (500Hz)
          </div>
        )}
        <div className="flex items-center gap-3 bg-[#141f38]/50 px-3 py-1.5 rounded-full border border-[#192540]/30">
          <div className="h-6 w-6 rounded-full overflow-hidden border border-[#81ecff]/10">
            <img 
              className="h-full w-full object-cover" 
              referrerPolicy="no-referrer"
              src={VISUAL_ASSETS.analystAvatar} 
              alt="Sports Analyst"
            />
          </div>
          <span className="text-xs font-medium text-[#dee5ff]">Sabomnim Rajat</span>
        </div>
      </div>
    </header>
  );
}
