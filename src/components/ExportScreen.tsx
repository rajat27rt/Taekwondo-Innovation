import { useState } from 'react';
import { 
  Settings, 
  Share2, 
  Filter, 
  RefreshCw, 
  PlusCircle, 
  Activity, 
  ArrowRight, 
  Code, 
  Table, 
  Cpu, 
  Check, 
  ShieldAlert, 
  Download, 
  Sparkles,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { TelemetrySession, AnalystPlatform } from '../types';
import { VISUAL_ASSETS } from '../data';

interface ExportScreenProps {
  sessions: TelemetrySession[];
  platforms: AnalystPlatform[];
  onTogglePlatform: (id: string, newStatus: 'active' | 'linked' | 'offline') => void;
  onNavigateToTab: (tab: string) => void;
}

export default function ExportScreen({
  sessions,
  platforms,
  onTogglePlatform,
  onNavigateToTab
}: ExportScreenProps) {
  // Checkbox Selection State
  const [selectedSessionIds, setSelectedSessionIds] = useState<string[]>(['s2', 's4']);
  const [exportPreset, setExportPreset] = useState<'JSON' | 'CSV'>('JSON');
  
  // Pipeline Compiling overlay state
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportMessage, setExportMessage] = useState('');
  const [exportedPayload, setExportedPayload] = useState<string>('');
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  // Platform Integration popup states
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [selectedPlatformForSync, setSelectedPlatformForSync] = useState<string | null>(null);
  const [apiSecretInput, setApiSecretInput] = useState('');
  const [targetPlatformId, setTargetPlatformId] = useState('');

  // Config settings state
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [sampleFrequency, setSampleFrequency] = useState('500Hz');
  const [compressionMode, setCompressionMode] = useState('GZIP Medium');

  // Multi-select actions
  const toggleSelectSession = (id: string) => {
    setSelectedSessionIds(prev => 
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedSessionIds.length === sessions.length) {
      setSelectedSessionIds([]);
    } else {
      setSelectedSessionIds(sessions.map(s => s.id));
    }
  };

  // Connect platform action
  const handleConnectPlatform = (id: string) => {
    const plat = platforms.find(p => p.id === id);
    if (!plat) return;
    if (plat.status === 'offline') {
      setTargetPlatformId(id);
      setApiSecretInput('');
      setApiKeyModalOpen(true);
    } else {
      // Toggle back to offline / disconnected
      onTogglePlatform(id, 'offline');
    }
  };

  // Compile & Export Generator
  const triggerCompilePipeline = () => {
    if (selectedSessionIds.length === 0) {
      alert('Hold on, select at least one session from the Repository list to export.');
      return;
    }

    setIsExporting(true);
    setExportProgress(5);
    setExportMessage('Initializing data pipeline, parsing checksum hashes...');

    const stages = [
      { prg: 20, msg: 'Decoding gyroscopic angular velocities (200Hz)...' },
      { prg: 45, msg: 'Parsing high-speed G-force thresholds and biomechanics...' },
      { prg: 75, msg: 'Formatting structured data & syncing active platforms...' },
      { prg: 95, msg: 'Signing secure data payload with SHA-256 blocks...' },
      { prg: 100, msg: 'Complete!' }
    ];

    let currentStageIndex = 0;
    const interval = setInterval(() => {
      if (currentStageIndex < stages.length) {
        const stage = stages[currentStageIndex];
        setExportProgress(stage.prg);
        setExportMessage(stage.msg);
        currentStageIndex++;
      } else {
        clearInterval(interval);
        
        // Build payload data dynamically based on selections
        const targetSessions = sessions.filter(s => selectedSessionIds.includes(s.id));
        let result = '';
        
        if (exportPreset === 'JSON') {
          const jsonArr = targetSessions.map(s => ({
            session: s.label,
            athlete: s.details.athlete,
            date: s.date,
            contact_ms: s.details.contactDuration,
            avg_velocity_kmh: s.details.avgVelocity,
            peak_accel_g: s.details.accelMax,
            spin_rpm: s.details.spinAvg,
            kicks_registered: s.kicksCount,
            hash: 'KINETIC_' + s.id.toUpperCase() + '_' + Math.floor(Math.random() * 900000 + 100000)
          }));
          result = JSON.stringify(jsonArr, null, 2);
        } else {
          // CSV structure
          result = "Session_Code,Athlete_Label,Session_Date,Contact_Duration_MS,Avg_Velocity_KMH,Peak_Accel_G,Spin_Rate_RPM,Kicks_Count,Validation_State\n";
          targetSessions.forEach(s => {
            result += `"${s.label}","${s.details.athlete}","${s.date}",${s.details.contactDuration},${s.details.avgVelocity},${s.details.accelMax},${s.details.spinAvg},${s.kicksCount},"${s.status}"\n`;
          });
        }

        setExportedPayload(result);
        setIsExporting(false);
        setSuccessModalOpen(true);

        // Download file triggered gracefully!
        const blob = new Blob([result], { type: exportPreset === 'JSON' ? 'application/json' : 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `kinetic_lab_export_${Date.now()}.${exportPreset.toLowerCase()}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    }, 450);
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Top action layout header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="font-body text-[10px] uppercase tracking-[0.15rem] text-[#a3aac4] font-medium">Data Pipeline</span>
          <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter text-[#dee5ff]">Export &amp; Integration</h2>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setConfigModalOpen(true)}
            className="bg-[#141f38] hover:bg-[#192540] transition-colors px-6 py-3 rounded-xl flex items-center gap-2 border border-[#40485d]/20 cursor-pointer"
          >
            <Settings className="h-4 w-4 text-[#a3aac4]" />
            <span className="font-body text-sm font-medium text-[#dee5ff]">Config</span>
          </button>
          <button 
            onClick={triggerCompilePipeline}
            className="bg-gradient-to-r from-[#81ecff] to-[#00e3fd] text-[#003840] font-bold px-8 py-3 rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(129,236,255,0.2)] hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
          >
            <Share2 className="h-4 w-4 fill-current" />
            <span className="font-body text-sm uppercase tracking-wider">Execute Export</span>
          </button>
        </div>
      </section>

      {/* Grid splits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column repository & formats */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#091328] rounded-2xl overflow-hidden shadow-2xl border border-[#192540]/30 animate-fade-in">
            <div className="px-6 py-4 flex justify-between items-center border-l-2 border-[#81ecff] bg-[#141f38]/50">
              <h3 className="font-headline text-lg font-semibold uppercase tracking-tight text-[#dee5ff]">
                Session Repository
              </h3>
              <div className="flex items-center gap-4 text-[#a3aac4]">
                <span className="font-body text-xs uppercase tracking-wider">Filter: 7 Days</span>
                <Filter className="h-4 w-4 cursor-pointer hover:text-[#dee5ff]" />
              </div>
            </div>

            {/* Table layout headers */}
            <div className="grid grid-cols-12 px-6 py-3 border-b border-[#40485d]/10 text-[#a3aac4] font-body text-[10px] uppercase tracking-wider bg-[#000000]/30 select-none">
              <div className="col-span-1 flex justify-center items-center">
                <input 
                  type="checkbox"
                  checked={selectedSessionIds.length === sessions.length}
                  onChange={toggleSelectAll}
                  className="rounded border-[#40485d] bg-[#0f1930] text-[#81ecff] focus:ring-[#81ecff] h-4 w-4 cursor-pointer"
                />
              </div>
              <div className="col-span-5">Session Detail</div>
              <div className="col-span-2">Format</div>
              <div className="col-span-2 text-right">Kicks</div>
              <div className="col-span-2 text-right">Status</div>
            </div>

            {/* Session item rows */}
            <div className="divide-y divide-[#40485d]/5">
              {sessions.map((session) => {
                const isChecked = selectedSessionIds.includes(session.id);
                return (
                  <div 
                    key={session.id}
                    onClick={() => toggleSelectSession(session.id)}
                    className="grid grid-cols-12 px-6 py-5 items-center hover:bg-[#192540]/25 transition-colors cursor-pointer group"
                  >
                    <div className="col-span-1 flex justify-center items-center" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelectSession(session.id)}
                        className="rounded border-[#40485d] bg-[#0f1930] text-[#81ecff] focus:ring-[#81ecff] h-4 w-4 cursor-pointer"
                      />
                    </div>
                    
                    <div className="col-span-5 space-y-1 pr-2">
                      <div className="font-semibold text-sm text-[#dee5ff] group-hover:text-[#81ecff] transition-colors truncate">
                        {session.label}
                      </div>
                      <div className="text-xs text-[#a3aac4] truncate">
                        {session.date} • {session.time}
                      </div>
                    </div>
                    
                    <div className="col-span-2 flex gap-1.5 flex-wrap">
                      {session.formats.map(f => (
                        <span key={f} className="bg-[#141f38] border border-[#141f38] px-2 py-0.5 rounded text-[10px] font-bold text-[#81ecff]">
                          {f}
                        </span>
                      ))}
                    </div>
                    
                    <div className="col-span-2 text-right font-headline text-lg font-medium text-[#dee5ff]">
                      {session.kicksCount}
                    </div>
                    
                    <div className="col-span-2 flex justify-end">
                      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                        session.status === 'Validated' 
                          ? 'bg-[#6bfe9c]/10 text-[#6bfe9c]' 
                          : 'bg-[#ffe084]/15 text-[#ffe084]'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${session.status === 'Validated' ? 'bg-[#6bfe9c]' : 'bg-[#ffe084]'}`}></span>
                        {session.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Export config presets bento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              onClick={() => setExportPreset('JSON')}
              className={`p-6 rounded-2xl border-l-2 transition-all cursor-pointer shadow-md select-none ${
                exportPreset === 'JSON'
                  ? 'bg-[#141f38] border-[#81ecff] scale-[1.01]' 
                  : 'bg-[#091328] border-transparent opacity-80 hover:opacity-100 hover:bg-[#141f38]/40'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                  exportPreset === 'JSON' ? 'bg-[#81ecff]/10 text-[#81ecff]' : 'bg-[#141f38] text-[#a3aac4]'
                }`}>
                  <Code className="h-5 w-5" />
                </div>
                {exportPreset === 'JSON' ? (
                  <span className="font-body text-[10px] font-bold text-[#81ecff] bg-[#81ecff]/10 px-2.5 py-1 rounded-full border border-[#81ecff]/20 uppercase">
                    DEFAULT SELECTED
                  </span>
                ) : (
                  <span className="font-body text-[10px] text-[#a3aac4]">DEFAULT</span>
                )}
              </div>
              <h4 className="font-headline font-bold text-sm text-[#dee5ff] mb-2">Technical Telemetry (JSON)</h4>
              <p className="text-xs text-[#a3aac4] leading-relaxed">
                Full raw kinematic sensor data including 3D orientation vector frames, impact force values, and angular gyroscopic velocities.
              </p>
            </div>

            <div 
              onClick={() => setExportPreset('CSV')}
              className={`p-6 rounded-2xl border-l-2 transition-all cursor-pointer shadow-md select-none ${
                exportPreset === 'CSV'
                  ? 'bg-[#141f38] border-[#81ecff] scale-[1.01]' 
                  : 'bg-[#091328] border-transparent opacity-80 hover:opacity-100 hover:bg-[#141f38]/40'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                  exportPreset === 'CSV' ? 'bg-[#81ecff]/10 text-[#81ecff]' : 'bg-[#141f38] text-[#a3aac4]'
                }`}>
                  <Table className="h-5 w-5" />
                </div>
                {exportPreset === 'CSV' ? (
                  <span className="font-body text-[10px] font-bold text-[#81ecff] bg-[#81ecff]/10 px-2.5 py-1 rounded-full border border-[#81ecff]/20 uppercase">
                    OPTIMIZED SELECTED
                  </span>
                ) : (
                  <span className="font-body text-[10px] text-[#a3aac4]">OPTIMIZED</span>
                )}
              </div>
              <h4 className="font-headline font-bold text-sm text-[#dee5ff] mb-2">Performance Summary (CSV)</h4>
              <p className="text-xs text-[#a3aac4] leading-relaxed">
                Aggregated statistics per kick drill: average velocity, terminal G-force peaks, rotational coefficients, and spatial boot indices.
              </p>
            </div>
          </div>
        </div>

        {/* Right column integrations & sync health */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Analyst platforms card */}
          <div className="bg-[#091328] p-6 rounded-2xl border border-[#192540]/30 shadow-2xl space-y-6">
            <h3 className="font-headline text-xs font-bold uppercase tracking-widest text-[#a3aac4] border-b border-[#192540]/50 pb-3">
              Analyst Platforms
            </h3>

            <div className="space-y-4">
              {platforms.map((platform) => {
                const isActive = platform.status !== 'offline';
                return (
                  <div 
                    key={platform.id}
                    className={`flex items-center justify-between p-4 bg-[#000000]/30 rounded-xl transition-all ${
                      !isActive ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center p-1.5 flex-shrink-0">
                        {platform.logoUrl ? (
                          <img 
                            src={platform.logoUrl} 
                            alt={platform.name}
                            referrerPolicy="no-referrer"
                            className={`opacity-80 object-contain w-full h-full ${!isActive ? 'grayscale' : ''}`}
                          />
                        ) : (
                          <Cpu className="h-4 w-4 text-[#a3aac4]" />
                        )}
                      </div>
                      
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-[#dee5ff] truncate">{platform.name}</div>
                        <div className={`text-[10px] flex items-center gap-1 uppercase font-bold tracking-tighter mt-0.5 ${
                          isActive ? 'text-[#6bfe9c]' : 'text-[#a3aac4]'
                        }`}>
                          <span className={`w-1 h-1 rounded-full ${isActive ? 'bg-[#6bfe9c] animate-pulse' : 'bg-[#a3aac4]'}`} />
                          {platform.status === 'active' ? 'Active' : platform.status === 'linked' ? 'Linked' : 'Offline'}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleConnectPlatform(platform.id)}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                        isActive
                          ? 'bg-[#192540]/40 border-[#40485d]/30 text-[#a3aac4] hover:text-[#dee5ff]'
                          : 'bg-[#81ecff]/10 border-[#81ecff]/20 text-[#81ecff] hover:bg-[#81ecff]/20'
                      }`}
                      title={isActive ? 'Sync / Disconnect' : 'Connect platform'}
                    >
                      {isActive ? (
                        <RefreshCw className="h-3.5 w-3.5" />
                      ) : (
                        <PlusCircle className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={() => {
                setTargetPlatformId('');
                setApiSecretInput('');
                setApiKeyModalOpen(true);
              }}
              className="w-full py-3 rounded-xl border border-dashed border-[#40485d]/50 text-[#a3aac4] hover:text-[#dee5ff] hover:border-[#81ecff]/30 transition-all text-xs font-body uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlusCircle className="h-4 w-4" />
              Request API Key
            </button>
          </div>

          {/* Connected Live Sync bridge status */}
          <div className="bg-[#141f38] rounded-2xl p-6 space-y-4 shadow-xl border border-[#192540]/30 relative overflow-hidden">
            <div className="flex justify-between items-center">
              <span className="font-body text-[10px] uppercase tracking-widest font-bold text-[#a3aac4]">Bridge Health</span>
              <span className="text-[#6bfe9c] font-mono text-xs font-bold">99.9%</span>
            </div>
            
            <div className="h-1.5 w-full bg-[#000000] rounded-full overflow-hidden">
              <div className="h-full w-[99.9%] bg-[#6bfe9c] shadow-[0_0_8px_rgba(107,254,156,0.4)]"></div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#192540]/50 font-mono">
              <div>
                <div className="text-[10px] text-[#a3aac4] uppercase">Latency</div>
                <div className="font-headline font-bold text-lg text-[#dee5ff]">14ms</div>
              </div>
              
              <div>
                <div className="text-[10px] text-[#a3aac4] uppercase">Data Rate</div>
                <div className="font-headline font-bold text-lg text-[#dee5ff]">4.2MB/s</div>
              </div>
            </div>
          </div>

          {/* Quick Preview navigation asset card */}
          <div 
            onClick={() => onNavigateToTab('trends')}
            className="relative h-48 rounded-2xl overflow-hidden group shadow-2xl border border-[#192540]/30 cursor-pointer"
          >
            <img 
              className="absolute inset-0 w-full h-full object-cover brightness-50 group-hover:scale-105 transition-transform duration-700" 
              src={VISUAL_ASSETS.quickPreviewKick} 
              alt="Soccer Kick"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060e20] to-transparent" />
            
            <div className="absolute bottom-5 left-5 right-5">
              <div className="font-headline font-bold text-lg text-[#dee5ff] mb-1">Session Visualizer</div>
              <div className="text-[10px] text-[#81ecff] uppercase font-bold tracking-widest flex items-center gap-2">
                Go to Analysis <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* API Key Connection Modal */}
      {apiKeyModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#000000]/80 backdrop-blur-md">
          <div className="bg-[#0f1930] w-full max-w-md p-6 rounded-2xl border border-[#81ecff]/20 shadow-2xl space-y-5">
            <h3 className="font-headline text-lg font-bold text-[#81ecff] uppercase tracking-tight">
              {targetPlatformId ? 'Connect Analyst Bridge' : 'Request Analyst Integration'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-[#a3aac4] mb-1.5 uppercase font-body font-semibold tracking-wider">
                  Target Platform Bridge
                </label>
                <select
                  value={targetPlatformId}
                  onChange={(e) => setTargetPlatformId(e.target.value)}
                  disabled={platforms.some(p => p.id === targetPlatformId && p.status !== 'offline')}
                  className="w-full px-4 py-2.5 bg-[#192540] border border-[#40485d]/40 text-[#dee5ff] text-sm rounded-xl"
                >
                  <option value="">Select Platform...</option>
                  <option value="p1">StatsPerform Integration API</option>
                  <option value="p2">Catapult Sports Bridge</option>
                  <option value="p3">Hudl Review Sync Interface</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs text-[#a3aac4] uppercase font-body font-semibold tracking-wider">
                    API Secret Token
                  </label>
                  <span className="flex items-center gap-1 text-[10px] text-[#6bfe9c]">
                    <Lock className="h-3 w-3" /> Secure End-to-End
                  </span>
                </div>
                
                <input
                  type="password"
                  value={apiSecretInput}
                  onChange={(e) => setApiSecretInput(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#192540] border border-[#40485d]/40 text-[#dee5ff] text-sm rounded-xl font-mono"
                  placeholder="Paste your developer private token key..."
                />
              </div>

              <p className="text-[10px] text-[#a3aac4] leading-normal italic">
                * By linking your developer secrets, Kinetic Lab will automatically transmit biomechanical session summaries whenever a session is flagged "Validated".
              </p>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button 
                onClick={() => setApiKeyModalOpen(false)}
                className="px-4 py-2 bg-[#192540] hover:bg-[#1f2b49] text-xs text-[#dee5ff] rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (!targetPlatformId || !apiSecretInput) {
                    alert('Please specify both a target platform and your developer security token to initiate validation.');
                    return;
                  }
                  onTogglePlatform(targetPlatformId, 'active');
                  setApiKeyModalOpen(false);
                }}
                className="px-6 py-2 bg-gradient-to-r from-[#81ecff] to-[#00e3fd] text-[#003840] font-bold text-xs rounded-xl cursor-pointer"
              >
                Authenticate Bridge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Pipeline Loading Overlay */}
      {isExporting && (
        <div className="fixed inset-0 z-[101] flex flex-col items-center justify-center p-6 bg-[#000000]/90 backdrop-blur-md space-y-6">
          <div className="relative w-40 h-40">
            {/* Spinning vector borders */}
            <div className="absolute inset-0 border-4 border-[#81ecff]/10 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-[#81ecff] rounded-full animate-spin"></div>
            
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <Cpu className="h-10 w-10 text-[#81ecff] animate-pulse" />
              <span className="font-headline font-bold text-[18px] text-[#dee5ff] mt-2 font-mono">
                {exportProgress}%
              </span>
            </div>
          </div>
          
          <div className="text-center space-y-2 max-w-sm">
            <h4 className="font-headline font-bold text-lg text-[#dee5ff] uppercase tracking-wide">
              Compiling Kinetic Bundles
            </h4>
            <p className="text-xs text-[#a3aac4] italic animate-pulse font-mono tracking-wide leading-relaxed">
              {exportMessage}
            </p>
          </div>

          <div className="w-64 h-1.5 bg-[#141f38] rounded-full overflow-hidden border border-[#40485d]/20">
            <div 
              className="h-full bg-gradient-to-r from-[#81ecff] to-[#00e3fd] transition-all duration-300" 
              style={{ width: `${exportProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Success Modal / Compiled Payload Output */}
      {successModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#000000]/80 backdrop-blur-md">
          <div className="bg-[#0f1930] w-full max-w-2xl p-6 rounded-2xl border border-[#6bfe9c]/20 shadow-2xl space-y-5 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-[#192540] pb-3 flex-shrink-0">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#6bfe9c]" />
                <h3 className="font-headline text-lg font-bold text-[#6bfe9c] uppercase tracking-tight">
                  Pipeline Compiled Successfully!
                </h3>
              </div>
              <span className="bg-[#6bfe9c]/10 text-[#6bfe9c] text-[10px] px-2 py-0.5 rounded-full font-bold">
                EXPORT COMPLETING
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-hidden flex flex-col">
              <p className="text-xs text-[#a3aac4] leading-relaxed">
                We compiled <strong className="text-[#81ecff]">{selectedSessionIds.length} select files</strong> into format <strong className="text-[#ffe084]">{exportPreset}</strong>. The browser has triggered a save event locally. You may inspect or copy the raw text bundle output console below:
              </p>
              
              <div className="flex-1 overflow-y-auto bg-[#060e20] p-4 rounded-xl border border-[#192540] font-mono text-xs text-[#81ecff] select-all max-h-60 leading-relaxed whitespace-pre font-medium">
                {exportedPayload}
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-3 border-t border-[#192540] flex-shrink-0">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(exportedPayload)
                    .then(() => alert('Compiled payload copy completed to clipboard!'))
                    .catch(() => alert('Clipboard copy denied, manual highlight requested.'));
                }}
                className="px-4 py-2 bg-[#192540] hover:bg-[#1f2b49] text-xs text-[#dee5ff] rounded-xl font-medium cursor-pointer"
              >
                Copy Raw Payload
              </button>
              <button 
                onClick={() => setSuccessModalOpen(false)}
                className="px-6 py-2 bg-gradient-to-r from-[#6bfe9c] to-[#5bef90] text-[#004a23] font-bold text-xs rounded-xl cursor-pointer"
              >
                Close Output
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Config Panel Settings Modal */}
      {configModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#000000]/80 backdrop-blur-md">
          <div className="bg-[#0f1930] w-full max-w-sm p-6 rounded-2xl border border-[#81ecff]/20 shadow-2xl space-y-5">
            <h3 className="font-headline text-lg font-bold text-[#81ecff] uppercase tracking-tight">
              Hardware Config Settings
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-[#a3aac4] mb-1.5 uppercase font-body font-semibold tracking-wider">
                  Gyroscopic Frequency
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['100Hz', '200Hz', '500Hz'].map(f => (
                    <button
                      key={f}
                      onClick={() => setSampleFrequency(f)}
                      className={`py-2 text-xs rounded-xl font-mono border transition-all cursor-pointer ${
                        sampleFrequency === f
                          ? 'bg-[#81ecff]/10 border-[#81ecff] text-[#81ecff]'
                          : 'bg-[#192540]/50 border-transparent text-[#a3aac4] hover:text-[#dee5ff]'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#a3aac4] mb-1.5 uppercase font-body font-semibold tracking-wider">
                  Compression Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['None', 'LZ4 High', 'GZIP Medium'].map(c => (
                    <button
                      key={c}
                      onClick={() => setCompressionMode(c)}
                      className={`py-2 text-xs rounded-xl font-mono border transition-all cursor-pointer ${
                        compressionMode === c
                          ? 'bg-[#81ecff]/10 border-[#81ecff] text-[#81ecff]'
                          : 'bg-[#192540]/50 border-transparent text-[#a3aac4] hover:text-[#dee5ff]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-[10px] text-[#a3aac4] italic">
                * Note: Changes to sample frequency influence immediate data latency and buffer requirements during live harvests.
              </p>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button 
                onClick={() => setConfigModalOpen(false)}
                className="w-full py-2 bg-[#192540] hover:bg-[#1f2b49] text-xs text-[#dee5ff] rounded-xl text-center"
              >
                Keep Configurations
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
