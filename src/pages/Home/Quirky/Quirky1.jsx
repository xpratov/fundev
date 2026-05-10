import { useState, useRef, useCallback } from "react";

const INITIAL_VOLUME = 50;

export default function VolumeCrank() {
  const [armAngle, setArmAngle] = useState(0);
  const [volume, setVolume] = useState(INITIAL_VOLUME);
  const [isDragging, setIsDragging] = useState(false);

  const pivotRef = useRef(null);
  const totalRotRef = useRef(0);
  const lastMouseAngleRef = useRef(0);

  const getMouseAngle = (clientX, clientY) => {
    const rect = pivotRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI);
  };

  const onDragStart = useCallback((clientX, clientY) => {
    lastMouseAngleRef.current = getMouseAngle(clientX, clientY);
    setIsDragging(true);

    const onMove = (e) => {
      const { clientX, clientY } = e.touches ? e.touches[0] : e;
      const newAngle = getMouseAngle(clientX, clientY);
      let delta = newAngle - lastMouseAngleRef.current;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      lastMouseAngleRef.current = newAngle;

      totalRotRef.current = Math.max(-50 * 360, Math.min(50 * 360, totalRotRef.current + delta));
      setArmAngle(totalRotRef.current);
      setVolume(Math.max(0, Math.min(100, INITIAL_VOLUME + Math.round(totalRotRef.current / 360))));
    };

    const onUp = () => {
      setIsDragging(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);
  }, []);

  const handleMouseDown = (e) => {
    e.preventDefault();
    onDragStart(e.clientX, e.clientY);
  };

  const handleTouchStart = (e) => {
    const t = e.touches[0];
    onDragStart(t.clientX, t.clientY);
  };

  const barColor = volume > 75 ? "#ff2d6b" : volume > 40 ? "#f5c842" : "#00e5c8";

  return (
    <div
      style={{
        width: "min(100%, 400px)",
        height: "min(100%, 400px)",
        minWidth: 300,
        minHeight: 300,
        background: "#c8cfe0",
        borderRadius: 18,
        boxSizing: "border-box",
        padding: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
        userSelect: "none",
      }}
    >
      {/* — Crank area — */}
      <div
        style={{
          position: "relative",
          width: 200,
          height: 200,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Outer decorative ring */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "1px solid #8a95b0",
          }}
        />

        {/* Inner inset ring */}
        <div
          style={{
            position: "absolute",
            inset: 20,
            borderRadius: "50%",
            border: "1px dashed #8a95b0",
            opacity: 0.5,
          }}
        />

        {/* Rotating arm + grip */}
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 82,
            height: 14,
            transformOrigin: "7px 50%",
            transform: `translate(-7px, -7px) rotate(${armAngle}deg)`,
            cursor: isDragging ? "grabbing" : "grab",
            zIndex: 2,
          }}
        >
          {/* Rod */}
          <div
            style={{
              position: "absolute",
              left: 7,
              top: "50%",
              transform: "translateY(-50%)",
              width: 68,
              height: 10,
              borderRadius: 5,
              background: "#6b7a99",
            }}
          />

          {/* Grip ball */}
          <div
            style={{
              position: "absolute",
              right: -4,
              top: "50%",
              transform: "translateY(-50%)",
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: "#3d4a6b",
              border: "2px solid #2a3555",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Hub — pivot point (sits on top, ref for center) */}
        <div
          ref={pivotRef}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "#2a3555",
            transform: "translate(-50%, -50%)",
            zIndex: 3,
            border: "2px solid #1e2640",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* — Volume display — */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          height: 200,
        }}
      >
        {/* Number */}
        <span
          style={{
            fontSize: 20,
            fontWeight: 700,
            fontFamily: "monospace",
            color: "#0f1220",
            letterSpacing: "-0.03em",
            minWidth: 36,
            textAlign: "center",
            lineHeight: 1,
          }}
        >
          {volume}
        </span>

        {/* Bar track */}
        <div
          style={{
            flex: 1,
            width: 28,
            background: "#8a95b0",
            borderRadius: 8,
            overflow: "hidden",
            border: "1.5px solid #3d4a6b",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <div
            style={{
              height: `${volume}%`,
              background: barColor,
              transition: "height 0.05s ease, background 0.15s ease",
              borderRadius: 7,
            }}
          />
        </div>

        {/* Speaker icon */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#3d4a6b"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          {volume > 60 && <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />}
        </svg>
      </div>
    </div>
  );
}