import { useState, useRef, useCallback } from "react";

const MIN = 0;
const MAX = 9999999999;

function formatPhone(num) {
  const s = String(Math.max(0, Math.min(MAX, num))).padStart(10, "0");
  return `(${s.slice(0, 3)}) ${s.slice(3, 6)}-${s.slice(6)}`;
}

export default function PhoneInput() {
  const [value, setValue] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const step = useCallback((dir) => {
    setValue((prev) => Math.max(MIN, Math.min(MAX, prev + dir)));
  }, []);

  const startHold = useCallback(
    (dir) => {
      step(dir);
      timeoutRef.current = setTimeout(() => {
        intervalRef.current = setInterval(() => step(dir), 80);
      }, 400);
    },
    [step]
  );

  const stopHold = useCallback(() => {
    clearTimeout(timeoutRef.current);
    clearInterval(intervalRef.current);
  }, []);

  const handleSubmit = () => {
    if (value > 0) setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setValue(0);
  };

  const btnBase = {
    width: 40,
    height: 40,
    borderRadius: 10,
    border: "1.5px solid #3d4a6b",
    background: "#8a95b0",
    color: "#0f1220",
    fontSize: 22,
    fontWeight: 400,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    lineHeight: 1,
    userSelect: "none",
    WebkitUserSelect: "none",
  };

  return (
    <div
      style={{
        width: "min(100%, 400px)",
        background: "#c8cfe0",
        borderRadius: 18,
        padding: "28px 24px",
        boxSizing: "border-box",
        fontFamily: "monospace",
      }}
    >
      {submitted ? (
        /* — Confirmation — */
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <span
            style={{
              fontSize: 11,
              letterSpacing: "0.18em",
              color: "#3d4a6b",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Submitted
          </span>
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: "#0f1220",
              letterSpacing: "0.04em",
            }}
          >
            {formatPhone(value)}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#00e5c8",
              }}
            />
            <span style={{ fontSize: 13, color: "#2a3555" }}>
              Raqam saqlandi
            </span>
          </div>
          <button
            onClick={handleReset}
            style={{
              marginTop: 4,
              padding: "8px 16px",
              borderRadius: 10,
              border: "1.5px solid #3d4a6b",
              background: "transparent",
              color: "#2a3555",
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "monospace",
              alignSelf: "flex-start",
            }}
          >
            Qayta kiritish
          </button>
        </div>
      ) : (
        /* — Input — */
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Label */}
          <span
            style={{
              fontSize: 11,
              letterSpacing: "0.18em",
              color: "#3d4a6b",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Telefon raqam
          </span>

          {/* Stepper row */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Minus */}
            <button
              style={btnBase}
              onMouseDown={() => startHold(-1)}
              onMouseUp={stopHold}
              onMouseLeave={stopHold}
              onTouchStart={() => startHold(-1)}
              onTouchEnd={stopHold}
            >
              −
            </button>

            {/* Phone display */}
            <div
              style={{
                flex: 1,
                textAlign: "center",
                fontSize: 20,
                fontWeight: 700,
                color: "#0f1220",
                letterSpacing: "0.06em",
                background: "#b8c0d4",
                borderRadius: 10,
                border: "1.5px solid #3d4a6b",
                padding: "10px 8px",
                boxSizing: "border-box",
                transition: "color 0.1s",
              }}
            >
              {formatPhone(value)}
            </div>

            {/* Plus */}
            <button
              style={btnBase}
              onMouseDown={() => startHold(1)}
              onMouseUp={stopHold}
              onMouseLeave={stopHold}
              onTouchStart={() => startHold(1)}
              onTouchEnd={stopHold}
            >
              +
            </button>
          </div>

          {/* Progress dots — how far from 0000000000 */}
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {Array.from({ length: 10 }).map((_, i) => {
              const digit = String(value).padStart(10, "0")[i];
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 3,
                    borderRadius: 2,
                    background: digit !== "0" ? "#2a3555" : "#8a95b0",
                    transition: "background 0.15s",
                  }}
                />
              );
            })}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={value === 0}
            style={{
              padding: "11px 0",
              borderRadius: 10,
              border: "1.5px solid #2a3555",
              background: value === 0 ? "#8a95b0" : "#2a3555",
              color: value === 0 ? "#6b7a99" : "#c8cfe0",
              fontSize: 14,
              fontWeight: 600,
              cursor: value === 0 ? "not-allowed" : "pointer",
              fontFamily: "monospace",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              transition: "background 0.15s, color 0.15s",
            }}
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}