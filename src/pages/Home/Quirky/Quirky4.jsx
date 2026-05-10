import { useState, useRef, useCallback } from "react";

const SIZE    = 280;
const CX      = SIZE / 2;
const CY      = SIZE / 2;
const RING_R  = SIZE / 2;
const HOLE_R  = RING_R - 44;
const DIGIT_R = RING_R - 22;
const DOT_R   = 13;
const STOP_DEG = 108;
const SNAP_TOL = 16;

// Each digit's resting angle (CW from 12 o'clock)
const ANGLES = {
  1: 60, 2: 24, 3: 348, 4: 312, 5: 276,
  6: 240, 7: 204, 8: 168, 9: 132, 0: 96,
};

const toRad = (d) => (d * Math.PI) / 180;

function ptOnCircle(r, deg) {
  const rad = toRad(deg);
  return { x: CX + r * Math.sin(rad), y: CY - r * Math.cos(rad) };
}

// Returns angle CW from 12 o'clock (-180..180)
function getMouseAngle(e, rect) {
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  const x = clientX - rect.left - CX;
  const y = clientY - rect.top  - CY;
  return (Math.atan2(x, -y) * 180) / Math.PI;
}

// Normalize angle difference to -180..180
function normDelta(a) {
  let d = a % 360;
  if (d > 180)  d -= 360;
  if (d < -180) d += 360;
  return d;
}

function formatPhone(digits) {
  const s = digits.join("");
  if (!s) return "";
  if (s.length <= 3) return s;
  if (s.length <= 6) return `(${s.slice(0, 3)}) ${s.slice(3)}`;
  return `(${s.slice(0, 3)}) ${s.slice(3, 6)}-${s.slice(6)}`;
}

