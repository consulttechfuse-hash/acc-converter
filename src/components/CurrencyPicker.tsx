import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { CURRENCIES } from '../lib/currencies';

interface Props {
  selected: string;
  onChange: (code: string) => void;
  disabled?: boolean;
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
  const filtered = CURRENCIES.filter(c => 
    c.code.toLowerCase().includes(search.toLowerCase()) || 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <button
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-3 bg-elevated-bg rounded-lg text-white font-mono hover:bg-opacity-80 transition-colors disabled:opacity-50"
      >
        <span>{selectedCurrency?.code || 'Select'}</span>
        <ChevronDown size={18} className="text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-card-bg border border-elevated-bg rounded-lg shadow-xl max-h-64 flex flex-col overflow-hidden">
          <div className="flex items-center p-2 border-b border-elevated-bg">
            <Search size={16} className="text-gray-400 ml-2" />
            <input
              type="text"
              placeholder="Search currency..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent p-2 text-white outline-none text-sm"
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
                className="w-full text-left p-3 hover:bg-elevated-bg text-white flex justify-between items-center"
              >
                <span className="font-bold">{c.code}</span>
                <span className="text-xs text-gray-400">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}