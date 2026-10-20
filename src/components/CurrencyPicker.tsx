import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { CircleFlag } from 'react-circle-flags';
import { CURRENCIES } from '../lib/currencies';

interface Props {
  selected: string;
  onChange: (code: string) => void;
  disabled?: boolean;
  isGoldCard?: boolean; // To style it differently if it's the top or bottom card
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
  const filtered = CURRENCIES.filter(c => 
    c.code.toLowerCase().includes(search.toLowerCase()) || 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // Base styling to match the template
  const buttonStyle = isGoldCard 
    ? "bg-white/90 hover:bg-white text-black" 
    : "bg-elevated-bg hover:bg-gray-600 text-white";

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <button
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full p-3 rounded-lg font-mono font-bold transition-colors disabled:opacity-80 ${buttonStyle}`}
      >
        <div className="flex items-center gap-2">
          {selectedCurrency?.countryCode ? (
            <CircleFlag countryCode={selectedCurrency.countryCode} height="20" />
          ) : (
             <div className="w-5 h-5 bg-ghd-gold rounded-full flex items-center justify-center text-[10px] text-black">{selectedCurrency?.symbol}</div>
          )}
          <span>{selectedCurrency?.code || 'Select'}</span>
        </div>
        {!disabled && <ChevronDown size={18} className="text-gray-400" />}
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-card-bg border border-elevated-bg rounded-lg shadow-xl max-h-64 flex flex-col overflow-hidden text-white">
          <div className="flex items-center p-2 border-b border-elevated-bg bg-page-bg">
            <Search size={16} className="text-gray-400 ml-2" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent p-2 outline-none text-sm"
            />
          </div>
          <div className="overflow-y-auto">
            {filtered.map((c) => (
              <button
                key={c.code}
                onClick={() => {
                  onChange(c.code);
                  setIsOpen(false);
                  setSearch('');
                }}
                className="w-full text-left p-3 hover:bg-elevated-bg flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  {c.countryCode ? (
                    <CircleFlag countryCode={c.countryCode} height="20" />
                  ) : (
                    <div className="w-5 h-5 bg-ghd-gold rounded-full flex items-center justify-center text-[10px] text-black">{c.symbol}</div>
                  )}
                  <span className="font-bold">{c.code}</span>
                </div>
                <span className="text-xs text-gray-400 truncate ml-2">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}