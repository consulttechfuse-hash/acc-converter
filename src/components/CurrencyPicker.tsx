import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Search } from 'lucide-react';
import { CURRENCIES } from '../lib/currencies';

interface Props {
  selected: string;
  onChange: (code: string) => void;
  disabled?: boolean;
  isDarkTheme?: boolean;
  activeTab: 'fiat' | 'acc' | 'crypto';
  onTabChange: (tab: 'fiat' | 'acc' | 'crypto') => void;
}

export function CurrencyPicker({ selected, onChange, disabled, activeTab, onTabChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        const portalMenu = document.getElementById('currency-portal');
        if (portalMenu && portalMenu.contains(event.target as Node)) return;
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOpen = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + 8, left: rect.left, width: rect.width });
    }
    setIsOpen(!isOpen);
  };

  const selectedCurrency = CURRENCIES.find(c => c.code === selected);
  
  const filtered = CURRENCIES
    .filter(c => c.type === activeTab)
    .filter(c => 
      c.code.toLowerCase().includes(search.toLowerCase()) || 
      c.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.code.localeCompare(b.code));

  return (
    <div className="relative w-full" ref={wrapperRef}>
      
      {/* 1. THE TABS - More padding, solid dark background for contrast */}
      <div className="flex bg-black/10 rounded-xl p-1 gap-1 mb-4 shadow-inner">
        {(['fiat', 'acc', 'crypto'] as const).map((tab) => (
          <button
            key={tab}
            disabled={disabled}
            onClick={() => { onTabChange(tab); setIsOpen(false); }}
            className={`flex-1 text-[11px] font-bold uppercase py-2 rounded-lg transition-all ${
              activeTab === tab 
                ? 'bg-white shadow-md text-black scale-[1.02]' 
                : 'text-black/60 hover:text-black'
            }`}
          >
            {tab === 'fiat' ? 'Currency' : tab === 'acc' ? 'ACC' : 'Crypto'}
          </button>
        ))}
      </div>

      {/* 2. THE DROPDOWN - Crisp white, heavy shadow to pop off the card */}
      <button
        ref={buttonRef}
        disabled={disabled}
        onClick={toggleOpen}
        className={`
          flex items-center justify-between w-full p-4 rounded-xl font-bold transition-all
          ${disabled 
            ? 'bg-transparent shadow-none text-black cursor-default' 
            : 'bg-white shadow-[0_4px_14px_rgba(0,0,0,0.1)] border border-black/5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)] text-black'
          }
        `}
      >
        <span className="text-lg tracking-tight">{selectedCurrency ? selectedCurrency.code : 'Select'}</span>
        {!disabled && <ChevronDown size={20} className="text-black/60 ml-1 shrink-0" />}
      </button>

      {isOpen && createPortal(
        <div 
          id="currency-portal"
          className="fixed z-[999999] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden border border-gray-100"
          style={{ top: coords.top, left: coords.left, width: Math.max(coords.width, 280) }}
        >
          <div className="flex items-center p-3 border-b border-gray-100 bg-gray-50/50">
            <Search size={16} className="text-gray-400 ml-2" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent p-2 outline-none text-sm text-black placeholder-gray-400"
            />
          </div>
          
          <div className="overflow-y-auto overflow-x-hidden max-h-64 [&::-webkit-scrollbar]:hidden">
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