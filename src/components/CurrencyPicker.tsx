import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { CURRENCIES } from '../lib/currencies';

interface Props {
  selected: string;
  onChange: (code: string) => void;
  disabled?: boolean;
  isGoldCard?: boolean;
}

export function CurrencyPicker({ selected, onChange, disabled, isGoldCard }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedCurrency = CURRENCIES.find(c => c.code === selected);
  
  const filtered = CURRENCIES
    .filter(c => 
      c.code.toLowerCase().includes(search.toLowerCase()) || 
      c.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.code.localeCompare(b.code));

  const buttonStyle = isGoldCard 
    ? "bg-white/90 hover:bg-white text-black" 
    : "bg-elevated-bg hover:bg-gray-600 text-white";

  return (
    <div className="relative w-full" ref={wrapperRef}>
      
      {/* Button now only shows text (Select Currency or the Code) */}
      <button
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full p-2.5 rounded-lg font-mono font-bold transition-colors ${buttonStyle}`}
      >
        <span className="text-sm">
          {selectedCurrency ? selectedCurrency.code : 'Select Currency'}
        </span>
        {!disabled && <ChevronDown size={16} className={isGoldCard ? "text-black/50" : "text-gray-400"} />}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-[100] w-56 mt-2 bg-card-bg border border-elevated-bg rounded-lg shadow-2xl max-h-64 flex flex-col overflow-hidden text-white">
          <div className="flex items-center p-2 border-b border-elevated-bg bg-page-bg">
            <Search size={14} className="text-gray-400 ml-2" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent p-2 outline-none text-sm text-white"
            />
          </div>
          
          <div className="overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {filtered.map((c) => (
              <button
                key={c.code}
                onClick={() => {
                  onChange(c.code);
                  setIsOpen(false);
                  setSearch('');
                }}
                className="w-full text-left p-3 hover:bg-elevated-bg flex items-center"
              >
                <span className="font-bold text-sm">{c.code}</span>
                <span className="text-xs text-gray-400 truncate ml-3">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}