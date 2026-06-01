const LINKS = [
  { label: 'GitHub',   href: 'https://github.com/grospierre/delta-v-nutrition', external: true },
  { label: 'Contact',  href: 'mailto:pierre.gros722@gmail.com',                  external: false },
  { label: 'Privacy',  href: '#privacy',                                          external: false },
  { label: 'About',    href: '#about',                                            external: false },
];

interface FooterProps {
  onOpenAbout: () => void;
  onOpenPrivacy: () => void;
}

export default function Footer({ onOpenAbout, onOpenPrivacy }: FooterProps) {
  return (
    <footer
      className="mt-auto px-6 pt-12 pb-12"
      style={{ background: '#001f3f', borderTop: '3px solid #4169E1' }}
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-6 relative z-10">

        {/* Brand */}
        <span className="font-black text-white text-2xl tracking-widest text-center">DELTA-V</span>

        {/* Tagline */}
        <p className="text-base text-gray-300 font-medium">
          Built by ultra-runners, for ultra-runners
        </p>

        {/* Divider */}
        <div className="w-24 h-px bg-brand-blue opacity-60" />

        {/* Links */}
        <nav className="flex flex-wrap justify-center gap-3" aria-label="Footer links">
          {LINKS.map(({ label, href, external }, i) => (
            <span key={label} className="flex items-center gap-3">
              {label === 'About' || label === 'Privacy' ? (
                <button
                  onClick={label === 'About' ? onOpenAbout : onOpenPrivacy}
                  className="text-base font-semibold text-[#4169E1] hover:text-blue-300 hover:underline underline-offset-4 transition-colors bg-transparent border-none p-0 cursor-pointer"
                >
                  {label}
                </button>
              ) : (
                <a
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="text-base font-semibold text-[#4169E1] hover:text-blue-300 hover:underline underline-offset-4 transition-colors"
                >
                  {label}
                </a>
              )}
              {i < LINKS.length - 1 && (
                <span className="text-gray-600 select-none">·</span>
              )}
            </span>
          ))}
        </nav>

        {/* Bottom line */}
        <p className="text-sm text-gray-400 text-center leading-relaxed">
          ⚡ Science-backed (ISSN) · 🔒 No data stored · Built with ❤️ by{' '}
          <a
            href="https://github.com/grospierre"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#4169E1] hover:text-blue-300 hover:underline transition-colors"
          >
            @grospierre
          </a>
        </p>

        {/* Copyright */}
        <p className="text-sm text-gray-500">
          © 2026 Delta-V Nutrition
        </p>

      </div>
    </footer>
  );
}
