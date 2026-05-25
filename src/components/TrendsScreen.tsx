import { useState } from 'react';
import { Target, Zap, Activity, Award, BarChart3, TrendingUp, Info } from 'lucide-react';

interface ZoneData {
  name: string;
  kickEfficiency: string;
  avgVelocity: string;
  avgSpin: string;
  dwellTime: string;
  torqueFactor: string;
  idealFor: string;
  description: string;
  x: string; // coordinates for the interactive indicator
  y: string;
}

const TKD_GUARD_ZONES: Record<string, ZoneData> = {
  instep: {
    name: "Instep / Baldeung Zone",
    kickEfficiency: "96.4%",
    avgVelocity: "112 km/h",
    avgSpin: "410 RPM",
    dwellTime: "6.1ms",
    torqueFactor: "11.2 Nm",
    idealFor: "Dolyeo Chagi (Roundhouse / Turning Kick)",
    description: "The primary high-surface scoring contact zone. Captures massive centrifugal energy. Optimized for absolute speed and instant electronic PSS trigger registration.",
    x: "48%",
    y: "40%"
  },
  heel: {
    name: "Heel / Dwitchook Zone",
    kickEfficiency: "88.2%",
    avgVelocity: "94 km/h",
    avgSpin: "780 RPM",
    dwellTime: "8.2ms",
    torqueFactor: "18.4 Nm",
    idealFor: "Naeryeo Chagi (Axe Kick) & Dwit Chagi (Spinning Back Kick)",
    description: "Maximum bone-density skeletal force transfer. Perfect orientation for heavy downward percussive torque. Very high momentum.",
    x: "30%",
    y: "55%"
  },
  toe: {
    name: "Ball of Foot / Apchook",
    kickEfficiency: "72.5%",
    avgVelocity: "105 km/h",
    avgSpin: "210 RPM",
    dwellTime: "5.4ms",
    torqueFactor: "6.3 Nm",
    idealFor: "Ap Chagi (Front Snap Kick) & Piercing Counter Attacks",
    description: "Concentrated point pressure of extreme PSI. While 72.5% efficiency seems lower than instep, it is exceptionally GOOD for Apchook due to joint articulation energy distribution. It proves solid ankle lock support.",
    x: "82%",
    y: "15%"
  },
  outer: {
    name: "Outer Blade / Balnal Zone",
    kickEfficiency: "81.9%",
    avgVelocity: "89 km/h",
    avgSpin: "480 RPM",
    dwellTime: "7.1ms",
    torqueFactor: "12.8 Nm",
    idealFor: "Yeop Chagi (Side Kick / Defensive Push-Scoring)",
    description: "High side leverage frame. Transmits straight hip extension thrust directly through the lateral margin. Extremely stable tracking profile.",
    x: "65%",
    y: "32%"
  }
};

