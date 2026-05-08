import Quirky1 from "../pages/Home/Quirky/Quirky1";
import Quirky2 from "../pages/Home/Quirky/Quirky2";
import Quirky3 from "../pages/Home/Quirky/Quirky3";
import Quirky4 from "../pages/Home/Quirky/Quirky4";
import Quirky5 from "../pages/Home/Quirky/Quirky5";


/**
 * Yangi Quirky qo'shish uchun:
 * 1. Quirkies/ papkasiga yangi component yarating
 * 2. Shu arrayga qo'shing
 * id — Firestore dagi doc id si bilan aynan mos bo'lishi SHART
 */
export const ALL_QUIRKIES = [ 
  { id: 'quirky1', Component: Quirky1 },
  { id: 'quirky2', Component: Quirky2 },
  { id: 'quirky3', Component: Quirky3 },
  { id: 'quirky4', Component: Quirky4 },
  { id: 'quirky5', Component: Quirky5 },
]