import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { CURRENCIES } from '../lib/currencies';

interface Props {
  selected: string;
  onChange: (code: string) => void;
  disabled?: boolean;
  isGoldCard?: boolean; // Kept for prop compatibility
}

export function CurrencyPicker({ selected, onChange, disabled }: Props) {
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

  return (
    <div className="relative w-full" ref={wrapperRef}>
      
      <button
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full p-2 rounded-xl font-semibold transition-colors ${
          disabled 
            ? 'bg-transparent text-black cursor-default' 
            : 'bg-gray-100 hover:bg-gray-200 text-black'
        }`}
      >
        <span className="text-base">{selectedCurrency ? selectedCurrency.code : 'Select'}</span>
        {!disabled && <ChevronDown size={16} className="text-gray-500 ml-1" />}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-[100] w-64 mt-2 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] max-h-72 flex flex-col overflow-hidden border border-gray-100">
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
          
          <div className="overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {filtered.map((c) => (
              <button
                key={c.code}
                onClick={() => {
                  onChange(c.code);
                  setIsOpen(false);
                  setSearch('');
                }}
                className="w-full text-left p-3 hover:bg-gray-50 flex items-center transition-colors"
              >
                <span className="font-semibold text-sm w-12">{c.code}</span>
                <span className="text-xs text-gray-500 truncate ml-2">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}