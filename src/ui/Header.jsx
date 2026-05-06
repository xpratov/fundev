import { NavLink } from 'react-router-dom'
import { useNavStore } from '../store/navStore'

const navLinks = [
  { label: "BÕSH SAHIFA", to: '/empty' },
  { label: 'DASTURCHI', to: '/dev' },
  { label: 'DONAT', to: '/donate' },
]

export default function Header() {
  const { menuOpen, toggleMenu, closeMenu } = useNavStore()

  return (
    <header className="sticky top-0 z-50 bg-[#0f1220] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={closeMenu}
              className={({ isActive }) =>
                `font-mono text-xs tracking-widest pb-1 transition-colors duration-200 ${
                  isActive
                    ? 'nav-active text-[#f5c842]'
                    : 'text-[#6b7a99] hover:text-[#c8cfe0]'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-[#6b7a99] hover:text-[#c8cfe0] focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className="font-mono text-xs tracking-widest">
            {menuOpen ? '[ CLOSE ]' : '[ MENU ]'}
          </span>
        </button>

        {/* Brand */}
        <a href="/">
          <span className="font-mono font-bold text-sm tracking-widest text-[#f5c842]">
            FUN🏠︎DEV
          </span>
        </a>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-[#161b2e] border-t border-white/5 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={closeMenu}
              className={({ isActive }) =>
                `font-mono text-xs tracking-widest ${
                  isActive ? 'text-[#f5c842]' : 'text-[#6b7a99]'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  )
}
