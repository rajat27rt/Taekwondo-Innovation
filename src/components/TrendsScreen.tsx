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

const BOOT_ZONES: Record<string, ZoneData> = {
  instep: {
    name: "Instep / Sweetspot",
    kickEfficiency: "96.4%",
    avgVelocity: "112 km/h",
    avgSpin: "380 RPM",
    dwellTime: "7.1ms",
    torqueFactor: "9.8 Nm",
    idealFor: "Power drives, straight bullets, and direct penalties",
    description: "The hardest impact point on the human foot. Yields maximum kinetic coefficient transfer and least elastic absorption. Perfect for raw speed.",
    x: "48%",
    y: "40%"
  },
  inside: {
    name: "Inside Curve Arch",
    kickEfficiency: "88.2%",
    avgVelocity: "94 km/h",
    avgSpin: "620 RPM",
    dwellTime: "8.6ms",
    torqueFactor: "12.4 Nm",
    idealFor: "Free-kicks, curving assists, and curling placement",
    description: "Maximum surface wrapping contact. Induces immense angular roll and gyroscopic spin via brush-torque vectors. High precision.",
    x: "30%",
    y: "55%"
  },
  toe: {
    name: "Toe Pokers Zone",
    kickEfficiency: "72.5%",
    avgVelocity: "105 km/h",
    avgSpin: "180 RPM",
    dwellTime: "5.8ms",
    torqueFactor: "4.1 Nm",
    idealFor: "Rapid reflex shots, loose ball scrambling, unexpected finishes",
    description: "Highly concentrated point pressure. High velocity but unstable trajectories. The short dwell-time prevents structured spin application.",
    x: "82%",
    y: "15%"
  },
  outside: {
    name: "Outside Swerve Triquetra",
    kickEfficiency: "81.9%",
    avgVelocity: "89 km/h",
    avgSpin: "580 RPM",
    dwellTime: "7.9ms",
    torqueFactor: "11.1 Nm",
    idealFor: "Trivela, defensive outer escapes, late curling swerves",
    description: "Inverted brush contact. Creates clockwise swerve profile from a right foot. Deceptive trajectories with high lateral deviation coefficients.",
    x: "65%",
    y: "32%"
  }
};

