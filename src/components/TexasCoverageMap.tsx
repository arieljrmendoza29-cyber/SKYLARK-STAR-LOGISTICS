import { useState } from 'react';
import { CheckCircle2, MapPin } from 'lucide-react';
import { COVERAGE_ZONES, CoverageZone } from '../utils/companyData';

export function TexasCoverageMap() {
  const [selectedId, setSelectedId] = useState<CoverageZone['id']>('la-porte');
  const activeZone = COVERAGE_ZONES.find((z) => z.id === selectedId) ?? COVERAGE_ZONES[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Left: Editorial Interactive Texas Map */}
      <div className="lg:col-span-7 min-w-0 bg-[#171717] rounded-3xl border border-[#171717] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#FF6500]">
              Texas Service Coverage
            </p>
            <p className="text-sm text-[#FFF5EB]/75 mt-1">
              Select a region to review verified operating scope.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {COVERAGE_ZONES.map((zone) => {
              const isSelected = zone.id === selectedId;
              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => setSelectedId(zone.id)}
                  className={`px-3.5 py-2 min-h-[40px] rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-[#FF6500] ${
                    isSelected
                      ? 'bg-[#FF6500] text-[#171717]'
                      : 'bg-white/10 text-[#FFF5EB] hover:bg-white/20'
                  }`}
                >
                  {zone.id === 'la-porte'
                    ? 'La Porte'
                    : zone.id === 'greater-houston'
                      ? 'Houston Metro'
                      : 'Texas Regional'}
                </button>
              );
            })}
          </div>
        </div>

        {/* SVG Texas Map */}
        <div className="relative w-full aspect-[16/11] flex items-center justify-center">
          <svg
            viewBox="0 0 800 560"
            className="w-full h-full max-h-[380px]"
            role="img"
            aria-label="Interactive Texas coverage map highlighting La Porte, Houston metropolitan area, and broader Texas coverage subject to confirmation"
          >
            <defs>
              <radialGradient id="houstonOrangeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FF6500" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#FF6500" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Subtle Coordinate Grid */}
            <g stroke="#FFF5EB" strokeOpacity="0.06" strokeWidth="1">
              <line x1="80" y1="120" x2="720" y2="120" />
              <line x1="80" y1="240" x2="720" y2="240" />
              <line x1="80" y1="360" x2="720" y2="360" />
              <line x1="200" y1="40" x2="200" y2="520" />
              <line x1="400" y1="40" x2="400" y2="520" />
              <line x1="600" y1="40" x2="600" y2="520" />
            </g>

            {/* Clean Architectural Silhouette of Texas */}
            <path
              d="M275 56 L402 56 L402 146 L460 162 L542 174 L630 176 L678 194 L685 268 L704 328 L664 388 L602 422 L542 456 L516 516 L466 508 L442 466 L396 420 L344 426 L296 382 L252 332 L170 288 L124 236 L275 236 Z"
              fill={selectedId === 'texas-regional' ? '#2A221D' : '#212121'}
              stroke="#FF6500"
              strokeWidth={selectedId === 'texas-regional' ? '2.5' : '1.5'}
              strokeOpacity={selectedId === 'texas-regional' ? '0.95' : '0.6'}
              className="transition-colors duration-300"
            />

            {/* Houston Metropolitan Halo */}
            <circle
              cx="612"
              cy="392"
              r={selectedId === 'greater-houston' ? '66' : '54'}
              fill="url(#houstonOrangeGlow)"
              className="transition-all duration-300"
            />
            <circle
              cx="612"
              cy="392"
              r="34"
              fill="#FF6500"
              fillOpacity={selectedId === 'greater-houston' ? '0.28' : '0.14'}
              stroke="#FF6500"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* Subtle Route Corridor */}
            <line
              x1="468"
              y1="295"
              x2="608"
              y2="388"
              stroke="#FF6500"
              strokeOpacity="0.5"
              strokeWidth="1.5"
              strokeDasharray="5 5"
            />

            {/* Interactive Zone Markers */}
            {COVERAGE_ZONES.map((zone) => {
              const isSelected = zone.id === selectedId;
              const labelX =
                zone.id === 'la-porte'
                  ? zone.coordinates.x + 12
                  : zone.id === 'greater-houston'
                    ? zone.coordinates.x - 132
                    : zone.coordinates.x - 95;
              const labelY =
                zone.id === 'la-porte'
                  ? zone.coordinates.y + 24
                  : zone.id === 'greater-houston'
                    ? zone.coordinates.y - 18
                    : zone.coordinates.y - 20;

              return (
                <g
                  key={zone.id}
                  onClick={() => setSelectedId(zone.id)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select ${zone.name}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedId(zone.id);
                    }
                  }}
                  className="cursor-pointer focus:outline-none"
                >
                  {isSelected && (
                    <circle
                      cx={zone.coordinates.x}
                      cy={zone.coordinates.y}
                      r="16"
                      fill="none"
                      stroke="#FF6500"
                      strokeWidth="1.75"
                      strokeOpacity="0.8"
                    />
                  )}
                  <circle
                    cx={zone.coordinates.x}
                    cy={zone.coordinates.y}
                    r={isSelected ? '8' : '6'}
                    fill={isSelected ? '#FF6500' : '#FFF5EB'}
                    stroke="#171717"
                    strokeWidth="2"
                  />
                  <text
                    x={labelX}
                    y={labelY}
                    fill={isSelected ? '#FF6500' : '#FFF5EB'}
                    stroke="#171717"
                    strokeWidth="4"
                    paintOrder="stroke"
                    fontSize="15"
                    fontWeight="700"
                    fontFamily="Poppins, sans-serif"
                  >
                    {zone.id === 'la-porte'
                      ? 'La Porte, TX'
                      : zone.id === 'greater-houston'
                        ? 'Houston Metro'
                        : 'Texas (Confirmed Scope)'}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <p className="text-xs text-[#FFF5EB]/65 mt-3">
          Note: Service coverage outside La Porte and Greater Houston is coordinated subject to
          confirmed Texas operating registration and route availability.
        </p>
      </div>

      {/* Right: Crisp Pure White Zone Details Card */}
      <div className="lg:col-span-5 min-w-0 bg-white rounded-3xl border border-[#EAD8C8] p-7 sm:p-9 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF6500]">
            <MapPin className="w-4 h-4 shrink-0 text-[#171717]" aria-hidden="true" />
            <span>{activeZone.statusLabel}</span>
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#171717] mt-3 leading-tight">
            {activeZone.name}
          </h3>
          <div className="w-12 h-1 rounded-full bg-[#FF6500] my-5" aria-hidden="true" />
          <p className="text-sm sm:text-base text-[#171717]/80 leading-relaxed">
            {activeZone.summary}
          </p>

          <ul className="mt-6 space-y-3.5">
            {activeZone.details.map((detail) => (
              <li key={detail} className="flex items-start gap-3 text-sm text-[#171717]/85">
                <CheckCircle2
                  className="w-4 h-4 text-[#171717] mt-0.5 shrink-0"
                  aria-hidden="true"
                />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 pt-6 border-t border-[#EAD8C8] flex items-center justify-between text-xs text-[#171717]/70">
          <span>Base: La Porte, TX 77571</span>
          <span className="font-mono tabular-nums font-semibold text-[#171717]">Est. 2022</span>
        </div>
      </div>
    </div>
  );
}
