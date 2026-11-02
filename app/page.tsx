@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

:root {
  --bg: #07111f;
  --bg-2: #0c1424;
  --panel: rgba(13, 21, 35, 0.86);
  --panel-strong: rgba(9, 16, 28, 0.94);
  --panel-alt: rgba(17, 27, 41, 0.85);
  --line: rgba(148, 163, 184, 0.14);
  --line-strong: rgba(148, 163, 184, 0.25);
  --text: #edf5ff;
  --muted: #9aaccc;
  --primary: #6fe7c8;
  --primary-2: #7aa9ff;
  --blue: #78a9ff;
  --purple: #9d7cf2;
  --amber: #f5c76d;
  --green: #61e6a7;
  --red: #ff7d7d;
  --shadow: 0 30px 80px rgba(5, 10, 18, 0.68);
  --glow: rgba(111, 231, 200, 0.24);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  background:
    radial-gradient(circle at top left, rgba(90, 168, 255, 0.2), transparent 28%),
    radial-gradient(circle at top right, rgba(111, 231, 200, 0.16), transparent 28%),
    linear-gradient(180deg, #050b15 0%, #07111f 36%, #091827 100%);
  color: var(--text);
}

button,
input,
select {
  font: inherit;
}

a {
  color: inherit;
  text-decoration: none;
}

img {
  max-width: 100%;
  display: block;
}

.page-shell {
  width: min(1280px, calc(100% - 36px));
  margin: 26px auto 48px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 18px 20px;
  border-radius: 20px;
  background: rgba(8, 14, 24, 0.8);
  border: 1px solid var(--line);
  backdrop-filter: blur(14px);
  box-shadow: var(--shadow);
  position: sticky;
  top: 18px;
  z-index: 20;
}

.brand-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-mark {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary), var(--primary-2));
  color: #081621;
  font-weight: 800;
  font-size: 1.3rem;
}

.brand-name {
  display: block;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.brand-group small {
  display: block;
  color: var(--muted);
  font-size: 11px;
  margin-top: 2px;
}

.nav {
  display: flex;
  align-items: center;
  gap: 28px;
  color: var(--muted);
  font-size: 0.92rem;
}

.nav a {
  transition: color 0.2s ease;
}

.nav a:hover {
  color: var(--text);
}

.primary-button,
.secondary-button,
.ghost-button {
  border: 0;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease, border-color 0.2s ease;
}

.primary-button:hover,
.secondary-button:hover,
.ghost-button:hover {
  transform: translateY(-1px);
}

.primary-button {
  background: linear-gradient(135deg, var(--primary), var(--primary-2));
  color: #07111f;
  padding: 12px 18px;
  box-shadow: 0 14px 24px rgba(111, 231, 200, 0.2);
}

.secondary-button,
.ghost-button {
  background: rgba(255, 255, 255, 0.02);
  color: var(--text);
  border: 1px solid var(--line-strong);
  padding: 12px 18px;
}

.ghost-button {
  padding: 9px 12px;
  font-size: 0.8rem;
}

.hero {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 24px;
  margin-top: 28px;
  align-items: stretch;
}

.hero-copy,
.hero-panel,
.panel,
.stat-card {
  background: rgba(11, 18, 31, 0.82);
  border: 1px solid var(--line);
  border-radius: 24px;
  box-shadow: var(--shadow);
}

.hero-copy {
  padding: 36px 32px;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(111, 231, 200, 0.08);
  border: 1px solid rgba(111, 231, 200, 0.22);
  color: var(--primary);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.eyebrow.small {
  letter-spacing: 0.06em;
  padding: 6px 10px;
  font-size: 0.68rem;
}

.hero-copy h1 {
  margin: 18px 0 18px;
  font-size: clamp(2.75rem, 4vw, 5rem);
  line-height: 1.04;
  letter-spacing: -0.06em;
}

.hero-copy p {
  margin: 0;
  max-width: 620px;
  color: var(--muted);
  font-size: 1.08rem;
  line-height: 1.7;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 26px;
}

.trust-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-top: 32px;
  padding-top: 22px;
  border-top: 1px solid var(--line);
}

.trust-row div {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.trust-row strong {
  font-size: 1.4rem;
  letter-spacing: -0.04em;
}

.trust-row span {
  color: var(--muted);
  font-size: 0.8rem;
}

.hero-panel {
  padding: 22px 22px 18px;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 6px 9px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.chip.live {
  color: #07111f;
  background: linear-gradient(135deg, var(--primary), var(--primary-2));
}

.panel-header h3 {
  margin: 10px 0 0;
  font-size: 1.35rem;
  letter-spacing: -0.04em;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  padding: 7px 10px;
  border-radius: 999px;
  background: rgba(97, 230, 167, 0.12);
  border: 1px solid rgba(97, 230, 167, 0.28);
  color: var(--green);
  font-size: 0.72rem;
  font-weight: 700;
}

.chart-wrap {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 10px;
  height: 190px;
  margin-top: 22px;
  padding: 18px 12px 12px;
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(120, 169, 255, 0.06), rgba(15, 29, 42, 0.1));
  border: 1px solid rgba(148, 163, 184, 0.08);
}

.chart-wrap span {
  display: block;
  width: 100%;
  border-radius: 999px 999px 0 0;
  background: linear-gradient(180deg, var(--primary), var(--primary-2));
  box-shadow: 0 10px 18px rgba(111, 231, 200, 0.2);
}

.panel-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}

.panel-metrics div {
  padding: 14px 12px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.02);
}

