import { ArrowDownUp, Lock, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
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
  
  const { data: market, isLoading, refetch, isFetching, dataUpdatedAt } = useMarketData();
  const [copied, setCopied] = useState(false);
  const [timeSinceUpdate, setTimeSinceUpdate] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (dataUpdatedAt) {
        const diffInSeconds = Math.floor((Date.now() - dataUpdatedAt) / 1000);
        setTimeSinceUpdate(diffInSeconds);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [dataUpdatedAt]);

  if (isLoading || !market) {
    return <div className="min-h-screen bg-[#F2F2F7] text-black flex items-center justify-center font-medium">Loading...</div>;
  }

  const getForex = (currency: string) => market.forexRates[currency] || 1;

  const isSendingToken = sendCurrency === 'GHD' || sendCurrency === 'GHD_SILVER';
  const direction = isSendingToken ? 'tokenToFiat' : 'fiatToToken';
  const fiatCurrency = isSendingToken ? receiveCurrency : sendCurrency;
  
  const selectedFiat = CURRENCIES.find(c => c.code === fiatCurrency);
  const fiatSymbol = selectedFiat?.symbol || '';
  
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

  // Dynamic font sizing to prevent overflow
  const getDynamicSize = (val: string) => {
    if (val.length > 12) return "text-3xl";
    if (val.length > 9) return "text-4xl";
    return "text-5xl";
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] text-black flex flex-col items-center font-sans selection:bg-blue-200">
      
      {/* HEADER */}
      <header className="w-full max-w-md flex items-center justify-between p-6 pt-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-[14px] flex items-center justify-center font-bold text-white text-xl shadow-sm">
            A
          </div>
          <div>
            <h1 className="font-semibold text-lg tracking-tight leading-tight">ACC</h1>
            <p className="text-xs text-gray-500 font-medium">All Currency Converter</p>
          </div>
        </div>
        
        <button 
          onClick={() => refetch()}
          className="p-3 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
          aria-label="Refresh data"
        >
          <RefreshCw size={18} className={`text-gray-600 ${isFetching ? 'animate-spin' : ''}`} />
        </button>
      </header>

      <main className="w-full max-w-md px-4 pb-12">
        
        {/* SUBTITLE */}
        <div className="text-center mb-8 mt-2">
          <p className="text-sm font-medium text-gray-500">This is a free to use tool.</p>
        </div>

        {/* CONVERTER CONTAINER */}
        <div className="relative">
          
          {/* TOP CARD (SEND) */}
          <div className="bg-white rounded-[24px] p-5 shadow-[0_2px_20px_rgba(0,0,0,0.04)] mb-2 relative z-10 transition-all">
            <div className="flex justify-between items-center mb-4">
              {/* Currency Selector */}
              <div className="flex items-center gap-2.5">
                {!isSendingToken && selectedFiat?.countryCode && (
                  <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                    <CircleFlag countryCode={selectedFiat.countryCode} height="24" />
                  </div>
                )}
                <div className="w-32">
                  <CurrencyPicker selected={sendCurrency} onChange={setSendCurrency} isGoldCard={true} />
                </div>
              </div>

              {/* Gold/Silver Toggle OR Lock Icon */}
              {isSendingToken ? (
                <div className="flex bg-gray-100 rounded-full p-1">
                  <button onClick={() => setActiveAsset('gold')} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${activeAsset === 'gold' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}>Gold</button>
                  <button onClick={() => setActiveAsset('silver')} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${activeAsset === 'silver' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}>Silver</button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-gray-400">
                  <Lock size={12} />
                  <span className="text-xs font-medium">Currency</span>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="flex items-center justify-between">
              <input
                type="text"
                inputMode="decimal"
                value={formattedInputValue}
                onChange={handleInputChange}
                className={`w-full bg-transparent font-semibold outline-none tracking-tight placeholder-gray-300 transition-all ${getDynamicSize(formattedInputValue)}`}
                placeholder="0"
              />
            </div>
          </div>

          {/* SWAP BUTTON (Floating between cards) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <button 
              onClick={swap} 
              className="w-12 h-12 flex items-center justify-center bg-[#007AFF] text-white rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              <ArrowDownUp size={20} strokeWidth={2.5} />
            </button>
          </div>

          {/* BOTTOM CARD (RECEIVE) */}
          <div className="bg-white rounded-[24px] p-5 shadow-[0_2px_20px_rgba(0,0,0,0.04)] mt-2 relative z-10 transition-all">
            <div className="flex justify-between items-center mb-4">
              {/* Currency Selector */}
              <div className="flex items-center gap-2.5">
                {isSendingToken && selectedFiat?.countryCode && (
                  <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                    <CircleFlag countryCode={selectedFiat.countryCode} height="24" />
                  </div>
                )}
                <div className="w-32">
                  <CurrencyPicker selected={receiveCurrency} onChange={setReceiveCurrency} disabled={true} isGoldCard={true} />
                </div>
              </div>

              {/* Gold/Silver Toggle OR Lock Icon */}
              {!isSendingToken ? (
                <div className="flex bg-gray-100 rounded-full p-1">
                  <button onClick={() => setActiveAsset('gold')} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${activeAsset === 'gold' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}>Gold</button>
                  <button onClick={() => setActiveAsset('silver')} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${activeAsset === 'silver' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}>Silver</button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-gray-400">
                  <Lock size={12} />
                  <span className="text-xs font-medium">Computed</span>
                </div>
              )}
            </div>

            {/* Output Area */}
            <div 
              onClick={handleCopy} 
              className={`w-full font-semibold tracking-tight cursor-pointer transition-all relative group whitespace-nowrap ${getDynamicSize(formattedOutputValue)}`}
            >
              {formattedOutputValue}
              <span className="absolute top-1/2 -translate-y-1/2 right-0 text-xs opacity-0 group-hover:opacity-100 transition-opacity font-sans font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-md">
                {copied ? 'Copied!' : 'Copy'}
              </span>
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <footer className="mt-16 text-center text-xs text-gray-400 font-medium flex flex-col gap-1">
          <p>ACC - All Currency Converter</p>
          <p>Indicative values only. Not financial advice.</p>
        </footer>
      </main>
    </div>
  );
}

export default App;