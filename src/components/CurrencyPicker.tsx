import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Search } from 'lucide-react';
import { CURRENCIES } from '../lib/currencies';

interface Props {
  selected: string;
  onChange: (code: string) => void;
  disabled?: boolean;
  isDarkTheme?: boolean;
}

export function CurrencyPicker({ selected, onChange, disabled, isDarkTheme }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        // Also check if they clicked inside the portal dropdown
        const portalMenu = document.getElementById('currency-portal');
        if (portalMenu && portalMenu.contains(event.target as Node)) return;
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calculate exact screen position when opened
  const toggleOpen = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 8, // 8px gap below button
        left: rect.left,
        width: rect.width
      });
    }
    setIsOpen(!isOpen);
  };

  const selectedCurrency = CURRENCIES.find(c => c.code === selected);
  
  const filtered = CURRENCIES
    .filter(c => 
      c.code.toLowerCase().includes(search.toLowerCase()) || 
      c.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.code.localeCompare(b.code));

  const buttonStyle = disabled
    ? 'bg-transparent text-black cursor-default'
    : isDarkTheme 
      ? 'bg-white/10 hover:bg-white/20 text-white' 
      : 'bg-black/5 hover:bg-black/10 text-black';

  return (
    <div className="relative w-full" ref={wrapperRef}>
      
      <button
        ref={buttonRef}
        disabled={disabled}
        onClick={toggleOpen}
        className={`flex items-center justify-between w-full p-2 rounded-xl font-semibold transition-colors ${buttonStyle}`}
      >
        <span className="text-base">{selectedCurrency ? selectedCurrency.code : 'Select'}</span>
        {!disabled && <ChevronDown size={16} className={isDarkTheme ? "text-white/50 ml-1" : "text-black/50 ml-1"} />}
      </button>

      {/* PORTAL: Renders outside the card so z-index is never an issue */}
      {isOpen && createPortal(
        <div 
          id="currency-portal"
          className="fixed z-[999999] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden border border-gray-100"
          style={{ 
            top: coords.top, 
            left: coords.left, 
            width: Math.max(coords.width, 260) // Make sure it's wide enough
          }}
        >
          <div className="flex items-center p-3 border-b border-gray-100 bg-gray-50/50">
            <Search size={16} className="text-gray-400 ml-2" />
            <input
              type="text"
              placeholder="Search currency..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent p-2 outline-none text-sm text-black placeholder-gray-400"
            />
          </div>
          
          <div className="overflow-y-auto overflow-x-hidden max-h-64 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {filtered.map((c) => (
              <button
                key={c.code}
                onClick={() => {
                  onChange(c.code);
                  setIsOpen(false);
                  setSearch('');
                }}
                className="w-full text-left p-3 hover:bg-gray-100 flex items-center transition-colors"
              >
                <span className="font-semibold text-sm w-16 text-black">{c.code}</span>
                <span className="text-xs text-gray-500 truncate ml-2">{c.name}</span>
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}