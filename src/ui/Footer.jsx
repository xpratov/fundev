const footerSections = [
  {
    title: 'RESOURCES',
    links: ['Support Center', 'Documentation', 'API Status'],
  },
  {
    title: 'LEGAL',
    links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
  },
  {
    title: 'COMPANY',
    links: ['About Us', 'Careers', 'Contact'],
  },
  {
    title: 'CONNECT',
    links: ['Twitter', 'GitHub'],
    row: true,
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-auto">
      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-mono text-[10px] tracking-[0.2em] text-[#6b7a99] mb-4">
                {section.title}
              </h4>
              <ul className={section.row ? 'flex gap-4' : 'space-y-2'}>
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-[#8a95b0] hover:text-[#c8cfe0] transition-colors duration-200 font-sans"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-mono text-xs text-[#c8cfe0] tracking-widest">
            FUN•DEV
          </span>
          <span className="font-mono text-[10px] text-[#3d4a6b] tracking-wider">
            © 2026 FUNDEV. ALL RIGHTS RESERVED.
          </span>
        </div>
      </div>
    </footer>
  )
}