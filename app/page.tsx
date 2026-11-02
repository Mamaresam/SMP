'use client';

import { useEffect, useState } from 'react';

type ForexRow = {
  pair: string;
  price: string;
  change: string;
  tone: 'positive' | 'negative';
  spread: string;
  session: string;
};

type CryptoRow = {
  symbol: string;
  name: string;
  price: string;
  change: string;
  marketCap: string;
  volume: string;
  network: string;
  tone: 'positive' | 'negative';
};

const DEFAULT_FOREX: ForexRow[] = [
  { pair: 'EUR/USD', price: '1.0847', change: '+0.18%', tone: 'positive', spread: '0.0002', session: 'London / New York' },
  { pair: 'GBP/USD', price: '1.2674', change: '+0.31%', tone: 'positive', spread: '0.0003', session: 'London / NY' },
  { pair: 'USD/JPY', price: '154.82', change: '-0.22%', tone: 'negative', spread: '0.04', session: 'Tokyo / London' },
  { pair: 'AUD/USD', price: '0.6628', change: '+0.26%', tone: 'positive', spread: '0.0002', session: 'Sydney / Tokyo' },
  { pair: 'USD/CHF', price: '0.9041', change: '-0.12%', tone: 'negative', spread: '0.0003', session: 'Europe / Zurich' },
  { pair: 'NZD/USD', price: '0.6132', change: '+0.09%', tone: 'positive', spread: '0.0004', session: 'Sydney / Tokyo' },
];

const DEFAULT_CRYPTO: CryptoRow[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: '$67,824.19', change: '+2.15%', marketCap: '$1.33T', volume: '$32.7B', network: 'PoW', tone: 'positive' },
  { symbol: 'ETH', name: 'Ethereum', price: '$3,420.27', change: '+4.82%', marketCap: '$410.8B', volume: '$18.4B', network: 'PoS', tone: 'positive' },
  { symbol: 'SOL', name: 'Solana', price: '$158.22', change: '+7.63%', marketCap: '$72.1B', volume: '$4.8B', network: 'PoS', tone: 'positive' },
  { symbol: 'BNB', name: 'BNB Chain', price: '$593.48', change: '+1.48%', marketCap: '$86.3B', volume: '$1.9B', network: 'PoSA', tone: 'positive' },
  { symbol: 'AVAX', name: 'Avalanche', price: '$35.81', change: '-1.14%', marketCap: '$14.2B', volume: '$621.4M', network: 'PoS', tone: 'negative' },
  { symbol: 'MATIC', name: 'Polygon', price: '$0.97', change: '+1.42%', marketCap: '$9.3B', volume: '$214.8M', network: 'PoS', tone: 'positive' },
];

const stats = [
  { label: 'Network Activity', value: '$8.9B', change: '+12.4%', tone: 'green' },
  { label: 'Transactions / 24h', value: '4.2M', change: '+8.1%', tone: 'blue' },
  { label: 'Active Wallets', value: '1.8M', change: '+5.7%', tone: 'purple' },
  { label: 'Avg. Gas', value: '22 Gwei', change: '-3.4%', tone: 'amber' },
];

const networks = [
  { name: 'Ethereum', value: '68%', color: '#78e7d3' },
  { name: 'Polygon', value: '18%', color: '#7aa2ff' },
  { name: 'BNB Chain', value: '9%', color: '#f5c76d' },
  { name: 'Base', value: '5%', color: '#9f7aea' },
];

const marketData = [
  { asset: 'ETH', price: '$3,420.27', change: '+4.82%', volume: '$1.64T', sentiment: 'bullish' },
  { asset: 'BTC', price: '$67,824.19', change: '+2.15%', volume: '$2.31T', sentiment: 'bullish' },
  { asset: 'SOL', price: '$158.22', change: '+7.63%', volume: '$940.1B', sentiment: 'bullish' },
  { asset: 'MATIC', price: '$0.97', change: '+1.42%', volume: '$214.8M', sentiment: 'neutral' },
];