export default function TrendsScreen() {
  const [activeZone, setActiveZone] = useState<string>('instep');
  const zone = BOOT_ZONES[activeZone] || BOOT_ZONES.instep;

  return (
    <div className="space-y-8 pb-12">
      {/* Intro section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="font-body text-[10px] uppercase tracking-[0.15rem] text-[#a3aac4] font-semibold">Analytical Intelligence</span>
          <h3 className="font-headline text-2xl font-bold text-[#dee5ff]">Biomechanics & Swerve Profiles</h3>
        </div>
        <div className="bg-[#141f38]/60 px-4 py-2 rounded-xl border border-[#192540]/30 font-mono text-xs text-[#a3aac4] flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[#81ecff]" />
          ACTIVE SELECTION: ALL ATHLETES
        </div>
      </section>

      {/* Main interactive grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Boot Heatmap Interactive Visualizer */}
        <div className="lg:col-span-7 bg-[#091328] rounded-2xl overflow-hidden border border-[#192540]/30 shadow-xl flex flex-col justify-between">
          <div className="px-6 py-4 bg-[#141f38]/50 border-b border-[#192540]/25 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-[#81ecff]" />
              <h3 className="font-headline text-sm font-bold uppercase tracking-widest text-[#dee5ff]">
                Spatial Contact Hotspots
              </h3>
            </div>
            <div className="text-[10px] text-[#81ecff] bg-[#81ecff]/10 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider animate-pulse">
              Click to probe zone
            </div>
          </div>

          <div className="p-8 flex flex-col items-center justify-center min-h-[350px] relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(25,37,64,0.3),transparent)] pointer-events-none" />
            
            {/* The Soccer Boot SVG Graphic */}
            <div className="relative w-full max-w-[500px]">
              <svg 
                viewBox="0 0 500 250" 
                className="w-full h-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Outlines of a premium sports boot */}
                <path 
                  d="M 50 180 C 80 185, 120 190, 160 190 C 220 190, 260 170, 310 160 C 370 148, 410 115, 450 95 C 475 83, 490 100, 480 120 C 460 160, 420 200, 360 215 C 310 227, 210 230, 150 220 C 110 213, 70 198, 50 180 Z" 
                  fill="#141f38" 
                  stroke="#40485d" 
                  strokeWidth="3"
                  className="transition-colors duration-300"
                />
                
                {/* Sole spikes outline */}
                <path 
                  d="M 120 221 L 115 235 L 125 235 Z M 190 222 L 185 237 L 195 237 Z M 270 221 L 265 235 L 273 235 Z M 340 217 L 336 230 L 344 230 Z" 
                  fill="#6d758c"
                />

                {/* Hotzone Overlays */}
                {/* Instep Zone */}
                <ellipse 
                  cx="240" cy="140" rx="45" ry="25" 
                  fill={activeZone === 'instep' ? '#81ecff' : '#00e3fd'} 
                  fillOpacity={activeZone === 'instep' ? '0.25' : '0.04'}
                  stroke={activeZone === 'instep' ? '#81ecff' : 'transparent'} 
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-300 hover:fill-opacity-30"
                  onClick={() => setActiveZone('instep')}
                />
                
                {/* Inside curve arch */}
                <path 
                  d="M 120 180 C 150 150, 180 145, 210 170 C 180 200, 140 205, 120 180 Z" 
                  fill={activeZone === 'inside' ? '#6bfe9c' : '#5bef90'} 
                  fillOpacity={activeZone === 'inside' ? '0.22' : '0.04'}
                  stroke={activeZone === 'inside' ? '#6bfe9c' : 'transparent'}
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-300 hover:fill-opacity-35"
                  onClick={() => setActiveZone('inside')}
                />

                {/* Outside Swerve */}
                <ellipse 
                  cx="320" cy="115" rx="35" ry="20" 
                  fill={activeZone === 'outside' ? '#ffe084' : '#fed023'} 
                  fillOpacity={activeZone === 'outside' ? '0.22' : '0.04'}
                  stroke={activeZone === 'outside' ? '#ffe084' : 'transparent'}
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-300 hover:fill-opacity-30"
                  onClick={() => setActiveZone('outside')}
                />

                {/* Toe Poke */}
                <circle 
                  cx="435" cy="105" r="22" 
                  fill={activeZone === 'toe' ? '#ff716c' : '#eec209'} 
                  fillOpacity={activeZone === 'toe' ? '0.22' : '0.03'}
                  stroke={activeZone === 'toe' ? '#ff716c' : 'transparent'}
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-300 hover:fill-opacity-30"
                  onClick={() => setActiveZone('toe')}
                />

                {/* Details overlays / Labels */}
                <text x="240" y="142" textAnchor="middle" fill="#dee5ff" fontSize="10" className="pointer-events-none font-headline font-bold uppercase tracking-tight">Sweetspot</text>
                <text x="165" y="174" textAnchor="middle" fill="#dee5ff" fontSize="10" className="pointer-events-none font-headline font-bold uppercase tracking-tight">Arch Curve</text>
                <text x="320" y="118" textAnchor="middle" fill="#dee5ff" fontSize="10" className="pointer-events-none font-headline font-bold uppercase tracking-tight">Outside</text>
                <text x="435" y="108" textAnchor="middle" fill="#dee5ff" fontSize="10" className="pointer-events-none font-headline font-bold uppercase tracking-tight">Toe</text>
              </svg>

              {/* Glowing Indicator Pins */}
              {Object.entries(BOOT_ZONES).map(([key, data]) => {
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
                      key === 'inside' ? 'bg-[#6bfe9c]' :
                      key === 'outside' ? 'bg-[#ffe084]' : 'bg-[#ff716c]'
                    }`}></span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-5 bg-surface-container border-t border-[#192540]/30 font-mono text-xs text-[#a3aac4] flex justify-between items-center text-center">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#81ecff]"></span> Instep</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#6bfe9c]"></span> Inside Arch</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#ffe084]"></span> Outside Swerve</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#ff716c]"></span> Toe Poke</span>
          </div>
        </div>

        {/* Selected Zone Biometrics Probe Panel */}
        <div className="lg:col-span-5 bg-[#091328] rounded-2xl p-6 border border-[#192540]/30 shadow-xl flex flex-col justify-between">
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
                <span className="text-[10px] text-[#a3aac4] uppercase font-semibold">Kick Efficiency</span>
                <span className="block font-headline text-lg font-bold text-[#6bfe9c] mt-0.5">{zone.kickEfficiency}</span>
              </div>
              
              <div className="bg-[#141f38]/50 p-3 rounded-lg border border-[#192540]/30">
                <span className="text-[10px] text-[#a3aac4] uppercase font-semibold">Peak Velocity</span>
                <span className="block font-headline text-lg font-bold text-[#81ecff] mt-0.5">{zone.avgVelocity}</span>
              </div>

              <div className="bg-[#141f38]/50 p-3 rounded-lg border border-[#192540]/30">
                <span className="text-[10px] text-[#a3aac4] uppercase font-semibold">Gyroscopic Spin</span>
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

      {/* Trajectory comparison panel representing a mini chart */}
      <section className="bg-[#091328] rounded-2xl p-6 border border-[#192540]/30 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#6bfe9c]" />
            <h4 className="font-headline font-bold text-sm uppercase tracking-widest text-[#dee5ff]">
              Seasonal Performance Swerve Deviations
            </h4>
          </div>
          <span className="text-xs text-[#a3aac4] font-mono">Comparison: Instep vs Inside</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#141f38]/30 p-4 rounded-xl border border-[#192540]/20 space-y-1">
            <div className="text-[10px] text-[#a3aac4] uppercase">Inside Curve Swerve Ratio</div>
            <div className="font-headline text-xl font-bold text-[#6bfe9c] flex items-baseline gap-1.5">
              1.42m <span className="text-xs font-normal text-[#a3aac4]">/ 30m path</span>
            </div>
            <p className="text-[10px] text-[#a3aac4]/80">Maximum sideways deviation achieved at 850 RPM angular torque.</p>
          </div>

          <div className="bg-[#141f38]/30 p-4 rounded-xl border border-[#192540]/20 space-y-1">
            <div className="text-[10px] text-[#a3aac4] uppercase">Instep Drop-Sinking Coefficient</div>
            <div className="font-headline text-xl font-bold text-[#81ecff] flex items-baseline gap-1.5">
              0.84m <span className="text-xs font-normal text-[#a3aac4]">/ late sink</span>
            </div>
            <p className="text-[10px] text-[#a3aac4]/80">The sudden vertical plunge simulated via zero-spin turbulence.</p>
          </div>

          <div className="bg-[#141f38]/30 p-4 rounded-xl border border-[#192540]/20 space-y-1">
            <div className="text-[10px] text-[#a3aac4] uppercase">Toe-Impact Deviation Angle</div>
            <div className="font-headline text-xl font-bold text-red-400 flex items-baseline gap-1.5">
              ± 4.8° <span className="text-xs font-normal text-[#a3aac4]">instability</span>
            </div>
            <p className="text-[10px] text-[#a3aac4]/80">High probability trajectory drift due to lack of surface wrap.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