.panel-metrics label {
  display: block;
  color: var(--muted);
  font-size: 0.72rem;
  margin-bottom: 8px;
}

.panel-metrics strong {
  font-size: 1.1rem;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-top: 26px;
}

.stat-card {
  padding: 18px 18px 16px;
}

.stat-card small {
  display: block;
  color: var(--muted);
  font-size: 0.8rem;
}

.stat-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 20px;
}

.stat-row strong {
  font-size: clamp(1.3rem, 2vw, 2rem);
  letter-spacing: -0.05em;
}

.trend {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 8px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
}

.trend.green {
  background: rgba(97, 230, 167, 0.12);
  color: var(--green);
}

.trend.blue {
  background: rgba(120, 169, 255, 0.12);
  color: var(--blue);
}

.trend.purple {
  background: rgba(157, 124, 242, 0.12);
  color: var(--purple);
}

.trend.amber {
  background: rgba(245, 199, 109, 0.12);
  color: var(--amber);
}

.content-grid,
.bottom-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 20px;
  margin-top: 22px;
}

.panel {
  padding: 22px 22px 18px;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.section-head h2 {
  margin: 8px 0 0;
  font-size: 1.5rem;
  letter-spacing: -0.05em;
}

.market-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.market-row {
  display: grid;
  grid-template-columns: 1.1fr auto auto;
  align-items: center;
  gap: 14px;
  padding: 14px 12px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.02);
}

.asset {
  display: flex;
  align-items: center;
  gap: 12px;
}

.asset-badge {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(111, 231, 200, 0.18), rgba(122, 169, 255, 0.24));
  color: var(--text);
  font-weight: 700;
  font-size: 0.8rem;
}

.asset strong {
  display: block;
  margin-bottom: 4px;
}

.asset small {
  color: var(--muted);
}

.tag {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  min-width: 80px;
  padding: 7px 10px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
}

.tag.up,
.tag.bullish {
  background: rgba(97, 230, 167, 0.12);
  color: var(--green);
}

.tag.neutral {
  background: rgba(245, 199, 109, 0.12);
  color: var(--amber);
}

.volume {
  font-size: 0.97rem;
}

.network-visual {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.network-row {
  display: grid;
  grid-template-columns: minmax(120px, 200px) minmax(160px, 1fr) auto;
  align-items: center;
  gap: 14px;
}

.label-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text);
  font-weight: 500;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  box-shadow: 0 0 18px currentColor;
}

.progress-track {
  position: relative;
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.1);
  overflow: hidden;
}

.progress-track span {
  display: block;
  height: 100%;
  border-radius: inherit;
}

.transactions-panel,
.insight-panel {
  min-height: 100%;
}

.tx-table {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tx-header,
.tx-row {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr 0.9fr 0.7fr;
  gap: 8px;
  align-items: center;
}

.tx-header {
  padding: 0 8px 10px;
  color: var(--muted);
  font-size: 0.76rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.tx-row {
  padding: 14px 10px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.02);
  color: var(--text);
  font-size: 0.92rem;
}

.status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  min-width: 70px;
  padding: 7px 9px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
}

.status.success {
  background: rgba(97, 230, 167, 0.12);
  color: var(--green);
}

.status.pending {
  background: rgba(245, 199, 109, 0.12);
  color: var(--amber);
}

.status.failed {
  background: rgba(255, 125, 125, 0.12);
  color: var(--red);
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.feature-list li {
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: 16px 14px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.02);
}

.feature-list strong {
  font-size: 1rem;
}

.feature-list span {
  color: var(--muted);
  line-height: 1.6;
}

.cta-box {
  margin-top: 20px;
  padding: 18px 18px 14px;
  border: 1px solid rgba(111, 231, 200, 0.18);
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(111, 231, 200, 0.08), rgba(122, 169, 255, 0.08));
}

.cta-box p {
  margin: 0 0 14px;
  color: var(--muted);
  line-height: 1.6;
}

@media (max-width: 980px) {
  .hero,
  .content-grid,
  .bottom-grid,
  .stat-grid {
    grid-template-columns: 1fr;
  }

  .nav {
    display: none;
  }
}

@media (max-width: 640px) {
  .page-shell {
    width: min(100% - 20px, 1280px);
    margin-top: 14px;
  }

  .topbar {
    padding: 14px 16px;
  }

  .brand-group {
    min-width: 0;
  }

  .hero-copy,
  .hero-panel,
  .panel,
  .stat-card {
    border-radius: 18px;
  }

  .hero-copy {
    padding: 24px 18px;
  }

  .hero-copy h1 {
    font-size: 2.5rem;
  }

  .hero-actions,
  .trust-row,
  .panel-metrics {
    grid-template-columns: 1fr;
    display: grid;
  }

  .hero-actions {
    grid-template-columns: 1fr;
  }

  .tx-header {
    display: none;
  }

  .tx-row {
    grid-template-columns: 1fr;
    gap: 6px;
  }
}









































































































































































































































































































































































































































































































































































































































































































































































































































