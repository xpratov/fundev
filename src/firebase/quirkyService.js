import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  increment,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './config'

const COL = 'quirkies'

/**
 * Barcha quirkylarning { id, likes } ma'lumotlarini qaytaradi.
 * Agar biron quirky hali DBda bo'lmasa — u doc bo'sh hisoblanadi (likes: 0).
 */
export async function fetchAllLikes() {
  const snapshot = await getDocs(collection(db, COL))
  const map = {}
  snapshot.forEach((d) => {
    map[d.id] = d.data().likes ?? 0
  })
  return map // { quirky1: 12, quirky2: 5, ... }
}

/**
 * Like qo'shadi. Agar doc mavjud bo'lmasa — yaratadi.
 */
export async function likeQuirky(id) {
  const ref = doc(db, COL, id)
  try {
    await updateDoc(ref, { likes: increment(1) })
  } catch {
    // doc yo'q bo'lsa — yangi yaratamiz
    await setDoc(ref, { likes: 1, createdAt: serverTimestamp() })
  }
}

/**
 * Likeni qaytarib oladi.
 */
export async function unlikeQuirky(id) {
  const ref = doc(db, COL, id)
  await updateDoc(ref, { likes: increment(-1) })
}