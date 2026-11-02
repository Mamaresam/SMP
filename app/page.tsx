'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

type Coin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number | null;
  market_cap: number;
  total_volume: number;
};

type FxQuote = { pair: string; price: number };
type FeeData = { slow: number; standard: number; fast: number; baseFee: number };
type Point = { time: number; value: number };

const coinIds = ['bitcoin', 'ethereum', 'solana', 'binancecoin', 'ripple', 'avalanche-2'];
const fxPairs = [
  { pair: 'EUR/USD', base: 'EUR' },
  { pair: 'GBP/USD', base: 'GBP' },
  { pair: 'USD/JPY', base: 'JPY' },
  { pair: 'AUD/USD', base: 'AUD' },
  { pair: 'USD/CHF', base: 'CHF' },
  { pair: 'USD/CAD', base: 'CAD' },
];

// Illustrative rows only; the UI labels these as demo data, not live transactions.
const transactions = [
  { hash: '0x5d2c...f14a', time: '2 min ago', amount: '2.88 ETH', status: 'Success' },
  { hash: '0x17a1...0a44', time: '7 min ago', amount: '410 USDT', status: 'Success' },
  { hash: '0x3d8e...992c', time: '14 min ago', amount: '0.64 BTC', status: 'Pending' },
  { hash: '0xc91f...91aa', time: '26 min ago', amount: '12.4 SOL', status: 'Failed' },
];

function money(value: number, digits = 2) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: digits,
  }).format(value);
}

function compactMoney(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 2,
  }).format(value);
}

