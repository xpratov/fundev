import { useState, useRef, useCallback, useEffect } from "react";

const W         = 360;
const H         = 260;
const SPK_X     = 72;
const SPK_Y     = 155;
const TRACK_Y   = 155;
const TRACK_X1  = 108;
const TRACK_X2  = 340;
const FORK_TOP  = { x: SPK_X - 8,  y: SPK_Y - 22 };
const FORK_BOT  = { x: SPK_X - 8,  y: SPK_Y + 22 };
const GRAVITY   = 0.55;
const POWER     = 0.22;
const MAX_PULL  = 90;

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function lerp(a, b, t) { return a + (b - a) * t; }

function volToX(vol) { return TRACK_X1 + (vol / 100) * (TRACK_X2 - TRACK_X1); }
function xToVol(x)   { return clamp(Math.round(((x - TRACK_X1) / (TRACK_X2 - TRACK_X1)) * 100), 0, 100); }

// Catmull-Rom style quadratic band
function bandPath(fork, proj) {
  const mx = (fork.x + proj.x) / 2;
  const my = (fork.y + proj.y) / 2 + 6;
  return `M ${fork.x} ${fork.y} Q ${mx} ${my} ${proj.x} ${proj.y}`;
}

export default function SlingshotVolume() {
  const [volume,   setVolume]   = useState(40);
  const [pull,     setPull]     = useState(null);   // {x,y} drag pos
  const [proj,     setProj]     = useState(null);   // {x,y} flying projectile
  const [landing,  setLanding]  = useState(volToX(40));
  const [trail,    setTrail]    = useState([]);
  const [phase,    setPhase]    = useState("idle"); // idle | pulling | flying | landed

  const svgRef  = useRef(null);
  const rafRef  = useRef(null);
  const dragging = useRef(false);

  const getSVGPos = (e) => {
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: ((clientX - rect.left) / rect.width)  * W,
      y: ((clientY - rect.top)  / rect.height) * H,
    };
  };

  const clampPull = ({ x, y }) => {
    const dx = x - SPK_X;
    const dy = y - SPK_Y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > MAX_PULL) {
      const scale = MAX_PULL / dist;
      return { x: SPK_X + dx * scale, y: SPK_Y + dy * scale };
    }
    return { x, y };
  };

  const onMouseDown = useCallback((e) => {
    if (phase === "flying") return;
    e.preventDefault();
    dragging.current = true;
    setPhase("pulling");
    setTrail([]);
    setProj(null);

    const onMove = (e) => {
      if (!dragging.current) return;
      const pos = getSVGPos(e);
      setPull(clampPull(pos));
    };

    const onUp = (e) => {
      dragging.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend",  onUp);

      const pos = getSVGPos(e.changedTouches ? { clientX: e.changedTouches[0].clientX, clientY: e.changedTouches[0].clientY } : e);
      const p   = clampPull(pos);
      const dx  = SPK_X - p.x;
      const dy  = SPK_Y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 10) { setPhase("idle"); setPull(null); return; }

      // Launch
      const vx = dx * POWER;
      const vy = dy * POWER;
      setPull(null);
      setPhase("flying");

      let px = SPK_X, py = SPK_Y;
      let pvx = vx, pvy = vy;
      const trailPts = [];

      const animate = () => {
        px  += pvx;
        py  += pvy;
        pvy += GRAVITY;
        trailPts.push({ x: px, y: py });
        if (trailPts.length > 18) trailPts.shift();

        setProj({ x: px, y: py });
        setTrail([...trailPts]);

        if (py >= TRACK_Y || px > TRACK_X2 + 20 || px < -20) {
          // Clamp landing to track
          const landX = clamp(px, TRACK_X1, TRACK_X2);
          const vol   = xToVol(landX);
          setVolume(vol);
          setLanding(landX);
          setProj(null);
          setPhase("landed");
          setTimeout(() => setPhase("idle"), 1200);
          return;
        }
        rafRef.current = requestAnimationFrame(animate);
      };

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend",  onUp);
  }, [phase]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const pullPt  = pull || { x: SPK_X, y: SPK_Y };
  const volColor = volume > 75 ? "#ff2d6b" : volume > 40 ? "#f5c842" : "#00e5c8";
  const landX    = volToX(volume);

  return (
    <div style={{
      width: "min(100%, 400px)",
      background: "#c8cfe0",
      borderRadius: 18,
      padding: "20px 20px 24px",
      boxSizing: "border-box",
      fontFamily: "monospace",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 12,
    }}>

      {/* Volume label */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, alignSelf: "stretch" }}>
        <span style={{ fontSize: 11, letterSpacing: "0.18em", color: "#3d4a6b", textTransform: "uppercase", fontWeight: 600 }}>
          Volume
        </span>
        <span style={{
          fontSize: 20, fontWeight: 700, color: "#0f1220",
          fontFamily: "monospace", marginLeft: "auto",
          transition: "color 0.2s",
          color: volColor,
        }}>
          {volume}
        </span>
      </div>

      {/* SVG Stage */}
      <svg
        ref={svgRef}
        width="100%"
        viewBox={`0 0 ${W} ${H}`}
        style={{
          display: "block",
          cursor: phase === "flying" ? "default" : phase === "pulling" ? "grabbing" : "grab",
          touchAction: "none",
        }}
        onMouseDown={onMouseDown}
        onTouchStart={onMouseDown}
      >
        <defs>
          <filter id="glow2">
            <feGaussianBlur stdDeviation="3" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="softglow">
            <feGaussianBlur stdDeviation="1.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* ── Track ── */}
        {/* Track groove */}
        <rect x={TRACK_X1} y={TRACK_Y - 3} width={TRACK_X2 - TRACK_X1} height={6}
          rx={3} fill="#8a95b0" />
        {/* Filled portion */}
        <rect x={TRACK_X1} y={TRACK_Y - 3} width={landX - TRACK_X1} height={6}
          rx={3} fill={volColor} style={{ transition: "fill 0.2s, width 0.1s" }} />

        {/* Volume ticks */}
        {[0,25,50,75,100].map((v) => {
          const tx = volToX(v);
          return (
            <g key={v}>
              <line x1={tx} y1={TRACK_Y + 6} x2={tx} y2={TRACK_Y + 12}
                stroke="#6b7a99" strokeWidth="1" />
              <text x={tx} y={TRACK_Y + 22} textAnchor="middle"
                fontSize="8" fill="#6b7a99" fontFamily="monospace">{v}</text>
            </g>
          );
        })}

        {/* Landing marker */}
        <circle cx={landX} cy={TRACK_Y} r={7}
          fill={volColor} filter="url(#softglow)"
          style={{ transition: "cx 0.15s, fill 0.2s" }} />
        <line x1={landX} y1={TRACK_Y - 18} x2={landX} y2={TRACK_Y - 8}
          stroke={volColor} strokeWidth="1.5" opacity="0.6"
          style={{ transition: "all 0.15s" }} />

        {/* ── Trail ── */}
        {trail.map((pt, i) => (
          <circle key={i}
            cx={pt.x} cy={pt.y}
            r={lerp(1, 4, i / trail.length)}
            fill={volColor}
            opacity={lerp(0.1, 0.5, i / trail.length)}
          />
        ))}

        {/* ── Slingshot bands ── */}
        {phase === "pulling" && pull && (
          <>
            <path d={bandPath(FORK_TOP, pullPt)}
              fill="none" stroke="#3d4a6b" strokeWidth="3"
              strokeLinecap="round" opacity="0.9" />
            <path d={bandPath(FORK_BOT, pullPt)}
              fill="none" stroke="#3d4a6b" strokeWidth="3"
              strokeLinecap="round" opacity="0.9" />
            {/* Pull indicator dot */}
            <circle cx={pullPt.x} cy={pullPt.y} r={8}
              fill="#f5c842" filter="url(#softglow)" />
            <circle cx={pullPt.x} cy={pullPt.y} r={4} fill="#2a3555" />
          </>
        )}

        {/* ── Flying projectile ── */}
        {proj && (
          <circle cx={proj.x} cy={proj.y} r={9}
            fill={volColor} filter="url(#glow2)" />
        )}

        {/* ── Speaker icon (SVG drawn) ── */}
        <g transform={`translate(${SPK_X - 20}, ${SPK_Y - 20})`}
          style={{ cursor: phase === "flying" ? "default" : "grab" }}>
          {/* Speaker body */}
          <polygon points="14,8 8,13 4,13 4,27 8,27 14,32"
            fill="#2a3555" stroke="#1e2640" strokeWidth="1" />
          {/* Wave 1 */}
          <path d="M17,13 Q22,20 17,27" fill="none"
            stroke={volume > 0 ? "#2a3555" : "#6b7a99"} strokeWidth="2.5"
            strokeLinecap="round" />
          {/* Wave 2 */}
          {volume > 30 && (
            <path d="M20,10 Q27,20 20,30" fill="none"
              stroke="#2a3555" strokeWidth="2"
              strokeLinecap="round" />
          )}
          {/* Wave 3 */}
          {volume > 65 && (
            <path d="M23,7 Q32,20 23,33" fill="none"
              stroke="#2a3555" strokeWidth="1.5"
              strokeLinecap="round" />
          )}
          {/* Fork prongs (slingshot visual) */}
          <line x1="6"  y1="8"  x2="-2" y2="-4"
            stroke="#3d4a6b" strokeWidth="3" strokeLinecap="round" />
          <line x1="6"  y1="32" x2="-2" y2="44"
            stroke="#3d4a6b" strokeWidth="3" strokeLinecap="round" />
          {/* Band at rest */}
          {phase === "idle" && (
            <path d="M -2,-4 Q 4,20 -2,44"
              fill="none" stroke="#3d4a6b" strokeWidth="2"
              strokeLinecap="round" opacity="0.5" strokeDasharray="3,3" />
          )}
        </g>

        {/* Hint text */}
        {phase === "idle" && (
          <text x={SPK_X + 30} y={SPK_Y - 32}
            fontSize="9" fill="#6b7a99" fontFamily="monospace">
            ushlab torting
          </text>
        )}
      </svg>
    </div>
  );
}