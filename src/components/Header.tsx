import { useState, useEffect } from 'react';

interface HeaderProps {
  onLogoClick: () => void;
}

const NAV_LINKS = [
  { label: 'Find a race',    href: 'https://www.finishers.com/courses'                        },
  { label: 'Find equipment', href: 'https://www.decathlon.com/en/sport/trail-running/_/N-dp5b' },
  { label: 'Elite rankings', href: 'https://itra.run/'                                        },
];

export default function Header({ onLogoClick }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn, { passive: true });
    fn(); // check on mount in case page is already scrolled
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-brand-blue/10 px-6 py-3 transition-shadow duration-300 ${
        scrolled ? 'shadow-lg' : 'shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Logo — left */}
        <button
          onClick={onLogoClick}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          aria-label="Delta-V home"
        >
          <img src="./delta-v-logo.png" alt="Delta-V logo" className="w-[88px] h-[88px]" />
          <div className="text-left">
            <h1 className="text-xl font-black text-brand-navy tracking-tight leading-none">DELTA-V</h1>
            <p className="text-xs font-bold text-brand-blue tracking-wide">Same physics. Different finish line.</p>
          </div>
        </button>

        {/* Nav links — right */}
        <nav className="hidden sm:flex items-center gap-1" aria-label="External links">
          {NAV_LINKS.map(({ label, href }, i) => (
            <span key={href} className="flex items-center gap-1">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-bold text-brand-blue hover:text-brand-blue-dark hover:underline underline-offset-4 transition-all px-3 py-1.5 rounded-lg hover:bg-brand-light hover:scale-105"
              >
                {label}
              </a>
              {i < NAV_LINKS.length - 1 && (
                <span className="inline-block w-[2px] h-4 bg-gray-900 rounded-sm mx-0.5 select-none" aria-hidden="true" />
              )}
            </span>
          ))}
        </nav>
      </div>
    </header>
  );
}