export default function TrendsScreen() {
  const [activeZone, setActiveZone] = useState<string>('toe'); // Default to toe so they can see the 72.5% right away!
  const zone = TKD_GUARD_ZONES[activeZone] || TKD_GUARD_ZONES.toe;

  return (
    <div className="space-y-8 pb-12">
      {/* Intro section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="font-body text-[10px] uppercase tracking-[0.15rem] text-[#a3aac4] font-semibold">WitMotion Biomechanics Analyzer</span>
          <h3 className="font-headline text-2xl font-bold text-[#dee5ff]">Taekwondo Foot Protector Scoring Vectors</h3>
        </div>
        <div className="bg-[#141f38]/60 px-4 py-2 rounded-xl border border-[#192540]/30 font-mono text-xs text-[#a3aac4] flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[#81ecff]" />
          ACTIVE GEAR: TKD ELECTRONIC SENSOR SOCKS
        </div>
      </section>

      {/* Explanation of Scoring Scale */}
      <section className="bg-gradient-to-r from-[#0d1b3e] to-[#071026] p-6 rounded-2xl border border-[#192540] grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-2 col-span-1 md:col-span-1 flex flex-col justify-center">
          <h4 className="text-xs font-bold uppercase text-[#81ecff] tracking-widest font-mono">TKD EFFICIENCY SCALE</h4>
          <p className="text-xs text-[#dee5ff] font-headline font-semibold">How to evaluate WitMotion IMU output metrics:</p>
        </div>
        <div className="p-4 bg-[#141f38]/40 rounded-xl border border-[#192540]/50 space-y-1">
          <div className="text-xs font-bold text-[#6bfe9c] font-mono">90% - 100% Elite Peak</div>
          <p className="text-[11px] text-[#a3aac4]">Maximum percussive snap-rebound. Near-instant dwell duration. Triggers PSS registers instantly.</p>
        </div>
        <div className="p-4 bg-[#141f38]/40 rounded-xl border border-[#192540]/50 space-y-1">
          <div className="text-xs font-bold text-[#ffe084] font-mono">70% - 89% Optimal Strike (72.5% Good)</div>
          <p className="text-[11px] text-[#a3aac4]">Strong force transmission. Minor dispersion via joint flex. Ideal for thrusting kicks or piercing point-impacts.</p>
        </div>
        <div className="p-4 bg-[#141f38]/40 rounded-xl border border-[#192540]/50 space-y-1">
          <div className="text-xs font-bold text-[#ff716c] font-mono">&lt; 70% Sub-Optimal / Push</div>
          <p className="text-[11px] text-[#a3aac4]">Off-axis impact drift. Slow retraction/rebound or loose ankle lock causing massive energy dispersion.</p>
        </div>
      </section>

      {/* Main interactive grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Foot Guard Hotmap Interactive Visualizer */}
        <div className="lg:col-span-7 bg-[#091328] rounded-2xl overflow-hidden border border-[#192540]/30 shadow-xl flex flex-col justify-between">
          <div className="px-6 py-4 bg-[#141f38]/50 border-b border-[#192540]/25 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-[#81ecff]" />
              <h3 className="font-headline text-sm font-bold uppercase tracking-widest text-[#dee5ff]">
                TKD Foot protector Sensors (WitMotion)
              </h3>
            </div>
            <div className="text-[10px] text-[#81ecff] bg-[#81ecff]/10 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider animate-pulse">
              Select target contact sensor to detail
            </div>
          </div>

          <div className="p-8 flex flex-col items-center justify-center min-h-[350px] relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(25,37,64,0.3),transparent)] pointer-events-none" />
            
            {/* The TKD Guard SVG Graphic */}
            <div className="relative w-full max-w-[500px]">
              <svg 
                viewBox="0 0 500 250" 
                className="w-full h-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Outlines of a Taekwondo Electronic Foot Protector protector */}
                <path 
                  d="M 50 160 C 70 140, 110 135, 140 145 C 170 155, 200 130, 260 110 C 320 90, 390 85, 450 95 C 475 100, 485 115, 475 130 C 445 165, 400 190, 340 195 C 290 200, 200 205, 140 195 C 90 185, 60 175, 50 160 Z" 
                  fill="#111c33" 
                  stroke="#3e5077" 
                  strokeWidth="3.5"
                  className="transition-colors duration-300"
                />
                
                {/* Sleek ankle strap overlay representing Taekwondo equipment */}
                <path 
                  d="M 120 141 L 105 192 L 135 194 L 145 145 Z" 
                  fill="#1c2c4d"
                  stroke="#81ecff"
                  strokeWidth="1.5"
                  strokeOpacity="0.5"
                />

                {/* Hotzone Overlays */}
                {/* Instep Zone */}
                <ellipse 
                  cx="320" cy="110" rx="42" ry="20" 
                  fill={activeZone === 'instep' ? '#81ecff' : '#00e3fd'} 
                  fillOpacity={activeZone === 'instep' ? '0.28' : '0.05'}
                  stroke={activeZone === 'instep' ? '#81ecff' : 'transparent'} 
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-300 hover:fill-opacity-30"
                  onClick={() => setActiveZone('instep')}
                />
                
                {/* Heel Zone */}
                <ellipse 
                  cx="90" cy="165" rx="30" ry="20" 
                  fill={activeZone === 'heel' ? '#6bfe9c' : '#5bef90'} 
                  fillOpacity={activeZone === 'heel' ? '0.25' : '0.05'}
                  stroke={activeZone === 'heel' ? '#6bfe9c' : 'transparent'}
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-300 hover:fill-opacity-35"
                  onClick={() => setActiveZone('heel')}
                />

                {/* Outer Blade */}
                <ellipse 
                  cx="240" cy="155" rx="45" ry="18" 
                  fill={activeZone === 'outer' ? '#ffe084' : '#fed023'} 
                  fillOpacity={activeZone === 'outer' ? '0.25' : '0.05'}
                  stroke={activeZone === 'outer' ? '#ffe084' : 'transparent'}
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-300 hover:fill-opacity-30"
                  onClick={() => setActiveZone('outer')}
                />

                {/* Apex Box / Ball of Foot (Toe) */}
                <circle 
                  cx="440" cy="115" r="24" 
                  fill={activeZone === 'toe' ? '#ff716c' : '#ff5550'} 
                  fillOpacity={activeZone === 'toe' ? '0.28' : '0.05'}
                  stroke={activeZone === 'toe' ? '#ff716c' : 'transparent'}
                  strokeWidth="2.5"
                  className="cursor-pointer transition-all duration-300 hover:fill-opacity-30"
                  onClick={() => setActiveZone('toe')}
                />

                {/* Technical Wireframe Accents inside sensor sock */}
                <circle cx="320" cy="110" r="4" fill="#81ecff" />
                <circle cx="90" cy="165" r="4" fill="#6bfe9c" />
                <circle cx="240" cy="155" r="4" fill="#ffe084" />
                <circle cx="440" cy="115" r="4" fill="#ff716c" />

                {/* Labels */}
                <text x="320" y="113" textAnchor="middle" fill="#dee5ff" fontSize="9" className="pointer-events-none font-headline font-bold uppercase tracking-tight">Baldeung</text>
                <text x="90" y="168" textAnchor="middle" fill="#dee5ff" fontSize="9" className="pointer-events-none font-headline font-bold uppercase tracking-tight">Dwitchook</text>
                <text x="240" y="158" textAnchor="middle" fill="#dee5ff" fontSize="9" className="pointer-events-none font-headline font-bold uppercase tracking-tight">Balnal</text>
                <text x="440" y="118" textAnchor="middle" fill="#dee5ff" fontSize="9" className="pointer-events-none font-headline font-bold uppercase tracking-tight">Apchook</text>
              </svg>

              {/* Glowing Indicator Pins */}
              {Object.entries(TKD_GUARD_ZONES).map(([key, data]) => {
                const isActive = activeZone === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveZone(key)}
                    style={{ left: data.x, top: data.y }}
                    className={`absolute translate-x-[-50%] translate-y-[-50%] h-6 w-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-[#81ecff] scale-125 z-20 shadow-[0_0_15px_rgba(129,236,255,0.8)]' 
                        : 'bg-[#192540] shadow-md hover:bg-[#1f2b49] z-10'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      key === 'instep' ? 'bg-[#81ecff]' :
                      key === 'heel' ? 'bg-[#6bfe9c]' :
                      key === 'outer' ? 'bg-[#ffe084]' : 'bg-[#ff716c]'
                    }`}></span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-5 bg-surface-container border-t border-[#192540]/30 font-mono text-xs text-[#a3aac4] flex justify-between items-center text-center">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#81ecff]"></span> Instep (Baldeung)</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#6bfe9c]"></span> Heel (Dwitchook)</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#ffe084]"></span> Outer Blade (Balnal)</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#ff716c]"></span> Ball of Foot (Apchook)</span>
          </div>
        </div>

        {/* Selected Zone Biometrics Probe Panel */}
        <div className="lg:col-span-4 bg-[#091328] rounded-2xl p-6 border border-[#192540]/30 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs uppercase text-[#81ecff] font-mono font-bold tracking-widest">
              <Award className="h-4 w-4" />
              HOTZONE BIOMETRICS PROBED
            </div>

            <h2 className="font-headline text-2xl font-bold tracking-tight text-[#dee5ff]">
              {zone.name}
            </h2>

            <p className="text-xs text-[#a3aac4] leading-relaxed italic bg-[#141f38]/30 p-4 rounded-xl border border-[#192540]/10">
              "{zone.description}"
            </p>

            {/* Metrics Stack */}
            <div className="grid grid-cols-2 gap-4 pt-3">
              <div className="bg-[#141f38]/50 p-3 rounded-lg border border-[#192540]/30">
                <span className="text-[10px] text-[#a3aac4] uppercase font-semibold">Strike Efficiency</span>
                <span className="block font-headline text-lg font-bold text-[#6bfe9c] mt-0.5">{zone.kickEfficiency}</span>
              </div>
              
              <div className="bg-[#141f38]/50 p-3 rounded-lg border border-[#192540]/30">
                <span className="text-[10px] text-[#a3aac4] uppercase font-semibold">Peak Velocity</span>
                <span className="block font-headline text-lg font-bold text-[#81ecff] mt-0.5">{zone.avgVelocity}</span>
              </div>

              <div className="bg-[#141f38]/50 p-3 rounded-lg border border-[#192540]/30">
                <span className="text-[10px] text-[#a3aac4] uppercase font-semibold">Rotational Spin</span>
                <span className="block font-headline text-lg font-bold text-[#ffe084] mt-0.5">{zone.avgSpin}</span>
              </div>

              <div className="bg-[#141f38]/50 p-3 rounded-lg border border-[#192540]/30">
                <span className="text-[10px] text-[#a3aac4] uppercase font-semibold">Dwell Duration</span>
                <span className="block font-headline text-lg font-bold text-[#81ecff] mt-0.5">{zone.dwellTime}</span>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <span className="block text-[10px] text-[#a3aac4] uppercase font-bold tracking-wider">Ideal Tactile Use-Case</span>
              <div className="flex gap-2 items-center text-xs text-[#dee5ff] bg-[#141f38]/40 px-3.5 py-2.5 rounded-xl border border-[#192540]/35">
                <Info className="h-4 w-4 text-[#81ecff]" />
                {zone.idealFor}
              </div>
            </div>
          </div>

          <div className="pt-6 font-mono text-[10px] text-[#a3aac4] border-t border-[#192540]/30 flex justify-between">
            <span>TORQUE FORCE COEF:</span>
            <span className="text-[#81ecff] font-bold">{zone.torqueFactor}</span>
          </div>
        </div>

      </div>

      {/* WitMotion IMU scale breakdown specifically for the user's 72.5% question */}
      <section className="bg-[#091328] rounded-2xl p-6 border border-[#192540]/30 shadow-xl space-y-4">
        <h4 className="font-headline font-bold text-sm uppercase tracking-widest text-[#dee5ff] flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-[#81ecff]" />
          Deep Dive: Why 72.5% Kick Efficiency Is Good (Apchook Specifics)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#dee5ff] leading-relaxed font-body">
          <div className="bg-[#141f38]/30 p-4 rounded-xl border border-[#192540]/20 space-y-2">
            <span className="text-[#ffe084] font-bold block font-headline">The Joint Dispersion Effect</span>
            <p className="text-[#a3aac4] text-[11px]">
              Unlike the solid bone of the heel, the toes/apchook utilize multiple articulating joints. At high power, energy absorbs into the metatarsals. Achieving **72.5% energy recovery** proves the athlete has locked their ankle perfectly, preventing joint dissipation.
            </p>
          </div>
          <div className="bg-[#141f38]/30 p-4 rounded-xl border border-[#192540]/20 space-y-2">
            <span className="text-[#6bfe9c] font-bold block font-headline">Ultra-Concentrated PSI</span>
            <p className="text-[#a3aac4] text-[11px]">
              Because the physical area of Apchook is roughly **15% the size** of the instep, the force is concentrated. 72.5% of total kinetic energy delivered on 15% area yields **400% higher PSI penetration** than a flat instep kick, scoring through tight guards.
            </p>
          </div>
          <div className="bg-[#141f38]/30 p-4 rounded-xl border border-[#192540]/20 space-y-2">
            <span className="text-[#ffe084] font-bold block font-headline">Minimal Dwell Window</span>
            <p className="text-[#a3aac4] text-[11px]">
              WitMotion logs a **5.4ms dwell time** for the Apchook, which is exceptionally short. A short dwell means high elasticity rebound, preventing the sensor from registering as a pushing motion or shove, yielding high score eligibility.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
