

export default function Developer() {
  return (
    <>
      <style>{`
        @keyframes travel {
          0%   { top: 0%;   opacity: 0; }
          8%   { opacity: 1; }
          88%  { opacity: 0.5; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes blink {
          0%, 100% { opacity: 0.25; }
          50%       { opacity: 0.7; }
        }
        .dot-travel  { animation: travel 2.6s ease-in-out infinite; }
        .scroll-hint { animation: blink 2.2s ease-in-out infinite; }

        .visit-btn {
          position: relative;
          transition: background 0.2s, color 0.2s;
        }
        .visit-btn::before {
          content: '';
          position: absolute;
          inset: -4px;
          border: 1px solid rgba(245, 200, 66, 0.28);
          transition: inset 0.22s, border-color 0.22s;
        }
        .visit-btn:hover {
          background: transparent !important;
          color: #f5c842 !important;
        }
        .visit-btn:hover::before {
          inset: -9px;
          border-color: rgba(245, 200, 66, 0.65);
        }
      `}</style>

      <div className="bg-[#0f1220] font-mono overflow-x-hidden">

        {/* ── HERO ── */}
        <section className="h-screen max-h-100 pb-12 flex flex-col items-center justify-center relative">

          {/* Name block */}
          <div className="leading-none tracking-tight select-none">
            {/*
              Space Mono is monospace → each char = equal width.
              "Xushnudbek" = 10 chars,  "Pratov" = 6 chars
              Pratov font-size = base × (10/6) → widths match exactly.
            */}
            <span
              className="block font-bold text-[#c8cfe0] whitespace-nowrap"
              style={{ fontSize: 'clamp(28px, 6vw, 72px)' }}
            >
              Xushnudbek
            </span>
            <span
              className="block font-bold text-[#f5c842] whitespace-nowrap"
              style={{ fontSize: 'calc(clamp(28px, 6vw, 72px) * 10 / 6)' }}
            >
              Pratov
            </span>
          </div>

          {/* Scroll hint — a bit above the very bottom */}
          <span
            className="scroll-hint absolute bottom-28 text-[9px] tracking-[0.28em] text-white/30"
          >
            SCROLL
          </span>

        </section>

        {/* ── ARROW + LINK ── */}
        <section className="flex flex-col items-center pb-32">

          {/* Shaft */}
          <div
            className="relative w-px"
            style={{
              height: '900px',
              background:
                'linear-gradient(to bottom, rgba(245,200,66,0.06) 0%, rgba(245,200,66,0.5) 65%, rgba(245,200,66,0.92) 100%)',
            }}
          >
            {/* Travelling dot */}
            <span
              className="dot-travel absolute left-1/2 -translate-x-1/2 w-0.75 h-0.75 rounded-full bg-[#f5c842]"
            />
          </div>

          {/* Arrowhead */}
          <svg
            width="12"
            height="20"
            viewBox="0 0 12 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginTop: '-1px' }}
          >
            <line
              x1="6" y1="0" x2="6" y2="15"
              stroke="rgba(245,200,66,0.92)"
              strokeWidth="1"
            />
            <polyline
              points="1,11 6,19 11,11"
              stroke="rgba(245,200,66,0.92)"
              strokeWidth="1"
              fill="none"
              strokeLinejoin="round"
            />
          </svg>

          {/* Button */}
          <div className="flex flex-col items-center gap-4 mt-10">
            <span className="text-[9px] tracking-[0.28em] text-[#3d4a6b]">
              VISIT
            </span>
            <a
              className="visit-btn text-[11px] font-bold tracking-[0.18em] text-[#0f1220] bg-[#f5c842] px-9 py-4 no-underline"
              href="https://pratov.uz"
              target="_blank"
              rel="noopener noreferrer"
            >
              PRATOV.UZ
            </a>
          </div>

        </section>

      </div>
    </>
  )
}