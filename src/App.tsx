import { ArrowRightLeft, Lock, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useExchangeStore } from './lib/exchange-store';
import { useMarketData } from './lib/market';
import { convert } from './lib/engine';
import { CurrencyPicker } from './components/CurrencyPicker';
import { VarianceChart } from './components/VarianceChart';

function App() {
  const { 
    sendAmount, sendCurrency, receiveCurrency, activeAsset,
    setSendAmount, setSendCurrency, swap, setActiveAsset
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

  // Keyboard Shortcuts (Kept 'S' and 'R' on desktop, removed visual hints)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      switch (e.key.toLowerCase()) {
        case 'r': refetch(); break;
        case 's': swap(); break;
        case 'g': setActiveAsset('gold'); break;
        case 'x': setActiveAsset('silver'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [refetch, swap, setActiveAsset]);

  if (isLoading || !market) {
    return <div className="min-h-screen bg-page-bg text-white flex items-center justify-center">Loading Live Data...</div>;
  }

  const getForex = (currency: string) => {
    if (currency === 'ZAR') return market.usdToZar;
    if (currency === 'EUR') return market.usdToEur;
    return 1;
  };

  const isSendingToken = sendCurrency === 'GHD' || sendCurrency === 'GHD_SILVER';
  const direction = isSendingToken ? 'tokenToFiat' : 'fiatToToken';
  const fiatCurrency = isSendingToken ? receiveCurrency : sendCurrency;
  const metalPrice = activeAsset === 'gold' ? market.goldUsd : market.silverUsd;
  const forex = getForex(fiatCurrency);

  const result = convert(
    Number(sendAmount) || 0, direction, activeAsset, metalPrice, forex
  );

  const displayRate = (market.goldUsd * getForex(fiatCurrency) * 0.1033).toFixed(2);
  const currencySymbol = fiatCurrency === 'ZAR' ? 'R' : fiatCurrency === 'USD' ? '$' : fiatCurrency === 'EUR' ? '€' : fiatCurrency === 'GBP' ? '£' : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(result.output.toFixed(2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getFreshnessColor = () => {
    if (timeSinceUpdate < 60) return 'bg-led-green'; 
    if (timeSinceUpdate < 300) return 'bg-yellow-400'; 
    return 'bg-danger'; 
  };

  const baseCallGoldUsd = 4187.34;
  const baseCallGoldZar = baseCallGoldUsd * 18.50;
  const baseCallUnitRate = baseCallGoldZar * 0.1033;
  const baseCallTotalValue = 5280 * baseCallUnitRate;
  const currentTotalValue = 5280 * (market.goldUsd * market.usdToZar * 0.1033);

  const calcDiff = (current: number, base: number) => {
    const diff = ((current - base) / base) * 100;
    const isPositive = diff >= 0;
    return (
      <span className={isPositive ? "text-success" : "text-danger"}>
        {isPositive ? '+' : ''}{diff.toFixed(2)}%
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-page-bg text-white pb-12">
      
      {/* Top Bar */}
      <header className="flex items-center justify-between p-4 bg-card-bg border-b border-elevated-bg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-ghd-gold rounded flex items-center justify-center font-bold text-black text-xl">G</div>
          <span className="font-semibold text-lg hidden sm:block">GHD Converter</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getFreshnessColor()} animate-pulse`}></div>
            <span className="text-xs text-gray-400 hidden sm:block">
              {timeSinceUpdate < 60 ? 'Live' : 'Stale'}
            </span>
          </div>
          <button 
            onClick={() => refetch()}
            className="p-2 bg-elevated-bg rounded-lg hover:bg-gray-600 transition-colors"
            aria-label="Refresh data"
          >
            <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 mt-6">
        
        {/* Top Rate Header - Now in one line */}
        <div className="mb-6 text-center sm:text-left">
          <h2 className="text-2xl font-mono text-white whitespace-nowrap">
            <span className="text-ghd-gold">1 GHD</span> = {currencySymbol}{displayRate}
          </h2>
        </div>

        {/* Top Card (Send) - Styled based on the template */}
        <div className={`p-6 rounded-2xl shadow-xl relative z-20 transition-colors ${isSendingToken ? 'bg-ghd-gold text-black' : 'bg-card-bg border border-elevated-bg text-white'}`}>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="w-full sm:w-48">
              <CurrencyPicker 
                selected={sendCurrency} 
                onChange={setSendCurrency} 
                isGoldCard={isSendingToken} 
              />
            </div>
            
            {isSendingToken ? (
              <button 
                onClick={() => setActiveAsset(activeAsset === 'gold' ? 'silver' : 'gold')}
                className="bg-black text-white text-xs font-bold px-3 py-1.5 rounded-md hover:opacity-80 transition-opacity"
              >
                {activeAsset === 'gold' ? 'Gold Anchored' : 'Silver Anchored'}
              </button>
            ) : (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Lock size={12} />
                <span>Currency</span>
              </div>
            )}
          </div>

          <p className={`text-sm mb-2 ${isSendingToken ? 'text-black/70' : 'text-gray-400'}`}>
            1. Choose Your Currency Here
          </p>

          <input
            type="number"
            inputMode="decimal"
            value={sendAmount}
            onChange={(e) => setSendAmount(e.target.value)}
            className={`w-full bg-transparent text-5xl font-mono outline-none ${isSendingToken ? 'text-black' : 'text-white'}`}
            placeholder="0.00"
          />
        </div>

        {/* Swap Button - Rectangular with labels */}
        <div className="flex justify-center -my-4 relative z-30">
          <button 
            onClick={swap}
            className="flex items-center gap-2 px-6 py-3 bg-ghd-gold rounded-xl text-black font-bold text-sm hover:scale-105 transition-transform shadow-xl"
            aria-label="Swap currencies"
          >
            <ArrowRightLeft size={18} />
            <span>SWAP</span>
          </button>
        </div>

        {/* Bottom Card (Receive) */}
        <div className={`p-6 rounded-2xl shadow-xl relative z-10 ${!isSendingToken ? 'bg-ghd-gold text-black' : 'bg-card-bg border border-elevated-bg text-white'}`}>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="w-full sm:w-48">
              <CurrencyPicker 
                selected={receiveCurrency} 
                onChange={() => {}} 
                disabled 
                isGoldCard={!isSendingToken}
              />
            </div>
            
            {!isSendingToken ? (
              <button 
                onClick={() => setActiveAsset(activeAsset === 'gold' ? 'silver' : 'gold')}
                className="bg-black text-white text-xs font-bold px-3 py-1.5 rounded-md hover:opacity-80 transition-opacity"
              >
                {activeAsset === 'gold' ? 'Gold Anchored' : 'Silver Anchored'}
              </button>
            ) : (
              <div className={`flex items-center gap-1 text-xs ${!isSendingToken ? 'text-black/70' : 'text-gray-400'}`}>
                <Lock size={12} />
                <span>Currency</span>
              </div>
            )}
          </div>

          <p className={`text-sm mb-2 ${!isSendingToken ? 'text-black/70' : 'text-gray-400'}`}>
            Computed
          </p>
          
          <div 
            onClick={handleCopy}
            className={`text-5xl font-mono cursor-pointer transition-colors relative group ${!isSendingToken ? 'text-black' : 'text-gray-300'}`}
          >
            {result.output.toFixed(4)}
            <span className="absolute top-0 right-0 text-xs opacity-0 group-hover:opacity-100 transition-opacity font-sans font-normal px-2 py-1 bg-black/10 rounded">
              {copied ? 'Copied!' : 'Click to copy'}
            </span>
          </div>
        </div>

        {/* Market Indicators Card */}
        <div className="mt-8 bg-market-teal text-black p-5 rounded-2xl shadow-lg">
          <h3 className="font-bold text-lg mb-3">Market Indicators</h3>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex justify-between items-center">
              <span>🟠 Gold (XAU):</span>
              <span>${market.goldUsd.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>⚪ Silver (XAG):</span>
              <span>${market.silverUsd.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>FX: USD/{fiatCurrency}:</span>
              <span>{forex.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center border-t border-black/20 pt-2 mt-2">
              <span>Anchor Ratio:</span>
              <span>{activeAsset === 'gold' ? '0.1033' : '0.1036'} oz</span>
            </div>
            <div className="flex justify-between items-center text-xs text-black/60 mt-2">
              <span>Last Updated:</span>
              <span>{timeSinceUpdate}s ago</span>
            </div>
          </div>
        </div>

        {/* Variance Monitor */}
        <div className="mt-8 bg-card-bg p-5 rounded-2xl border border-elevated-bg">
          <h3 className="font-semibold text-white mb-4">Variance Monitor (1W)</h3>
          <VarianceChart data={market.historyData} />
        </div>

        {/* Comparison Table */}
        <div className="mt-8 bg-card-bg p-5 rounded-2xl border border-elevated-bg overflow-x-auto">
          <h3 className="font-semibold text-white mb-4">Model vs. Base Call</h3>
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="text-gray-400 border-b border-elevated-bg">
                <th className="pb-2 pr-4 font-normal">Metric</th>
                <th className="pb-2 pr-4 font-normal">Base Call</th>
                <th className="pb-2 pr-4 font-normal">Current</th>
                <th className="pb-2 font-normal">Diff</th>
              </tr>
            </thead>
            <tbody className="font-mono text-gray-300">
              <tr className="border-b border-elevated-bg/50">
                <td className="py-2 pr-4 text-ghd-gold">Gold (USD)</td>
                <td className="py-2 pr-4">${baseCallGoldUsd.toFixed(2)}</td>
                <td className="py-2 pr-4">${market.goldUsd.toFixed(2)}</td>
                <td className="py-2">{calcDiff(market.goldUsd, baseCallGoldUsd)}</td>
              </tr>
              <tr className="border-b border-elevated-bg/50">
                <td className="py-2 pr-4 text-ghd-gold">Gold (ZAR)</td>
                <td className="py-2 pr-4">R{baseCallGoldZar.toFixed(2)}</td>
                <td className="py-2 pr-4">R{(market.goldUsd * market.usdToZar).toFixed(2)}</td>
                <td className="py-2">{calcDiff(market.goldUsd * market.usdToZar, baseCallGoldZar)}</td>
              </tr>
              <tr className="border-b border-elevated-bg/50">
                <td className="py-2 pr-4 text-ghd-gold">Unit Rate</td>
                <td className="py-2 pr-4">R{baseCallUnitRate.toFixed(2)}</td>
                <td className="py-2 pr-4">R{(market.goldUsd * market.usdToZar * 0.1033).toFixed(2)}</td>
                <td className="py-2">{calcDiff(market.goldUsd * market.usdToZar * 0.1033, baseCallUnitRate)}</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 text-ghd-gold">Total (5,280 GHD)</td>
                <td className="py-2 pr-4">R{baseCallTotalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                <td className="py-2 pr-4">R{currentTotalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                <td className="py-2">{calcDiff(currentTotalValue, baseCallTotalValue)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <footer className="mt-12 text-center text-xs text-gray-500">
          GHD Converter · Indicative values only. Not financial advice.
        </footer>

      </main>
    </div>
  );
}

export default App;