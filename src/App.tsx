import { ArrowDownUp, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useExchangeStore } from './lib/exchange-store';
import { useMarketData } from './lib/market';
import { convert } from './lib/engine';
import { CurrencyPicker } from './components/CurrencyPicker';
import { CURRENCIES } from './lib/currencies';
import { CircleFlag } from 'react-circle-flags';

function App() {
  const { 
    sendAmount, sendCurrency, receiveCurrency, activeAsset,
    setSendAmount, setSendCurrency, swap, setReceiveCurrency
  } = useExchangeStore();
  
  const { data: market, isLoading, refetch, isFetching, dataUpdatedAt } = useMarketData();
  const [copied, setCopied] = useState(false);

  const [sendTab, setSendTab] = useState<'fiat' | 'acc' | 'crypto'>('fiat');
  const [receiveTab, setReceiveTab] = useState<'fiat' | 'acc' | 'crypto'>('acc');

  // LED Pulse Logic
  const [ledPulse, setLedPulse] = useState(false);
  useEffect(() => {
    if (dataUpdatedAt) {
      setLedPulse(true);
      const timer = setTimeout(() => setLedPulse(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [dataUpdatedAt]);

  if (isLoading || !market) {
    return (
      <div className="min-h-screen bg-[#fbfcf8] text-black flex items-center justify-center font-medium">
        Loading Market Data...
      </div>
    );
  }

  const sendType = sendTab;
  const receiveType = receiveTab;
  const finalAsset = (sendType === 'acc' || receiveType === 'acc') ? activeAsset : 'gold';

  const result = convert({
    amount: Number(sendAmount) || 0,
    sendType,
    receiveType,
    activeAsset: finalAsset,
    sendCurrency,
    receiveCurrency,
    market: market as any 
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(result.output.toFixed(result.output > 1 ? 2 : 6));
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
  
  const isOutputCryptoOrToken = receiveTab !== 'fiat';
  const formattedOutputValue = result.output.toLocaleString('en-US', { 
    minimumFractionDigits: isOutputCryptoOrToken ? 4 : 2, 
    maximumFractionDigits: isOutputCryptoOrToken ? 6 : 2 
  });

  const getDynamicSize = (val: string) => {
    if (val.length > 12) return "text-3xl";
    if (val.length > 9) return "text-4xl";
    return "text-[42px]";
  };

  const selectedSendFiat = CURRENCIES.find(c => c.code === sendCurrency);
  const selectedReceiveFiat = CURRENCIES.find(c => c.code === receiveCurrency);

  // --- LIVE TICKER LOGIC ---
  const getAssetUsdValue = (tab: string, code: string, assetType: 'gold' | 'silver') => {
    if (tab === 'fiat') return 1 / (market.forexRates[code] || 1);
    if (tab === 'crypto') return market.cryptoRates[code] || 0;
    if (tab === 'acc') {
      const peg = assetType === 'silver' ? 0.1033 : 0.1000;
      const metal = assetType === 'silver' ? market.silverUsd : market.goldUsd;
      return metal * peg;
    }
    return 0;
  };

  const sourceUsd = getAssetUsdValue(sendTab, sendCurrency, finalAsset);
  const targetUsd = getAssetUsdValue(receiveTab, receiveCurrency, finalAsset);
  const liveCrossRate = targetUsd > 0 ? (sourceUsd / targetUsd) : 0;

  return (
    <div className="min-h-screen bg-[#E5E5EA] flex items-center justify-center p-4 sm:p-6 font-sans selection:bg-black/10">
      <div className="w-full max-w-[390px] h-[85vh] max-h-[844px] rounded-[48px] border-[14px] border-[#343d46] shadow-[0_25px_60px_rgba(0,0,0,0.25)] overflow-hidden bg-[#fff3d7] relative flex flex-col">
        
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden flex flex-col items-center pt-6 pb-6 px-4 relative">
          
          <header className="w-full flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black text-white rounded-[12px] flex items-center justify-center font-bold text-xl shadow-sm">A</div>
              <div>
                <h1 className="font-semibold text-lg text-black tracking-tight leading-tight">ACC</h1>
                <p className="text-xs text-black/60 font-medium">All Currency Converter</p>
              </div>
            </div>
            <button onClick={() => refetch()} className="p-3 bg-white/50 rounded-full shadow-sm border border-black/5 hover:bg-white/80 transition-colors">
              <RefreshCw size={16} className={`text-black/70 ${isFetching ? 'animate-spin' : ''}`} />
            </button>
          </header>

          {/* LIVE MARKET TICKER */}
          <div className="w-full bg-white/40 border border-black/5 rounded-2xl p-3 mb-4 flex items-center justify-between shadow-sm relative z-10">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full transition-all duration-300 ${ledPulse ? 'bg-green-500 scale-150 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-green-500/50'}`}></div>
              <span className="text-[10px] font-bold text-black/50 uppercase tracking-wider">Live</span>
            </div>
            
            <div className="flex gap-3 text-xs font-medium items-end">
              <div className="flex flex-col items-end">
                <span className="text-[9px] text-black/40 uppercase tracking-wider">Gold (oz)</span>
                <span className="text-black font-semibold">${market.goldUsd.toFixed(2)}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] text-black/40 uppercase tracking-wider">Silver (oz)</span>
                <span className="text-black font-semibold">${market.silverUsd.toFixed(2)}</span>
              </div>
              <div className="w-px h-6 bg-black/10 mx-1"></div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] text-black/40 uppercase tracking-wider">
                  {sendCurrency}/{receiveCurrency}
                </span>
                <span className="text-blue-600 font-bold">{liveCrossRate.toFixed(4)}</span>
              </div>
            </div>
          </div>

          <div className="w-full relative z-10">
            
            {/* TOP CARD */}
            <div className="bg-[#afe059] rounded-[24px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] mb-2 relative z-20 transition-all">
              
              {selectedSendFiat?.countryCode && sendTab === 'fiat' && (
                <div className="absolute top-6 right-6 w-8 h-8 bg-white/40 rounded-full flex items-center justify-center overflow-hidden border border-black/5">
                  <CircleFlag countryCode={selectedSendFiat.countryCode} height="20" />
                </div>
              )}

              <div className="w-full pr-12">
                <CurrencyPicker 
                  selected={sendCurrency} 
                  onChange={setSendCurrency} 
                  activeTab={sendTab}
                  onTabChange={setSendTab}
                  isDarkTheme={false} 
                />
              </div>

              <div className="flex items-center justify-between mt-4">
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
                onClick={() => {
                  swap();
                  setSendTab(receiveTab);
                  setReceiveTab(sendTab);
                }} 
                className="w-[52px] h-[52px] flex items-center justify-center bg-black text-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95 transition-all border-[4px] border-[#fff3d7]"
              >
                <ArrowDownUp size={22} strokeWidth={2.5} />
              </button>
            </div>

            {/* BOTTOM CARD */}
            <div className="bg-[#b9d6f1] rounded-[24px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] mt-2 relative z-10 transition-all">
              
              {selectedReceiveFiat?.countryCode && receiveTab === 'fiat' && (
                <div className="absolute top-6 right-6 w-8 h-8 bg-white/40 rounded-full flex items-center justify-center overflow-hidden border border-black/5">
                  <CircleFlag countryCode={selectedReceiveFiat.countryCode} height="20" />
                </div>
              )}

              <div className="w-full pr-12">
                <CurrencyPicker 
                  selected={receiveCurrency} 
                  onChange={setReceiveCurrency} 
                  activeTab={receiveTab}
                  onTabChange={setReceiveTab}
                  isDarkTheme={false} 
                />
              </div>

              <div 
                onClick={handleCopy} 
                className={`w-full font-semibold text-black tracking-tight cursor-pointer transition-all relative group whitespace-nowrap mt-4 ${getDynamicSize(formattedOutputValue)}`}
              >
                {formattedOutputValue}
                <span className="absolute top-1/2 -translate-y-1/2 right-0 text-xs opacity-0 group-hover:opacity-100 transition-opacity font-sans font-medium px-2 py-1 bg-black/10 text-black/70 rounded-md">
                  {copied ? 'Copied!' : 'Copy'}
                </span>
              </div>
            </div>

          </div>

          <footer className="mt-auto pt-6 w-full text-center text-[10px] text-black/40 font-medium flex flex-col items-center gap-3 relative z-10">
            {/* EXPLORE LINK */}
            <a 
              href="/explore.html" 
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-white/50 hover:bg-white/80 border border-black/5 rounded-full shadow-sm text-black/70 hover:text-black transition-all text-xs font-semibold"
            >
              <span>🌍</span> Explore Global Finance Systems
            </a>
            
            <div className="flex flex-col gap-1 mt-1">
              <p>ACC All Currency Converter is a free infor. Rates are indicative only.</p>
              <p className="opacity-70">© {new Date().getFullYear()} All rights reserved.</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;