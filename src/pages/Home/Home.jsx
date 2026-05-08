
import { useEffect, useRef } from "react"
import { fetchAllLikes, fetchAllLikesTest } from "../../firebase/quirkyService"
import SkeletonCard from "../../ui/Skeleton"
import { ALL_QUIRKIES } from "../../utils/quirkyIndex"
import QuirkyCard from "./ui/QuirkyCard"
import { useQuirkiesStore } from "../../store/quirkyStore"

const CARD_COUNT = 9

export default function Home() {
  
  
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

      {/* Skeleton grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {ALL_QUIRKIES ?
          ALL_QUIRKIES.map(({id, Component}) => (
            <QuirkyCard id={id} key={id} >
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
