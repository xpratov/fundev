import { useState, useRef, useEffect, useCallback } from "react";

const TRACK_LEN = 230;
const TRACK_H   = 46;
const BALL_R    = 13;
const MAX_ANGLE = 58;
const GROOVE_W  = TRACK_LEN - 24;

function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

export default function TiltVolume() {
  const [angle,   setAngle]   = useState(0);
  const [ballPos, setBallPos] = useState(0); // -1..1
  const [volume,  setVolume]  = useState(50);
  const [isDrag,  setIsDrag]  = useState(false);

  const physRef = useRef({ pos: 0, vel: 0, angle: 0 });
  const rafRef  = useRef(null);

  const sliderRef = useRef(null);

  // ── Physics loop ───────────────────────────────────────────
  useEffect(() => {
    const SPRING  = 0.06;
    const DAMP    = 0.80;
    const MAX_SIN = Math.sin((MAX_ANGLE * Math.PI) / 180); // normalize so ±MAX_ANGLE → ±1

    const loop = () => {
      const p = physRef.current;
      // Scale so max angle maps ball all the way to edge (0 or 100)
      const target = clamp(Math.sin((p.angle * Math.PI) / 180) / MAX_SIN, -1, 1);
      p.vel += (target - p.pos) * SPRING;
      p.vel *= DAMP;
      p.pos += p.vel;
      p.pos = clamp(p.pos, -1, 1);
      setBallPos(p.pos);
      setVolume(Math.round(((p.pos + 1) / 2) * 100));
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // ── Drag to rotate ─────────────────────────────────────────
  const onPointerDown = useCallback((e) => {
    e.preventDefault();
    setIsDrag(true);
    const clientX  = e.touches ? e.touches[0].clientX : e.clientX;
    const startY   = e.touches ? e.touches[0].clientY : e.clientY;
    const startAngle = physRef.current.angle;

    // Determine which side of the slider was grabbed → invert drag for left side
    const rect   = sliderRef.current.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const rad    = -(physRef.current.angle * Math.PI) / 180;
    const dx     = clientX - cx;
    const dy     = (e.touches ? e.touches[0].clientY : e.clientY) - cy;
    const localX = dx * Math.cos(rad) - dy * Math.sin(rad);
    const sign   = localX < 0 ? -1 : 1; // left side → invert

    const onMove = (e) => {
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      const newAngle = clamp(startAngle + (y - startY) * 0.7 * sign, -MAX_ANGLE, MAX_ANGLE);
      physRef.current.angle = newAngle;
      setAngle(newAngle);
    };

    const onUp = () => {
      setIsDrag(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend",  onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend",  onUp);
  }, []);

  // ── Derived visuals ────────────────────────────────────────
  const ballX    = ballPos * ((GROOVE_W / 2) - BALL_R);
  const volColor = volume > 74 ? "#ff2d6b" : volume > 39 ? "#f5c842" : "#00e5c8";
  const absAngle = Math.abs(angle);
  // Subtle 3-D shading: top face lighter when tilted
  const topShade  = `rgba(200,207,224,${0.18 + (angle / MAX_ANGLE) * 0.08})`;
  const sideDepth = Math.round(absAngle / MAX_ANGLE * 8) + 4;

  return (
    <div style={{
      width: "min(100%, 400px)",
      minWidth: 300,
      background: "#c8cfe0",
      borderRadius: 18,
      padding: "28px 24px 32px",
      boxSizing: "border-box",
      fontFamily: "monospace",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 36,
      userSelect: "none",
    }}>

      {/* ── Volume label ── */}
      <div style={{ display: "flex", gap: 10, alignItems: "baseline", alignSelf: "stretch" }}>
        <span style={{ fontSize: 11, letterSpacing: "0.18em", color: "#3d4a6b", textTransform: "uppercase", fontWeight: 600 }}>
          Volume
        </span>
        <span style={{ fontSize: 28, fontWeight: 700, color: volColor, fontFamily: "monospace", transition: "color 0.2s", marginLeft: "auto" }}>
          {volume}
        </span>
      </div>

      {/* ── Tilting slider ── */}
      <div
        ref={sliderRef}
        style={{
          transform: `rotate(${angle}deg)`,
          transition: isDrag ? "none" : "transform 0.08s ease-out",
          cursor: isDrag ? "grabbing" : "grab",
          position: "relative",
          touchAction: "none",
        }}
        onMouseDown={onPointerDown}
        onTouchStart={onPointerDown}
      >
        {/* Body (top face) */}
        <div style={{
          width: TRACK_LEN,
          height: TRACK_H,
          background: `linear-gradient(180deg, #b8c0d4 0%, #8a95b0 100%)`,
          borderRadius: 8,
          boxShadow: `
            0 ${sideDepth}px 0 #3d4a6b,
            0 ${sideDepth + 2}px 12px rgba(0,0,0,0.25),
            inset 0 1px 0 rgba(255,255,255,0.25)
          `,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          {/* Groove track */}
          <div style={{
            width: GROOVE_W,
            height: 6,
            background: "#2a3555",
            borderRadius: 3,
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4)",
            position: "relative",
            overflow: "visible",
          }}>
            {/* Filled left portion */}
            <div style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: `${((ballPos + 1) / 2) * 100}%`,
              background: volColor,
              borderRadius: 3,
              transition: "background 0.2s",
            }} />
          </div>

          {/* Ball */}
          <div style={{
            position: "absolute",
            left: `calc(50% + ${ballX}px)`,
            top: "50%",
            transform: "translate(-50%, -50%)",
            width:  BALL_R * 2,
            height: BALL_R * 2,
            borderRadius: "50%",
            background: `radial-gradient(circle at 35% 35%, #ffffff, ${volColor})`,
            boxShadow: `0 2px 8px rgba(0,0,0,0.35), 0 0 0 2px #2a3555`,
            transition: "background 0.2s, box-shadow 0.2s",
            zIndex: 2,
          }} />

          {/* End caps */}
          {[-1, 1].map((side) => (
            <div key={side} style={{
              position: "absolute",
              [side === -1 ? "left" : "right"]: 8,
              top: "50%",
              transform: "translateY(-50%)",
              width: 3,
              height: 16,
              background: "#3d4a6b",
              borderRadius: 2,
              opacity: 0.6,
            }} />
          ))}

          {/* Top highlight */}
          <div style={{
            position: "absolute", inset: 0,
            borderRadius: 8,
            background: topShade,
            pointerEvents: "none",
          }} />
        </div>

        {/* Bottom 3-D side face */}
        <div style={{
          position: "absolute",
          top: TRACK_H,
          left: 4,
          width: TRACK_LEN - 8,
          height: sideDepth,
          background: "#3d4a6b",
          borderRadius: "0 0 6px 6px",
          transform: "skewX(0deg)",
        }} />
      </div>

      {/* ── Angle indicator ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{
          width: 32, height: 32,
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative",
        }}>
          {/* Mini tilt arc */}
          <svg width="32" height="32" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="10" fill="none" stroke="#8a95b0" strokeWidth="1.5" />
            <line
              x1="16" y1="16"
              x2={16 + 9 * Math.sin((angle * Math.PI) / 180)}
              y2={16 - 9 * Math.cos((angle * Math.PI) / 180)}
              stroke={volColor} strokeWidth="2.5" strokeLinecap="round"
              style={{ transition: "all 0.08s" }}
            />
            <circle cx="16" cy="16" r="2.5" fill="#2a3555" />
          </svg>
        </div>
        <span style={{ fontSize: 11, color: "#6b7a99", letterSpacing: "0.1em" }}>
          {angle >= 0 ? "+" : ""}{Math.round(angle)}°
        </span>
        <span style={{ fontSize: 10, color: "#8a95b0", marginLeft: 4 }}>
          yuqori-pastga torting
        </span>
      </div>
    </div>
  );
}