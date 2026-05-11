
import { useEffect, useMemo } from "react"
import SkeletonCard from "../../ui/Skeleton"
import { ALL_QUIRKIES } from "../../utils/quirkyIndex"
import QuirkyCard from "./ui/QuirkyCard"
import { useQuirkiesStore } from "../../store/quirkyStore"

const CARD_COUNT = 9

export default function Home() {
  const fetchLikes = useQuirkiesStore((s) => s.fetchLikes)
  const likes = useQuirkiesStore((s) => s.likes)

  useEffect(() => {
    fetchLikes()
  }, [fetchLikes])

  const sortedQuirkies = useMemo(() => {
    return ALL_QUIRKIES
      .map((quirky, index) => ({ ...quirky, index }))
      .sort((a, b) => {
        const likesDiff = (likes[b.id] ?? 0) - (likes[a.id] ?? 0)
        return likesDiff || a.index - b.index
      })
  }, [likes])

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Hero */}
      <section className="mb-12">
        <h1 className="font-mono font-bold text-5xl md:text-6xl leading-tight text-[#f5c842] uppercase mb-6">
          Fun😄Dev
        </h1>
        <p className="font-sans text-[#8a95b0] text-sm leading-relaxed max-w-md">
        Fundev — UI/UX olamidagi eng g‘alati va kulgili xatolar jamlangan kreativ platforma. Foydalanuvchilarni qiynaydigan absurd komponentlar orqali dizayn qonuniyatlariga teskari nigoh tashlang!
        </p>
      </section>

      {/* Quirky masonry */}
      <section className="columns-1 sm:columns-2 md:columns-3 gap-4">
        {sortedQuirkies ?
          sortedQuirkies.map(({id, name, Component}, position) => (
            <QuirkyCard id={id} key={id} position={position} name={name}>
              <Component key={id}/>
            </QuirkyCard>))
        : Array.from({ length: CARD_COUNT }).map((_, i) => (
            <SkeletonCard key={i} index={i} />
          )) 
        }
      </section>
    </div>
  )
}
