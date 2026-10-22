import { ArrowDownUp, Lock, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useExchangeStore } from './lib/exchange-store';
import { useMarketData } from './lib/market';
import { convert } from './lib/engine';
import { CurrencyPicker } from './components/CurrencyPicker';
import { CURRENCIES } from './lib/currencies';
import { CircleFlag } from 'react-circle-flags';

function App() {
  const { 
    sendAmount, sendCurrency, receiveCurrency, activeAsset,
    setSendAmount, setSendCurrency, swap, setActiveAsset, setReceiveCurrency
  } = useExchangeStore();
  
  const { data: market, isLoading, refetch, isFetching } = useMarketData();
  const [copied, setCopied] = useState(false);

  if (isLoading || !market) {
    return (
      <div className="min-h-screen bg-[#fbfcf8] text-black flex items-center justify-center font-medium">
        Loading Market Data...
      </div>
    );
  }

  const getForex = (currency: string) => market.forexRates[currency] || 1;

  const isSendingToken = sendCurrency === 'ACC' || sendCurrency === 'ACC_SILVER';
  const direction = isSendingToken ? 'tokenToFiat' : 'fiatToToken';
  const fiatCurrency = isSendingToken ? receiveCurrency : sendCurrency;
  
  const selectedFiat = CURRENCIES.find(c => c.code === fiatCurrency);
  
  const metalPrice = activeAsset === 'gold' ? market.goldUsd : market.silverUsd;
  const forex = getForex(fiatCurrency);
  
  const result = convert(
    Number(sendAmount) || 0, direction, activeAsset, metalPrice, forex
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(result.output.toFixed(4));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, '');
    if (!isNaN(Number(rawValue))) {
      if (rawValue.length <= 15) setSendAmount(rawValue);
    }
  };

  const formattedInputValue = sendAmount ? Number(sendAmount).toLocaleString('en-US') : '';
  const formattedOutputValue = result.output.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 });

  const getDynamicSize = (val: string) => {
    if (val.length > 12) return "text-3xl";
    if (val.length > 9) return "text-4xl";
    return "text-[42px]";
  };

  return (
    /* Outer Background: Soft grey to make the frame pop on any screen */
    <div className="min-h-screen bg-[#E5E5EA] flex items-center justify-center p-4 sm:p-6 font-sans selection:bg-black/10">
      
      {/* iPhone Frame Wrapper: Always visible, forced size */}
      <div className="w-full max-w-[390px] h-[85vh] max-h-[844px] rounded-[48px] border-[14px] border-[#343d46] shadow-[0_25px_60px_rgba(0,0,0,0.25)] overflow-hidden bg-[#fff3d7] relative flex flex-col">
        
        {/* Inner App Container - Scrolls inside the phone frame */}
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden flex flex-col items-center pt-8 pb-6 px-4 relative">
          
          {/* HEADER */}
          <header className="w-full flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black text-white rounded-[12px] flex items-center justify-center font-bold text-xl shadow-sm">
                A
              </div>
              <div>
                <h1 className="font-semibold text-lg text-black tracking-tight leading-tight">ACC</h1>
                <p className="text-xs text-black/60 font-medium">All Currency Converter</p>
              </div>
            </div>
            
            <button 
              onClick={() => refetch()}
              className="p-3 bg-white/50 rounded-full shadow-sm border border-black/5 hover:bg-white/80 transition-colors"
              aria-label="Refresh data"
            >
              <RefreshCw size={16} className={`text-black/70 ${isFetching ? 'animate-spin' : ''}`} />
            </button>
          </header>

          <div className="text-center mb-4 relative z-10">
            <p className="text-xs font-medium text-black/50">This is a free to use tool.</p>
          </div>

          {/* CALCULATOR SECTION */}
          <div className="w-full relative z-10">
            
            {/* TOP CARD (SEND) */}
            <div className="bg-[#afe059] rounded-[24px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] mb-2 relative z-20 transition-all">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2.5">
                  {!isSendingToken && selectedFiat?.countryCode && (
                    <div className="w-9 h-9 bg-white/40 rounded-full flex items-center justify-center overflow-hidden shrink-0 border border-black/5">
                      <CircleFlag countryCode={selectedFiat.countryCode} height="24" />
                    </div>
                  )}
                  <div className="w-32">
                    <CurrencyPicker selected={sendCurrency} onChange={setSendCurrency} isDarkTheme={false} />
                  </div>
                </div>

                {isSendingToken ? (
                  <div className="flex bg-black/10 rounded-full p-1">
                    <button onClick={() => setActiveAsset('gold')} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${activeAsset === 'gold' ? 'bg-white shadow-sm text-black' : 'text-black/50'}`}>Gold</button>
                    <button onClick={() => setActiveAsset('silver')} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${activeAsset === 'silver' ? 'bg-white shadow-sm text-black' : 'text-black/50'}`}>Silver</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-black/40">
                    <Lock size={12} />
                    <span className="text-xs font-medium">Currency</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <input
                  type="text"
                  inputMode="decimal"
                  value={formattedInputValue}
                  onChange={handleInputChange}
                  className={`w-full bg-transparent font-semibold text-black outline-none tracking-tight placeholder-black/30 transition-all ${getDynamicSize(formattedInputValue)}`}
                  placeholder="0"
                />
              </div>
            </div>

            {/* SWAP BUTTON */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
              <button 
                onClick={swap} 
                className="w-[52px] h-[52px] flex items-center justify-center bg-black text-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95 transition-all border-[4px] border-[#fff3d7]"
              >
                <ArrowDownUp size={22} strokeWidth={2.5} />
              </button>
            </div>

            {/* BOTTOM CARD (RECEIVE) */}
            <div className="bg-[#b9d6f1] rounded-[24px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] mt-2 relative z-10 transition-all">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2.5">
                  {isSendingToken && selectedFiat?.countryCode && (
                    <div className="w-9 h-9 bg-white/40 rounded-full flex items-center justify-center overflow-hidden shrink-0 border border-black/5">
                      <CircleFlag countryCode={selectedFiat.countryCode} height="24" />
                    </div>
                  )}
                  <div className="w-32">
                    <CurrencyPicker selected={receiveCurrency} onChange={setReceiveCurrency} disabled={true} isDarkTheme={false} />
                  </div>
                </div>

                {!isSendingToken ? (
                  <div className="flex bg-black/10 rounded-full p-1">
                    <button onClick={() => setActiveAsset('gold')} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${activeAsset === 'gold' ? 'bg-white shadow-sm text-black' : 'text-black/50'}`}>Gold</button>
                    <button onClick={() => setActiveAsset('silver')} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${activeAsset === 'silver' ? 'bg-white shadow-sm text-black' : 'text-black/50'}`}>Silver</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-black/40">
                    <Lock size={12} />
                    <span className="text-xs font-medium">Computed</span>
                  </div>
                )}
              </div>

              <div 
                onClick={handleCopy} 
                className={`w-full font-semibold text-black tracking-tight cursor-pointer transition-all relative group whitespace-nowrap ${getDynamicSize(formattedOutputValue)}`}
              >
                {formattedOutputValue}
                <span className="absolute top-1/2 -translate-y-1/2 right-0 text-xs opacity-0 group-hover:opacity-100 transition-opacity font-sans font-medium px-2 py-1 bg-black/10 text-black/70 rounded-md">
                  {copied ? 'Copied!' : 'Copy'}
                </span>
              </div>
            </div>

          </div>

          <footer className="mt-auto pt-6 w-full text-center text-[10px] text-black/40 font-medium flex flex-col gap-1 relative z-10">
            <p>ACC - All Currency Converter</p>
            <p>All Values are Indicative only. This is Not financial advice.</p>
            <p className="mt-1 opacity-70">© {new Date().getFullYear()} Cashcade (Pty). All rights reserved.</p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;