export default function RotaryDial() {
  const [rotation, setRotation] = useState(0);
  const [easing,   setEasing]   = useState("none");
  const [digits,   setDigits]   = useState([]);
  const [busy,     setBusy]     = useState(false);
  const [flash,    setFlash]    = useState(false);

  const svgRef   = useRef(null);
  const dragData = useRef(null); // { startAngle, maxRot }
  const curRot   = useRef(0);

  const springBack = useCallback((ok) => {
    if (ok) {
      setFlash(true);
      setTimeout(() => setFlash(false), 300);
    }
    setEasing("transform 400ms cubic-bezier(0.22,1,0.36,1)");
    setRotation(0);
    curRot.current = 0;
    setTimeout(() => {
      setBusy(false);
      setEasing("none");
    }, 420);
  }, []);

  const onPointerDown = useCallback((e) => {
    if (busy || digits.length >= 10) return;
    e.preventDefault();

    const rect   = svgRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const px = clientX - rect.left - CX;
    const py = clientY - rect.top  - CY;
    const dist = Math.sqrt(px * px + py * py);

    // Must click inside ring area
    if (dist < HOLE_R - 4 || dist > RING_R + 6) return;

    // Find which digit was grabbed (closest digit circle center)
    let closestDigit = null;
    let minDist = Infinity;
    for (const [d, angle] of Object.entries(ANGLES)) {
      const pt = ptOnCircle(DIGIT_R, angle);
      const dx = px - (pt.x - CX);
      const dy = py - (pt.y - CY);
      const dd = Math.sqrt(dx * dx + dy * dy);
      if (dd < minDist) { minDist = dd; closestDigit = Number(d); }
    }

    // Max rotation = how far this digit needs to travel to reach stopper
    const base   = ANGLES[closestDigit];
    const maxRot = ((STOP_DEG - base) % 360 + 360) % 360;

    setBusy(true);
    setEasing("none");
    curRot.current = 0;
    dragData.current = { startAngle: getMouseAngle(e, rect), maxRot };

    const onMove = (e) => {
      const rect2 = svgRef.current.getBoundingClientRect();
      const raw   = getMouseAngle(e, rect2) - dragData.current.startAngle;
      const delta = normDelta(raw);
      // CW only, clamped to this digit's max
      const rot = Math.max(0, Math.min(dragData.current.maxRot, delta));
      curRot.current = rot;
      setRotation(rot);
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend",  onUp);

      const rot    = curRot.current;
      const needed = dragData.current.maxRot;
      const ok     = Math.abs(rot - needed) < SNAP_TOL;
      if (ok) setDigits((p) => [...p, closestDigit]);
      springBack(ok);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend",  onUp);
  }, [busy, digits.length, springBack]);

  // Stopper visuals
  const stopPt = ptOnCircle(RING_R + 16, STOP_DEG);
  const stopB1 = ptOnCircle(RING_R - 2,  STOP_DEG - 8);
  const stopB2 = ptOnCircle(RING_R - 2,  STOP_DEG + 8);
  const accent = flash ? "#f5c842" : "#00e5c8";
  const PAD    = 26; // extra space around SVG for stopper arrow

  return (
    <div style={{
      width: "min(100%, 400px)",
      background: "#c8cfe0",
      borderRadius: 18,
      padding: "24px 20px 28px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 18,
      fontFamily: "monospace",
      userSelect: "none",
    }}>

      {/* Display */}
      <div style={{ minHeight: 36, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{
          fontSize: digits.length === 0 ? 14 : 22,
          fontWeight: 700,
          color: digits.length === 0 ? "#6b7a99" : "#0f1220",
          letterSpacing: "0.08em",
          transition: "font-size 0.15s",
        }}>
          {digits.length === 0 ? "raqamni ushlab torting →" : formatPhone(digits)}
        </span>
        {digits.length > 0 && (
          <button
            onClick={() => !busy && setDigits((p) => p.slice(0, -1))}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7a99", fontSize: 18, padding: "0 4px", lineHeight: 1 }}
          >←</button>
        )}
      </div>

      {/* Dial + stopper */}
      <div style={{ position: "relative", width: SIZE + PAD * 2, height: SIZE + PAD * 2 }}>

        {/* Fixed stopper overlay */}
        <svg
          width={SIZE + PAD * 2}
          height={SIZE + PAD * 2}
          style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 10, overflow: "visible" }}
        >
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          {/* Arrow */}
          <polygon
            points={[
              `${stopPt.x + PAD},${stopPt.y + PAD}`,
              `${stopB1.x + PAD},${stopB1.y + PAD}`,
              `${stopB2.x + PAD},${stopB2.y + PAD}`,
            ].join(" ")}
            fill={accent}
            filter="url(#glow)"
            style={{ transition: "fill 0.15s" }}
          />
          {/* Side guides */}
          {[-13, 13].map((off, i) => {
            const p1 = ptOnCircle(RING_R,      STOP_DEG + off);
            const p2 = ptOnCircle(RING_R + 10, STOP_DEG + off);
            return (
              <line key={i}
                x1={p1.x + PAD} y1={p1.y + PAD}
                x2={p2.x + PAD} y2={p2.y + PAD}
                stroke={accent} strokeWidth="1.5" opacity="0.5"
                style={{ transition: "stroke 0.15s" }}
              />
            );
          })}
          {/* Arc */}
          {(() => {
            const r  = RING_R + 22;
            const a1 = toRad(STOP_DEG - 20);
            const a2 = toRad(STOP_DEG + 20);
            return (
              <path
                d={`M ${CX + PAD + r * Math.sin(a1)} ${CY + PAD - r * Math.cos(a1)} A ${r} ${r} 0 0 1 ${CX + PAD + r * Math.sin(a2)} ${CY + PAD - r * Math.cos(a2)}`}
                fill="none" stroke={accent} strokeWidth="1.5" opacity="0.35"
                style={{ transition: "stroke 0.15s" }}
              />
            );
          })()}
        </svg>

        {/* Rotating dial */}
        <svg
          ref={svgRef}
          width={SIZE}
          height={SIZE}
          style={{
            position: "absolute",
            left: PAD, top: PAD,
            cursor: busy ? "grabbing" : "grab",
            transform: `rotate(${rotation}deg)`,
            transition: easing,
            transformOrigin: `${CX}px ${CY}px`,
          }}
          onMouseDown={onPointerDown}
          onTouchStart={onPointerDown}
        >
          {/* Ring */}
          <circle cx={CX} cy={CY} r={RING_R - 1} fill="#2a3555" />
          {/* Hole */}
          <circle cx={CX} cy={CY} r={HOLE_R} fill="#b8c0d4" stroke="#3d4a6b" strokeWidth="1.5" />
          {/* Hub */}
          <circle cx={CX} cy={CY} r={9} fill="#3d4a6b" />

          {/* Digits */}
          {Object.entries(ANGLES).map(([d, angle]) => {
            const pt = ptOnCircle(DIGIT_R, angle);
            return (
              <g key={d}>
                <circle cx={pt.x} cy={pt.y} r={DOT_R} fill="#6b7a99" />
                <text
                  x={pt.x} y={pt.y}
                  textAnchor="middle" dominantBaseline="central"
                  fontSize="12" fontWeight="700" fontFamily="monospace"
                  fill="#0f1220" style={{ pointerEvents: "none" }}
                >
                  {d}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Progress dots */}
      <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} style={{
            width:  i < digits.length ? 8 : 5,
            height: i < digits.length ? 8 : 5,
            borderRadius: "50%",
            background: i < digits.length ? "#2a3555" : "#8a95b0",
            transition: "all 0.2s",
          }} />
        ))}
      </div>
    </div>
  );
}