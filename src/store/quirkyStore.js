import { create } from 'zustand'
import { fetchAllLikes, likeQuirky, unlikeQuirky } from '../firebase/quirkyService'


const LS_KEY = 'cf_liked_quirkies' // localStorage key

function getLikedFromLS() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '{}')
  } catch {
    return {}
  }
}

function saveLikedToLS(liked) {
  localStorage.setItem(LS_KEY, JSON.stringify(liked))
}

export const useQuirkiesStore = create((set, get) => ({
  // { quirky1: 12, quirky2: 5, ... }
  likes: {},

  // { quirky1: true, quirky3: true, ... }  — localStorage dan keladi
  liked: getLikedFromLS(),

  loading: false,
  error: null,

  /** Sahifa ochilganda bir marta chaqiriladi */
  fetchLikes: async () => {
    // Allaqachon yuklangan yoki yuklanayotgan bo'lsa — qaytib ket
    if (get().loading || Object.keys(get().likes).length > 0) return
  
    set({ loading: true, error: null })
    try {
      const data = await fetchAllLikes()
      // Mavjud optimistic update lar bilan merge qilamiz
      set((state) => ({
        likes: { ...data, ...state.likes },
        loading: false,
      }))
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  /** Like bosish / qaytarib olish */
  toggleLike: async (id) => {
    const { liked, likes } = get()
    const alreadyLiked = !!liked[id]

    // Optimistic UI — darhol yangilash
    const newLikes = {
      ...likes,
      [id]: Math.max(0, (likes[id] ?? 0) + (alreadyLiked ? -1 : 1)),
    }
    const newLiked = { ...liked }
    if (alreadyLiked) {
      delete newLiked[id]
    } else {
      newLiked[id] = true
    }

    set({ likes: newLikes, liked: newLiked })
    saveLikedToLS(newLiked)

    // Firebase ga yuborish
    try {
      if (alreadyLiked) {
        await unlikeQuirky(id)
      } else {
        await likeQuirky(id)
      }
    } catch (err) {
      // Xato bo'lsa — rollback
      set({ likes, liked })
      saveLikedToLS(liked)
      console.error('Like xatosi:', err)
    }
  },
}))