function linePath(points: Point[], width = 720, height = 220) {
  if (points.length < 2) return '';
  const values = points.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  return points.map((point, index) => {
    const x = (index / (points.length - 1)) * width;
    const y = height - 12 - ((point.value - min) / range) * (height - 24);
    return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');
}

function formatTime(date: Date | null) {
  if (!date) return 'Waiting for first update';
  return new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(date);
}

export default function Home() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [fx, setFx] = useState<FxQuote[]>([]);
  const [btcHistory, setBtcHistory] = useState<Point[]>([]);
  const [fees, setFees] = useState<FeeData | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const failures: string[] = [];
    const results = await Promise.allSettled([
      fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds.join(',')}&price_change_percentage=24h&sparkline=false`, { cache: 'no-store' }).then(async (r) => {
        if (!r.ok) throw new Error('crypto');
        return await r.json() as Coin[];
      }),
      fetch('https://api.frankfurter.app/latest?from=USD&to=EUR,GBP,JPY,AUD,CHF,CAD', { cache: 'no-store' }).then(async (r) => {
        if (!r.ok) throw new Error('forex');
        return await r.json() as { date: string; rates: Record<string, number> };
      }),
      fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1&interval=hourly', { cache: 'no-store' }).then(async (r) => {
        if (!r.ok) throw new Error('chart');
        return await r.json() as { prices: [number, number][] };
      }),
      fetch('https://ethereum-rpc.publicnode.com', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_feeHistory', params: ['0x5', 'latest', [25, 50, 75]], id: 1 }), cache: 'no-store',
      }).then(async (r) => {
        if (!r.ok) throw new Error('gas');
        return await r.json() as { result?: { baseFeePerGas: string[]; reward: string[][] } };
      }),
    ]);

    const [coinResult, fxResult, historyResult, feeResult] = results;
    if (coinResult.status === 'fulfilled') setCoins(coinResult.value);
    else failures.push('crypto');

    if (fxResult.status === 'fulfilled') {
      const rates = fxResult.value.rates;
      setFx(fxPairs.map(({ pair, base }) => ({
        pair,
        price: 1 / (rates[base] ?? 1),
      })));
    } else failures.push('forex');

    if (historyResult.status === 'fulfilled') {
      setBtcHistory(historyResult.value.prices.map(([time, value]) => ({ time, value })));
    } else failures.push('chart');

    if (feeResult.status === 'fulfilled' && feeResult.value.result) {
      const result = feeResult.value.result;
      const gwei = (hex: string) => Number(BigInt(hex)) / 1e9;
      const rewardRows = result.reward ?? [];
      const tipAt = (index: number) => {
        const row = rewardRows[rewardRows.length - 1] ?? [];
        return row[index] ? gwei(row[index]) : 0;
      };
      const base = gwei(result.baseFeePerGas[result.baseFeePerGas.length - 1]);
      setFees({ slow: base + tipAt(0), standard: base + tipAt(1), fast: base + tipAt(2), baseFee: base });
    } else failures.push('gas');

    setErrors(failures);
    setUpdatedAt(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
    const interval = window.setInterval(() => void refresh(), 60_000);
    return () => window.clearInterval(interval);
  }, [refresh]);

  const btcPath = useMemo(() => linePath(btcHistory), [btcHistory]);
  const btc = coins.find((coin) => coin.id === 'bitcoin');
  const eth = coins.find((coin) => coin.id === 'ethereum');

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="SMP home">
          <span className="brand-icon">S</span>
          <span><strong>SMP</strong><small>Market intelligence</small></span>
        </a>
        <nav className="nav" aria-label="Main navigation">
          <a href="#markets">Markets</a><a href="#forex">Forex</a><a href="#network">Network</a>
        </nav>
        <div className="feed-state"><span className={`pulse ${loading ? 'loading' : ''}`} />
          <span>{loading ? 'Connecting feeds' : errors.length ? 'Partial data' : 'Market feeds active'}</span>
          <small>{formatTime(updatedAt)}</small>
        </div>
      </header>

      <section className="welcome" id="top">
        <div>
          <span className="kicker"><span className="pulse" /> LIVE MARKET DESK</span>
          <h1>Clarity in every<br /><em>market move.</em></h1>
          <p>Crypto, foreign exchange and network activity in one focused view. Quotes refresh automatically; source delays and availability vary.</p>
        </div>
        <div className="welcome-aside">
          <span className="aside-label">ETHEREUM NETWORK</span>
          <strong>{fees ? `${fees.standard.toFixed(2)} <small>GWEI</small>` : '—'}</strong>
          <span className="aside-caption">Current standard fee estimate</span>
          <div className="aside-divider" />
          <span className="aside-label">ETH SPOT</span>
          <strong>{eth ? money(eth.current_price) : '—'}</strong>
          <span className="aside-caption">Market quote · USD</span>
        </div>
      </section>

      <section className="stats-grid" aria-label="Market summary">
        <article className="stat-card"><span>Bitcoin</span><strong>{btc ? money(btc.current_price) : '—'}</strong><small className={btc && (btc.price_change_percentage_24h ?? 0) >= 0 ? 'up' : 'down'}>{btc?.price_change_percentage_24h == null ? 'Quote unavailable' : `${btc.price_change_percentage_24h >= 0 ? '+' : ''}${btc.price_change_percentage_24h.toFixed(2)}% · 24h`}</small></article>
        <article className="stat-card"><span>Ethereum</span><strong>{eth ? money(eth.current_price) : '—'}</strong><small className={eth && (eth.price_change_percentage_24h ?? 0) >= 0 ? 'up' : 'down'}>{eth?.price_change_percentage_24h == null ? 'Quote unavailable' : `${eth.price_change_percentage_24h >= 0 ? '+' : ''}${eth.price_change_percentage_24h.toFixed(2)}% · 24h`}</small></article>
        <article className="stat-card"><span>ETH base fee</span><strong>{fees ? `${fees.baseFee.toFixed(2)} gwei` : '—'}</strong><small>Ethereum RPC · latest block</small></article>
        <article className="stat-card"><span>Feed status</span><strong>{errors.length ? 'Partial' : loading ? 'Connecting' : 'Online'}</strong><small>{updatedAt ? `Updated ${formatTime(updatedAt)}` : 'Waiting for data'}</small></article>
      </section>

      <section className="main-grid" id="markets">
        <article className="panel chart-panel">
          <div className="panel-heading">
            <div><span className="section-label">MARKET CHART</span><h2>Bitcoin / USD</h2></div>
            <span className="timeframe">24 HOURS</span>
          </div>
          <div className="chart-price-row"><strong>{btc ? money(btc.current_price) : '—'}</strong><span className={btc && (btc.price_change_percentage_24h ?? 0) >= 0 ? 'up' : 'down'}>{btc?.price_change_percentage_24h == null ? '—' : `${btc.price_change_percentage_24h >= 0 ? '+' : ''}${btc.price_change_percentage_24h.toFixed(2)}%`}</span></div>
          <div className="line-chart">
            <div className="chart-grid-lines"><i /><i /><i /><i /></div>
            {btcPath ? <svg viewBox="0 0 720 220" preserveAspectRatio="none" role="img" aria-label="Bitcoin price history for the last 24 hours"><defs><linearGradient id="btcArea" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#65e7c2" stopOpacity=".24" /><stop offset="100%" stopColor="#65e7c2" stopOpacity="0" /></linearGradient></defs><path d={`${btcPath} L 720 220 L 0 220 Z`} fill="url(#btcArea)" /><path d={btcPath} className="chart-line" /></svg> : <div className="chart-empty">{loading ? 'Loading live price history…' : 'Price history is temporarily unavailable.'}</div>}
          </div>
          <div className="chart-footer"><span>Source: CoinGecko</span><span>Refresh interval: 60 sec</span></div>
        </article>

        <article className="panel movers-panel">
          <div className="panel-heading"><div><span className="section-label">LIVE SNAPSHOT</span><h2>Crypto markets</h2></div><span className="data-mark">USD</span></div>
          <div className="asset-list">
            {coins.map((coin) => (
              <div className="asset-row" key={coin.id}>
                <div className="asset-identity"><img src={coin.image} alt="" /><span><strong>{coin.name}</strong><small>{coin.symbol.toUpperCase()}</small></span></div>
                <span className="asset-price"><strong>{money(coin.current_price, coin.current_price < 1 ? 4 : 2)}</strong><small>Vol {compactMoney(coin.total_volume)}</small></span>
                <span className={`change-pill ${(coin.price_change_percentage_24h ?? 0) >= 0 ? 'positive' : 'negative'}`}>{coin.price_change_percentage_24h == null ? '—' : `${coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h.toFixed(2)}%`}</span>
              </div>
            ))}
            {!coins.length && <p className="empty-state">{loading ? 'Fetching market quotes…' : 'Crypto quotes are unavailable. They will retry automatically.'}</p>}
          </div>
          <div className="source-note">Price and 24-hour change from CoinGecko public market data.</div>
        </article>
      </section>

      <section className="lower-grid">
        <article className="panel forex-panel" id="forex">
          <div className="panel-heading"><div><span className="section-label">FOREIGN EXCHANGE</span><h2>Major currency pairs</h2></div><span className="data-mark">REFERENCE RATES</span></div>
          <div className="fx-list">
            {fx.map(({ pair, price }) => (
              <div className="fx-row" key={pair}><span className="fx-icon">{pair.slice(0, 3)}<b>{pair.slice(4)}</b></span><strong>{pair}</strong><span className="fx-price">{price.toFixed(pair.includes('JPY') ? 3 : 5)}</span><span className="fx-note">USD reference</span></div>
            ))}
            {!fx.length && <p className="empty-state">{loading ? 'Fetching reference rates…' : 'Reference rates unavailable. Automatic retry is enabled.'}</p>}
          </div>
          <div className="source-note">Frankfurter reference rates are generally daily, not tick-by-tick broker quotes. Last refreshed: {updatedAt ? formatTime(updatedAt) : '—'}.</div>
        </article>

        <article className="panel gas-panel">
          <div className="panel-heading"><div><span className="section-label">ON-CHAIN FEES</span><h2>Ethereum gas</h2></div><span className="eth-mark">Ξ</span></div>
          <div className="gas-options">
            <div><span>Low priority</span><strong>{fees ? `${fees.slow.toFixed(2)}` : '—'} <small>GWEI</small></strong></div>
            <div className="recommended"><span>Standard</span><strong>{fees ? `${fees.standard.toFixed(2)}` : '—'} <small>GWEI</small></strong></div>
            <div><span>High priority</span><strong>{fees ? `${fees.fast.toFixed(2)}` : '—'} <small>GWEI</small></strong></div>
          </div>
          <p className="source-note">Estimated from recent Ethereum fee history via public RPC. Actual transaction cost varies by gas usage.</p>
        </article>
      </section>

      <section className="panel network-panel" id="network">
        <div className="panel-heading"><div><span className="section-label">NETWORK ACTIVITY</span><h2>Recent transaction flow</h2></div><span className="data-mark">DEMO DATA</span></div>
        <div className="demo-notice">Transaction examples below are illustrative UI samples, not live blockchain transactions.</div>
        <div className="tx-table"><div className="tx-header"><span>Transaction</span><span>Age</span><span>Asset / amount</span><span>Status</span></div>
          {transactions.map((tx) => <div className="tx-row" key={tx.hash}><span className="mono">{tx.hash}</span><span>{tx.time}</span><span>{tx.amount}</span><span className={`tx-status ${tx.status.toLowerCase()}`}>{tx.status}</span></div>)}
        </div>
      </section>

      <footer className="footer"><span>SMP Market Intelligence</span><span>Market data may be delayed or temporarily unavailable. For informational purposes only.</span></footer>
    </main>
  );
}
