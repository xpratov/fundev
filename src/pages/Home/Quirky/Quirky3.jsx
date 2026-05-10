import { useState } from "react";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const YEARS = Array.from({ length: 80 }, (_, i) => 2024 - i);
const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const sel = (width, small = false) => ({
  width,
  height: small ? 40 : 44,
  background: "#b8c0d4",
  border: "1.5px solid #3d4a6b",
  borderRadius: 9,
  color: "#0f1220",
  fontSize: small ? 15 : 14,
  fontFamily: "monospace",
  fontWeight: 700,
  cursor: "pointer",
  outline: "none",
  padding: small ? "0 2px" : "0 6px",
  appearance: "none",
  WebkitAppearance: "none",
  textAlign: "center",
  textAlignLast: "center",
  boxSizing: "border-box",
});

const sep = (char) => (
  <span style={{ color: "#3d4a6b", fontWeight: 700, fontSize: 16, fontFamily: "monospace", flexShrink: 0 }}>
    {char}
  </span>
);

const label = (text) => (
  <span style={{
    fontSize: 11,
    letterSpacing: "0.18em",
    color: "#3d4a6b",
    textTransform: "uppercase",
    fontWeight: 600,
    fontFamily: "monospace",
  }}>
    {text}
  </span>
);

export default function DatePhoneForm() {
  const [month, setMonth] = useState(0);
  const [day, setDay]     = useState(1);
  const [year, setYear]   = useState(2000);
  const [digits, setDigits] = useState(Array(10).fill(0));
  const [submitted, setSubmitted] = useState(false);

  const setDigit = (i, v) =>
    setDigits((prev) => { const n = [...prev]; n[i] = Number(v); return n; });

  const phone = `(${digits.slice(0,3).join("")}) ${digits.slice(3,6).join("")}-${digits.slice(6).join("")}`;
  const dateStr = `${MONTHS[month]} ${day}, ${year}`;

  const digitSel = (i) => (
    <select
      key={i}
      value={digits[i]}
      onChange={(e) => setDigit(i, e.target.value)}
      style={sel(32, true)}
    >
      {DIGITS.map((d) => <option key={d} value={d}>{d}</option>)}
    </select>
  );

  if (submitted) {
    return (
      <div style={{
        width: "min(100%, 400px)",
        background: "#c8cfe0",
        borderRadius: 18,
        padding: 28,
        boxSizing: "border-box",
        fontFamily: "monospace",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}>
        {label("Yuborildi")}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{
            background: "#b8c0d4",
            border: "1.5px solid #3d4a6b",
            borderRadius: 10,
            padding: "12px 16px",
          }}>
            <div style={{ fontSize: 11, color: "#3d4a6b", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Sana</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#0f1220" }}>{dateStr}</div>
          </div>
          <div style={{
            background: "#b8c0d4",
            border: "1.5px solid #3d4a6b",
            borderRadius: 10,
            padding: "12px 16px",
          }}>
            <div style={{ fontSize: 11, color: "#3d4a6b", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Telefon</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#0f1220" }}>{phone}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00e5c8" }} />
          <span style={{ fontSize: 13, color: "#2a3555" }}>Ma'lumot saqlandi</span>
        </div>
        <button
          onClick={() => { setSubmitted(false); setDigits(Array(10).fill(0)); setMonth(0); setDay(1); setYear(2000); }}
          style={{
            padding: "10px 0",
            borderRadius: 10,
            border: "1.5px solid #3d4a6b",
            background: "transparent",
            color: "#2a3555",
            fontSize: 13,
            cursor: "pointer",
            fontFamily: "monospace",
            letterSpacing: "0.1em",
          }}
        >
          Qayta kiritish
        </button>
      </div>
    );
  }

  return (
    <div style={{
      width: "min(100%, 400px)",
      background: "#c8cfe0",
      borderRadius: 18,
      padding: 28,
      boxSizing: "border-box",
      fontFamily: "monospace",
      display: "flex",
      flexDirection: "column",
      gap: 0,
    }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#0f1220", letterSpacing: "-0.01em" }}>
          Ma'lumot kiriting
        </div>
        <div style={{ fontSize: 12, color: "#3d4a6b", marginTop: 4 }}>
          Sana va telefon raqamni tanlang
        </div>
      </div>

      {/* — Date — */}
      <div style={{ marginBottom: 28 }}>
        {label("Tug'ilgan sana")}
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 10 }}>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            style={{ ...sel(130), appearance: "auto", WebkitAppearance: "auto", textAlign: "left", textAlignLast: "left", padding: "0 10px", fontSize: 13 }}
          >
            {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
          <select
            value={day}
            onChange={(e) => setDay(Number(e.target.value))}
            style={{ ...sel(66), appearance: "auto", WebkitAppearance: "auto", textAlign: "left", textAlignLast: "left", padding: "0 8px", fontSize: 13 }}
          >
            {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            style={{ ...sel(88), appearance: "auto", WebkitAppearance: "auto", textAlign: "left", textAlignLast: "left", padding: "0 8px", fontSize: 13 }}
          >
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: "#6b7a99" }}>
          {MONTHS[month]} {day}, {year}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "#8a95b0", marginBottom: 28 }} />

      {/* — Phone — */}
      <div style={{ marginBottom: 28 }}>
        {label("Telefon raqam")}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 3,
          marginTop: 10,
          flexWrap: "nowrap",
        }}>
          {sep("(")}
          {digitSel(0)}{digitSel(1)}{digitSel(2)}
          {sep(")")}
          <span style={{ width: 4 }} />
          {digitSel(3)}{digitSel(4)}{digitSel(5)}
          {sep("−")}
          {digitSel(6)}{digitSel(7)}{digitSel(8)}{digitSel(9)}
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: "#6b7a99" }}>{phone}</div>
      </div>

      {/* Submit */}
      <button
        onClick={() => setSubmitted(true)}
        style={{
          padding: "13px 0",
          borderRadius: 10,
          border: "1.5px solid #2a3555",
          background: "#2a3555",
          color: "#c8cfe0",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "monospace",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          marginTop: "auto",
        }}
      >
        Submit
      </button>
    </div>
  );
}