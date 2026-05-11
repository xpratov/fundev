import Quirky1 from "../pages/Home/Quirky/Quirky1";
import Quirky2 from "../pages/Home/Quirky/Quirky2";
import Quirky3 from "../pages/Home/Quirky/Quirky3";
import Quirky4 from "../pages/Home/Quirky/Quirky4";
import Quirky5 from "../pages/Home/Quirky/Quirky5";
import Quirky6 from "../pages/Home/Quirky/Quirky6";
import Quirky7 from "../pages/Home/Quirky/Quirky7";


/**
 * Yangi Quirky qo'shish uchun:
 * 1. Quirkies/ papkasiga yangi component yarating
 * 2. Shu arrayga qo'shing
 * id — Firestore dagi doc id si bilan aynan mos bo'lishi SHART
 */
export const ALL_QUIRKIES = [ 
  { id: 'quirky1', name: 'Volume Crank', Component: Quirky1 },
  { id: 'quirky2', name: 'Phone Stepper', Component: Quirky2 },
  { id: 'quirky3', name: 'Date Phone Picker', Component: Quirky3 },
  { id: 'quirky4', name: 'Rotary Phone Dial', Component: Quirky4 },
  { id: 'quirky5', name: 'Slingshot Volume', Component: Quirky5 },
  { id: 'quirky6', name: 'Tilt Volume Slider', Component: Quirky6 },
  { id: 'quirky7', name: 'Random Phone Confirm', Component: Quirky7 },

]