const tradingSessions = [
  { name: 'Sydney', open: '22:00', close: '07:00', status: 'Open', timezone: 'UTC+10', overlap: 'Tokyo', color: 'blue' },
  { name: 'Tokyo', open: '00:00', close: '09:00', status: 'Open', timezone: 'UTC+9', overlap: 'London', color: 'purple' },
  { name: 'London', open: '08:00', close: '17:00', status: 'Open', timezone: 'UTC+1', overlap: 'New York', color: 'green' },
  { name: 'New York', open: '13:00', close: '22:00', status: 'Open', timezone: 'UTC-5', overlap: 'London', color: 'amber' },
];

const transactions = [
  { hash: '0x5d2c...f14a', time: '2 min ago', amount: '2.88 ETH', status: 'Success' },
  { hash: '0x17a1...0a44', time: '7 min ago', amount: '410 USDT', status: 'Success' },
  { hash: '0x3d8e...992c', time: '14 min ago', amount: '0.64 BTC', status: 'Pending' },
  { hash: '0xc91f...91aa', time: '26 min ago', amount: '12.4 SOL', status: 'Failed' },
];

const chartBars = [52, 72, 36, 88, 55, 96, 70, 82, 63, 94, 58, 78];

function formatMoney(value: number): string {
  if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
}

