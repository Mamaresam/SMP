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

const transactions = [
  { hash: '0x5d2c...f14a', time: '2 min ago', amount: '2.88 ETH', status: 'Success' },
  { hash: '0x17a1...0a44', time: '7 min ago', amount: '410 USDT', status: 'Success' },
  { hash: '0x3d8e...992c', time: '14 min ago', amount: '0.64 BTC', status: 'Pending' },
  { hash: '0xc91f...91aa', time: '26 min ago', amount: '12.4 SOL', status: 'Failed' },
];

const chartBars = [52, 72, 36, 88, 55, 96, 70, 82, 63, 94, 58, 78];

export default function Home() {
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
          <a href="#analytics">Analytics</a>
          <a href="#network">Network</a>
          <a href="#insights">Insights</a>
        </nav>

        <button className="primary-button">Launch Dashboard</button>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Built for on-chain clarity</span>
          <h1>Professional blockchain data, made simple.</h1>
          <p>
            Monitor wallet movement, transaction depth, token flows, gas pressure, and market
            sentiment in one streamlined dashboard built for speed and confidence.
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
              <span className="chip live">Live</span>
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
              <span>Track multi-chain metrics from a single control surface.</span>
            </li>
            <li>
              <strong>Real-time visibility</strong>
              <span>Analyze wallet behavior, gas pressure, and volatility instantly.</span>
            </li>
            <li>
              <strong>Professional navigation</strong>
              <span>Designed to feel like a high-trust market intelligence product.</span>
            </li>
          </ul>

          <div className="cta-box">
            <p>Ready to launch your blockchain intelligence experience.</p>
            <button className="primary-button">Deploy on Netlify</button>
          </div>
        </div>
      </section>
    </main>
  );
}
