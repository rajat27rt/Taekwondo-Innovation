import { useState, useEffect, useRef } from 'react';
import { Play, Square, Circle, Zap, RefreshCw, Cpu, Activity, User } from 'lucide-react';
import { TelemetrySession } from '../types';

interface LiveScreenProps {
  onAddSession: (newSession: TelemetrySession) => void;
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
  activeAthlete: string;
  setActiveAthlete: (name: string) => void;
}

export default function LiveScreen({
  onAddSession,
  isRecording,
  setIsRecording,
  activeAthlete,
  setActiveAthlete
}: LiveScreenProps) {
  // Sensor simulated connections
  const [rightSensorConnected, setRightSensorConnected] = useState(true);
  const [leftSensorConnected, setLeftSensorConnected] = useState(true);

  // Rolling chart states
  const [accelPoints, setAccelPoints] = useState<number[]>(Array(50).fill(1.0));
  const [rotationPoints, setRotationPoints] = useState<number[]>(Array(50).fill(120));
  
  // Active statistics
  const [currentAccel, setCurrentAccel] = useState(1.0);
  const [currentSpin, setCurrentSpin] = useState(120);
  const [instantForce, setInstantForce] = useState(0);
  const [kickVelocity, setKickVelocity] = useState(0);
  const [lastKickInfo, setLastKickInfo] = useState<{ velocity: number; force: number; spin: number } | null>(null);

  // Counter
  const [kicksRecorded, setKicksRecorded] = useState(0);
  const [sessionTime, setSessionTime] = useState(0); // in seconds
  
  // Saved state
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveLabel, setSaveLabel] = useState('');

  // Interval references
  const streamRef = useRef<number | null>(null);
  const clockRef = useRef<number | null>(null);

  // Stream simulation
  useEffect(() => {
    if (isRecording) {
      streamRef.current = window.setInterval(() => {
        // Randomly simulate physical telemetry drift
        const deltaAccel = (Math.random() - 0.48) * 0.5;
        const deltaSpin = (Math.random() - 0.5) * 15;
        
        // Random Soccer Kick Spike!
        let isKick = Math.random() < 0.08; // 8% chance per tick
        let forceSpike = 0;
        let accelSpike = 0;
        let spinSpike = 0;
        let kickVel = 0;

        if (isKick) {
          forceSpike = Math.floor(Math.random() * 400) + 350; // N
          accelSpike = Number((Math.random() * 10 + 10).toFixed(1)); // Gs
          spinSpike = Math.floor(Math.random() * 300) + 400; // RPM
          kickVel = Math.floor(Math.random() * 45) + 75; // km/h
          
          setKicksRecorded(prev => prev + 1);
          setInstantForce(forceSpike);
          setKickVelocity(kickVel);
          
          setLastKickInfo({
            velocity: kickVel,
            force: forceSpike,
            spin: spinSpike
          });

          // Reset instant spike after a brief delay
          setTimeout(() => {
            setInstantForce(0);
          }, 600);
        }

        setCurrentAccel(prev => {
          const next = isKick ? accelSpike : Math.max(0.5, Math.min(6.0, prev + deltaAccel));
          setAccelPoints(hist => {
            const copy = [...hist.slice(1)];
            copy.push(next);
            return copy;
          });
          return next;
        });

        setCurrentSpin(prev => {
          const next = isKick ? spinSpike : Math.max(50, Math.min(350, prev + deltaSpin));
          setRotationPoints(hist => {
            const copy = [...hist.slice(1)];
            copy.push(next);
            return copy;
          });
          return next;
        });

      }, 200);

      clockRef.current = window.setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    } else {
      if (streamRef.current) clearInterval(streamRef.current);
      if (clockRef.current) clearInterval(clockRef.current);
    }

    return () => {
      if (streamRef.current) clearInterval(streamRef.current);
      if (clockRef.current) clearInterval(clockRef.current);
    };
  }, [isRecording]);

  const toggleRecording = () => {
    if (isRecording) {
      // Prompt Save Modal
      setIsRecording(false);
      setSaveLabel(`DRILL_${activeAthlete.toUpperCase().replace(/\s+/g, '_')}_${new Date().toLocaleDateString('en-US', {month: 'short', day: 'numeric'}).toUpperCase().replace(/\s+/g, '_')}`);
      setSaveModalOpen(true);
    } else {
      // Reset details and trigger recording
      setKicksRecorded(0);
      setSessionTime(0);
      setLastKickInfo(null);
      setIsRecording(true);
    }
  };

  const handleSaveSession = () => {
    const freshSession: TelemetrySession = {
      id: 'session_' + Date.now(),
      label: saveLabel || 'UNNAMED_DRILL',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      formats: ['CSV', 'JSON'],
      kicksCount: kicksRecorded || Math.floor(Math.random() * 20) + 5,
      status: Math.random() > 0.3 ? 'Validated' : 'Review Req',
      details: {
        duration: formatTime(sessionTime),
        athlete: activeAthlete,
        accelMax: lastKickInfo ? Number((lastKickInfo.force / 38).toFixed(1)) : 14.2,
        spinAvg: lastKickInfo ? lastKickInfo.spin : 480,
        contactDuration: Number((Math.random() * 3 + 6.5).toFixed(1)),
        avgVelocity: lastKickInfo ? lastKickInfo.velocity : 85
      }
    };
    
    onAddSession(freshSession);
    setSaveModalOpen(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s} mins`;
  };

  // Convert array to SVG path
  const makeSvgPath = (points: number[], maxVal: number, width: number, height: number) => {
    const len = points.length;
    const step = width / (len - 1);
    return points.map((p, i) => {
      const x = i * step;
      // Flip mathematically since SVG 0,0 is top-left
      const y = height - (p / maxVal) * (height - 10) - 5;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Target Naming & Sensor Connections Box */}
      <section className="p-6 bg-[#091328] rounded-2xl border-l-2 border-[#81ecff] relative overflow-hidden">
        <div className="absolute right-0 top-0 w-[500px] h-full opacity-10 bg-[radial-gradient(circle_at_right,rgba(129,236,255,0.15),transparent)] pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-4">
            <span className="font-body text-[10px] uppercase tracking-[0.15rem] text-[#a3aac4] font-semibold">Active Tracker Console</span>
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              <div>
                <label className="block text-xs text-[#a3aac4] mb-1 uppercase font-body font-semibold tracking-wider">Target Athlete</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-[#a3aac4]" />
                  <input
                    type="text"
                    value={activeAthlete}
                    onChange={(e) => setActiveAthlete(e.target.value)}
                    disabled={isRecording}
                    className="pl-9 pr-4 py-2 bg-[#192540] border border-[#40485d]/30 text-[#dee5ff] text-sm rounded-xl focus:outline-none focus:border-[#81ecff] disabled:opacity-50 transition-colors w-64"
                    placeholder="Enter athlete name"
                  />
                </div>
              </div>

              <div className="flex flex-col justify-end pt-5 sm:pt-0">
                <button
                  onClick={toggleRecording}
                  className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-body font-bold text-sm transition-all shadow-[0_4px_12px_rgba(0,0,0,0.2)] ${
                    isRecording
                      ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                      : 'bg-gradient-to-r from-[#81ecff] to-[#00e3fd] text-[#003840] hover:scale-[1.02] active:scale-95'
                  }`}
                >
                  {isRecording ? <Square className="h-4 w-4 fill-white" /> : <Play className="h-4 w-4 fill-current" />}
                  {isRecording ? 'STOP SESSION' : 'START HARVESTING'}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="block text-xs text-[#a3aac4] uppercase font-body font-semibold tracking-wider">Boot Transceiver Array</span>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => !isRecording && setRightSensorConnected(!rightSensorConnected)}
                disabled={isRecording}
                className={`px-4 py-2 rounded-xl flex items-center gap-2.5 border transition-all ${
                  rightSensorConnected 
                    ? 'bg-[#006d37]/10 border-[#6bfe9c]/30 text-[#6bfe9c]' 
                    : 'bg-red-500/10 border-red-500/20 text-red-400 opacity-60'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${rightSensorConnected ? 'bg-[#6bfe9c] animate-pulse' : 'bg-red-400'}`}></span>
                <span className="font-mono text-xs font-bold font-headline">RIGHT_BOOT_V5</span>
              </button>

              <button 
                onClick={() => !isRecording && setLeftSensorConnected(!leftSensorConnected)}
                disabled={isRecording}
                className={`px-4 py-2 rounded-xl flex items-center gap-2.5 border transition-all ${
                  leftSensorConnected 
                    ? 'bg-[#006d37]/10 border-[#6bfe9c]/30 text-[#6bfe9c]' 
                    : 'bg-red-500/10 border-red-500/20 text-red-400 opacity-60'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${leftSensorConnected ? 'bg-[#6bfe9c] animate-pulse' : 'bg-red-400'}`}></span>
                <span className="font-mono text-xs font-bold font-headline">LEFT_BOOT_V5</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Grid: Stats and Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Real-time Dynamic Graphs */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#091328] rounded-2xl overflow-hidden shadow-xl border border-[#192540]/30">
            <div className="px-6 py-4 flex justify-between items-center bg-[#141f38]/50 border-b border-[#192540]/20">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-[#81ecff]" />
                <h3 className="font-headline text-sm font-bold uppercase tracking-widest text-[#dee5ff]">
                  Aceleration Live Feed (3-Axis)
                </h3>
              </div>
              <span className="font-mono text-xs text-[#a3aac4]">G-Units (500Hz)</span>
            </div>
            
            <div className="p-6">
              {/* Plot rendering line */}
              <div className="h-44 relative bg-[#060e20] rounded-xl overflow-hidden border border-[#192540]/40 p-2">
                {/* Horizontal reference lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none p-4 opacity-5">
                  <div className="w-full h-px bg-white"></div>
                  <div className="w-full h-px bg-white"></div>
                  <div className="w-full h-px bg-white"></div>
                </div>

                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  {/* SVG filter for the premium glow */}
                  <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Gradient fill for chart */}
                  <path
                    d={`${makeSvgPath(accelPoints, 20.0, 600, 150)} L 600 150 L 0 150 Z`}
                    fill="url(#accelGradient)"
                    className="opacity-10"
                  />
                  
                  {/* Glowing main path */}
                  <path
                    d={makeSvgPath(accelPoints, 20.0, 600, 150)}
                    fill="none"
                    stroke="#81ecff"
                    strokeWidth="2.5"
                    filter="url(#glow)"
                    className="transition-all duration-75"
                  />
                  
                  <defs>
                    <linearGradient id="accelGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#81ecff" />
                      <stop offset="100%" stopColor="#060e20" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Instant display badge */}
                <div className="absolute bottom-3 right-4 bg-[#141f38]/90 px-3 py-1 rounded-lg border border-[#81ecff]/20 font-mono text-xs text-[#81ecff]">
                  ACCEL: {currentAccel.toFixed(1)} G
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#091328] rounded-2xl overflow-hidden shadow-xl border border-[#192540]/30">
            <div className="px-6 py-4 flex justify-between items-center bg-[#141f38]/50 border-b border-[#192540]/20">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-[#ffe084]" />
                <h3 className="font-headline text-sm font-bold uppercase tracking-widest text-[#dee5ff]">
                  Rotational Spin Rate (Gyroscopic)
                </h3>
              </div>
              <span className="font-mono text-xs text-[#a3aac4]">RPM (200Hz)</span>
            </div>
            
            <div className="p-6">
              {/* Plot rendering line */}
              <div className="h-44 relative bg-[#060e20] rounded-xl overflow-hidden border border-[#192540]/40 p-2">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none p-4 opacity-5">
                  <div className="w-full h-px bg-white"></div>
                  <div className="w-full h-px bg-white"></div>
                  <div className="w-full h-px bg-white"></div>
                </div>

                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  {/* Glowing path */}
                  <path
                    d={makeSvgPath(rotationPoints, 900, 600, 150)}
                    fill="none"
                    stroke="#ffe084"
                    strokeWidth="2.5"
                    filter="url(#glow)"
                    className="transition-all duration-75"
                  />
                </svg>

                {/* Instant display badge */}
                <div className="absolute bottom-3 right-4 bg-[#141f38]/90 px-3 py-1 rounded-lg border border-[#ffe084]/20 font-mono text-xs text-[#ffe084]">
                  SPIN: {Math.floor(currentSpin)} RPM
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Statistics Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#091328] rounded-2xl p-6 border border-[#192540]/30 shadow-xl space-y-6">
            <h3 className="font-headline text-xs font-bold uppercase tracking-widest text-[#a3aac4] border-b border-[#192540]/50 pb-3">
              Session Metrics Stream
            </h3>

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              <div className="bg-[#141f38]/50 p-4 rounded-xl border border-[#192540]/30">
                <span className="block text-[10px] text-[#a3aac4] uppercase font-semibold">Total Kicks Collected</span>
                <span className="text-3xl font-headline font-bold text-[#81ecff] mt-1 block">
                  {kicksRecorded}
                </span>
                <span className="text-[10px] text-[#a3aac4]/80 block mt-1 font-mono">Count limit: Unlimited</span>
              </div>

              <div className="bg-[#141f38]/50 p-4 rounded-xl border border-[#192540]/30">
                <span className="block text-[10px] text-[#a3aac4] uppercase font-semibold">Session Lifetime</span>
                <span className="text-3xl font-headline font-bold text-[#ffe084] mt-1 block">
                  {formatTime(sessionTime).split(' ')[0]}
                </span>
                <span className="text-[10px] text-[#a3aac4]/80 block mt-1 font-mono">HMR Stream: Enabled</span>
              </div>
            </div>

            {/* Impact indicator widget */}
            <div className="bg-[#141f38]/30 rounded-xl p-4 border border-[#192540]/40 flex gap-4 items-center">
              <div className="p-3 bg-red-400/10 rounded-lg text-red-400 animate-pulse">
                <Zap className="h-5 w-5 fill-current" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] text-[#a3aac4] uppercase font-semibold">Last Impact Force</div>
                <div className="font-headline font-bold text-lg mt-0.5 text-[#dee5ff]">
                  {instantForce > 0 ? `${instantForce} N` : lastKickInfo ? `${lastKickInfo.force} N` : 'Waiting...'}
                </div>
              </div>
            </div>

            {/* Velocity statistics */}
            <div className="bg-[#141f38]/30 rounded-xl p-4 border border-[#192540]/40 flex gap-4 items-center">
              <div className="p-3 bg-[#6bfe9c]/10 rounded-lg text-[#6bfe9c]">
                <Activity className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] text-[#a3aac4] uppercase font-semibold">Last Calculated Velocity</div>
                <div className="font-headline font-bold text-lg mt-0.5 text-[#6bfe9c]">
                  {kickVelocity > 0 ? `${kickVelocity} km/h` : lastKickInfo ? `${lastKickInfo.velocity} km/h` : 'No triggers yet'}
                </div>
              </div>
            </div>
          </div>

          {/* Device Telemetry status */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#141f38] to-[#091328] border border-[#192540]/30 space-y-4 shadow-xl">
            <h4 className="font-headline font-semibold text-xs text-[#dee5ff] uppercase tracking-wider">
              Signal Diagnostic Info
            </h4>
            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex justify-between items-center text-[#a3aac4]">
                <span>Sample Frequency:</span>
                <span className="text-[#81ecff]">500 Hz</span>
              </div>
              <div className="flex justify-between items-center text-[#a3aac4]">
                <span>Transceiver Latency:</span>
                <span className="text-[#6bfe9c]">12ms</span>
              </div>
              <div className="flex justify-between items-center text-[#a3aac4]">
                <span>Signal Strength:</span>
                <span className="text-[#6bfe9c]">-52 dBm (Excellent)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Session Modal */}
      {saveModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#000]/80 backdrop-blur-md">
          <div className="bg-[#0f1930] w-full max-w-md p-6 rounded-2xl border border-[#81ecff]/20 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-[#192540] pb-3">
              <h3 className="font-headline text-lg font-bold text-[#81ecff] uppercase tracking-tight">
                Save Telemetry Recording
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-[#a3aac4] mb-1 uppercase font-body font-semibold tracking-wider">
                  Session Code Identifier
                </label>
                <input
                  type="text"
                  value={saveLabel}
                  onChange={(e) => setSaveLabel(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#192540] border border-[#40485d]/40 text-[#dee5ff] text-sm rounded-xl focus:outline-none focus:border-[#81ecff] font-mono"
                  placeholder="e.g. DRILL_MARCUS_OCT24"
                />
              </div>

              <div className="bg-[#141f38]/60 p-4 rounded-xl border border-[#192540]/50 space-y-2 font-mono text-xs text-[#a3aac4]">
                <div className="flex justify-between">
                  <span>Athlete Target:</span>
                  <span className="text-[#dee5ff] font-bold">{activeAthlete}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="text-[#dee5ff] font-bold">{formatTime(sessionTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Kicks:</span>
                  <span className="text-[#dee5ff] font-bold">{kicksRecorded}</span>
                </div>
                {lastKickInfo && (
                  <div className="flex justify-between">
                    <span>Avg Velocity Peak:</span>
                    <span className="text-[#6bfe9c] font-bold">{lastKickInfo.velocity} km/h</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button 
                onClick={() => setSaveModalOpen(false)}
                className="px-4 py-2 bg-[#192540] hover:bg-[#1f2b49] text-sm text-[#dee5ff] rounded-xl font-medium cursor-pointer"
              >
                Discard
              </button>
              <button 
                onClick={handleSaveSession}
                className="px-6 py-2 bg-gradient-to-r from-[#81ecff] to-[#00e3fd] text-[#003840] hover:opacity-90 text-sm font-bold rounded-xl cursor-pointer"
              >
                Confirm Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
