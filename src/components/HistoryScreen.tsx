import { useState } from 'react';
import { Search, Filter, Trash2, CheckCircle2, AlertTriangle, ChevronRight, FileSpreadsheet, Code, Sparkles, User, Info } from 'lucide-react';
import { TelemetrySession } from '../types';

interface HistoryScreenProps {
  sessions: TelemetrySession[];
  onDeleteSession: (id: string) => void;
  onSelectSession: (session: TelemetrySession) => void;
}

export default function HistoryScreen({
  sessions,
  onDeleteSession,
  onSelectSession
}: HistoryScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Validated' | 'Review Req'>('ALL');
  const [selectedInspectSession, setSelectedInspectSession] = useState<TelemetrySession | null>(null);

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch = session.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          session.details.athlete.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || session.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Search and Filters Section */}
      <section className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#091328] p-5 rounded-2xl border border-[#192540]/30 shadow-md">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#a3aac4]" />
          <input
            type="text"
            placeholder="Search label or athlete..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#141f38] border border-[#40485d]/30 text-sm text-[#dee5ff] rounded-xl focus:outline-none focus:border-[#81ecff]"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-4 py-1.5 text-xs font-medium rounded-xl border transition-all truncate whitespace-nowrap cursor-pointer ${
              statusFilter === 'ALL'
                ? 'bg-[#81ecff]/10 border-[#81ecff]/30 text-[#81ecff]'
                : 'bg-transparent border-[#192540] text-[#a3aac4] hover:text-[#dee5ff]'
            }`}
          >
            All Sessions
          </button>
          <button
            onClick={() => setStatusFilter('Validated')}
            className={`px-4 py-1.5 text-xs font-medium rounded-xl border transition-all truncate whitespace-nowrap cursor-pointer ${
              statusFilter === 'Validated'
                ? 'bg-[#6bfe9c]/10 border-[#6bfe9c]/30 text-[#6bfe9c]'
                : 'bg-transparent border-[#192540] text-[#a3aac4] hover:text-[#6bfe9c]'
            }`}
          >
            Validated
          </button>
          <button
            onClick={() => setStatusFilter('Review Req')}
            className={`px-4 py-1.5 text-xs font-medium rounded-xl border transition-all truncate whitespace-nowrap cursor-pointer ${
              statusFilter === 'Review Req'
                ? 'bg-[#ffe084]/15 border-[#ffe084]/30 text-[#ffe084]'
                : 'bg-transparent border-[#192540] text-[#a3aac4] hover:text-[#ffe084]'
            }`}
          >
            Review Required
          </button>
        </div>
      </section>

      {/* Main Backlog and Inspect Pane split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Collection Lists */}
        <div className="lg:col-span-7 bg-[#091328] rounded-2xl overflow-hidden border border-[#192540]/30 shadow-xl">
          <div className="px-6 py-4 flex justify-between items-center border-l-2 border-[#81ecff] bg-[#141f38]/50">
            <h3 className="font-headline text-lg font-bold uppercase tracking-tight text-[#dee5ff]">
              Stored Telemetry Catalog
            </h3>
            <span className="text-xs font-mono text-[#a3aac4] bg-[#141f38] px-2.5 py-1 rounded-md border border-[#192540]/30">
              {filteredSessions.length} listed
            </span>
          </div>

          <div className="divide-y divide-[#192540]/40 max-h-[500px] overflow-y-auto">
            {filteredSessions.length === 0 ? (
              <div className="p-8 text-center text-sm text-[#a3aac4] space-y-2">
                <Info className="h-8 w-8 text-[#a3aac4]/40 mx-auto" />
                <p>No sessions match current search criteria.</p>
              </div>
            ) : (
              filteredSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => setSelectedInspectSession(session)}
                  className={`flex items-center justify-between p-5 hover:bg-[#141f38]/20 transition-all cursor-pointer group ${
                    selectedInspectSession?.id === session.id ? 'bg-[#141f38]/40 border-r-2 border-[#81ecff]' : ''
                  }`}
                >
                  <div className="space-y-1.5 flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="font-headline font-bold text-sm text-[#dee5ff] truncate group-hover:text-[#81ecff] transition-colors block">
                        {session.label}
                      </span>
                      {session.status === 'Validated' ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#6bfe9c] flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="h-3.5 w-3.5 text-[#ffe084] flex-shrink-0 animate-pulse" />
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#a3aac4]">
                      <span>{session.details.athlete}</span>
                      <span className="text-[#192540] font-bold">•</span>
                      <span>{session.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right">
                      <div className="font-headline font-bold text-base text-[#dee5ff]">
                        {session.kicksCount}
                      </div>
                      <div className="text-[9px] text-[#a3aac4] uppercase font-semibold">Total Kicks</div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (selectedInspectSession?.id === session.id) {
                          setSelectedInspectSession(null);
                        }
                        onDeleteSession(session.id);
                      }}
                      className="p-1.5 text-[#a3aac4]/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer"
                      title="Delete recording"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    
                    <ChevronRight className="h-5 w-5 text-[#a3aac4] group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Deep Biomechanical Sensor inspector */}
        <div className="lg:col-span-5">
          {selectedInspectSession ? (
            <div className="bg-[#091328] rounded-2xl p-6 border border-[#81ecff]/10 shadow-xl space-y-6 animate-fade-in relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-[#81ecff]/2 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex justify-between items-start border-b border-[#192540]/60 pb-3">
                <div className="space-y-1">
                  <span className="text-[10px] text-[#81ecff] uppercase font-bold tracking-widest font-mono">
                    Deep Sensor Probe
                  </span>
                  <h4 className="font-headline text-lg font-bold text-[#dee5ff]">
                    {selectedInspectSession.label}
                  </h4>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                  selectedInspectSession.status === 'Validated'
                    ? 'bg-[#6bfe9c]/10 text-[#6bfe9c]'
                    : 'bg-[#ffe084]/15 text-[#ffe084]'
                }`}>
                  {selectedInspectSession.status}
                </span>
              </div>

              {/* Inspector stats list */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-[#141f38]/30 p-3.5 rounded-xl border border-[#192540]/40">
                  <User className="h-5 w-5 text-[#81ecff]" />
                  <div>
                    <span className="block text-[9px] text-[#a3aac4] uppercase font-semibold">Registered Athlete</span>
                    <span className="text-sm font-bold text-[#dee5ff]">{selectedInspectSession.details.athlete}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#141f38]/60 p-3 rounded-xl border border-[#192540]/30 space-y-1">
                    <span className="block text-[9px] text-[#a3aac4] uppercase">Tracked Duration</span>
                    <span className="block font-headline font-bold text-base text-[#dee5ff]">
                      {selectedInspectSession.details.duration}
                    </span>
                  </div>

                  <div className="bg-[#141f38]/60 p-3 rounded-xl border border-[#192540]/30 space-y-1">
                    <span className="block text-[9px] text-[#a3aac4] uppercase">Avg Ball Speed</span>
                    <span className="block font-headline font-bold text-base text-[#6bfe9c]">
                      {selectedInspectSession.details.avgVelocity} km/h
                    </span>
                  </div>

                  <div className="bg-[#141f38]/60 p-3 rounded-xl border border-[#192540]/30 space-y-1">
                    <span className="block text-[9px] text-[#a3aac4] uppercase">Peak Acceleration</span>
                    <span className="block font-headline font-bold text-base text-[#81ecff]">
                      {selectedInspectSession.details.accelMax} G
                    </span>
                  </div>

                  <div className="bg-[#141f38]/60 p-3 rounded-xl border border-[#192540]/30 space-y-1">
                    <span className="block text-[9px] text-[#a3aac4] uppercase">Mean Gyro Spin</span>
                    <span className="block font-headline font-bold text-base text-[#ffe084]">
                      {selectedInspectSession.details.spinAvg} RPM
                    </span>
                  </div>
                </div>

                <div className="bg-[#141f38]/10 p-4 rounded-xl border border-[#192540]/35 flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#81ecff] animate-pulse" />
                    <span className="text-[#a3aac4]">Sensor Dwell Period:</span>
                  </div>
                  <span className="text-[#81ecff] font-bold">{selectedInspectSession.details.contactDuration} ms</span>
                </div>
              </div>

              {/* Formats info */}
              <div className="pt-4 border-t border-[#192540]/60 flex justify-between items-center text-xs font-mono">
                <span className="text-[#a3aac4]">Supported Formats:</span>
                <div className="flex gap-1.5">
                  {selectedInspectSession.formats.map((f) => (
                    <span key={f} className="bg-[#141f38] px-2 py-0.5 rounded text-[10px] font-bold text-[#81ecff] border border-[#192540]">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#091328] rounded-2xl p-8 border border-dashed border-[#192540] text-center space-y-3 h-full flex flex-col items-center justify-center min-h-[300px]">
              <Sparkles className="h-10 w-10 text-[#a3aac4]/20 animate-pulse" />
              <div className="space-y-1">
                <h4 className="font-headline font-semibold text-sm text-[#dee5ff]">Inspect Metrics Drill</h4>
                <p className="text-xs text-[#a3aac4] max-w-[240px] leading-relaxed mx-auto">
                  Select a session from the catalog timeline to analyze mechanical microdata details.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
