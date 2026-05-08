import { useEffect, useRef } from "react"
import { useQuirkiesStore } from "../../../store/quirkyStore"
import { fetchAllLikes } from "../../../firebase/quirkyService"


/**
 * Har bir Quirky ushbu wrapper ichida bo'ladi.
 * Props:
 *   id       — "quirky1" kabi, Firestore doc id si bilan mos kelishi kerak
 *   children — quirkyning o'zi
 */
export default function QuirkyCard({ id, children }) {
  const likes  = useQuirkiesStore((s) => s.likes[id] ?? 0)
  const liked  = useQuirkiesStore((s) => !!s.liked[id])
  const toggle = useQuirkiesStore((s) => s.toggleLike)
  const hasFetched = useRef(false)

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true
    
  }, [])

  return (
    <div className="group relative border border-[#1e2640] bg-[#131829] rounded-sm overflow-hidden transition-all duration-300 hover:border-[#2a3555]">
      {/* Content */}
      <div className="p-5">
        {children}
      </div>

      {/* Like bar */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-[#1e2640]">
        <span className="font-mono text-[9px] tracking-[0.2em] text-[#3d4a6b]">
          {id}
        </span>

        <button
          onClick={() => toggle(id)}
          className={`flex items-center gap-2 font-mono text-[20px] tracking-widest transition-colors duration-200
            ${liked
              ? 'text-[#ff1d1d]'
              : 'text-[#3d4a6b] hover:text-[#6b7a99]'
            }`}
        >
          {/* Like button - THUMB-UP */}
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              className="transition-transform duration-150 group-hover:scale-110"
            >
              <path
                d="M7 22V11M2 13v7a2 2 0 0 0 2 2h11.4a2 2 0 0 0 1.97-1.65l1.4-7A2 2 0 0 0 16.8 11H13V6a3 3 0 0 0-3-3 1 1 0 0 0-1 1v.5L7.5 9.5A1 1 0 0 1 7 10.34V11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={liked ? 'currentColor' : 'none'}
              />
          </svg>
          <span>{likes}</span>
        </button>
      </div>
    </div>
  )
}