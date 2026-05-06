import { poorMeme } from "../../utils/imageExport"


export default function DonatePage() {
  const donateUrl = 'https://tirikchilik.uz/khushnudbek'

  return (
    <>
      <style>{`
        @keyframes blink-cursor {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        .cursor { animation: blink-cursor 1s step-end infinite; }

        .donate-link {
          position: relative;
          transition: color 0.2s;
        }
        .donate-link::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 0%;
          height: 1px;
          background: #f5c842;
          transition: width 0.35s ease;
        }
        .donate-link:hover { color: #f5c842; }
        .donate-link:hover::after { width: 100%; }

        .copy-btn {
          transition: background 0.18s, color 0.18s, border-color 0.18s;
        }
        .copy-btn:hover {
          background: #f5c842;
          color: #0f1220;
          border-color: #f5c842;
        }
      `}</style>

      <div className="min-h-screen bg-[#0f1220] font-mono flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-16">

          <div className="flex flex-col md:flex-row md:items-center gap-12 md:gap-0">

            {/* LEFT: text */}
            <div className="flex-1 flex flex-col justify-center">

              <div className="mb-10">
                <span className="block font-bold text-[#f5c842] uppercase leading-none"
                  style={{ fontSize: 'clamp(64px, 14vw, 120px)' }}>
                  DONAT<span className="cursor text-[#00e5c8]">_</span>
                </span>
              </div>

              <div className="w-12 h-px bg-[#f5c842]/30 mb-8" />

              <p className="text-[#6b7a99] text-xs tracking-widest mb-8 max-w-xs leading-relaxed">
                AGAR ISHIM SIZGA YOQQAN BO'LSA,<br />
                QUYIDAGI HAVOLA ORQALI QO'LLAB-QUVVATLASHINGIZ MUMKIN.
              </p>

              {/* Link block */}
              <div className="border border-[#1e2640] bg-[#131829] p-5 max-w-sm">

                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-[#ff2d6b]/60" />
                  <span className="w-2 h-2 rounded-full bg-[#f5c842]/60" />
                  <span className="w-2 h-2 rounded-full bg-[#00e5c8]/60" />
                  <span className="ml-2 text-[9px] text-[#3d4a6b] tracking-widest">LINK</span>
                </div>

                <a
                  className="donate-link text-[#c8cfe0] text-xs tracking-wide break-all"
                  href={donateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  tirikchilik.uz/<span className="text-[#00e5c8]">khushnudbek</span>
                </a>

                <div className="mt-5 flex items-center gap-3">
                  <button
                    className="copy-btn text-[9px] tracking-[0.2em] text-[#f5c842] border border-[#f5c842]/30 px-4 py-2"
                    onClick={() => navigator.clipboard?.writeText(donateUrl)}
                  >
                    COPY LINK
                  </button>
                  <a
                    href={donateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[9px] tracking-[0.2em] text-[#3d4a6b] hover:text-[#6b7a99] transition-colors"
                  >
                    OPEN →
                  </a>
                </div>
              </div>

            </div>

            {/* RIGHT: image placeholder */}
            <div className="flex-1 flex justify-center md:justify-end">
              <img 
                src={poorMeme} 
                alt="Am I looks like this? " 
                className="w-full h-full"
              />
            </div>

          </div>
        </div>
      </div>
    </>
  )
}