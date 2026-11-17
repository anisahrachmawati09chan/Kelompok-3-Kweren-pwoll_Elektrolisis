import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  Sliders,
  FlaskConical,
  Flame,
} from 'lucide-react';
import {
  ELECTROLYTES,
  ELECTRODES,
  calculateElectrolysisReactions,
  type ElectrolyteId,
  type ElectrodeId,
  type CellContainerType,
  type SaltBridgeSalt,
} from './electrolysisRules';
import './simulation.css';

interface Bubble {
  id: number;
  x: number;
  y: number;
  r: number;
  speed: number;
  opacity: number;
  color: string;
}

interface IonParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'cation' | 'anion';
  label: string;
  color: string;
}

export const ElectrolysisSimulator: React.FC = () => {
  // 1. Simulation Variable States
  const [containerType, setContainerType] = useState<CellContainerType>('single');
  const [saltBridgeSalt, setSaltBridgeSalt] = useState<SaltBridgeSalt>('KNO3');
  const [electrolyteId, setElectrolyteId] = useState<ElectrolyteId>('cuso4');
  const [cathodeId, setCathodeId] = useState<ElectrodeId>('C');
  const [anodeId, setAnodeId] = useState<ElectrodeId>('Cu');
  const [voltage, setVoltage] = useState<number>(4.5); // 1.0 to 12.0 V

  // 2. Playback States
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [isSwitchClosed, setIsSwitchClosed] = useState<boolean>(true);

  // 3. Animation dynamic states
  const [electronOffset, setElectronOffset] = useState<number>(0);
  const [depositGrowth, setDepositGrowth] = useState<number>(2.5); // Thickness in px
  const [anodeErosion, setAnodeErosion] = useState<number>(0); // Erosion in px
  const [simTime, setSimTime] = useState<number>(0); // seconds

  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [ions, setIons] = useState<IonParticle[]>([]);

  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Chemical Calculation Results
  const reaction = calculateElectrolysisReactions(
    electrolyteId,
    cathodeId,
    anodeId,
    containerType,
    saltBridgeSalt
  );

  const electrolyte = ELECTROLYTES[electrolyteId];
  const cathodeElectrode = ELECTRODES[cathodeId];
  const anodeElectrode = ELECTRODES[anodeId];

  // Initialize and re-seed ion particles when electrolyte changes
  useEffect(() => {
    const newIons: IonParticle[] = [];
    const numPairs = 12;

    const cationSpecies = electrolyte.cations[0] || { formula: 'M⁺', color: '#0284c7' };
    const anionSpecies = electrolyte.anions[0] || { formula: 'X⁻', color: '#ea580c' };

    for (let i = 0; i < numPairs; i++) {
      // Cations distributed across solution area
      newIons.push({
        id: i * 2,
        x: 100 + Math.random() * 220,
        y: 220 + Math.random() * 110,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        type: 'cation',
        label: cationSpecies.formula,
        color: cationSpecies.color,
      });

      // Anions distributed across solution area
      newIons.push({
        id: i * 2 + 1,
        x: 100 + Math.random() * 220,
        y: 220 + Math.random() * 110,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        type: 'anion',
        label: anionSpecies.formula,
        color: anionSpecies.color,
      });
    }

    setIons(newIons);
    setBubbles([]);
    setDepositGrowth(1.5);
    setAnodeErosion(0);
    setSimTime(0);
  }, [electrolyteId, containerType]);

  // Handle Switch Toggle
  const toggleSwitch = () => {
    const newState = !isSwitchClosed;
    setIsSwitchClosed(newState);
    setIsRunning(newState);
  };

  const handlePlayPause = () => {
    const newState = !isRunning;
    setIsRunning(newState);
    setIsSwitchClosed(newState);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsSwitchClosed(false);
    setDepositGrowth(1.5);
    setAnodeErosion(0);
    setBubbles([]);
    setSimTime(0);
  };

  // Main real-time Animation loop
  useEffect(() => {
    const animate = (time: number) => {
      if (lastTimeRef.current != null) {
        const delta = Math.min((time - lastTimeRef.current) / 1000, 0.1);

        if (isRunning && isSwitchClosed) {
          const speedMultiplier = voltage / 4.5;

          // 1. Advance electron phase
          setElectronOffset((prev) => (prev + delta * 45 * speedMultiplier) % 100);

          // 2. Advance simulation timer
          setSimTime((prev) => prev + delta);

          // 3. Deposit growth on cathode if metal deposition
          if (reaction.cathodeReactionType === 'metal_deposition') {
            setDepositGrowth((prev) => Math.min(prev + delta * 0.45 * speedMultiplier, 9));
          }

          // 4. Anode erosion if active
          if (reaction.anodeErosion) {
            setAnodeErosion((prev) => Math.min(prev + delta * 0.3 * speedMultiplier, 5));
          }

          // 5. Update Ions Position (Drift towards opposite electrodes)
          setIons((prevIons) =>
            prevIons.map((ion) => {
              let newX = ion.x;
              let newY = ion.y;

              // Drift force: Cations drift LEFT (towards Cathode x=125)
              // Anions drift RIGHT (towards Anode x=295)
              const drift = 0.55 * speedMultiplier;
              const brownianX = (Math.random() - 0.5) * 0.5;
              const brownianY = (Math.random() - 0.5) * 0.5;

              if (ion.type === 'cation') {
                newX -= drift + brownianX;
                // If it hits cathode, wrap around back to right side
                if (newX < 125) newX = 260 + Math.random() * 40;
              } else {
                newX += drift + brownianX;
                // If it hits anode, wrap around back to left side
                if (newX > 295) newX = 125 + Math.random() * 40;
              }

              newY += brownianY;
              if (newY < 215) newY = 220;
              if (newY > 325) newY = 320;

              return { ...ion, x: newX, y: newY };
            })
          );

          // 6. Spawn and Update Gas Bubbles
          setBubbles((prevBubbles) => {
            const nextBubbles: Bubble[] = [];

            // Cathode bubbles (H2)
            if (reaction.cathodeGasType === 'H2' && Math.random() < 0.35 * speedMultiplier) {
              nextBubbles.push({
                id: Math.random(),
                x: 120 + (Math.random() - 0.5) * 16,
                y: 310 - Math.random() * 70,
                r: 2 + Math.random() * 2.5,
                speed: 35 + Math.random() * 25,
                opacity: 0.9,
                color: 'rgba(255, 255, 255, 0.85)',
              });
            }

            // Anode bubbles (O2, Cl2)
            if (reaction.anodeGasType && Math.random() < 0.35 * speedMultiplier) {
              const gasColor =
                reaction.anodeGasType === 'Cl2'
                  ? 'rgba(234, 179, 8, 0.85)' // Yellowish green
                  : 'rgba(255, 255, 255, 0.85)'; // Clear O2

              nextBubbles.push({
                id: Math.random(),
                x: 300 + (Math.random() - 0.5) * 16,
                y: 310 - Math.random() * 70,
                r: 2 + Math.random() * 2.5,
                speed: 35 + Math.random() * 25,
                opacity: 0.9,
                color: gasColor,
              });
            }

            // Float existing bubbles upward
            for (const b of prevBubbles) {
              const updatedY = b.y - b.speed * delta;
              if (updatedY > 205) {
                // Liquid surface is at y=205
                nextBubbles.push({
                  ...b,
                  y: updatedY,
                  opacity: Math.max(0, b.opacity - delta * 0.15),
                });
              }
            }

            return nextBubbles.slice(-35); // Keep at most 35 bubbles for performance
          });
        }
      }
      lastTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current != null) cancelAnimationFrame(requestRef.current);
    };
  }, [isRunning, isSwitchClosed, voltage, reaction]);

  // Preset handler for quick demo scenarios
  const applyPreset = (preset: 'electroplating' | 'chloralkali' | 'water_split' | 'downs') => {
    if (preset === 'electroplating') {
      setElectrolyteId('cuso4');
      setCathodeId('C');
      setAnodeId('Cu');
      setContainerType('single');
    } else if (preset === 'chloralkali') {
      setElectrolyteId('nacl_aq');
      setCathodeId('C');
      setAnodeId('C');
      setContainerType('porous_pot');
    } else if (preset === 'water_split') {
      setElectrolyteId('h2so4');
      setCathodeId('Pt');
      setAnodeId('Pt');
      setContainerType('single');
    } else if (preset === 'downs') {
      setElectrolyteId('nacl_molten');
      setCathodeId('Fe');
      setAnodeId('C');
      setContainerType('single');
    }
    setIsRunning(true);
    setIsSwitchClosed(true);
  };

  const calculatedCurrent = (voltage / 2.2).toFixed(2);

  return (
    <div className="sim-container">
      {/* --------------------------------------------------------
          1. HEADER CARD WITH REALTIME STATUS
      -------------------------------------------------------- */}
      <div className="sim-header-card">
        <div className="sim-header-left">
          <div className="sim-badge-row">
            <span className="sim-kicker">LABORATORIUM VIRTUAL INTERAKTIF</span>
            <span className="sim-kicker" style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
              FASE F KIMIA KELAS 12
            </span>
          </div>
          <h2 className="sim-title">
            <Zap size={22} className="text-sky-400" />
            Simulasi Bergerak Sel Elektrolisis
          </h2>
          <p className="sim-subtitle">
            Visualisasi mikroskopis perpindahan elektron, migrasi ion, dan reaksi elektrode secara langsung.
          </p>
        </div>

        <div className={`sim-status-pill ${isRunning && isSwitchClosed ? 'is-active' : 'is-paused'}`}>
          <span className="status-dot" />
          <span>{isRunning && isSwitchClosed ? 'ARUS MENGALIR (ON)' : 'SIRKUIT TERPUTUS (OFF)'}</span>
        </div>
      </div>

      {/* --------------------------------------------------------
          2. MAIN SECTION: VISUAL STAGE & CONTROLS
      -------------------------------------------------------- */}
      <div className="sim-main-grid">
        {/* Left Column: Visual Stage */}
        <div className="sim-stage-card">
          <div className="sim-stage-toolbar">
            <div className="sim-controls-group">
              <button
                type="button"
                className={`btn-sim-control btn-sim-play ${isRunning && isSwitchClosed ? 'active' : ''}`}
                onClick={handlePlayPause}
                title={isRunning && isSwitchClosed ? 'Jeda Simulasi' : 'Jalankan Simulasi'}
              >
                {isRunning && isSwitchClosed ? <Pause size={15} /> : <Play size={15} />}
                <span>{isRunning && isSwitchClosed ? 'Jeda' : 'Mulai'}</span>
              </button>

              <button
                type="button"
                className="btn-sim-control btn-sim-reset"
                onClick={handleReset}
                title="Reset Posisi & Lapisan"
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
            </div>

            {/* Slider Pengatur Arus / Tegangan */}
            <div className="sim-voltage-slider-box">
              <span className="slider-label">
                <Sliders size={13} />
                Tegangan: <strong className="slider-value">{voltage.toFixed(1)} V</strong>
              </span>
              <input
                type="range"
                min="1.0"
                max="12.0"
                step="0.5"
                value={voltage}
                onChange={(e) => setVoltage(parseFloat(e.target.value))}
                className="sim-range-input"
                title="Atur Tegangan DC Baterai (1.0 V - 12.0 V)"
              />
            </div>
          </div>

          {/* SVG Animated Viewport */}
          <div className="sim-stage-viewport">
            {/* Live Telemetry Overlay */}
            <div className="sim-telemetry-badge">
              <div className="telemetry-row">
                <span className="telemetry-label">Kuat Arus:</span>
                <span className="telemetry-val">{isSwitchClosed && isRunning ? `${calculatedCurrent} A` : '0.00 A'}</span>
              </div>
              <div className="telemetry-row">
                <span className="telemetry-label">Waktu:</span>
                <span className="telemetry-val">{simTime.toFixed(1)} s</span>
              </div>
              {reaction.cathodeDepositColor && (
                <div className="telemetry-row">
                  <span className="telemetry-label">Tebal Lapisan:</span>
                  <span className="telemetry-val" style={{ color: '#f59e0b' }}>
                    {(depositGrowth * 0.35).toFixed(2)} mm
                  </span>
                </div>
              )}
            </div>

            {/* SVG Visual Model */}
            <svg viewBox="0 0 420 380" className="sim-svg-stage">
              <defs>
                {/* Gradients */}
                <linearGradient id="batteryGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="50%" stopColor="#334155" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>

                <linearGradient id="liquidGradSingle" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={electrolyte.color} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={electrolyte.color} stopOpacity="0.9" />
                </linearGradient>

                {/* Glass Beaker Reflections */}
                <linearGradient id="glassReflection" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
                  <stop offset="20%" stopColor="#ffffff" stopOpacity="0.1" />
                  <stop offset="85%" stopColor="#ffffff" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* ----------------------------------------------------
                  1. DC POWER SOURCE / BATTERY (Top Center)
              ---------------------------------------------------- */}
              <g transform="translate(145, 18)">
                {/* Battery casing */}
                <rect x="0" y="0" width="130" height="48" rx="8" fill="url(#batteryGrad)" stroke="#475569" strokeWidth="2" />

                {/* Battery Label & Voltmeter Display */}
                <rect x="35" y="8" width="60" height="24" rx="4" fill="#020617" stroke="#334155" />
                <text x="65" y="24" fill="#38bdf8" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  {voltage.toFixed(1)} V
                </text>
                <text x="65" y="42" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">
                  SUMBER ARUS DC
                </text>

                {/* Minus (-) Terminal - Katode lead (Left) */}
                <rect x="-8" y="14" width="8" height="20" rx="3" fill="#0284c7" />
                <circle cx="-16" cy="24" r="8" fill="#0284c7" />
                <text x="-16" y="28" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">−</text>

                {/* Plus (+) Terminal - Anode lead (Right) */}
                <rect x="130" y="14" width="8" height="20" rx="3" fill="#ea580c" />
                <circle cx="146" cy="24" r="8" fill="#ea580c" />
                <text x="146" y="28" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">+</text>
              </g>

              {/* ----------------------------------------------------
                  2. EXTERNAL CIRCUIT WIRES & SWITCH
              ---------------------------------------------------- */}
              {/* Blue wire: Battery (-) to Katode (-) */}
              <path
                d="M 129 42 L 65 42 L 65 140 L 125 140"
                fill="none"
                stroke="#0284c7"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Red wire: Battery (+) to Switch, then to Anode (+) */}
              {/* Part 1: from battery to switch */}
              <path
                d="M 291 42 L 355 42 L 355 85"
                fill="none"
                stroke="#ea580c"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive Knife Switch */}
              <g
                className="sim-switch-interactive"
                onClick={toggleSwitch}
                title={`Klik saklar untuk ${isSwitchClosed ? 'MEMUTUS' : 'MENGHUBUNGKAN'} arus`}
              >
                {/* Switch Contacts */}
                <circle cx="355" cy="85" r="4.5" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
                <circle cx="355" cy="118" r="4.5" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />

                {/* Switch Lever Blade */}
                {isSwitchClosed ? (
                  // Closed state (connecting both contacts)
                  <line x1="355" y1="85" x2="355" y2="118" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
                ) : (
                  // Open state (swung out with angle gap)
                  <line x1="355" y1="85" x2="380" y2="100" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
                )}
                <text x="375" y="80" fill={isSwitchClosed ? '#10b981' : '#ef4444'} fontSize="8" fontWeight="800">
                  {isSwitchClosed ? 'ON' : 'OFF'}
                </text>
              </g>

              {/* Part 2: from switch to Anode */}
              <path
                d="M 355 118 L 355 140 L 295 140"
                fill="none"
                stroke="#ea580c"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Electron flow animation (moving yellow particles) when ON */}
              {isSwitchClosed && isRunning && (
                <>
                  {/* Left Wire Electrons: Flowing from Battery (-) to Katode */}
                  {[0.1, 0.35, 0.6, 0.85].map((pos, idx) => {
                    const phase = (pos + electronOffset / 100) % 1;
                    let ex = 0;
                    let ey = 0;
                    if (phase < 0.3) {
                      // Horizontal top: 129 down to 65
                      ex = 129 - (phase / 0.3) * (129 - 65);
                      ey = 42;
                    } else if (phase < 0.75) {
                      // Vertical down: 42 to 140
                      ex = 65;
                      ey = 42 + ((phase - 0.3) / 0.45) * (140 - 42);
                    } else {
                      // Horizontal into electrode: 65 to 125
                      ex = 65 + ((phase - 0.75) / 0.25) * (125 - 65);
                      ey = 140;
                    }

                    return (
                      <g key={`el-${idx}`} transform={`translate(${ex}, ${ey})`}>
                        <circle r="4.5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
                        <text y="2.5" fill="#854d0e" fontSize="7" fontWeight="bold" textAnchor="middle">e⁻</text>
                      </g>
                    );
                  })}

                  {/* Right Wire Electrons: Flowing from Anode (+) up to Battery (+) */}
                  {[0.15, 0.45, 0.75].map((pos, idx) => {
                    const phase = (pos + electronOffset / 100) % 1;
                    let ex = 0;
                    let ey = 0;
                    if (phase < 0.3) {
                      // Horizontal from Anode 295 out to 355
                      ex = 295 + (phase / 0.3) * (355 - 295);
                      ey = 140;
                    } else if (phase < 0.7) {
                      // Vertical up from 140 to 42
                      ex = 355;
                      ey = 140 - ((phase - 0.3) / 0.4) * (140 - 42);
                    } else {
                      // Horizontal into Battery (+) 355 to 291
                      ex = 355 - ((phase - 0.7) / 0.3) * (355 - 291);
                      ey = 42;
                    }

                    return (
                      <g key={`er-${idx}`} transform={`translate(${ex}, ${ey})`}>
                        <circle r="4.5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
                        <text y="2.5" fill="#854d0e" fontSize="7" fontWeight="bold" textAnchor="middle">e⁻</text>
                      </g>
                    );
                  })}
                </>
              )}

              {/* ----------------------------------------------------
                  3. ELECTROLYTIC CELL CONTAINER (Glassware)
              ---------------------------------------------------- */}
              {containerType === 'single' ? (
                // Single Beaker Setup
                <g>
                  {/* Liquid inside beaker */}
                  <rect x="75" y="200" width="270" height="150" rx="4" fill="url(#liquidGradSingle)" />
                  <ellipse cx="210" cy="200" rx="135" ry="8" fill={electrolyte.color} opacity="0.7" />

                  {/* Glass Beaker Body */}
                  <rect x="75" y="170" width="270" height="180" rx="14" fill="none" stroke="#94a3b8" strokeWidth="3.5" />
                  <rect x="75" y="170" width="270" height="180" rx="14" fill="url(#glassReflection)" />

                  {/* Volume Graduation ticks */}
                  <line x1="80" y1="230" x2="95" y2="230" stroke="#64748b" strokeWidth="1.5" />
                  <text x="100" y="233" fill="#64748b" fontSize="8">300 mL</text>
                  <line x1="80" y1="265" x2="95" y2="265" stroke="#64748b" strokeWidth="1.5" />
                  <text x="100" y="268" fill="#64748b" fontSize="8">200 mL</text>
                  <line x1="80" y1="300" x2="95" y2="300" stroke="#64748b" strokeWidth="1.5" />
                  <text x="100" y="303" fill="#64748b" fontSize="8">100 mL</text>

                  {/* Solution Label at bottom */}
                  <rect x="135" y="325" width="150" height="18" rx="4" fill="rgba(15, 23, 42, 0.75)" />
                  <text x="210" y="337" fill="#f8fafc" fontSize="9" fontWeight="bold" textAnchor="middle">
                    {electrolyte.name}
                  </text>
                </g>
              ) : containerType === 'salt_bridge' ? (
                // Dual Beakers with U-tube Salt Bridge
                <g>
                  {/* Left Beaker (Cathode) */}
                  <rect x="65" y="205" width="130" height="145" rx="8" fill="url(#liquidGradSingle)" />
                  <rect x="65" y="175" width="130" height="175" rx="10" fill="none" stroke="#94a3b8" strokeWidth="3" />
                  <text x="130" y="335" fill="#0369a1" fontSize="8" fontWeight="bold" textAnchor="middle">
                    Kompartemen Katoda
                  </text>

                  {/* Right Beaker (Anode) */}
                  <rect x="225" y="205" width="130" height="145" rx="8" fill="url(#liquidGradSingle)" />
                  <rect x="225" y="175" width="130" height="175" rx="10" fill="none" stroke="#94a3b8" strokeWidth="3" />
                  <text x="290" y="335" fill="#c2410c" fontSize="8" fontWeight="bold" textAnchor="middle">
                    Kompartemen Anoda
                  </text>

                  {/* Inverted U-tube Salt Bridge */}
                  <path
                    d="M 175 270 L 175 195 Q 175 180 195 180 L 225 180 Q 245 180 245 195 L 245 270"
                    fill="none"
                    stroke="#fed7aa"
                    strokeWidth="16"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 175 270 L 175 195 Q 175 180 195 180 L 225 180 Q 245 180 245 195 L 245 270"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <rect x="180" y="165" width="60" height="14" rx="4" fill="#0f172a" />
                  <text x="210" y="175" fill="#fde047" fontSize="8" fontWeight="bold" textAnchor="middle">
                    Jembatan {saltBridgeSalt}
                  </text>
                </g>
              ) : (
                // Porous Membrane (Sekat Berpori)
                <g>
                  {/* Single Beaker Container */}
                  <rect x="75" y="200" width="270" height="150" rx="4" fill="url(#liquidGradSingle)" />
                  <rect x="75" y="170" width="270" height="180" rx="14" fill="none" stroke="#94a3b8" strokeWidth="3.5" />

                  {/* Porous Membrane Partition in Middle */}
                  <line x1="210" y1="180" x2="210" y2="348" stroke="#0f172a" strokeWidth="4" strokeDasharray="5,4" />
                  <rect x="175" y="156" width="70" height="15" rx="3" fill="#1e293b" />
                  <text x="210" y="167" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">
                    Sekat Berpori
                  </text>
                </g>
              )}

              {/* ----------------------------------------------------
                  4. ELECTRODES (Katode Left, Anode Right)
              ---------------------------------------------------- */}
              {/* KATODA (-) on Left */}
              <g transform="translate(115, 130)">
                {/* Main Cathode Bar */}
                <rect
                  x="0"
                  y="0"
                  width="18"
                  height="185"
                  rx="3"
                  fill={cathodeElectrode.color}
                  stroke={cathodeElectrode.highlightColor}
                  strokeWidth="1.5"
                />

                {/* Metal Deposit Layer (Grows thicker when Cu/Ag/Zn/Ni/Au deposits) */}
                {reaction.cathodeDepositColor && depositGrowth > 1 && (
                  <rect
                    x={-depositGrowth}
                    y="75"
                    width={18 + depositGrowth * 2}
                    height="105"
                    rx="4"
                    fill={reaction.cathodeDepositColor}
                    stroke="#fef3c7"
                    strokeWidth="1"
                    opacity="0.9"
                  />
                )}

                {/* Katode (-) Label Tag Header */}
                <g transform="translate(-15, -28)">
                  <rect x="0" y="0" width="55" height="20" rx="4" fill="#0284c7" />
                  <text x="27.5" y="14" fill="#ffffff" fontSize="9" fontWeight="800" textAnchor="middle">
                    KATODA (−)
                  </text>
                  <text x="27.5" y="-3" fill="#0369a1" fontSize="8" fontWeight="bold" textAnchor="middle">
                    {cathodeElectrode.symbol}
                  </text>
                </g>
              </g>

              {/* ANODA (+) on Right */}
              <g transform="translate(285, 130)">
                {/* Main Anode Bar (Shrinks/erodes if active) */}
                <rect
                  x={anodeErosion / 2}
                  y="0"
                  width={Math.max(6, 18 - anodeErosion)}
                  height="185"
                  rx="3"
                  fill={anodeElectrode.color}
                  stroke={anodeElectrode.highlightColor}
                  strokeWidth="1.5"
                />

                {/* Anode (+) Label Tag Header */}
                <g transform="translate(-15, -28)">
                  <rect x="0" y="0" width="55" height="20" rx="4" fill="#ea580c" />
                  <text x="27.5" y="14" fill="#ffffff" fontSize="9" fontWeight="800" textAnchor="middle">
                    ANODA (+)
                  </text>
                  <text x="27.5" y="-3" fill="#c2410c" fontSize="8" fontWeight="bold" textAnchor="middle">
                    {anodeElectrode.symbol}
                  </text>
                </g>
              </g>

              {/* ----------------------------------------------------
                  5. BUBBLES ANIMATION (H2, O2, Cl2)
              ---------------------------------------------------- */}
              {bubbles.map((b) => (
                <circle
                  key={b.id}
                  cx={b.x}
                  cy={b.y}
                  r={b.r}
                  fill={b.color}
                  stroke="rgba(0, 0, 0, 0.2)"
                  strokeWidth="0.5"
                  opacity={b.opacity}
                />
              ))}

              {/* ----------------------------------------------------
                  6. IONS MIGRATION IN SOLUTION
              ---------------------------------------------------- */}
              {ions.map((ion) => (
                <g key={ion.id} transform={`translate(${ion.x}, ${ion.y})`}>
                  <circle
                    r="8.5"
                    fill={ion.type === 'cation' ? '#dbeafe' : '#fee2e2'}
                    stroke={ion.type === 'cation' ? '#2563eb' : '#dc2626'}
                    strokeWidth="1.5"
                    opacity="0.95"
                  />
                  <text
                    y="3"
                    fill={ion.type === 'cation' ? '#1d4ed8' : '#b91c1c'}
                    fontSize="7"
                    fontWeight="800"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {ion.label}
                  </text>
                </g>
              ))}

              {/* Migration Direction Arrows (Visual guide for students) */}
              {isSwitchClosed && isRunning && (
                <g opacity="0.6">
                  {/* Cations migration arrow (Leftwards towards Katode) */}
                  <path d="M 230 250 L 175 250 M 185 246 L 175 250 L 185 254" stroke="#2563eb" strokeWidth="2" fill="none" />
                  <text x="202" y="244" fill="#1e40af" fontSize="8" fontWeight="bold" textAnchor="middle">
                    Migrasi Kation (+)
                  </text>

                  {/* Anions migration arrow (Rightwards towards Anode) */}
                  <path d="M 230 280 L 275 280 M 265 276 L 275 280 L 265 284" stroke="#dc2626" strokeWidth="2" fill="none" />
                  <text x="252" y="293" fill="#991b1b" fontSize="8" fontWeight="bold" textAnchor="middle">
                    Migrasi Anion (−)
                  </text>
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Right Column: Controls & Variable Selection Panel */}
        <div className="sim-options-panel">
          {/* Card A: Pilihan Wadah / Jembatan */}
          <div className="sim-option-card">
            <h4 className="opt-section-title">
              <Layers size={14} className="text-sky-600" />
              1. Pilihan Wadah & Sekat
            </h4>
            <div className="opt-select-grid">
              <button
                type="button"
                className={`opt-btn-choice ${containerType === 'single' ? 'selected' : ''}`}
                onClick={() => setContainerType('single')}
              >
                <span className="opt-btn-name">Wadah Tunggal</span>
                <span className="opt-btn-desc">1 Gelas Kimia Standar</span>
              </button>

              <button
                type="button"
                className={`opt-btn-choice ${containerType === 'salt_bridge' ? 'selected' : ''}`}
                onClick={() => setContainerType('salt_bridge')}
              >
                <span className="opt-btn-name">Jembatan Garam</span>
                <span className="opt-btn-desc">2 Beaker + Tabung U</span>
              </button>

              <button
                type="button"
                className={`opt-btn-choice ${containerType === 'porous_pot' ? 'selected' : ''}`}
                onClick={() => setContainerType('porous_pot')}
              >
                <span className="opt-btn-name">Sekat Berpori</span>
                <span className="opt-btn-desc">Membran Pemisah</span>
              </button>
            </div>

            {/* Salt Bridge electrolyte options if selected */}
            {containerType === 'salt_bridge' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Garam Jembatan:</span>
                {(['KNO3', 'Na2SO4', 'KCl'] as SaltBridgeSalt[]).map((salt) => (
                  <button
                    key={salt}
                    type="button"
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.6rem',
                      borderRadius: '6px',
                      border: '1px solid',
                      borderColor: saltBridgeSalt === salt ? '#0284c7' : '#cbd5e1',
                      background: saltBridgeSalt === salt ? '#e0f2fe' : '#ffffff',
                      color: saltBridgeSalt === salt ? '#0369a1' : '#475569',
                      cursor: 'pointer',
                    }}
                    onClick={() => setSaltBridgeSalt(salt)}
                  >
                    {salt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Card B: Pilihan Larutan / Lelehan Elektrolit */}
          <div className="sim-option-card">
            <h4 className="opt-section-title">
              <FlaskConical size={14} className="text-emerald-600" />
              2. Pilihan Elektrolit
            </h4>
            <div className="solution-chips-grid">
              {(Object.keys(ELECTROLYTES) as ElectrolyteId[]).map((id) => {
                const el = ELECTROLYTES[id];
                const isSelected = electrolyteId === id;
                return (
                  <div
                    key={id}
                    className={`solution-chip-item ${isSelected ? 'active' : ''}`}
                    onClick={() => setElectrolyteId(id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setElectrolyteId(id);
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span className="chip-swatch" style={{ backgroundColor: el.color }} />
                      <span>{el.name}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', opacity: 0.85 }}>
                      {el.formula}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card C: Pilihan Elektroda (Katoda & Anoda Terpisah) */}
          <div className="sim-option-card">
            <h4 className="opt-section-title">
              <Zap size={14} className="text-amber-500" />
              3. Pilihan Batang Elektroda
            </h4>
            <div className="electrodes-duo-grid">
              {/* Katoda (-) Selector */}
              <div className="electrode-selector-box box-katode">
                <div className="electrode-box-title title-katode">
                  <span>Katoda (−)</span>
                  <span className="electrode-badge-tag tag-katode">
                    {cathodeElectrode.isInert ? 'Inert' : 'Aktif'}
                  </span>
                </div>
                <select
                  className="electrode-select-input"
                  value={cathodeId}
                  onChange={(e) => setCathodeId(e.target.value as ElectrodeId)}
                >
                  {(Object.keys(ELECTRODES) as ElectrodeId[]).map((elId) => (
                    <option key={elId} value={elId}>
                      {ELECTRODES[elId].name} ({ELECTRODES[elId].symbol}) - {ELECTRODES[elId].isInert ? 'Inert' : 'Aktif'}
                    </option>
                  ))}
                </select>
                <span style={{ fontSize: '0.6875rem', color: '#0369a1' }}>
                  {cathodeElectrode.description}
                </span>
              </div>

              {/* Anoda (+) Selector */}
              <div className="electrode-selector-box box-anode">
                <div className="electrode-box-title title-anode">
                  <span>Anoda (+)</span>
                  <span className="electrode-badge-tag tag-anode">
                    {anodeElectrode.isInert ? 'Inert' : 'Aktif'}
                  </span>
                </div>
                <select
                  className="electrode-select-input"
                  value={anodeId}
                  onChange={(e) => setAnodeId(e.target.value as ElectrodeId)}
                >
                  {(Object.keys(ELECTRODES) as ElectrodeId[]).map((elId) => (
                    <option key={elId} value={elId}>
                      {ELECTRODES[elId].name} ({ELECTRODES[elId].symbol}) - {ELECTRODES[elId].isInert ? 'Inert' : 'Aktif'}
                    </option>
                  ))}
                </select>
                <span style={{ fontSize: '0.6875rem', color: '#c2410c' }}>
                  {anodeElectrode.description}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------
          3. INFORMATION & CHEMICAL REACTION DISPLAY
      -------------------------------------------------------- */}
      <div className="sim-reactions-section">
        {/* Duo Cards: Katode (Reduksi) & Anode (Oksidasi) */}
        <div className="sim-reactions-grid">
          {/* Katoda Card */}
          <div className="reaction-card card-katode-reaction">
            <div className="reaction-card-header">
              <span className="rx-role-pill pill-katode">REAKSI KATODA (REDUKSI)</span>
              <span className="rx-product-tag">Kutub (−) Sumber Listrik</span>
            </div>
            <div className="rx-equation-box">{reaction.cathodeReaction}</div>
            <div className="rx-observation-box">
              <span className="rx-observation-title" style={{ color: '#1e40af' }}>
                <CheckCircle2 size={14} /> Pengamatan Makroskopis:
              </span>
              <p style={{ margin: 0 }}>{reaction.cathodeVisualNote}</p>
            </div>
          </div>

          {/* Anoda Card */}
          <div className="reaction-card card-anode-reaction">
            <div className="reaction-card-header">
              <span className="rx-role-pill pill-anode">REAKSI ANODA (OKSIDASI)</span>
              <span className="rx-product-tag">Kutub (+) Sumber Listrik</span>
            </div>
            <div className="rx-equation-box">{reaction.anodeReaction}</div>
            <div className="rx-observation-box">
              <span className="rx-observation-title" style={{ color: '#b91c1c' }}>
                <CheckCircle2 size={14} /> Pengamatan Makroskopis:
              </span>
              <p style={{ margin: 0 }}>{reaction.anodeVisualNote}</p>
            </div>
          </div>
        </div>

        {/* Total Reaction Banner */}
        <div className="total-reaction-card">
          <div className="total-rx-header">
            <span className="total-rx-title">
              <Sparkles size={16} /> PERSAMAAN REAKSI SEL TOTAL
            </span>
            <span style={{ fontSize: '0.75rem', color: '#a5b4fc', fontWeight: 600 }}>
              Kondisi: {electrolyte.name} | Anoda: {anodeElectrode.name}
            </span>
          </div>

          <div className="total-rx-equation">{reaction.totalReaction}</div>

          <div className="total-rx-notes">
            <span>
              <strong>Perubahan Cairan Elektrolit:</strong> {reaction.solutionObservation}
            </span>
            {reaction.industrialApplicationNote && (
              <span className="industrial-app-badge">
                <Flame size={14} /> {reaction.industrialApplicationNote}
              </span>
            )}
          </div>
        </div>

        {/* Quick Demo Experiment Guide (Presets for Students) */}
        <div className="sim-guide-card">
          <h4 className="guide-title">
            <Info size={16} className="text-sky-600" />
            Preset Skenario Percobaan Kimia SMA yang Sering Diujikan:
          </h4>
          <div className="guide-items-grid">
            <div className="guide-chip" onClick={() => applyPreset('electroplating')}>
              <span className="guide-chip-title">✨ 1. Penyepuhan Tembaga (Electroplating)</span>
              Larutan CuSO₄ + Anoda Cu Aktif. Tembaga berpindah dari anoda ke katoda.
            </div>

            <div className="guide-chip" onClick={() => applyPreset('chloralkali')}>
              <span className="guide-chip-title">🏭 2. Industri Klor-Alkali (NaCl Brine)</span>
              Larutan NaCl + Elektroda Karbon (C) + Sekat. Gas Cl₂ di anoda &amp; H₂ di katoda.
            </div>

            <div className="guide-chip" onClick={() => applyPreset('water_split')}>
              <span className="guide-chip-title">💧 3. Penguraian Air Murni (H₂SO₄)</span>
              Elektrolisis air menghasilkan gas H₂ di katoda dan gas O₂ di anoda (volume 2:1).
            </div>

            <div className="guide-chip" onClick={() => applyPreset('downs')}>
              <span className="guide-chip-title">⚡ 4. Proses Downs (Lelehan NaCl)</span>
              Lelehan cair tanpa air menghasilkan logam Na murni cair di katoda.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
