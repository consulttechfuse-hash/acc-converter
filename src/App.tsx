import { ArrowRightLeft, Lock, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useExchangeStore } from './lib/exchange-store';
import { useMarketData } from './lib/market';
import { convert } from './lib/engine';
import { CurrencyPicker } from './components/CurrencyPicker';
import { VarianceChart } from './components/VarianceChart';
import { CURRENCIES } from './lib/currencies';
import { CircleFlag } from 'react-circle-flags';

function App() {
  const { 
    sendAmount, sendCurrency, receiveCurrency, activeAsset,
    setSendAmount, setSendCurrency, swap, setActiveAsset
  } = useExchangeStore();
  
  const { data: market, isLoading, refetch, isFetching, dataUpdatedAt } = useMarketData();
  const [copied, setCopied] = useState(false);
  const [timeSinceUpdate, setTimeSinceUpdate] = useState(0);
  
  const [timeframe, setTimeframe] = useState<'1W' | '1M'>('1W');

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
    return <div className="min-h-screen bg-page-bg text-white flex items-center justify-center">Loading Live Data...</div>;
  }

  const getForex = (currency: string) => {
    return market.forexRates[currency] || 1; 
  };

  const isSendingToken = sendCurrency === 'GHD' || sendCurrency === 'GHD_SILVER';
  const direction = isSendingToken ? 'tokenToFiat' : 'fiatToToken';
  const fiatCurrency = isSendingToken ? receiveCurrency : sendCurrency;
  
  const selectedFiat = CURRENCIES.find(c => c.code === fiatCurrency);
  const fiatSymbol = selectedFiat?.symbol || '';
  
  const metalPrice = activeAsset === 'gold' ? market.goldUsd : market.silverUsd;
  const forex = getForex(fiatCurrency);
  const displayRate = (metalPrice * forex * (activeAsset === 'gold' ? 0.1033 : 0.1036)).toFixed(2);

  const result = convert(
    Number(sendAmount) || 0, direction, activeAsset, metalPrice, forex
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(result.output.toFixed(4));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getFreshnessColor = () => {
    if (timeSinceUpdate < 60) return 'bg-led-green'; 
    if (timeSinceUpdate < 300) return 'bg-yellow-400'; 
    return 'bg-danger'; 
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, '');
    if (!isNaN(Number(rawValue))) {
      if (rawValue.length <= 15) {
        setSendAmount(rawValue);
      }
    }
  };

  const formattedInputValue = sendAmount ? Number(sendAmount).toLocaleString('en-US') : '';
  const formattedOutputValue = result.output.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 });

  const getDynamicSize = (val: string, baseSize = "text-5xl") => {
    if (val.length > 16) return "text-2xl";
    if (val.length > 12) return "text-3xl";
    if (val.length > 9) return "text-4xl";
    return baseSize;
  };

  const baseCallGoldUsd = 4187.34;
  const baseCallRateForFiat = fiatCurrency === 'ZAR' ? 18.50 : (18.50 / market.forexRates['ZAR']) * forex;
  
  const baseCallGoldFiat = baseCallGoldUsd * baseCallRateForFiat; 
  const baseCallUnitRate = baseCallGoldFiat * 0.1033;
  const baseCallTotalValue = 5280 * baseCallUnitRate;
  
  const currentGoldFiat = market.goldUsd * forex;
  const currentUnitRate = currentGoldFiat * 0.1033;
  const currentTotalValue = 5280 * currentUnitRate;

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
    <div className="min-h-screen bg-page-bg text-white pb-12 flex flex-col items-center">
      
      <header className="w-full flex items-center justify-between p-4 bg-card-bg border-b border-elevated-bg">
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

      <main className="w-full max-w-lg p-4 mt-8">
        
        <div className="mb-6 text-left px-2">
          <h2 className="text-2xl font-mono text-white whitespace-nowrap">
            <span className="text-ghd-gold font-bold">1 GHD</span> = {fiatSymbol}{displayRate}
          </h2>
        </div>

        <div className={`p-6 rounded-2xl shadow-2xl relative z-20 transition-colors ${isSendingToken ? 'bg-ghd-gold text-black' : 'bg-card-bg border border-elevated-bg text-white'}`}>
          
          <div className="flex justify-between items-center mb-6">
            {isSendingToken ? (
              <div className="flex bg-black/10 rounded-lg p-1">
                <button onClick={() => setActiveAsset('gold')} className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${activeAsset === 'gold' ? 'bg-black text-white' : 'text-black/60 hover:text-black'}`}>Gold</button>
                <button onClick={() => setActiveAsset('silver')} className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${activeAsset === 'silver' ? 'bg-black text-white' : 'text-black/60 hover:text-black'}`}>Silver</button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {selectedFiat?.countryCode && (
                  <div className="w-10 h-10 bg-elevated-bg rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                    <CircleFlag countryCode={selectedFiat.countryCode} height="24" />
                  </div>
                )}
                <div className="w-32">
                  <CurrencyPicker selected={sendCurrency} onChange={setSendCurrency} isGoldCard={false} />
                </div>
              </div>
            )}
            <div className={`flex items-center gap-1 text-xs ${isSendingToken ? 'text-black/70' : 'text-gray-400'}`}>
              {isSendingToken ? <span className="font-bold">{activeAsset === 'gold' ? 'Gold Anchored' : 'Silver Anchored'}</span> : <><Lock size={12} /><span>Currency</span></>}
            </div>
          </div>

          <p className={`text-sm mb-2 font-medium ${isSendingToken ? 'text-black/70' : 'text-gray-400'}`}>Amount</p>

          <div className={`w-full rounded-xl p-3 h-[60px] flex items-center overflow-hidden ${isSendingToken ? 'bg-black/5' : 'bg-page-bg border border-elevated-bg'}`}>
            <input
              type="text"
              inputMode="decimal"
              value={formattedInputValue}
              onChange={handleInputChange}
              className={`w-full bg-transparent font-mono outline-none transition-all ${getDynamicSize(formattedInputValue)} ${isSendingToken ? 'text-black placeholder-black/30' : 'text-white placeholder-gray-600'}`}
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="flex justify-center -my-5 relative z-30">
          <button onClick={swap} className="flex items-center gap-2 px-6 py-3 bg-[#2D2D2D] border-2 border-ghd-gold rounded-xl text-white font-bold text-sm hover:scale-105 transition-transform shadow-2xl" aria-label="Swap currencies">
            <ArrowRightLeft size={18} className="text-ghd-gold" />
            <span>SWAP</span>
          </button>
        </div>

        <div className={`p-6 rounded-2xl shadow-2xl relative z-10 ${!isSendingToken ? 'bg-ghd-gold text-black' : 'bg-card-bg border border-elevated-bg text-white'}`}>
          <div className="flex justify-between items-center mb-6">
            {!isSendingToken ? (
              <div className="flex bg-black/10 rounded-lg p-1">
                <button onClick={() => setActiveAsset('gold')} className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${activeAsset === 'gold' ? 'bg-black text-white' : 'text-black/60 hover:text-black'}`}>Gold</button>
                <button onClick={() => setActiveAsset('silver')} className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${activeAsset === 'silver' ? 'bg-black text-white' : 'text-black/60 hover:text-black'}`}>Silver</button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {selectedFiat?.countryCode && (
                  <div className="w-10 h-10 bg-elevated-bg rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                    <CircleFlag countryCode={selectedFiat.countryCode} height="24" />
                  </div>
                )}
                <div className="w-32">
                  <CurrencyPicker selected={receiveCurrency} onChange={() => {}} disabled isGoldCard={false} />
                </div>
              </div>
            )}
            <div className={`flex items-center gap-1 text-xs ${!isSendingToken ? 'text-black/70' : 'text-gray-400'}`}>
              {!isSendingToken ? <span className="font-bold">{activeAsset === 'gold' ? 'Gold Anchored' : 'Silver Anchored'}</span> : <><Lock size={12} /><span>Currency</span></>}
            </div>
          </div>

          <p className={`text-sm mb-2 font-medium ${!isSendingToken ? 'text-black/70' : 'text-gray-400'}`}>Computed</p>
          
          <div className={`w-full rounded-xl p-3 h-[60px] flex items-center overflow-hidden ${!isSendingToken ? 'bg-black/5' : 'bg-page-bg border border-elevated-bg'}`}>
            <div onClick={handleCopy} className={`w-full font-mono cursor-pointer transition-all relative group whitespace-nowrap ${getDynamicSize(formattedOutputValue)} ${!isSendingToken ? 'text-black' : 'text-white'}`}>
              {formattedOutputValue}
              <span className="absolute top-0 right-0 text-xs opacity-0 group-hover:opacity-100 transition-opacity font-sans font-normal px-2 py-1 bg-black/10 rounded">
                {copied ? 'Copied!' : 'Click to copy'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-market-teal text-black p-5 rounded-2xl shadow-lg">
          <h3 className="font-bold text-lg mb-3">Market Indicators</h3>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex justify-between items-center"><span>🟠 Gold (XAU):</span><span>${market.goldUsd.toFixed(2)}</span></div>
            <div className="flex justify-between items-center"><span>⚪ Silver (XAG):</span><span>${market.silverUsd.toFixed(2)}</span></div>
            <div className="flex justify-between items-center border-t border-black/20 pt-2 mt-2"><span>Anchor Ratio:</span><span>{activeAsset === 'gold' ? '0.1033' : '0.1036'} oz</span></div>
            <div className="flex justify-between items-center text-xs text-black/60 mt-2"><span>Last Updated:</span><span>{timeSinceUpdate}s ago</span></div>
          </div>
        </div>

        <div className="mt-8 bg-card-bg p-5 rounded-2xl border border-elevated-bg">
          <VarianceChart 
            data={market.historyData} 
            silverHistoryData={market.silverHistoryData} 
            timeframe={timeframe}
            setTimeframe={setTimeframe}
          />
        </div>

        <div className="mt-8 bg-card-bg p-5 rounded-2xl border border-elevated-bg overflow-hidden shadow-2xl">
          
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white">Valuation Benchmark</h3>
              <div className="w-2 h-2 rounded-full bg-led-green animate-pulse"></div>
            </div>
            <span className="text-xs text-gray-400 font-mono bg-page-bg px-2 py-1 rounded border border-elevated-bg">
              {timeframe === '1W' ? '1 Week vs. Live' : '1 Month vs. Live'}
            </span>
          </div>
          
          <table className="w-full text-left text-xs sm:text-sm font-mono">
            <thead>
              <tr className="text-gray-400 border-b border-elevated-bg">
                <th className="pb-3 pr-2 font-normal">Metric</th>
                <th className="pb-3 pr-2 font-normal text-right">Base</th>
                <th className="pb-3 pr-2 font-normal text-right">Live</th>
                <th className="pb-3 font-normal text-right">Diff</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              <tr className="border-b border-elevated-bg/50 hover:bg-white/5 transition-colors">
                <td className="py-3 pr-2 text-ghd-gold font-bold">Gold (USD)</td>
                <td className="py-3 pr-2 text-right">${baseCallGoldUsd.toFixed(2)}</td>
                <td className="py-3 pr-2 text-right">${market.goldUsd.toFixed(2)}</td>
                <td className="py-3 text-right">{calcDiff(market.goldUsd, baseCallGoldUsd)}</td>
              </tr>
              <tr className="border-b border-elevated-bg/50 hover:bg-white/5 transition-colors">
                <td className="py-3 pr-2 text-ghd-gold font-bold">Gold ({fiatCurrency})</td>
                <td className="py-3 pr-2 text-right">{fiatSymbol}{baseCallGoldFiat.toFixed(2)}</td>
                <td className="py-3 pr-2 text-right">{fiatSymbol}{currentGoldFiat.toFixed(2)}</td>
                <td className="py-3 text-right">{calcDiff(currentGoldFiat, baseCallGoldFiat)}</td>
              </tr>
              <tr className="border-b border-elevated-bg/50 hover:bg-white/5 transition-colors">
                <td className="py-3 pr-2 text-ghd-gold font-bold">Unit Rate</td>
                <td className="py-3 pr-2 text-right">{fiatSymbol}{baseCallUnitRate.toFixed(2)}</td>
                <td className="py-3 pr-2 text-right">{fiatSymbol}{currentUnitRate.toFixed(2)}</td>
                <td className="py-3 text-right">{calcDiff(currentUnitRate, baseCallUnitRate)}</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="py-3 pr-2 text-ghd-gold font-bold">Total Value</td>
                <td className="py-3 pr-2 text-right">{fiatSymbol}{baseCallTotalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                <td className="py-3 pr-2 text-right">{fiatSymbol}{currentTotalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                <td className="py-3 text-right">{calcDiff(currentTotalValue, baseCallTotalValue)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <footer className="mt-12 text-center text-xs text-gray-500 flex flex-col gap-1">
          <p>GHD Converter · Free Tool · Indicative values only. Not financial advice.</p>
        </footer>
      </main>
    </div>
  );
}

export default App;