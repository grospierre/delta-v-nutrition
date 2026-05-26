interface HeaderProps {
  onLogoClick: () => void;
}

export default function Header({ onLogoClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-brand-blue/10 px-6 py-3 shadow-sm">
      <button
        onClick={onLogoClick}
        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        aria-label="Delta-V home"
      >
        <img src="./delta-v-logo.svg" alt="Delta-V logo" className="w-10 h-10" />
        <div className="text-left">
          <h1 className="text-xl font-black text-brand-navy tracking-tight leading-none">DELTA-V</h1>
          <p className="text-xs text-gray-500">Same physics. Different finish line.</p>
        </div>
      </button>
    </header>
  );
}