async function fetchForexData(): Promise<ForexRow[]> {
  try {
    const response = await fetch('https://api.frankfurter.app/latest?from=USD&to=EUR,GBP,JPY,CHF,AUD,NZD', {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) throw new Error('FX fetch failed');

    const json = await response.json() as { rates?: Record<string, number> };
    const rates = json.rates ?? {};

    const pairMap = [
      { pair: 'EUR/USD', base: 'EUR' },
      { pair: 'GBP/USD', base: 'GBP' },
      { pair: 'USD/JPY', base: 'JPY' },
      { pair: 'AUD/USD', base: 'AUD' },
      { pair: 'USD/CHF', base: 'CHF' },
      { pair: 'NZD/USD', base: 'NZD' },
    ];

    return pairMap.map(({ pair, base }) => {
      const rate = rates[base] ?? 1;
      const numericValue = pair.startsWith('USD/') ? 1 / rate : 1 / rate;
      const positive = pair === 'USD/JPY' ? rate < 154.9 : numericValue > 1;

      return {
        pair,
        price: numericValue.toFixed(pair.startsWith('USD/') ? 2 : 4),
        change: positive ? '+0.18%' : '-0.12%',
        tone: positive ? 'positive' : 'negative',
        spread: pair.startsWith('USD/') ? (pair === 'USD/JPY' ? '0.04' : '0.0003') : '0.0003',
        session:
          pair === 'EUR/USD' || pair === 'GBP/USD' || pair === 'USD/CHF'
            ? 'London / New York'
            : pair === 'USD/JPY'
              ? 'Tokyo / London'
              : 'Sydney / Tokyo',
      };
    });
  } catch {
    return DEFAULT_FOREX;
  }
}

async function fetchCryptoData(): Promise<CryptoRow[]> {
  try {
    const ids = ['bitcoin', 'ethereum', 'solana', 'binancecoin', 'avalanche-2', 'matic-network'];
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids.join(',')}&price_change_percentage=24h&sparkline=false&precision=2&locale=en`;

    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) throw new Error('Crypto fetch failed');

    const data = await response.json() as Array<{
      id: string;
      name: string;
      symbol: string;
      current_price: number;
      market_cap: number;
      total_volume: number;
      price_change_percentage_24h: number;
    }>;

    const networkMap: Record<string, string> = {
      bitcoin: 'PoW',
      ethereum: 'PoS',
      solana: 'PoS',
      binancecoin: 'PoSA',
      'avalanche-2': 'PoS',
      'matic-network': 'PoS',
    };

    const symbolMap: Record<string, string> = {
      bitcoin: 'BTC',
      ethereum: 'ETH',
      solana: 'SOL',
      binancecoin: 'BNB',
      'avalanche-2': 'AVAX',
      'matic-network': 'MATIC',
    };

    return (data ?? []).map((coin) => ({
      symbol: symbolMap[coin.id] ?? coin.symbol.toUpperCase(),
      name: coin.name,
      price: `$${Number(coin.current_price ?? 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`,
      change: `${Number(coin.price_change_percentage_24h ?? 0) >= 0 ? '+' : ''}${Number(coin.price_change_percentage_24h ?? 0).toFixed(2)}%`,
      marketCap: formatMoney(Number(coin.market_cap ?? 0)),
      volume: formatMoney(Number(coin.total_volume ?? 0)),
      network: networkMap[coin.id] ?? 'PoS',
      tone: Number(coin.price_change_percentage_24h ?? 0) >= 0 ? 'positive' : 'negative',
    }));
  } catch {
    return DEFAULT_CRYPTO;
  }
}

export default function Home() {
  const [forexPairs, setForexPairs] = useState<ForexRow[]>(DEFAULT_FOREX);
  const [blockchainAssets, setBlockchainAssets] = useState<CryptoRow[]>(DEFAULT_CRYPTO);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [fx, crypto] = await Promise.all([fetchForexData(), fetchCryptoData()]);

        if (isMounted) {
          setForexPairs(fx);
          setBlockchainAssets(crypto);
        }
      } catch {
        // leave fallback values in place
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="page-shell">
      <header className="topbar">
        <div className="brand-group">
          <div className="brand-mark">S</div>
          <div>
            <span className="brand-name">SMP</span>
            <small>Blockchain Intelligence</small>
          </div>
        </div>

        <nav className="nav">
          <a href="#markets">Markets</a>
          <a href="#forex">Forex</a>
          <a href="#analytics">Analytics</a>
          <a href="#sessions">Sessions</a>
          <a href="#insights">Insights</a>
        </nav>

        <button className="primary-button">Launch Dashboard</button>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Built for on-chain clarity</span>
          <h1>Professional blockchain data, made simple.</h1>
          <p>
            Monitor wallet movement, transaction depth, token flows, gas pressure, FX pricing, and
            global trading session windows in one streamlined dashboard built for speed and confidence.
          </p>

          <div className="hero-actions">
            <button className="primary-button">Explore Analytics</button>
            <button className="secondary-button">View Demo</button>
          </div>

          <div className="trust-row">
            <div>
              <strong>200+</strong>
              <span>Protocol metrics</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>Market monitoring</span>
            </div>
            <div>
              <strong>99.9%</strong>
              <span>Uptime reliability</span>
            </div>
          </div>
        </div>

        <div className="hero-panel">
          <div className="panel-header">
            <div>
              <span className="chip live">{isLoading ? 'Syncing' : 'Live'}</span>
              <h3>Network Overview</h3>
            </div>
            <span className="status-pill">+3.42% today</span>
          </div>

          <div className="chart-wrap">
            {[...chartBars].reverse().map((height, index) => (
              <span key={index} style={{ height: `${height}%` }} />
            ))}
          </div>

          <div className="panel-metrics">
            <div>
              <label>TPS</label>
              <strong>183.2</strong>
            </div>
            <div>
              <label>TVL</label>
              <strong>$42.8B</strong>
            </div>
            <div>
              <label>Hash Rate</label>
              <strong>1.09 EH/s</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="stat-grid" id="analytics">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <small>{stat.label}</small>
            <div className="stat-row">
              <strong>{stat.value}</strong>
              <span className={`trend ${stat.tone}`}>{stat.change}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="content-grid">
        <div className="panel" id="markets">
          <div className="section-head">
            <div>
              <span className="eyebrow small">Market Pulse</span>
              <h2>Top movers</h2>
            </div>
            <button className="ghost-button">See all</button>
          </div>

          <div className="market-list">
            {marketData.map((item) => (
              <div key={item.asset} className="market-row">
                <div className="asset">
                  <span className="asset-badge">{item.asset.slice(0, 2)}</span>
                  <div>
                    <strong>{item.asset}</strong>
                    <small>{item.price}</small>
                  </div>
                </div>

                <span className={`tag ${item.sentiment}`}>{item.change}</span>
                <strong className="volume">{item.volume}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="panel" id="network">
          <div className="section-head">
            <div>
              <span className="eyebrow small">Network share</span>
              <h2>Chain mix</h2>
            </div>
          </div>

          <div className="network-visual">
            {networks.map((network) => (
              <div key={network.name} className="network-row">
                <div className="label-wrap">
                  <span className="dot" style={{ background: network.color }} />
                  <span>{network.name}</span>
                </div>
                <div className="progress-track">
                  <span style={{ width: network.value, background: network.color }} />
                </div>
                <strong>{network.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="panel" id="forex">
          <div className="section-head">
            <div>
              <span className="eyebrow small">FX data</span>
              <h2>Forex watchlist</h2>
            </div>
            <button className="ghost-button">Live quotes</button>
          </div>

          <div className="fx-table">
            <div className="fx-header">
              <span>Pair</span>
              <span>Price</span>
              <span>Change</span>
              <span>Spread</span>
            </div>

            {forexPairs.map((row) => (
              <div key={row.pair} className="fx-row">
                <strong>{row.pair}</strong>
                <span>{row.price}</span>
                <span className={`fx-change ${row.tone}`}>{row.change}</span>
                <span>{row.spread}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel" id="sessions">
          <div className="section-head">
            <div>
              <span className="eyebrow small">Session clocks</span>
              <h2>Trading sessions</h2>
            </div>
          </div>

          <div className="session-grid">
            {tradingSessions.map((session) => (
              <div key={session.name} className={`session-card ${session.color}`}>
                <div className="session-topline">
                  <strong>{session.name}</strong>
                  <span className="session-status">{session.status}</span>
                </div>
                <div className="session-time">
                  <span>{session.open} UTC</span>
                  <span>→ {session.close} UTC</span>
                </div>
                <small>Timezone: {session.timezone}</small>
                <small>Overlap: {session.overlap}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel full-panel">
        <div className="section-head">
          <div>
            <span className="eyebrow small">On-chain overview</span>
            <h2>Blockchain market data</h2>
          </div>
        </div>

        <div className="coin-grid">
          {blockchainAssets.map((coin) => (
            <div key={coin.symbol} className="coin-card">
              <div className="coin-top">
                <div className="coin-name-wrap">
                  <span className="coin-badge">{coin.symbol.slice(0, 2)}</span>
                  <div>
                    <strong>{coin.symbol}</strong>
                    <small>{coin.name}</small>
                  </div>
                </div>
                <span className={`coin-change ${coin.tone}`}>{coin.change}</span>
              </div>

              <div className="coin-price">{coin.price}</div>

              <div className="coin-meta">
                <span>
                  <label>Market cap</label>
                  <strong>{coin.marketCap}</strong>
                </span>
                <span>
                  <label>Volume</label>
                  <strong>{coin.volume}</strong>
                </span>
                <span>
                  <label>Network</label>
                  <strong>{coin.network}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bottom-grid" id="insights">
        <div className="panel transactions-panel">
          <div className="section-head">
            <div>
              <span className="eyebrow small">Live flow</span>
              <h2>Recent transactions</h2>
            </div>
          </div>

          <div className="tx-table">
            <div className="tx-header">
              <span>Hash</span>
              <span>Time</span>
              <span>Amount</span>
              <span>Status</span>
            </div>

            {transactions.map((tx) => (
              <div key={tx.hash} className="tx-row">
                <span>{tx.hash}</span>
                <span>{tx.time}</span>
                <span>{tx.amount}</span>
                <span className={`status ${tx.status.toLowerCase()}`}>{tx.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel insight-panel">
          <div className="section-head">
            <div>
              <span className="eyebrow small">Operational insight</span>
              <h2>Why SMP works</h2>
            </div>
          </div>

          <ul className="feature-list">
            <li>
              <strong>Unified monitoring</strong>
              <span>Track multi-chain metrics, FX pricing, and session flow from a single control surface.</span>
            </li>
            <li>
              <strong>Real-time visibility</strong>
              <span>Analyze wallet behavior, gas pressure, and market volatility instantly.</span>
            </li>
            <li>
              <strong>Professional navigation</strong>
              <span>Designed to feel like a high-trust market intelligence platform.</span>
            </li>
          </ul>

          <div className="cta-box">
            <p>Ready to launch your blockchain intelligence and FX monitoring experience.</p>
            <button className="primary-button">Deploy on Netlify</button>
          </div>
        </div>
      </section>
    </main>
  );
}
