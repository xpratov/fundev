import { useState, useCallback } from "react";

const PREFIXES = ["90","91","93","94","95","97","98","99","33","50"];

function randomPhone() {
  const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
  const rest   = String(Math.floor(Math.random() * 10000000)).padStart(7, "0");
  return `+998 ${prefix} ${rest.slice(0,3)} ${rest.slice(3,5)} ${rest.slice(5)}`;
}

export default function Quirky7() {
  const [phone,     setPhone]     = useState(randomPhone);
  const [confirmed, setConfirmed] = useState(false);
  const [shake,     setShake]     = useState(false);
  const [yesAnim,   setYesAnim]   = useState(false);

  const handleNo = useCallback(() => {
    setShake(true);
    setTimeout(() => {
      setShake(false);
      setPhone(randomPhone());
    }, 380);
  }, []);

  const handleYes = useCallback(() => {
    setYesAnim(true);
    setTimeout(() => setConfirmed(true), 260);
  }, []);

  const handleReset = () => {
    setConfirmed(false);
    setYesAnim(false);
    setPhone(randomPhone());
  };

  return (
    <div style={{
      width: "min(100%, 400px)",
      minWidth: 300,
      background: "#c8cfe0",
      borderRadius: 18,
      padding: "28px 24px",
      boxSizing: "border-box",
      fontFamily: "monospace",
      height: 220,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    }}>
      <style>{`
        @keyframes shake {
          0%   { transform: translateX(0); }
          18%  { transform: translateX(-10px); }
          36%  { transform: translateX(9px); }
          54%  { transform: translateX(-7px); }
          72%  { transform: translateX(5px); }
          88%  { transform: translateX(-3px); }
          100% { transform: translateX(0); }
        }
        @keyframes pop {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>

      {/* ── Top: label + phone ── */}
      <div style={{ animation: shake ? "shake 0.35s ease" : "none" }}>
        <p style={{ margin: 0, fontSize: 12, color: "#3d4a6b", fontWeight: 600, marginBottom: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Bu sizning raqamingizmi?
        </p>
        <p style={{
          margin: 0,
          fontSize: 22,
          fontWeight: 700,
          color: "#0f1220",
          letterSpacing: "0.06em",
          animation: !shake ? "pop 0.28s ease" : "none",
        }}>
          {phone}
        </p>
      </div>

      {/* ── Middle: status line (always present) ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        height: 28,
        opacity: confirmed ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}>
        <div style={{
          width: 20, height: 20, borderRadius: "50%",
          background: "#00e5c8",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, flexShrink: 0,
        }}>✓</div>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#0f1220" }}>
          Raqam tasdiqlandi
        </span>
      </div>

      {/* ── Bottom: buttons ── */}
      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={confirmed ? handleReset : handleYes}
          style={{
            flex: 1,
            padding: "12px 0",
            borderRadius: 10,
            border: "1.5px solid #2a3555",
            background: yesAnim ? "#00e5c8" : "#2a3555",
            color: yesAnim ? "#0f1220" : "#c8cfe0",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "monospace",
            letterSpacing: "0.08em",
            transition: "background 0.25s, color 0.25s",
          }}
        >
          {confirmed ? "Qayta" : "Ha"}
        </button>

        <button
          onClick={handleNo}
          disabled={confirmed}
          style={{
            flex: 1,
            padding: "12px 0",
            borderRadius: 10,
            border: "1.5px solid #3d4a6b",
            background: "transparent",
            color: confirmed ? "#8a95b0" : "#2a3555",
            fontSize: 14,
            fontWeight: 700,
            cursor: confirmed ? "default" : "pointer",
            fontFamily: "monospace",
            letterSpacing: "0.08em",
            transition: "color 0.2s",
          }}
        >
          Yo'q
        </button>
      </div>
    </div>
  );
}