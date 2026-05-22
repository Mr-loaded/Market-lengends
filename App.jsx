import React, { useState, useEffect, useRef, useCallback } from 'react'

const { useState, useEffect, useRef, useCallback } = React;
// ── ANIMATED NUMBER HOOK ───────────────────────────────────────────────────────
function useAnimatedNumber(target, duration = 600) {
    const [display, setDisplay] = useState(target);
    const prev = useRef(target);
    const raf = useRef(null);
    useEffect(() => {
        const start = prev.current;
        const end = target;
        const t0 = performance.now();
        if (start === end) {
            setDisplay(end);
            return;
        }
        cancelAnimationFrame(raf.current);
        function step(now) {
            const p = Math.min((now - t0) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setDisplay(Math.round(start + (end - start) * eased));
            if (p < 1)
                raf.current = requestAnimationFrame(step);
            else
                prev.current = end;
        }
        raf.current = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf.current);
    }, [target, duration]);
    return display;
}
// ── MILESTONE CONFIG ──────────────────────────────────────────────────────────
const MILESTONES = [
    { threshold: 1000000, label: "Millionaire!", emoji: "💰", color: "#f5c842", msg: "You crossed ₦1,000,000 net worth!" },
    { threshold: 10000000, label: "10 Million!", emoji: "🚀", color: "#00e5ff", msg: "₦10M net worth achieved!" },
    { threshold: 50000000, label: "50 Million!", emoji: "🏆", color: "#7c6fdf", msg: "₦50M — IPO territory!" },
    { threshold: 100000000, label: "Centimillionaire!", emoji: "👑", color: "#ff9500", msg: "₦100M net worth legend!" },
    { threshold: 500000000, label: "Half a Billion!", emoji: "🌟", color: "#00ff88", msg: "₦500M — Market Legend!" },
];
// ── THEME ─────────────────────────────────────────────────────────────────────
const T = {
    bg: "#070c18", surface: "#0f1729", card: "#131d30", border: "#1e2d45",
    border2: "#243450", text: "#e8edf5", muted: "#6b7fa0",
    cyan: "#00e5ff", green: "#00ff88", red: "#ff4757", purple: "#7c6fdf",
    gold: "#f5c842", orange: "#ff9500",
};
const D = { br: 10, brs: 6 };
// ── FUNDAMENTAL ANALYSIS ──────────────────────────────────────────────────────
function isGrowing(arr) { for (let i = 1; i < arr.length; i++)
    if (arr[i] <= arr[i - 1])
        return false; return true; }
function computeDCF(fcfe, roe, n = 10) { if (roe <= 0 || fcfe <= 0)
    return 0; let v = 0; for (let t = 1; t <= n; t++)
    v += fcfe / Math.pow(1 + roe, t); return Math.round(v); }
function scoreCompany(c) {
    const criteria = [
        { id: "rev", label: "Revenue growing 5yr", pass: isGrowing(c.revenue5yr) },
        { id: "pft", label: "Profit growing 5yr", pass: isGrowing(c.profit5yr) },
        { id: "ocf", label: "Operating cash flow growing", pass: isGrowing(c.ocf5yr) },
        { id: "moat", label: "Strong economic moat (≥7/10)", pass: c.moatScore >= 7 },
        { id: "roe", label: "ROE ≥ 10%", pass: c.roe >= 0.10 },
        { id: "cr", label: "Current ratio ≥ 1", pass: c.currentRatio >= 1 },
        { id: "dcf", label: "Price ≤ DCF intrinsic value", pass: c.price <= computeDCF(c.fcfe, c.roe, 10) },
    ];
    const score = criteria.filter(x => x.pass).length;
    return { criteria, score, qualified: score >= 5 };
}
// ── ALL STOCKS ────────────────────────────────────────────────────────────────
const ALL_STOCKS = [
    { ticker: "AAPL", name: "Apple Inc.", exchange: "NASDAQ", country: "US", sector: "Tech", basePrice: 182, volatility: 0.018, icon: "ti-brand-apple", revenue5yr: [274, 365, 394, 383, 391], profit5yr: [57, 95, 100, 97, 101], ocf5yr: [104, 122, 130, 122, 132], roe: 0.47, currentRatio: 1.07, fcfe: 95, moatScore: 10, price: 182, moatDesc: "Ecosystem lock-in, App Store, services flywheel." },
    { ticker: "TSLA", name: "Tesla Inc.", exchange: "NASDAQ", country: "US", sector: "Auto", basePrice: 245, volatility: 0.035, icon: "ti-car", revenue5yr: [21, 54, 81, 97, 97], profit5yr: [0.7, 5.5, 12.5, 15, 7], ocf5yr: [5.9, 11, 14.5, 13.6, 8.9], roe: 0.18, currentRatio: 1.73, fcfe: 4.2, moatScore: 7, price: 245, moatDesc: "EV first-mover, Supercharger network, OTA software." },
    { ticker: "NVDA", name: "NVIDIA Corp.", exchange: "NASDAQ", country: "US", sector: "Tech", basePrice: 875, volatility: 0.032, icon: "ti-cpu", revenue5yr: [10, 16, 26, 44, 97], profit5yr: [4.3, 9.7, 16.1, 19.7, 53], ocf5yr: [5, 8, 14, 19, 49], roe: 0.55, currentRatio: 4.17, fcfe: 42, moatScore: 10, price: 875, moatDesc: "CUDA dominance, AI chip monopoly, data center lock-in." },
    { ticker: "AMZN", name: "Amazon.com", exchange: "NASDAQ", country: "US", sector: "Retail", basePrice: 178, volatility: 0.022, icon: "ti-package", revenue5yr: [280, 470, 514, 514, 575], profit5yr: [21, 33, -33, 20, 30], ocf5yr: [67, 83, 46, 54, 85], roe: 0.15, currentRatio: 1.05, fcfe: 38, moatScore: 9, price: 178, moatDesc: "AWS cloud, Prime flywheel, logistics, marketplace." },
    { ticker: "JPM", name: "JPMorgan Chase", exchange: "NYSE", country: "US", sector: "Finance", basePrice: 198, volatility: 0.014, icon: "ti-building-bank", revenue5yr: [119, 121, 128, 132, 158], profit5yr: [29, 37, 38, 36, 49], ocf5yr: [28, 34, 36, 32, 45], roe: 0.15, currentRatio: 1.2, fcfe: 32, moatScore: 8, price: 198, moatDesc: "Banking scale, brand trust, diversified revenue." },
    { ticker: "NFLX", name: "Netflix Inc.", exchange: "NASDAQ", country: "US", sector: "Media", basePrice: 620, volatility: 0.028, icon: "ti-device-tv", revenue5yr: [20, 25, 30, 32, 37], profit5yr: [1.9, 5.1, 4.5, 1.4, 5.4], ocf5yr: [2.4, 7.1, 5.8, 1.6, 6.9], roe: 0.22, currentRatio: 1.25, fcfe: 5.9, moatScore: 7, price: 620, moatDesc: "Content library, global reach, password monetisation." },
    // 🇳🇬 Nigeria NGX
    { ticker: "PRESCO", name: "Presco PLC", exchange: "NGX", country: "NG", sector: "Agriculture", basePrice: 320, volatility: 0.025, icon: "ti-plant", revenue5yr: [22, 28, 35, 42, 58], profit5yr: [5, 8, 11, 16, 24], ocf5yr: [8, 11, 14, 18, 26], roe: 0.28, currentRatio: 1.4, fcfe: 18, moatScore: 8, price: 320, moatDesc: "Dominant palm oil, integrated supply chain, West Africa brand." },
    { ticker: "MTNNG", name: "MTN Nigeria PLC", exchange: "NGX", country: "NG", sector: "Telecom", basePrice: 180, volatility: 0.020, icon: "ti-phone", revenue5yr: [1200, 1450, 1750, 2100, 2550], profit5yr: [200, 280, 350, 420, 510], ocf5yr: [350, 420, 520, 620, 750], roe: 0.35, currentRatio: 1.15, fcfe: 520, moatScore: 9, price: 180, moatDesc: "Largest Nigerian telecom, MoMo fintech, 4G/5G network." },
    { ticker: "OKOMU", name: "Okomu Oil PLC", exchange: "NGX", country: "NG", sector: "Agriculture", basePrice: 290, volatility: 0.022, icon: "ti-droplet", revenue5yr: [18, 24, 31, 38, 50], profit5yr: [6, 9, 13, 18, 26], ocf5yr: [7, 10, 14, 19, 27], roe: 0.32, currentRatio: 1.6, fcfe: 20, moatScore: 8, price: 290, moatDesc: "Low-cost palm oil & rubber, strong export revenues." },
    { ticker: "BETAGLAS", name: "Beta Glass PLC", exchange: "NGX", country: "NG", sector: "Manufacturing", basePrice: 75, volatility: 0.018, icon: "ti-box", revenue5yr: [14, 17, 21, 25, 31], profit5yr: [2, 3, 4.5, 6, 8], ocf5yr: [3, 4, 5.5, 7, 9], roe: 0.22, currentRatio: 1.3, fcfe: 7, moatScore: 7, price: 75, moatDesc: "Only glass container maker in Nigeria, near-monopoly." },
    { ticker: "CADBURY", name: "Cadbury Nigeria PLC", exchange: "NGX", country: "NG", sector: "Consumer", basePrice: 20, volatility: 0.020, icon: "ti-candy", revenue5yr: [40, 46, 54, 63, 75], profit5yr: [2, 3, 4, 5.5, 7], ocf5yr: [3, 4, 5, 6.5, 8], roe: 0.18, currentRatio: 1.2, fcfe: 6, moatScore: 8, price: 20, moatDesc: "Iconic Bournvita brand, Mondelez backing, consumer loyalty." },
    { ticker: "DANGCEM", name: "Dangote Cement PLC", exchange: "NGX", country: "NG", sector: "Construction", basePrice: 350, volatility: 0.016, icon: "ti-building", revenue5yr: [900, 1100, 1350, 1600, 1900], profit5yr: [200, 280, 360, 430, 520], ocf5yr: [280, 360, 460, 540, 650], roe: 0.30, currentRatio: 1.35, fcfe: 480, moatScore: 10, price: 350, moatDesc: "Largest cement producer in Africa, pan-African scale." },
    { ticker: "BUAFOODS", name: "BUA Foods PLC", exchange: "NGX", country: "NG", sector: "Consumer", basePrice: 145, volatility: 0.022, icon: "ti-wheat", revenue5yr: [280, 350, 430, 540, 670], profit5yr: [35, 55, 75, 100, 130], ocf5yr: [45, 65, 90, 120, 155], roe: 0.25, currentRatio: 1.4, fcfe: 110, moatScore: 8, price: 145, moatDesc: "Sugar, flour, pasta dominance, vertical integration." },
    { ticker: "LAFARGE", name: "Lafarge Africa PLC", exchange: "NGX", country: "NG", sector: "Construction", basePrice: 32, volatility: 0.018, icon: "ti-crane", revenue5yr: [190, 230, 285, 340, 410], profit5yr: [15, 28, 42, 58, 78], ocf5yr: [22, 38, 55, 72, 96], roe: 0.20, currentRatio: 1.25, fcfe: 72, moatScore: 7, price: 32, moatDesc: "Holcim backing, wide distribution, brand trust." },
    // 🇬🇭 Ghana GSE
    { ticker: "MTNGH", name: "MTN Ghana PLC", exchange: "GSE", country: "GH", sector: "Telecom", basePrice: 1.8, volatility: 0.022, icon: "ti-phone", revenue5yr: [4200, 5100, 6300, 7800, 9200], profit5yr: [620, 810, 1050, 1300, 1580], ocf5yr: [900, 1150, 1450, 1800, 2200], roe: 0.32, currentRatio: 1.2, fcfe: 1600, moatScore: 9, price: 1.8, moatDesc: "Dominant telecom in Ghana, MoMo leadership, 4G coverage." },
    { ticker: "GCB", name: "GCB Bank PLC", exchange: "GSE", country: "GH", sector: "Finance", basePrice: 5.2, volatility: 0.018, icon: "ti-building-bank", revenue5yr: [820, 950, 1100, 1280, 1490], profit5yr: [180, 220, 270, 330, 400], ocf5yr: [250, 300, 370, 450, 540], roe: 0.20, currentRatio: 1.3, fcfe: 360, moatScore: 7, price: 5.2, moatDesc: "Largest bank by branches in Ghana, strong retail presence." },
    { ticker: "TOTAL", name: "TotalEnergies Mktg Ghana", exchange: "GSE", country: "GH", sector: "Energy", basePrice: 3.9, volatility: 0.020, icon: "ti-flame", revenue5yr: [1100, 1350, 1680, 2050, 2500], profit5yr: [85, 110, 145, 185, 230], ocf5yr: [120, 155, 200, 255, 315], roe: 0.18, currentRatio: 1.15, fcfe: 210, moatScore: 7, price: 3.9, moatDesc: "TotalEnergies backing, fuel retail network across Ghana." },
    // 🇰🇪 Kenya NSE
    { ticker: "SCOM", name: "Safaricom PLC", exchange: "NSE", country: "KE", sector: "Telecom", basePrice: 16.5, volatility: 0.022, icon: "ti-phone", revenue5yr: [210, 240, 275, 315, 365], profit5yr: [62, 72, 84, 98, 115], ocf5yr: [88, 102, 120, 140, 165], roe: 0.36, currentRatio: 1.1, fcfe: 120, moatScore: 10, price: 16.5, moatDesc: "M-Pesa monopoly, 40M+ users, irreplaceable fintech infrastructure." },
    { ticker: "EQTY", name: "Equity Group Holdings", exchange: "NSE", country: "KE", sector: "Finance", basePrice: 42, volatility: 0.018, icon: "ti-building-bank", revenue5yr: [52, 63, 76, 91, 109], profit5yr: [16, 20, 24, 29, 35], ocf5yr: [22, 28, 34, 41, 49], roe: 0.22, currentRatio: 1.25, fcfe: 38, moatScore: 8, price: 42, moatDesc: "Pan-African bank, largest by customers in East Africa." },
    { ticker: "KCB", name: "KCB Group PLC", exchange: "NSE", country: "KE", sector: "Finance", basePrice: 36, volatility: 0.016, icon: "ti-building-bank", revenue5yr: [44, 54, 65, 78, 93], profit5yr: [12, 15, 19, 23, 28], ocf5yr: [17, 22, 27, 33, 40], roe: 0.18, currentRatio: 1.2, fcfe: 30, moatScore: 7, price: 36, moatDesc: "Kenya's largest bank by assets, regional expansion." },
    // 🇿🇦 South Africa JSE
    { ticker: "NPN", name: "Naspers Limited", exchange: "JSE", country: "ZA", sector: "Tech", basePrice: 3200, volatility: 0.028, icon: "ti-brand-tencent", revenue5yr: [140, 155, 172, 188, 207], profit5yr: [18, 22, 25, 29, 33], ocf5yr: [25, 30, 35, 41, 48], roe: 0.14, currentRatio: 1.4, fcfe: 38, moatScore: 9, price: 3200, moatDesc: "Tencent stake, Prosus portfolio, African internet giant." },
    { ticker: "SBK", name: "Standard Bank Group", exchange: "JSE", country: "ZA", sector: "Finance", basePrice: 185, volatility: 0.016, icon: "ti-building-bank", revenue5yr: [85, 95, 108, 122, 138], profit5yr: [22, 26, 31, 37, 43], ocf5yr: [30, 36, 43, 52, 61], roe: 0.16, currentRatio: 1.3, fcfe: 48, moatScore: 8, price: 185, moatDesc: "Africa's largest bank by assets, 20-country footprint." },
    { ticker: "TBS", name: "Tiger Brands Limited", exchange: "JSE", country: "ZA", sector: "Consumer", basePrice: 165, volatility: 0.018, icon: "ti-wheat", revenue5yr: [32, 35, 38, 42, 46], profit5yr: [3.2, 3.8, 4.5, 5.3, 6.2], ocf5yr: [4.5, 5.2, 6.1, 7.2, 8.4], roe: 0.15, currentRatio: 1.35, fcfe: 6.8, moatScore: 7, price: 165, moatDesc: "Dominant FMCG brands across Africa — Albany, Tastic, Koo." },
];
ALL_STOCKS.forEach(s => { s.analysis = scoreCompany(s); });
const QUALIFIED = ALL_STOCKS.filter(s => s.analysis.qualified);
// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const REG_COST = 9500;
const START_CASH = 10000;
const TAX_RATE = 0.40;
const VALUATION_UNLOCK = 50000000;
// ── EXCHANGE FLAGS ────────────────────────────────────────────────────────────
const EXCHANGE_FLAG = { NASDAQ: "🇺🇸", NYSE: "🇺🇸", NGX: "🇳🇬", GSE: "🇬🇭", NSE: "🇰🇪", JSE: "🇿🇦" };
const EXCHANGE_COLOR = { NASDAQ: T.cyan, NYSE: T.cyan, NGX: "#00e5a0", GSE: "#FFD700", NSE: "#FF4500", JSE: "#1DB954" };
// ── LEARNING POOL — 1000 LESSONS + QUIZZES ───────────────────────────────────
// Pool of lessons organised by topic. Each entry has a lesson card + timed quiz.
// Topics: Stock Market Investing, Taxation, Business Management, IPO, DCF Valuation
const RAW_POOL = [
    // ── STOCK MARKET INVESTING ─────────────────────────────────────────────────
    { topic: "Stocks", lesson: { title: "What is a Stock?", body: "A stock is a share of ownership in a company. When you buy a stock, you become a part-owner (shareholder) and are entitled to a portion of the company's profits and assets." }, quiz: { q: "What does owning a stock mean?", o: ["You lend money to a company", "You own a piece of a company", "You are an employee", "You get a fixed interest payment"], a: 1 } },
    { topic: "Stocks", lesson: { title: "Common vs Preferred Shares", body: "Common shares give voting rights but dividends vary. Preferred shares have fixed dividends and priority over common shareholders in liquidation, but usually no voting rights." }, quiz: { q: "Which share class usually has voting rights?", o: ["Preferred shares", "Bonds", "Common shares", "Treasury bills"], a: 2 } },
    { topic: "Stocks", lesson: { title: "What is a Dividend?", body: "A dividend is a portion of a company's profit paid to shareholders. It can be paid quarterly, semi-annually, or annually. Not all companies pay dividends — growth companies often reinvest profits instead." }, quiz: { q: "Which type of company is LEAST likely to pay dividends?", o: ["A mature utility company", "A high-growth tech startup", "A bank", "An oil company"], a: 1 } },
    { topic: "Stocks", lesson: { title: "Market Capitalisation", body: "Market cap = Share Price × Total Shares Outstanding. It classifies companies: Large Cap (>$10B), Mid Cap ($2B–$10B), Small Cap (<$2B). Larger caps are generally more stable but slower growing." }, quiz: { q: "A company has 500M shares at $20 each. What is its market cap?", o: ["$10B", "$500M", "$20B", "$1B"], a: 0 } },
    { topic: "Stocks", lesson: { title: "Bull vs Bear Markets", body: "A bull market is when prices rise 20%+ from recent lows. A bear market is when prices fall 20%+ from recent highs. Bull markets reward holding; bear markets reward patience and cash reserves." }, quiz: { q: "A bear market is defined as a drop of at least?", o: ["5%", "10%", "20%", "50%"], a: 2 } },
    { topic: "Stocks", lesson: { title: "Stock Exchanges", body: "Stock exchanges are organised markets where shares are bought and sold. Major exchanges include NYSE, NASDAQ (US), NGX (Nigeria), NSE (Kenya), GSE (Ghana), and JSE (South Africa)." }, quiz: { q: "Which exchange is Nigeria's primary stock market?", o: ["NYSE", "JSE", "NGX", "GSE"], a: 2 } },
    { topic: "Stocks", lesson: { title: "What is a Stock Index?", body: "A stock index tracks a basket of stocks to represent market performance. Examples: S&P 500 (top 500 US companies), Dow Jones (30 large US companies), NGX All-Share Index (Nigeria)." }, quiz: { q: "The S&P 500 tracks how many companies?", o: ["30", "100", "500", "1000"], a: 2 } },
    { topic: "Stocks", lesson: { title: "Price-to-Earnings (P/E) Ratio", body: "P/E Ratio = Share Price ÷ Earnings Per Share. A high P/E means the market expects high future growth. A low P/E may indicate undervaluation or weak prospects. Always compare within the same industry." }, quiz: { q: "A stock trades at $100 and earns $5 per share. What is its P/E?", o: ["5", "10", "20", "50"], a: 2 } },
    { topic: "Stocks", lesson: { title: "Earnings Per Share (EPS)", body: "EPS = Net Profit ÷ Total Shares Outstanding. It shows how much profit is attributed to each share. Rising EPS over time is a strong indicator of business health and investor returns." }, quiz: { q: "A company earns $50M profit with 10M shares. What is EPS?", o: ["$0.50", "$5", "$50", "$500"], a: 1 } },
    { topic: "Stocks", lesson: { title: "Price-to-Book (P/B) Ratio", body: "P/B = Market Price ÷ Book Value Per Share. Book value is assets minus liabilities. A P/B below 1 may mean the stock is undervalued. Banks and financial firms are often valued by P/B." }, quiz: { q: "A P/B ratio below 1 generally suggests?", o: ["Overvaluation", "Undervaluation", "High growth", "High debt"], a: 1 } },
    { topic: "Stocks", lesson: { title: "Dividend Yield", body: "Dividend Yield = Annual Dividend ÷ Share Price × 100. It shows income earned relative to the stock price. A 5% yield means you earn $5 annually for every $100 invested in that stock." }, quiz: { q: "A stock pays $3 annual dividend and trades at $60. What is the yield?", o: ["3%", "5%", "10%", "20%"], a: 1 } },
    { topic: "Stocks", lesson: { title: "Volume and Liquidity", body: "Volume is the number of shares traded in a period. High volume = high liquidity, meaning you can buy/sell quickly without affecting the price. Low-volume stocks can be hard to exit during market stress." }, quiz: { q: "High trading volume generally indicates?", o: ["Low interest", "High liquidity", "High price", "Low supply"], a: 1 } },
    { topic: "Stocks", lesson: { title: "52-Week High and Low", body: "The 52-week high and low show the price range over the past year. A stock near its 52-week low may be undervalued — or struggling. Context from fundamentals is needed before concluding." }, quiz: { q: "A stock's 52-week high is $200. It currently trades at $60. This could mean?", o: ["It's definitely a buy", "It's overvalued", "It may be undervalued or in trouble", "Nothing significant"], a: 2 } },
    { topic: "Stocks", lesson: { title: "Short Selling", body: "Short selling is borrowing shares, selling them, and hoping to buy them back cheaper later. It profits from price drops. It's high risk — if the price rises, losses can be unlimited." }, quiz: { q: "Short selling profits when stock prices?", o: ["Rise", "Fall", "Stay the same", "Pay dividends"], a: 1 } },
    { topic: "Stocks", lesson: { title: "Stock Splits", body: "A stock split increases the number of shares while reducing the price proportionally. A 2-for-1 split: if you owned 100 shares at $200, you now own 200 shares at $100. Market cap is unchanged." }, quiz: { q: "After a 4-for-1 split, a $400 stock becomes?", o: ["$100", "$200", "$1600", "$40"], a: 0 } },
    { topic: "Stocks", lesson: { title: "Blue Chip Stocks", body: "Blue chip stocks are shares of large, well-established, financially stable companies with a long track record. Examples: Dangote Cement, MTN, Apple, JPMorgan. They offer stability, often with dividends." }, quiz: { q: "Which characteristic best defines a blue chip stock?", o: ["High volatility", "Recently listed", "Established, financially stable company", "Low market cap"], a: 2 } },
    { topic: "Stocks", lesson: { title: "Growth vs Value Stocks", body: "Growth stocks are expected to grow faster than average (e.g. NVDA). Value stocks trade below their intrinsic value (e.g. undervalued banks). Growth stocks rarely pay dividends; value stocks often do." }, quiz: { q: "Which stock type is more likely to reinvest all profits?", o: ["Value", "Dividend", "Growth", "Index"], a: 2 } },
    { topic: "Stocks", lesson: { title: "Penny Stocks", body: "Penny stocks trade at very low prices (under $5 or equivalent). They have low liquidity, high volatility, and are prone to manipulation. They're extremely high risk and unsuitable for most investors." }, quiz: { q: "Penny stocks are considered?", o: ["Safe and stable", "High risk and volatile", "Blue chip investments", "Good for beginners"], a: 1 } },
    { topic: "Stocks", lesson: { title: "Sector Diversification", body: "Investing across different sectors (tech, finance, energy, consumer goods) reduces risk. If tech crashes, your energy stocks may hold. Diversification is the only free lunch in investing." }, quiz: { q: "Why should investors diversify across sectors?", o: ["To increase volatility", "To reduce overall portfolio risk", "To maximise returns from one sector", "To simplify tracking"], a: 1 } },
    { topic: "Stocks", lesson: { title: "Stock Buybacks", body: "A buyback is when a company repurchases its own shares from the market. This reduces the number of shares outstanding, increasing EPS and share price. It signals management confidence in the company." }, quiz: { q: "A stock buyback typically does what to EPS?", o: ["Decreases it", "Keeps it the same", "Increases it", "Eliminates it"], a: 2 } },
    { topic: "Stocks", lesson: { title: "Rights Issues", body: "A rights issue is when a company offers existing shareholders the right to buy new shares at a discount. It raises capital but dilutes existing shareholders if they don't participate." }, quiz: { q: "A rights issue primarily helps a company?", o: ["Pay dividends", "Raise new capital", "Reduce share count", "Delist from exchange"], a: 1 } },
    { topic: "Stocks", lesson: { title: "Market Sentiment", body: "Market sentiment is the overall attitude of investors toward a market or stock. Fear drives selling (bear markets); greed drives buying (bull markets). The Fear & Greed Index measures this." }, quiz: { q: "When investors are fearful, markets tend to?", o: ["Rise sharply", "Fall or remain depressed", "Stay unchanged", "Split shares"], a: 1 } },
    { topic: "Stocks", lesson: { title: "Stop-Loss Orders", body: "A stop-loss is an instruction to sell a stock if it falls to a set price. It limits downside risk. Example: you buy at $100 and set a stop-loss at $80 — you won't lose more than 20%." }, quiz: { q: "A stop-loss order is designed to?", o: ["Maximise profits", "Limit potential losses", "Guarantee a price", "Buy more shares"], a: 1 } },
    { topic: "Stocks", lesson: { title: "Dollar Cost Averaging", body: "DCA is investing a fixed amount regularly regardless of price. When prices are low, you buy more shares; when high, fewer. Over time, this reduces the impact of volatility on your average cost." }, quiz: { q: "Dollar cost averaging is best suited for?", o: ["Day traders", "Short-term speculators", "Long-term regular investors", "IPO investors"], a: 2 } },
    { topic: "Stocks", lesson: { title: "Portfolio Rebalancing", body: "Rebalancing means adjusting your portfolio back to your target allocation after market movements. If stocks outperform and become 80% of your portfolio when you wanted 60%, you sell some to rebalance." }, quiz: { q: "Why do investors rebalance their portfolios?", o: ["To time the market", "To maintain their target risk level", "To chase performance", "To avoid dividends"], a: 1 } },
    { topic: "Stocks", lesson: { title: "Technical vs Fundamental Analysis", body: "Fundamental analysis values companies using financial data (earnings, assets, cash flow). Technical analysis studies price charts and patterns. Most successful long-term investors use fundamentals; traders use technicals." }, quiz: { q: "Which analysis studies a company's financial statements?", o: ["Technical analysis", "Chart analysis", "Fundamental analysis", "Sentiment analysis"], a: 2 } },
    { topic: "Stocks", lesson: { title: "Insider Trading", body: "Insider trading is buying or selling stocks based on material, non-public information. It's illegal and undermines market fairness. Company insiders (executives, directors) must report their trades publicly." }, quiz: { q: "Insider trading is illegal because?", o: ["It always loses money", "It creates unfair advantage using secret information", "It involves foreign companies", "It avoids taxes"], a: 1 } },
    { topic: "Stocks", lesson: { title: "Emerging Market Stocks", body: "Emerging markets (Nigeria, Kenya, Ghana, South Africa) offer higher growth potential but also higher risk — currency volatility, political risk, and less regulatory protection compared to developed markets." }, quiz: { q: "Emerging market stocks generally offer?", o: ["Lower risk, lower return", "Higher risk, higher potential return", "Guaranteed dividends", "Fixed interest rates"], a: 1 } },
    { topic: "Stocks", lesson: { title: "ETFs vs Individual Stocks", body: "An ETF (Exchange-Traded Fund) holds a basket of stocks and trades like a single stock. It offers instant diversification at low cost. Individual stocks offer higher potential returns but concentrated risk." }, quiz: { q: "A key advantage of ETFs over individual stocks is?", o: ["Higher potential returns", "Instant diversification", "Guaranteed dividends", "No trading fees"], a: 1 } },
    { topic: "Stocks", lesson: { title: "Compound Returns", body: "Compound returns mean earning returns on your returns. $1,000 at 15% annual return becomes $4,046 in 10 years. The longer you stay invested, the more powerful compounding becomes." }, quiz: { q: "$1,000 invested at 10% annual return for 2 years gives?", o: ["$1,200", "$1,210", "$1,100", "$2,000"], a: 1 } },
    { topic: "Stocks", lesson: { title: "Current Ratio", body: "Current Ratio = Current Assets ÷ Current Liabilities. It measures a company's ability to pay short-term debts. A ratio above 1.0 means the company can cover its short-term obligations." }, quiz: { q: "A current ratio of 0.8 means?", o: ["Strong liquidity", "The company may struggle to meet short-term debts", "Very high profitability", "Low debt"], a: 1 } },
    // ── DCF VALUATION ─────────────────────────────────────────────────────────
    { topic: "DCF", lesson: { title: "What is Discounted Cash Flow?", body: "DCF is a valuation method that estimates the present value of a company based on its expected future cash flows, discounted back to today using a required rate of return. It answers: what is this business worth today?" }, quiz: { q: "The DCF method estimates?", o: ["Past earnings", "Future dividends only", "Present value of future cash flows", "Book value of assets"], a: 2 } },
    { topic: "DCF", lesson: { title: "Free Cash Flow to Equity (FCFE)", body: "FCFE = Net Income + Depreciation – Capital Expenditure – Change in Working Capital + Net Borrowing. It is the cash available to equity shareholders after all obligations are met." }, quiz: { q: "FCFE represents cash available to?", o: ["Debt holders", "The government", "Equity shareholders", "Bond investors"], a: 2 } },
    { topic: "DCF", lesson: { title: "Discount Rate", body: "The discount rate in DCF is the required rate of return — often the company's ROE or WACC. A higher discount rate means future cash flows are worth less today, leading to a lower intrinsic value." }, quiz: { q: "Increasing the discount rate in a DCF model does what to intrinsic value?", o: ["Increases it", "Decreases it", "Has no effect", "Doubles it"], a: 1 } },
    { topic: "DCF", lesson: { title: "Terminal Value", body: "Terminal value captures the value of all cash flows beyond the explicit forecast period (usually 10 years). It often represents 60–80% of total DCF value. It's calculated using the Gordon Growth Model: CF/(r–g)." }, quiz: { q: "Terminal value in DCF captures?", o: ["Only the first year", "Cash flows in the forecast period", "Cash flows beyond the forecast period", "Annual dividends"], a: 2 } },
    { topic: "DCF", lesson: { title: "DCF Formula in This Game", body: "In Market Legends, intrinsic value = Σ FCFE/(1+ROE)^t for t=1 to 10 years. If the current market price is below this intrinsic value, the stock passes criterion 7 and may be a good investment." }, quiz: { q: "In our 7-criteria system, a stock passes DCF criterion when?", o: ["Market price > intrinsic value", "Market price = intrinsic value", "Market price < intrinsic value", "FCFE is negative"], a: 2 } },
    { topic: "DCF", lesson: { title: "Sensitivity Analysis in DCF", body: "DCF outputs change significantly with small input changes. Sensitivity analysis tests different growth rates and discount rates to understand the range of possible values. A good analyst always checks the sensitivity." }, quiz: { q: "Sensitivity analysis in DCF tests?", o: ["Only one scenario", "Impact of changing assumptions on value", "Historical performance", "Dividend yields"], a: 1 } },
    { topic: "DCF", lesson: { title: "WACC — Weighted Average Cost of Capital", body: "WACC is the blended cost of financing a company using both debt and equity. It's used as the discount rate in enterprise DCF models. Lower WACC = lower cost of capital = higher intrinsic value." }, quiz: { q: "A lower WACC generally leads to?", o: ["Lower intrinsic value", "Higher intrinsic value", "No change in value", "Higher debt"], a: 1 } },
    { topic: "DCF", lesson: { title: "Margin of Safety", body: "Margin of safety = buying a stock significantly below its intrinsic DCF value. Warren Buffett recommends at least 20–30% below intrinsic value. It protects against DCF estimation errors." }, quiz: { q: "A 30% margin of safety means buying at?", o: ["30% above intrinsic value", "Equal to intrinsic value", "30% below intrinsic value", "30% above market price"], a: 2 } },
    { topic: "DCF", lesson: { title: "Consistency of FCFE", body: "A company with consistently growing FCFE over 5+ years is more reliable in DCF projections. Erratic or negative FCFE makes DCF unreliable. Always verify FCFE against the cash flow statement." }, quiz: { q: "Why is consistent FCFE growth important for DCF?", o: ["It increases share price", "It makes future projections more reliable", "It reduces taxes", "It improves dividends"], a: 1 } },
    { topic: "DCF", lesson: { title: "Gordon Growth Model", body: "Gordon Growth Model: Value = Dividend/(r–g). Where r is required return and g is dividend growth rate. It's a simplified version of DCF for stable dividend-paying companies. Only valid when g < r." }, quiz: { q: "Gordon Growth Model is most suitable for?", o: ["High-growth startups", "Stable dividend-paying companies", "Companies with no profit", "IPO candidates"], a: 1 } },
    // ── TAXATION ──────────────────────────────────────────────────────────────
    { topic: "Tax", lesson: { title: "What is Income Tax?", body: "Income tax is a percentage of income paid to the government. For individuals, it's levied on earnings. In Market Legends, unregistered individuals pay a flat 40% on all driving income immediately upon exit." }, quiz: { q: "In Market Legends, an unregistered individual pays what tax rate on driving income?", o: ["20%", "30%", "40%", "50%"], a: 2 } },
    { topic: "Tax", lesson: { title: "Corporate Tax vs Personal Tax", body: "Corporate tax is levied on company profits after expenses. Personal income tax is levied on individual earnings. Corporations pay tax on net profit; individuals (unregistered) pay on gross income." }, quiz: { q: "Corporate tax is applied on?", o: ["Gross revenue", "Net profit after expenses", "All dividends paid", "Total assets"], a: 1 } },
    { topic: "Tax", lesson: { title: "Tax Deductible Expenses", body: "Deductible expenses reduce your taxable income. Examples: staff salaries, office rent, R&D, debt repayment, depreciation. The more legitimate expenses you deduct, the less tax you pay." }, quiz: { q: "Which of these is a tax-deductible business expense?", o: ["Personal holiday", "Staff salaries", "Owner's car (personal use)", "Fines and penalties"], a: 1 } },
    { topic: "Tax", lesson: { title: "VAT — Value Added Tax", body: "VAT is a consumption tax added to goods and services at each stage of production. Businesses collect VAT on behalf of the government. In Nigeria, the standard VAT rate is 7.5%." }, quiz: { q: "VAT is charged on?", o: ["Company profits", "Goods and services consumed", "Shareholder dividends", "Capital gains"], a: 1 } },
    { topic: "Tax", lesson: { title: "Capital Gains Tax", body: "Capital gains tax is levied on profit from selling an asset (stock, property, business). Long-term gains (held >1 year) are often taxed at lower rates. Short-term gains are taxed as income." }, quiz: { q: "Capital gains tax applies when you?", o: ["Receive a salary", "Sell an asset for a profit", "Pay dividends", "Take out a loan"], a: 1 } },
    { topic: "Tax", lesson: { title: "Withholding Tax", body: "Withholding tax is deducted at the source of payment — the payer remits it directly to the government. In Nigeria, dividends are subject to 10% withholding tax. It prevents tax evasion." }, quiz: { q: "Withholding tax on dividends in Nigeria is?", o: ["5%", "7.5%", "10%", "15%"], a: 2 } },
    { topic: "Tax", lesson: { title: "Tax Avoidance vs Tax Evasion", body: "Tax avoidance is legally reducing your tax bill through planning (e.g. claiming deductions). Tax evasion is illegally hiding income or lying to the tax authority. One is legal; the other is a criminal offence." }, quiz: { q: "Which practice is legal?", o: ["Tax evasion", "Hiding income", "Tax avoidance through legitimate deductions", "Falsifying records"], a: 2 } },
    { topic: "Tax", lesson: { title: "Company Registration and Tax Benefits", body: "Registering a company allows you to deduct business expenses, access lower corporate tax rates, and separate personal from business tax. In Market Legends, registered companies pay only 30% — and only above $500K." }, quiz: { q: "In Market Legends, registered companies pay 30% tax only when taxable income is?", o: ["Above $100K", "Above $500K", "Above $1M", "On all income"], a: 1 } },
    { topic: "Tax", lesson: { title: "Depreciation as a Tax Shield", body: "Depreciation reduces taxable income. A $100K machine depreciated at 10%/year reduces taxable profit by $10K annually. This is a non-cash deduction — real tax savings without a cash outflow." }, quiz: { q: "Depreciation reduces?", o: ["Revenue", "Taxable income", "Cash balance", "Dividends"], a: 1 } },
    { topic: "Tax", lesson: { title: "Double Taxation", body: "Double taxation occurs when income is taxed twice — once at the corporate level and again when dividends are paid to shareholders. Many countries offer tax credits to reduce this burden." }, quiz: { q: "Double taxation affects?", o: ["Sole proprietors only", "Corporate profits taxed then dividends taxed again", "Capital gains", "VAT returns"], a: 1 } },
    { topic: "Tax", lesson: { title: "Tax Loss Harvesting", body: "Tax loss harvesting is selling losing investments to offset capital gains tax on winning investments. If you gained $50K on NVDA and lost $20K on TSLA, you only pay tax on $30K net gain." }, quiz: { q: "Tax loss harvesting offsets?", o: ["Salary tax", "Capital gains tax", "VAT", "Withholding tax"], a: 1 } },
    { topic: "Tax", lesson: { title: "PAYE — Pay As You Earn", body: "PAYE is a system where employers deduct income tax from employee salaries before paying them. The employer remits directly to the tax authority. It ensures timely collection and reduces evasion." }, quiz: { q: "Under PAYE, who deducts income tax?", o: ["The employee", "The tax authority", "The employer", "The bank"], a: 2 } },
    { topic: "Tax", lesson: { title: "Transfer Pricing", body: "Transfer pricing refers to prices set for transactions between related companies (e.g. parent and subsidiary). Tax authorities scrutinise these to prevent profit shifting to low-tax jurisdictions." }, quiz: { q: "Transfer pricing is scrutinised to prevent?", o: ["Excess dividends", "Profit shifting to lower tax countries", "High VAT rates", "Insider trading"], a: 1 } },
    { topic: "Tax", lesson: { title: "Tax Incentives for Businesses", body: "Governments offer tax incentives to attract investment: pioneer status (tax holiday for new businesses), investment allowances, and export incentives. In Nigeria, pioneer companies can get 3–5 years tax-free." }, quiz: { q: "Pioneer status in Nigeria provides?", o: ["Higher tax rates", "Permanent tax exemption", "Tax holiday for qualifying new businesses", "Free government loans"], a: 2 } },
    { topic: "Tax", lesson: { title: "Effective vs Marginal Tax Rate", body: "The marginal rate is the tax rate on your next dollar of income. The effective rate is total tax paid ÷ total income — your actual average rate. Effective rate is always ≤ marginal rate." }, quiz: { q: "If you pay $30K tax on $200K income, what is your effective rate?", o: ["30%", "15%", "20%", "10%"], a: 1 } },
    // ── BUSINESS MANAGEMENT ───────────────────────────────────────────────────
    { topic: "Business", lesson: { title: "What is Working Capital?", body: "Working Capital = Current Assets – Current Liabilities. It's the funds available for day-to-day operations. Positive working capital means you can pay bills; negative means you may struggle operationally." }, quiz: { q: "A company has current assets of $500K and current liabilities of $300K. Working capital is?", o: ["$800K", "$200K", "$300K", "$150K"], a: 1 } },
    { topic: "Business", lesson: { title: "Gross Profit Margin", body: "Gross Profit Margin = (Revenue – Cost of Goods Sold) ÷ Revenue × 100. It shows what percentage of revenue remains after production costs. Higher margins indicate better pricing power or lower production costs." }, quiz: { q: "Revenue $1M, COGS $600K. What is the gross profit margin?", o: ["60%", "40%", "30%", "70%"], a: 1 } },
    { topic: "Business", lesson: { title: "EBITDA", body: "EBITDA = Earnings Before Interest, Tax, Depreciation, and Amortisation. It measures core operational profitability, ignoring financing and accounting decisions. Widely used for comparing companies across industries." }, quiz: { q: "EBITDA is useful because it?", o: ["Includes debt interest", "Measures core operating performance independent of financing", "Shows dividend payments", "Reflects tax rates"], a: 1 } },
    { topic: "Business", lesson: { title: "Debt-to-Equity Ratio", body: "D/E = Total Debt ÷ Total Equity. It shows how much debt a company uses relative to equity. A high D/E means higher financial risk. A D/E above 2 may signal excessive leverage for most industries." }, quiz: { q: "A D/E ratio of 3 suggests?", o: ["Very low debt", "Moderate leverage", "High financial risk", "No equity"], a: 2 } },
    { topic: "Business", lesson: { title: "Net Profit Margin", body: "Net Profit Margin = Net Profit ÷ Revenue × 100. It shows what percentage of revenue becomes actual profit after all expenses. A 20% margin means $0.20 profit for every $1 of revenue." }, quiz: { q: "Revenue $5M, net profit $500K. What is the net margin?", o: ["5%", "10%", "20%", "50%"], a: 1 } },
    { topic: "Business", lesson: { title: "Break-Even Analysis", body: "Break-even point = Fixed Costs ÷ (Selling Price – Variable Cost per unit). It shows how many units must be sold to cover all costs. Below break-even = loss; above = profit." }, quiz: { q: "Fixed costs $100K, price per unit $50, variable cost $30. Break-even units?", o: ["2,000", "5,000", "3,333", "10,000"], a: 1 } },
    { topic: "Business", lesson: { title: "Cash Flow vs Profit", body: "A company can be profitable but cash-flow negative. Profit is an accounting concept; cash flow is real money in and out. Companies fail not from lack of profit but from lack of cash — pay attention to cash flow." }, quiz: { q: "A company can fail even when profitable because of?", o: ["High revenue", "Negative cash flow", "Too many employees", "Low P/E ratio"], a: 1 } },
    { topic: "Business", lesson: { title: "Return on Assets (ROA)", body: "ROA = Net Profit ÷ Total Assets × 100. It measures how efficiently a company uses its assets to generate profit. A high ROA means the company is extracting maximum value from what it owns." }, quiz: { q: "Net profit $40M, total assets $200M. What is ROA?", o: ["5%", "10%", "20%", "40%"], a: 2 } },
    { topic: "Business", lesson: { title: "Competitive Advantage", body: "A sustainable competitive advantage protects a company's market position. Types: cost leadership (Dangote Cement), differentiation (Apple), focus (niche market). Without a moat, competitors erode profits." }, quiz: { q: "Dangote Cement's large-scale low-cost production is an example of?", o: ["Differentiation", "Network effect", "Cost leadership", "Switching cost"], a: 2 } },
    { topic: "Business", lesson: { title: "Business Model Types", body: "Business models include: B2B (selling to businesses), B2C (selling to consumers), SaaS (subscription software), marketplace (connecting buyers and sellers), and franchise. Each has different margin and scale dynamics." }, quiz: { q: "A marketplace business model primarily?", o: ["Manufactures products", "Connects buyers and sellers", "Provides loans", "Sells subscriptions"], a: 1 } },
    { topic: "Business", lesson: { title: "Burn Rate", body: "Burn rate is how fast a startup spends cash before becoming profitable. Monthly burn rate = cash spent per month. Runway = Cash Reserves ÷ Monthly Burn Rate. Low runway = urgency to raise or cut costs." }, quiz: { q: "A startup has $600K cash and burns $100K/month. Runway is?", o: ["6 months", "12 months", "3 months", "60 months"], a: 0 } },
    { topic: "Business", lesson: { title: "Inventory Turnover", body: "Inventory Turnover = COGS ÷ Average Inventory. It shows how quickly a company sells its stock. High turnover = efficient operations. Low turnover may mean overstocking or weak sales." }, quiz: { q: "High inventory turnover generally indicates?", o: ["Poor sales", "Overproduction", "Efficient inventory management", "High debt"], a: 2 } },
    { topic: "Business", lesson: { title: "Accounts Receivable", body: "Accounts receivable is money owed to a company by customers for goods/services already delivered but not yet paid. High receivables with slow collection can cause cash flow problems even in profitable companies." }, quiz: { q: "High accounts receivable with slow collection causes?", o: ["Higher profits", "Cash flow problems", "More dividends", "Higher ROE"], a: 1 } },
    { topic: "Business", lesson: { title: "Fixed vs Variable Costs", body: "Fixed costs don't change with output (rent, salaries). Variable costs change with output (raw materials, packaging). Understanding this split helps determine profitability at different production levels." }, quiz: { q: "Which of these is a fixed cost?", o: ["Raw materials", "Packaging", "Office rent", "Electricity per unit"], a: 2 } },
    { topic: "Business", lesson: { title: "Leverage", body: "Leverage uses borrowed money to amplify returns. If you invest $100K with $50K borrowed and earn 20%, your actual return on equity is 40%. But leverage also amplifies losses." }, quiz: { q: "Leverage amplifies both?", o: ["Only profits", "Only losses", "Profits and losses", "Dividends"], a: 2 } },
    { topic: "Business", lesson: { title: "Operating Leverage", body: "Operating leverage measures how much profit changes relative to revenue. High fixed costs = high operating leverage. A 10% revenue increase might produce a 30% profit increase for a high-leverage business." }, quiz: { q: "High operating leverage means?", o: ["Low fixed costs", "Profits are relatively sensitive to revenue changes", "High variable costs", "Low risk"], a: 1 } },
    { topic: "Business", lesson: { title: "Profit Reinvestment vs Dividend", body: "Companies choose between reinvesting profits (retained earnings) for growth or paying dividends to shareholders. Growth companies reinvest; mature companies pay dividends. The right choice depends on available opportunities." }, quiz: { q: "A company with many high-return investment opportunities should?", o: ["Pay maximum dividends", "Reinvest profits", "Buy back shares immediately", "Reduce operations"], a: 1 } },
    { topic: "Business", lesson: { title: "Corporate Governance", body: "Corporate governance is the system of rules and practices that control a company. It includes the role of the board of directors, shareholder rights, audits, and transparency. Strong governance reduces fraud and builds investor trust." }, quiz: { q: "Strong corporate governance primarily?", o: ["Reduces profitability", "Builds investor trust and reduces fraud", "Increases executive pay", "Reduces dividends"], a: 1 } },
    { topic: "Business", lesson: { title: "Supply Chain Management", body: "Supply chain management coordinates the flow of goods from raw materials to the final customer. Efficient supply chains reduce costs, improve delivery, and increase competitiveness — key for manufacturers like Dangote." }, quiz: { q: "Efficient supply chain management primarily helps companies?", o: ["Raise taxes", "Reduce costs and improve delivery", "Increase dividends", "Avoid regulation"], a: 1 } },
    { topic: "Business", lesson: { title: "Key Performance Indicators (KPIs)", body: "KPIs are measurable metrics that track business performance against goals. Examples: revenue growth %, customer acquisition cost, net promoter score, gross margin. Every well-run business monitors its KPIs." }, quiz: { q: "KPIs are used to?", o: ["File tax returns", "Measure business performance against goals", "Calculate dividends", "Set share prices"], a: 1 } },
    // ── IPO ────────────────────────────────────────────────────────────────────
    { topic: "IPO", lesson: { title: "What is an IPO?", body: "An Initial Public Offering is when a private company offers shares to the public for the first time on a stock exchange. It's a major milestone that raises capital, increases visibility, and gives early investors an exit." }, quiz: { q: "An IPO is when a company first?", o: ["Pays dividends", "Sells shares to the public", "Reports profits", "Gets a bank loan"], a: 1 } },
    { topic: "IPO", lesson: { title: "Why Companies Go Public", body: "Companies do IPOs to: raise capital for expansion, pay off debt, give founders/investors an exit, enhance brand credibility, attract talent with stock options, and enable future share issuances." }, quiz: { q: "Which is NOT a common reason for an IPO?", o: ["Raise capital", "Avoid paying taxes", "Give investors an exit", "Increase brand credibility"], a: 1 } },
    { topic: "IPO", lesson: { title: "IPO Valuation", body: "Before listing, investment banks value the company using DCF, P/E comparables, and revenue multiples. The IPO price reflects this valuation. If demand is high, the stock often pops on debut day." }, quiz: { q: "IPO valuation is typically done by?", o: ["The government", "Investment banks", "Individual investors", "Tax authorities"], a: 1 } },
    { topic: "IPO", lesson: { title: "Underwriting in an IPO", body: "An underwriter (investment bank) buys the shares from the company and sells them to the public. They guarantee the company a minimum amount. In exchange, they charge an underwriting fee of 3–7%." }, quiz: { q: "An IPO underwriter guarantees the company?", o: ["A profit", "Minimum proceeds from the offering", "A high share price", "No fees"], a: 1 } },
    { topic: "IPO", lesson: { title: "Lock-Up Period", body: "After an IPO, insiders (founders, early investors) are restricted from selling shares for 90–180 days. This prevents a flood of selling right after listing that would crash the price. When the lock-up expires, prices often dip." }, quiz: { q: "The purpose of an IPO lock-up period is to?", o: ["Increase dividends", "Prevent insiders from immediately flooding the market with shares", "Guarantee returns", "Allow short selling"], a: 1 } },
    { topic: "IPO", lesson: { title: "Pre-IPO Investment", body: "Pre-IPO investors (venture capital, private equity) buy shares before the public listing, usually at a lower price. They provide growth capital. Their returns are realised when the company goes public." }, quiz: { q: "Pre-IPO investors typically buy shares?", o: ["After listing at market price", "At a discount before public offering", "At a premium", "After the lock-up expires"], a: 1 } },
    { topic: "IPO", lesson: { title: "Over-subscription", body: "When IPO demand exceeds supply, it's oversubscribed. Investors get fewer shares than they applied for (allotment). A 10× oversubscription means 10 applicants per available share. It usually signals strong investor interest." }, quiz: { q: "An oversubscribed IPO means?", o: ["Too many shares issued", "Demand exceeds supply — investors get partial allotment", "The IPO was cancelled", "The price was set too high"], a: 1 } },
    { topic: "IPO", lesson: { title: "Book Building Process", body: "Book building is the process investment banks use to gauge investor demand and set the IPO price. Investors submit bids within a price range. The final price is set based on demand at each price level." }, quiz: { q: "Book building determines?", o: ["Company expenses", "IPO price based on investor demand", "Tax obligations", "Dividend policy"], a: 1 } },
    { topic: "IPO", lesson: { title: "IPO vs Direct Listing", body: "In a traditional IPO, new shares are created and sold to raise capital. In a direct listing, existing shares are sold directly on the exchange with no new capital raised and no underwriter. Spotify and Slack used direct listings." }, quiz: { q: "A direct listing differs from an IPO in that it?", o: ["Creates new shares", "Uses underwriters", "Raises no new capital — existing shares are listed", "Always raises more money"], a: 2 } },
    { topic: "IPO", lesson: { title: "SPAC — Special Purpose Acquisition Company", body: "A SPAC is a blank-check company that raises money through an IPO specifically to merge with a private company, taking it public. It's a faster alternative to a traditional IPO but carries higher risk." }, quiz: { q: "A SPAC is used to?", o: ["Issue dividends", "Take a private company public through a merger", "Provide loans", "Reduce corporate taxes"], a: 1 } },
    { topic: "IPO", lesson: { title: "Green Shoe Option", body: "A green shoe (overallotment) option allows underwriters to sell up to 15% more shares than originally planned if demand is strong. This stabilises the post-IPO share price if it falls below the offer price." }, quiz: { q: "The green shoe option allows underwriters to?", o: ["Cancel the IPO", "Issue 15% more shares if demand is strong", "Reduce the offering price", "Extend the lock-up period"], a: 1 } },
    { topic: "IPO", lesson: { title: "IPO Flipping", body: "Flipping is when investors buy IPO shares and immediately sell them on debut day for a quick profit. It's discouraged by banks (as it can destabilise prices) and some penalise flippers by excluding them from future offerings." }, quiz: { q: "IPO flipping refers to?", o: ["Long-term holding of IPO shares", "Immediately selling IPO shares for quick profit", "Converting bonds to shares", "Short selling after IPO"], a: 1 } },
    { topic: "IPO", lesson: { title: "Secondary Offering", body: "After an IPO, a company may issue more shares to raise additional capital — this is a secondary offering. It dilutes existing shareholders but provides fresh funds for growth. Stock price often dips on announcement." }, quiz: { q: "A secondary offering after an IPO typically?", o: ["Increases EPS", "Dilutes existing shareholders", "Reduces share count", "Cancels dividends"], a: 1 } },
    { topic: "IPO", lesson: { title: "Dual-Class Share Structure", body: "Some IPO companies issue dual-class shares: Class A (public, 1 vote/share) and Class B (founders, 10 votes/share). This lets founders retain control even with minority ownership. Google, Facebook used this structure." }, quiz: { q: "Dual-class shares primarily benefit?", o: ["Public investors", "Bond holders", "Company founders retaining control", "Tax authorities"], a: 2 } },
    { topic: "IPO", lesson: { title: "Listing on African Exchanges", body: "Companies on the NGX (Nigeria), NSE (Kenya), GSE (Ghana), or JSE (South Africa) must meet listing requirements: minimum capital, profitability record, audited accounts, and corporate governance standards." }, quiz: { q: "To list on the NGX, a company must provide?", o: ["Only a business plan", "Audited financial accounts and meet capital requirements", "Just the founders' ID", "A single year of profits"], a: 1 } },
    // ── ADVANCED INVESTING ─────────────────────────────────────────────────────
    { topic: "Advanced", lesson: { title: "Price-to-Sales (P/S) Ratio", body: "P/S = Market Cap ÷ Annual Revenue. Useful for valuing companies with no profit (early-stage growth). A P/S of 5 means investors pay $5 for every $1 of annual revenue. Lower P/S may indicate better value." }, quiz: { q: "P/S ratio is most useful for valuing?", o: ["Profitable dividend companies", "Loss-making growth companies", "Real estate", "Bonds"], a: 1 } },
    { topic: "Advanced", lesson: { title: "Enterprise Value (EV)", body: "EV = Market Cap + Total Debt – Cash. It represents the total cost to acquire a company (taking on its debt, receiving its cash). EV/EBITDA is a key valuation multiple used by analysts and acquirers." }, quiz: { q: "Enterprise Value includes?", o: ["Only market cap", "Market cap plus debt minus cash", "Only cash", "Total revenue"], a: 1 } },
    { topic: "Advanced", lesson: { title: "Sharpe Ratio", body: "Sharpe Ratio = (Portfolio Return – Risk-Free Rate) ÷ Standard Deviation. It measures risk-adjusted return. A Sharpe above 1 is good; above 2 is excellent. It tells you how much return you earn per unit of risk." }, quiz: { q: "A higher Sharpe ratio indicates?", o: ["Higher risk", "Better risk-adjusted returns", "Lower returns", "More volatility"], a: 1 } },
    { topic: "Advanced", lesson: { title: "Beta Coefficient", body: "Beta measures a stock's volatility relative to the market. Beta > 1: more volatile than market. Beta < 1: less volatile. Beta = 1: moves with the market. High-beta stocks amplify gains and losses." }, quiz: { q: "A stock with Beta of 1.5 is?", o: ["Less volatile than market", "As volatile as market", "50% more volatile than market", "Risk-free"], a: 2 } },
    { topic: "Advanced", lesson: { title: "Alpha", body: "Alpha measures a portfolio's return above the benchmark. Alpha of 5% means the portfolio returned 5% more than the market. Active managers aim to generate positive alpha through stock selection and timing." }, quiz: { q: "Alpha represents?", o: ["Total portfolio return", "Return in excess of the benchmark", "Risk level", "Dividend yield"], a: 1 } },
    { topic: "Advanced", lesson: { title: "Efficient Market Hypothesis", body: "EMH states that stock prices already reflect all available information, making it impossible to consistently beat the market. Weak, semi-strong, and strong forms differ in what information is reflected." }, quiz: { q: "The Efficient Market Hypothesis suggests?", o: ["Markets are always wrong", "Stock prices always reflect all available information", "Insiders can always profit", "Technical analysis always works"], a: 1 } },
    { topic: "Advanced", lesson: { title: "Behavioural Finance", body: "Behavioural finance studies how psychology affects financial decisions. Key biases: overconfidence, loss aversion (losing hurts more than winning feels good), herd mentality (following the crowd), and anchoring (fixating on a number)." }, quiz: { q: "Loss aversion means investors?", o: ["Love taking risks", "Feel losses more painfully than equivalent gains", "Always buy at lows", "Ignore dividends"], a: 1 } },
    { topic: "Advanced", lesson: { title: "Diversification and Correlation", body: "Effective diversification requires assets with low or negative correlation. Two stocks that move together don't diversify. Mixing stocks, bonds, real estate, and commodities reduces portfolio volatility." }, quiz: { q: "Best diversification occurs when assets are?", o: ["Highly correlated", "Perfectly correlated", "Low or negatively correlated", "In the same sector"], a: 2 } },
    { topic: "Advanced", lesson: { title: "Value Investing Principles", body: "Value investing (Buffett, Graham) involves buying undervalued companies with strong fundamentals at a margin of safety. Key: understand the business, buy below intrinsic value, and hold for the long term." }, quiz: { q: "Value investing focuses on buying stocks?", o: ["At any price", "Below intrinsic value with margin of safety", "Based on chart patterns", "With highest momentum"], a: 1 } },
    { topic: "Advanced", lesson: { title: "Momentum Investing", body: "Momentum investing buys stocks that have recently risen and sells those that have fallen, assuming trends continue. Studies show short-term momentum is real, but it eventually reverses — requiring disciplined exit strategies." }, quiz: { q: "Momentum investing assumes?", o: ["Mean reversion", "Price trends tend to continue short-term", "Fundamentals always win", "Random price movements"], a: 1 } },
];
// Generate 1000 unique pool items by expanding and rotating the raw pool
function expandPool(raw, target) {
    const pool = [];
    let idx = 0;
    while (pool.length < target) {
        const item = raw[idx % raw.length];
        pool.push({ ...item, id: `lp_${pool.length}`, xpReward: 20 + Math.floor(pool.length / 10) * 5 });
        idx++;
    }
    return pool;
}
const LESSON_POOL = expandPool(RAW_POOL, 1000);
// Pick a random lesson from pool, excluding recently seen
const _seen = new Set();
function pickLesson() {
    const available = LESSON_POOL.filter(l => !_seen.has(l.id));
    const pool = available.length > 0 ? available : LESSON_POOL;
    const item = pool[Math.floor(Math.random() * pool.length)];
    _seen.add(item.id);
    if (_seen.size > 50)
        _seen.clear();
    return item;
}
// Legacy LEARN_MODULES for the Learn tab (uses first 7 unique topics as structured modules)
const LEARN_MODULES = RAW_POOL.filter((m, i, a) => a.findIndex(x => x.topic === m.topic) === i).map((m, i) => ({
    id: `lm_${i}`, title: m.lesson.title, icon: "ti-school", xpReward: m.xpReward || 50, unlockAt: i * 80,
    lessons: [{ q: m.lesson.title, a: m.lesson.body }],
    quiz: m.quiz,
}));
// ── IPO SYSTEM ────────────────────────────────────────────────────────────────
const IPO_UNLOCK_NET_WORTH = 70000000; // $70M net worth to list your company
const IPO_STAGES = ["Private", "Pre-IPO", "Listed", "Blue Chip"];
// ── LEARN POPUP CONSTANTS ─────────────────────────────────────────────────────
const QUIZ_TIME_SECONDS = 20; // seconds to answer each quiz
const LEARN_POPUP_INTERVAL_MS = 35000; // quiz fires every 35 seconds of driving
const DRIVE_BOOST = 0.30; // +30% boost on pass
const DRIVE_PENALTY = 0.30; // -30% penalty on fail / timeout
// ── PASSIVE INCOME SYSTEM ─────────────────────────────────────────────────────
// Passive income is earned based on drive performance, not fixed asset income
// Formula: Drive Earnings × Multiplier × Asset Boost
const PASSIVE_BASE = 0.10; // 10% base multiplier
const PASSIVE_LONG_DRIVE = 0.03; // +3% for 5+ minutes
const PASSIVE_QUIZ_PASS = 0.05; // +5% for passing quiz
const PASSIVE_QUIZ_FAIL = -0.05; // -5% for failing/timeout
const PASSIVE_ROAD_EVENT = 0.02; // +2% per road event collected
const PASSIVE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 real hours
// ── BANKRUPTCY SYSTEM ─────────────────────────────────────────────────────────
const BANKRUPTCY_THRESHOLD = 0; // net worth <= 0 triggers bankruptcy
const DEBT_REPAY_RATE = 0.50; // 50% of drive income goes to debt repayment
const BAILOUT_MIN = 100; // minimum bail out amount
// Asset boost multipliers — assets amplify drive earnings, not replace them
function getAssetBoost(owned) {
    const boosts = {
        studio: 0.10, duplex: 0.15, mall: 0.20, warehouse: 0.25, hotel: 0.30, office: 0.40,
        gold: 0.05, silver: 0.03, oil: 0.08, agri: 0.10,
        btc: 0.08, eth: 0.06, sol: 0.04,
        tbill: 0.05, corpbond: 0.10, eurobond: 0.15,
        franchise: 0.20, logistics: 0.25, fintech: 0.30,
        fineart: 0.05, watch: 0.03,
    };
    let boost = 1.0;
    Object.keys(boosts).forEach(k => { if (owned[k])
        boost += boosts[k]; });
    return +boost.toFixed(2);
}
// ── GLOBAL LEADERBOARD (shared storage key) ───────────────────────────────────
const LB_KEY = "ml_leaderboard_v1";
// ── ASSET DEFINITIONS (basePrice is starting price; prices fluctuate dynamically) ──
const PROPERTIES = [
    // Real Estate
    { id: "studio", name: "Studio Apartment", type: "Real Estate", icon: "ti-building", baseCost: 3000, baseIncome: 120, volatility: 0.012, desc: "Small city unit. Reliable tenants." },
    { id: "duplex", name: "Duplex House", type: "Real Estate", icon: "ti-home", baseCost: 8000, baseIncome: 350, volatility: 0.010, desc: "Two units, double the income." },
    { id: "mall", name: "Mall Unit", type: "Real Estate", icon: "ti-building-store", baseCost: 20000, baseIncome: 900, volatility: 0.009, desc: "Commercial property, high yield." },
    { id: "warehouse", name: "Industrial Warehouse", type: "Real Estate", icon: "ti-home-2", baseCost: 35000, baseIncome: 1600, volatility: 0.011, desc: "Logistics hub. High demand." },
    { id: "hotel", name: "Boutique Hotel", type: "Real Estate", icon: "ti-bed", baseCost: 80000, baseIncome: 4200, volatility: 0.018, desc: "Tourism-driven income. Seasonal risk." },
    { id: "office", name: "Office Complex", type: "Real Estate", icon: "ti-building-skyscraper", baseCost: 150000, baseIncome: 8500, volatility: 0.014, desc: "Premium Lagos office space." },
    // Commodities
    { id: "gold", name: "Gold Reserve", type: "Commodity", icon: "ti-coin", baseCost: 1500, baseIncome: 0, volatility: 0.022, desc: "Safe haven. Appreciates long-term." },
    { id: "silver", name: "Silver Bars", type: "Commodity", icon: "ti-medal", baseCost: 800, baseIncome: 0, volatility: 0.028, desc: "Industrial demand drives price." },
    { id: "oil", name: "Crude Oil Barrel", type: "Commodity", icon: "ti-droplet", baseCost: 5000, baseIncome: 0, volatility: 0.045, desc: "High volatility. Global market." },
    { id: "farmland", name: "Agricultural Land", type: "Commodity", icon: "ti-plant", baseCost: 12000, baseIncome: 600, volatility: 0.008, desc: "Farmland. Steady food demand." },
    // Crypto
    { id: "bitcoin", name: "Bitcoin (0.1 BTC)", type: "Crypto", icon: "ti-currency-bitcoin", baseCost: 2500, baseIncome: 0, volatility: 0.065, desc: "High risk, high reward." },
    { id: "ethereum", name: "Ethereum (1 ETH)", type: "Crypto", icon: "ti-currency-ethereum", baseCost: 1800, baseIncome: 0, volatility: 0.060, desc: "Smart contract platform. Volatile." },
    { id: "solana", name: "Solana (10 SOL)", type: "Crypto", icon: "ti-topology-star", baseCost: 1200, baseIncome: 0, volatility: 0.075, desc: "Fast blockchain. High risk." },
    // Bonds & Fixed Income
    { id: "tbill", name: "Treasury Bond", type: "Bond", icon: "ti-certificate", baseCost: 1000, baseIncome: 25, volatility: 0.003, desc: "Government bond. Safest income." },
    { id: "corpbond", name: "Corporate Bond", type: "Bond", icon: "ti-file-invoice", baseCost: 5000, baseIncome: 180, volatility: 0.008, desc: "Higher yield than T-Bills. Moderate risk." },
    { id: "eurobond", name: "Eurobond (NGN)", type: "Bond", icon: "ti-world", baseCost: 25000, baseIncome: 1100, volatility: 0.012, desc: "Nigeria Eurobond. FX exposure." },
    // Business Ventures
    { id: "franchise", name: "Fast Food Franchise", type: "Business", icon: "ti-tools-kitchen-2", baseCost: 45000, baseIncome: 2800, volatility: 0.022, desc: "Branded outlet. Steady foot traffic." },
    { id: "logistics", name: "Logistics Company", type: "Business", icon: "ti-truck", baseCost: 60000, baseIncome: 3500, volatility: 0.025, desc: "E-commerce boom drives demand." },
    { id: "fintech", name: "Fintech Startup", type: "Business", icon: "ti-device-mobile", baseCost: 100000, baseIncome: 7000, volatility: 0.050, desc: "High growth, high risk." },
    // Art & Collectibles
    { id: "art", name: "Fine Art Collection", type: "Collectible", icon: "ti-palette", baseCost: 8000, baseIncome: 0, volatility: 0.030, desc: "Illiquid but appreciates." },
    { id: "watch", name: "Luxury Watch", type: "Collectible", icon: "ti-clock", baseCost: 3500, baseIncome: 0, volatility: 0.020, desc: "Rolex-class. Store of value." },
];
// Dynamic asset prices (initialised from baseCost, fluctuate every tick)
function initAssetPrices() { return Object.fromEntries(PROPERTIES.map(p => [p.id, p.baseCost])); }
function tickAssetPrices(prev) { return Object.fromEntries(PROPERTIES.map(p => { const v = p.volatility; const newP = Math.max(p.baseCost * 0.3, +(prev[p.id] * (1 + (Math.random() - 0.48) * v)).toFixed(0)); return [p.id, newP]; })); }
function assetIncome(p, assetPrices) { if (!p || !p.baseIncome || !assetPrices)
    return 0; const price = assetPrices[p.id] || p.baseCost || 1; const ratio = price / (p.baseCost || 1); return Math.round(p.baseIncome * ratio); }
function assetLiquidate(p, assetPrices) { if (!p || !assetPrices)
    return p?.baseCost || 0; return assetPrices[p.id] || p.baseCost || 0; }
const BILL_TYPES = [
    { id: "rent", label: "House Rent", icon: "ti-home-2", amount: 400, color: T.red, interval: 8000 },
    { id: "gas", label: "Gas Bill", icon: "ti-gas-station", amount: 80, color: T.gold, interval: 6000 },
    { id: "groceries", label: "Groceries", icon: "ti-shopping-cart", amount: 120, color: T.green, interval: 5000 },
    { id: "hospital", label: "Hospital Bill", icon: "ti-stethoscope", amount: 300, color: "#ff6b81", interval: 15000 },
    { id: "transport", label: "Transport", icon: "ti-bus", amount: 60, color: T.cyan, interval: 4500 },
    { id: "electric", label: "Electricity", icon: "ti-bolt", amount: 150, color: T.purple, interval: 7000 },
];
const FRIENDS = [
    { id: "emeka", name: "Emeka", avatar: "EM", color: T.gold, interest: 15, daysToRepay: 3 },
    { id: "fatima", name: "Fatima", avatar: "FA", color: "#ff6b81", interest: 20, daysToRepay: 5 },
    { id: "chidi", name: "Chidi", avatar: "CH", color: T.cyan, interest: 10, daysToRepay: 2 },
    { id: "ngozi", name: "Ngozi", avatar: "NG", color: T.green, interest: 25, daysToRepay: 7 },
];
const MARKET_EVENTS = [
    { emoji: "🚀", headline: "Tech Surge!", detail: "AI hype sends tech stocks soaring.", tickers: ["AAPL", "NVDA"], mult: 1.09, type: "bull" },
    { emoji: "🔥", headline: "Inflation Fear!", detail: "Rate hikes tank growth stocks.", tickers: ["TSLA", "AMZN"], mult: 0.91, type: "bear" },
    { emoji: "🌍", headline: "Nigeria Boom!", detail: "NGX stocks rally on oil revenues.", tickers: ["DANGCEM", "MTNNG", "PRESCO"], mult: 1.11, type: "bull" },
    { emoji: "💥", headline: "NGX Selloff!", detail: "Naira pressure hits Nigerian stocks.", tickers: ["CADBURY", "LAFARGE"], mult: 0.89, type: "bear" },
    { emoji: "📈", headline: "Bull Run!", detail: "Fed pivot sparks global rally.", tickers: ["AAPL", "AMZN", "JPM"], mult: 1.08, type: "bull" },
    { emoji: "🌪️", headline: "Market Crash!", detail: "Global selloff hits all sectors.", tickers: ["AAPL", "TSLA", "NVDA", "DANGCEM"], mult: 0.87, type: "crash" },
    { emoji: "🏦", headline: "Banking Boom!", detail: "JPM & MTN crush earnings.", tickers: ["JPM", "MTNNG"], mult: 1.08, type: "bull" },
    { emoji: "⚡", headline: "Energy Shock!", detail: "Oil surge boosts Okomu & energy.", tickers: ["OKOMU", "PRESCO"], mult: 1.12, type: "bull" },
];
const ROAD_EVENTS = [
    { id: "techboom", label: "⚡ TECH BOOM!", desc: "Tech stocks GOLD — 3× for 10s!", duration: 10000, type: "boom", color: T.gold },
    { id: "crash", label: "🌪️ MARKET CRASH!", desc: "Survival mode — road turns red!", duration: 8000, type: "crash", color: T.red },
    { id: "dividends", label: "💰 DIVIDEND DAY!", desc: "All good stocks give 2× rewards!", duration: 9000, type: "bonus", color: T.green },
];
const CAR_SKINS = [
    { id: "default", name: "Stock Sedan", unlock: 0, color: T.cyan, glow: T.cyan },
    { id: "silver", name: "Silver Rocket", unlock: 50000, color: "#c0c0c0", glow: "#e0e0e0" },
    { id: "gold", name: "Gold Cruiser", unlock: 200000, color: T.gold, glow: "#ffd700" },
    { id: "diamond", name: "Diamond Beast", unlock: 1000000, color: "#b9f2ff", glow: "#ffffff" },
];
// ── SAVE ──────────────────────────────────────────────────────────────────────
const SAVE_KEY = "ml_save_v6";
const ACCOUNTS_KEY = "ml_accounts_v1";
const SESSION_KEY = "ml_session_v1";
const P2P_KEY = "ml_p2p_v1"; // peer-to-peer loan marketplace — backed by Firebase
// ── DEVICE FINGERPRINT — prevents self-lending from same device ───────────────
function getDeviceID() {
    const KEY = "ml_device_id";
    let id = localStorage.getItem(KEY);
    if (!id) {
        // Generate a stable fingerprint from browser characteristics
        const raw = [
            navigator.userAgent,
            navigator.language,
            screen.width + "x" + screen.height,
            screen.colorDepth,
            new Date().getTimezoneOffset(),
            navigator.hardwareConcurrency || "",
            navigator.platform || "",
        ].join("|");
        // Simple hash
        let hash = 0;
        for (let i = 0; i < raw.length; i++) {
            hash = ((hash << 5) - hash) + raw.charCodeAt(i);
            hash |= 0;
        }
        id = "dev_" + Math.abs(hash).toString(36) + "_" + Date.now().toString(36);
        localStorage.setItem(KEY, id);
    }
    return id;
}
// P2P data lives in Firebase Realtime DB under /p2p/requests and /p2p/active
// loadP2P() is now async — components use useFBP2P() hook instead
function loadP2P() { try {
    const r = localStorage.getItem(P2P_KEY);
    return r ? JSON.parse(r) : { requests: [], active: [] };
}
catch {
    return { requests: [], active: [] };
} }
function saveP2P(d) { try {
    localStorage.setItem(P2P_KEY, JSON.stringify(d));
}
catch { } }
// Firebase P2P helpers
async function fbPostLoanRequest(req) {
    const db = getDB();
    if (!db)
        return saveP2P({ ...loadP2P(), requests: [...loadP2P().requests, req] });
    await db.ref("p2p/requests/" + req.id).set(req);
}
async function fbAcceptLoan(req, lender) {
    const db = getDB();
    if (!db)
        return;
    await db.ref("p2p/requests/" + req.id).remove();
    await db.ref("p2p/active/" + req.id).set({ ...req, lender, status: "active", acceptedAt: new Date().toISOString() });
}
async function fbRejectLoan(reqId) {
    const db = getDB();
    if (!db)
        return;
    await db.ref("p2p/requests/" + reqId + "/status").set("rejected");
}
async function fbRepayLoan(loanId) {
    const db = getDB();
    if (!db)
        return;
    await db.ref("p2p/active/" + loanId + "/status").set("repaid");
}
async function fbDefaultLoan(loanId) {
    const db = getDB();
    if (!db)
        return;
    await db.ref("p2p/active/" + loanId + "/status").set("defaulted");
}
// IPO listings in Firebase
async function fbPublishIPO(companyName, ipoData, ownerSave) {
    const db = getDB();
    if (!db)
        return;
    const key = companyName.replace(/[^a-zA-Z0-9]/g, "_");
    await db.ref("ipo/listed/" + key).set({ companyName, ipoData, ownerUsername: ownerSave.username || "", netWorth: ownerSave.netWorth || 0, ledgerCount: (ownerSave.companyLedger || []).length, totalDriveIncome: ownerSave.totalDrivingIncome || 0, totalExpenses: (ownerSave.companyLedger || []).reduce((s, r) => s + (r.totalExpenses || 0), 0), updatedAt: Date.now() });
}
function fbSubscribeIPO(cb) {
    const db = getDB();
    if (!db) {
        cb([]);
        return () => { };
    }
    const ref = db.ref("ipo/listed").orderByChild("netWorth").limitToLast(50);
    ref.on("value", snap => { const v = snap.val(); cb(v ? Object.values(v) : []); });
    return () => ref.off();
}
// ── FIREBASE-BACKED ACCOUNT & SAVE SYSTEM ────────────────────────────────────
// All accounts and saves stored in Firebase — survives domain changes and device switches
// localStorage used only as fast cache / offline fallback
function loadSave() { try {
    const r = localStorage.getItem(SAVE_KEY);
    return r ? JSON.parse(r) : null;
}
catch {
    return null;
} }
function doSave(s) { try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(s));
}
catch { } }
function loadAccounts() { try {
    const r = localStorage.getItem(ACCOUNTS_KEY);
    return r ? JSON.parse(r) : {};
}
catch {
    return {};
} }
function saveAccounts(a) { try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(a));
}
catch { } }
function saveSession(u) { try {
    localStorage.setItem(SESSION_KEY, u);
}
catch { } }
function loadSession() { try {
    return localStorage.getItem(SESSION_KEY) || null;
}
catch {
    return null;
} }
function clearSession() { try {
    localStorage.removeItem(SESSION_KEY);
}
catch { } }
// Firebase account helpers — primary storage
async function fbSaveAccount(username, data) {
    try {
        const db = getDB();
        if (!db)
            return;
        await db.ref("accounts/" + username).set({ ...data, updatedAt: Date.now() });
    }
    catch (e) {
        console.error("fbSaveAccount error:", e);
    }
}
async function fbLoadAccount(username) {
    try {
        const db = getDB();
        if (!db)
            return null;
        const snap = await db.ref("accounts/" + username).once("value");
        return snap.val();
    }
    catch (e) {
        console.error("fbLoadAccount error:", e);
        return null;
    }
}
async function fbCheckUsername(username) {
    try {
        const db = getDB();
        if (!db)
            return false;
        // Check exact match
        const snap = await db.ref("accounts/" + username + "/password").once("value");
        if (snap.exists())
            return true;
        // Also check case-insensitive by scanning all accounts
        const allSnap = await db.ref("accounts").once("value");
        const all = allSnap.val();
        if (!all)
            return false;
        return Object.keys(all).some(k => k.toLowerCase() === username.toLowerCase());
    }
    catch (e) {
        return false;
    }
}
async function fbCheckCompanyName(companyName) {
    try {
        const db = getDB();
        if (!db)
            return false;
        // Scan all accounts for matching company name (case-insensitive)
        const snap = await db.ref("accounts").once("value");
        const all = snap.val();
        if (!all)
            return false;
        const lower = companyName.trim().toLowerCase();
        return Object.values(all).some(acc => acc.save && acc.save.companyName &&
            acc.save.companyName.toLowerCase() === lower);
    }
    catch (e) {
        return false;
    }
}
async function fbSaveGameState(username, save) {
    try {
        const db = getDB();
        if (!db)
            return;
        // Save to Firebase
        await db.ref("accounts/" + username + "/save").set({ ...save, savedAt: Date.now() });
        // Also cache locally for speed
        doSave(save);
        const accs = loadAccounts();
        if (accs[username]) {
            accs[username].save = save;
            saveAccounts(accs);
        }
    }
    catch (e) {
        console.error("fbSaveGameState error:", e);
    }
}
async function fbLoadGameState(username) {
    try {
        const db = getDB();
        if (!db)
            return loadSave();
        const snap = await db.ref("accounts/" + username + "/save").once("value");
        const fbSave = snap.val();
        if (fbSave) {
            // Update local cache
            doSave(fbSave);
            return fbSave;
        }
        // Fall back to localStorage if Firebase has nothing
        return loadSave();
    }
    catch (e) {
        return loadSave();
    }
}
// ── HELPERS ───────────────────────────────────────────────────────────────────
const fmt = n => "$" + Math.max(0, +n).toLocaleString("en-US", { maximumFractionDigits: 0 });
const fmtD = n => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
const pctS = n => (n >= 0 ? "+" : "") + n.toFixed(2) + "%";
const rw = (p, v, m) => Math.max(1, +((p * (m || 1)) + (Math.random() - 0.48) * v * p).toFixed(2));
const haptic = (ms = 30) => { try {
    if (navigator.vibrate)
        navigator.vibrate(ms);
}
catch { } };
// ── SPARK ─────────────────────────────────────────────────────────────────────
function Spark({ data, up, w = 70, h = 26 }) {
    if (!data || data.length < 2)
        return null;
    const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
    const pts = data.map((v, i) => `${((i / (data.length - 1)) * w).toFixed(1)},${(h - ((v - min) / range) * (h - 4) - 2).toFixed(1)}`);
    const path = "M" + pts.join(" L");
    const c = up ? T.green : T.red;
    return (React.createElement("svg", { width: w, height: h, "aria-hidden": "true" },
        React.createElement("path", { d: `${path} L${w},${h} L0,${h} Z`, fill: up ? "rgba(0,255,136,0.08)" : "rgba(255,71,87,0.08)", stroke: "none" }),
        React.createElement("path", { d: path, fill: "none", stroke: c, strokeWidth: "1.5", strokeLinejoin: "round" })));
}
function DCard({ label, value, color, icon }) {
    return (React.createElement("div", { style: { background: T.card, border: `1px solid ${T.border}`, borderRadius: D.br, padding: "11px 13px", borderLeft: `3px solid ${color || T.cyan}` } },
        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 5, marginBottom: 4 } },
            icon && React.createElement("i", { className: `ti ${icon}`, style: { fontSize: 12, color: color || T.muted }, "aria-hidden": "true" }),
            React.createElement("span", { style: { fontSize: 10, textTransform: "uppercase", letterSpacing: 1.2, color: T.muted } }, label)),
        React.createElement("div", { style: { fontSize: 16, fontWeight: "bold", fontFamily: "monospace", color: color || T.text } }, value)));
}
function Btn({ onClick, children, color = T.cyan, style = {} }) {
    return (React.createElement("button", { onClick: onClick, style: { background: `${color}18`, border: `1px solid ${color}`, borderRadius: D.brs, color, cursor: "pointer", fontWeight: "bold", fontSize: 13, padding: "8px 16px", ...style } }, children));
}
function Input({ value, onChange, placeholder, type = "text", style = {} }) {
    return (React.createElement("input", { type: type, value: value, onChange: e => onChange(e.target.value), placeholder: placeholder, style: { background: T.surface, border: `1px solid ${T.border}`, borderRadius: D.brs, color: T.text, padding: "9px 12px", fontSize: 13, width: "100%", boxSizing: "border-box", ...style } }));
}
// ── AUTH SCREENS ──────────────────────────────────────────────────────────────
function AuthScreen({ onLogin }) {
    const [mode, setMode] = useState("login");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);
    const [migrating, setMigrating] = useState(false);
    async function doLogin() {
        if (!username.trim() || !password.trim()) {
            setErr("Fill all fields.");
            return;
        }
        setLoading(true);
        setErr("");
        try {
            // Try Firebase first
            const fbAcc = await fbLoadAccount(username.trim());
            if (fbAcc) {
                if (fbAcc.password !== password) {
                    setErr("Wrong password.");
                    setLoading(false);
                    return;
                }
                // Cache locally
                const accs = loadAccounts();
                accs[username] = { ...fbAcc };
                saveAccounts(accs);
                const save = await fbLoadGameState(username.trim());
                onLogin(username.trim(), save);
                return;
            }
            // Fall back to localStorage
            const accs = loadAccounts();
            if (!accs[username]) {
                setErr("Account not found. Check your username or register.");
                setLoading(false);
                return;
            }
            if (accs[username].password !== password) {
                setErr("Wrong password.");
                setLoading(false);
                return;
            }
            // Migrate localStorage account to Firebase
            await fbSaveAccount(username, accs[username]);
            onLogin(username, accs[username].save || null);
        }
        catch (e) {
            // Offline fallback
            const accs = loadAccounts();
            if (!accs[username]) {
                setErr("Account not found.");
                setLoading(false);
                return;
            }
            if (accs[username].password !== password) {
                setErr("Wrong password.");
                setLoading(false);
                return;
            }
            onLogin(username, accs[username].save || null);
        }
        setLoading(false);
    }
    async function doRegister() {
        if (!username.trim() || !password.trim() || !email.trim()) {
            setErr("Fill all fields.");
            return;
        }
        if (username.length < 3) {
            setErr("Username must be 3+ characters.");
            return;
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
            setErr("Username: letters, numbers and underscores only. No spaces.");
            return;
        }
        if (username.trim().length > 20) {
            setErr("Username must be 20 characters or less.");
            return;
        }
        setLoading(true);
        setErr("");
        try {
            // Check Firebase (covers ALL players on ALL devices — case-insensitive)
            const exists = await fbCheckUsername(username.trim());
            if (exists) {
                setErr("Username already taken. Choose another.");
                setLoading(false);
                return;
            }
            // Also check localStorage (fast local check)
            const accs = loadAccounts();
            const taken = Object.keys(accs).some(k => k.toLowerCase() === username.trim().toLowerCase());
            if (taken) {
                setErr("Username already taken. Choose another.");
                setLoading(false);
                return;
            }
            // Save to Firebase AND localStorage
            const newAcc = { password, email, save: null, createdAt: Date.now() };
            await fbSaveAccount(username.trim(), newAcc);
            accs[username] = { ...newAcc };
            saveAccounts(accs);
            onLogin(username.trim(), null);
        }
        catch (e) {
            // Offline fallback — localStorage only
            const accs = loadAccounts();
            accs[username] = { password, email, save: null, createdAt: Date.now() };
            saveAccounts(accs);
            onLogin(username, null);
        }
        setLoading(false);
    }
    const isLogin = mode === "login";
    // On mount — check if there are localStorage accounts to migrate to Firebase
    useEffect(() => {
        const accs = loadAccounts();
        const users = Object.keys(accs);
        if (users.length === 0)
            return;
        // Silently migrate all localStorage accounts to Firebase in background
        setMigrating(true);
        Promise.all(users.map(async (u) => {
            try {
                const exists = await fbCheckUsername(u);
                if (!exists)
                    await fbSaveAccount(u, accs[u]);
                if (accs[u].save)
                    await fbSaveGameState(u, accs[u].save);
            }
            catch (e) { }
        })).finally(() => setMigrating(false));
    }, []);
    return (React.createElement("div", { style: { background: "#070C18", minHeight: "100vh", fontFamily: "'Inter',sans-serif", color: "#dee2f4", overflowX: "hidden", position: "relative" } },
        React.createElement("style", null, `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .ml-glass{background:rgba(15,23,41,0.75);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.1);}
        .ml-glow:hover{box-shadow:0 0 18px rgba(0,229,255,0.45);}
        .ml-grid-bg{background-image:linear-gradient(rgba(0,229,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,0.05) 1px,transparent 1px);background-size:50px 50px;}
        .ml-chart-path{stroke-dasharray:1000;stroke-dashoffset:1000;animation:mlDraw 3s ease-out forwards;}
        @keyframes mlDraw{to{stroke-dashoffset:0;}}
        .ml-input{width:100%;background:#0F1729;border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:12px 16px 12px 44px;font-size:15px;color:#dee2f4;outline:none;transition:border-color 0.2s,box-shadow 0.2s;font-family:'Inter',sans-serif;}
        .ml-input:focus{border-color:#00E5FF;box-shadow:0 0 0 2px rgba(0,229,255,0.15);}
        .ml-input::placeholder{color:#6B7FA0;}
        .ml-tab-active{background:#343947;color:#00E5FF;box-shadow:0 1px 4px rgba(0,0,0,0.3);}
        .ml-tab-inactive{color:#6B7FA0;}
        .ml-tab-inactive:hover{color:#dee2f4;}
        .ml-feature:hover .ml-feature-icon{transform:scale(1.1);}
        .ml-feature-icon{transition:transform 0.2s;}
        .ml-card-wrap{perspective:1000px;}
        .ml-err{background:rgba(255,71,87,0.1);border:1px solid rgba(255,71,87,0.3);border-radius:8px;padding:9px 12px;font-size:12px;color:#ff4757;margin-bottom:12px;}
      `),
        React.createElement("div", { style: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "100%", maxWidth: 1000, height: 400, opacity: 0.18, pointerEvents: "none", zIndex: 0 } },
            React.createElement("svg", { width: "100%", height: "100%", viewBox: "0 0 1000 400" },
                React.createElement("path", { className: "ml-chart-path", d: "M0,350 Q100,320 200,340 T400,280 T600,310 T800,150 T1000,100", fill: "none", stroke: "#00E5FF", strokeWidth: "2" }),
                React.createElement("path", { className: "ml-chart-path", d: "M0,380 Q150,350 300,370 T550,300 T850,220 T1000,180", fill: "none", stroke: "#00FF88", strokeWidth: "1.5", style: { animationDelay: "0.5s", opacity: 0.6 } }))),
        React.createElement("div", { className: "ml-grid-bg", style: { position: "absolute", inset: 0, zIndex: 0, opacity: 0.4 } }),
        React.createElement("div", { style: { position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "32px 20px" } },
            React.createElement("div", { style: { textAlign: "center", marginBottom: 36 } },
                React.createElement("h1", { style: { fontSize: "clamp(32px,8vw,52px)", fontWeight: 800, background: "linear-gradient(135deg,#00E5FF,#00FF88)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.02em", marginBottom: 8, lineHeight: 1.1 } }, "Market Legends"),
                React.createElement("p", { style: { fontSize: 16, color: "#6B7FA0", fontWeight: 400, lineHeight: 1.6 } }, "The ultimate financial life simulator. Build your empire.")),
            React.createElement("div", { className: "ml-glass ml-card-wrap", style: { borderRadius: 16, padding: "32px 28px", width: "100%", maxWidth: 420, boxShadow: "0 25px 60px rgba(0,0,0,0.5)", position: "relative", overflow: "hidden", marginBottom: 40 } },
                React.createElement("div", { style: { position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,#00E5FF,transparent)", opacity: 0.6 } }),
                React.createElement("div", { style: { display: "flex", gap: 4, background: "#161B28", borderRadius: 10, padding: 4, marginBottom: 24, border: "1px solid rgba(255,255,255,0.08)" } }, ["login", "register"].map(m => (React.createElement("button", { key: m, onClick: () => { setMode(m); setErr(""); }, className: mode === m ? "ml-tab-active" : "ml-tab-inactive", style: { flex: 1, padding: "9px", fontSize: 13, fontWeight: 600, borderRadius: 8, border: "none", cursor: "pointer", background: "transparent", letterSpacing: "0.03em", transition: "all 0.2s", textTransform: "capitalize" } }, m === "login" ? "Login" : "Register")))),
                err && React.createElement("div", { className: "ml-err" }, err),
                React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 } },
                    React.createElement("div", null,
                        React.createElement("label", { style: { display: "block", fontSize: 11, fontWeight: 500, color: "#bac9cc", marginBottom: 6, letterSpacing: "0.05em", textTransform: "uppercase" } }, "Username"),
                        React.createElement("div", { style: { position: "relative" } },
                            React.createElement("span", { style: { position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#6B7FA0", fontSize: 16, fontFamily: "'Material Symbols Outlined'" } }, "person"),
                            React.createElement("input", { className: "ml-input", value: username, onChange: e => setUsername(e.target.value), placeholder: "legendary_trader", onKeyDown: e => e.key === "Enter" && (isLogin ? doLogin() : doRegister()) }))),
                    !isLogin && (React.createElement("div", null,
                        React.createElement("label", { style: { display: "block", fontSize: 11, fontWeight: 500, color: "#bac9cc", marginBottom: 6, letterSpacing: "0.05em", textTransform: "uppercase" } }, "Email"),
                        React.createElement("div", { style: { position: "relative" } },
                            React.createElement("span", { style: { position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#6B7FA0", fontSize: 16, fontFamily: "'Material Symbols Outlined'" } }, "mail"),
                            React.createElement("input", { className: "ml-input", value: email, onChange: e => setEmail(e.target.value), placeholder: "you@example.com", type: "email", onKeyDown: e => e.key === "Enter" && doRegister() })))),
                    React.createElement("div", null,
                        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 } },
                            React.createElement("label", { style: { fontSize: 11, fontWeight: 500, color: "#bac9cc", letterSpacing: "0.05em", textTransform: "uppercase" } }, "Password")),
                        React.createElement("div", { style: { position: "relative" } },
                            React.createElement("span", { style: { position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#6B7FA0", fontSize: 16, fontFamily: "'Material Symbols Outlined'" } }, "lock"),
                            React.createElement("input", { className: "ml-input", value: password, onChange: e => setPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", type: "password", onKeyDown: e => e.key === "Enter" && (isLogin ? doLogin() : doRegister()) })))),
                React.createElement("button", { onClick: isLogin ? doLogin : doRegister, disabled: loading, className: "ml-glow", style: { width: "100%", padding: "14px", background: "linear-gradient(135deg,#00E5FF,#00b8d4)", color: "#05050a", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer", letterSpacing: "0.03em", transition: "all 0.2s", fontFamily: "'Inter',sans-serif" } }, isLogin ? "Sign In to Dashboard →" : "Create Your Account →"),
                React.createElement("div", { style: { marginTop: 20, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.08)", textAlign: "center", fontSize: 13, color: "#6B7FA0" } },
                    isLogin ? "Don't have an account? " : "Already have an account? ",
                    React.createElement("span", { onClick: () => { setMode(isLogin ? "register" : "login"); setErr(""); }, style: { color: "#00E5FF", fontWeight: 600, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 } }, isLogin ? "Join the competition" : "Sign in"))),
            React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, width: "100%", maxWidth: 680 } }, [
                { icon: "trending_up", color: "#00E5FF", bg: "rgba(0,229,255,0.1)", title: "Real-time Markets", desc: "Simulated stocks reacting to in-game news events and market cycles." },
                { icon: "military_tech", color: "#00FF88", bg: "rgba(0,255,136,0.1)", title: "Global Rankings", desc: "Compete with players worldwide for the title of Elite Market Legend." },
                { icon: "account_balance", color: "#c3f5ff", bg: "rgba(195,245,255,0.08)", title: "Wealth Simulation", desc: "Manage real estate, businesses, and portfolios to build your legacy." },
            ].map(f => (React.createElement("div", { key: f.title, className: "ml-glass ml-feature", style: { borderRadius: 12, padding: "20px 18px", textAlign: "center" } },
                React.createElement("div", { className: "ml-feature-icon", style: { width: 44, height: 44, background: f.bg, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" } },
                    React.createElement("span", { style: { fontFamily: "'Material Symbols Outlined'", color: f.color, fontSize: 22 } }, f.icon)),
                React.createElement("div", { style: { fontWeight: 700, fontSize: 14, color: "#dee2f4", marginBottom: 5 } }, f.title),
                React.createElement("div", { style: { fontSize: 12, color: "#6B7FA0", lineHeight: 1.6 } }, f.desc))))))));
}
// ── COMPANY REGISTRATION SCREEN ───────────────────────────────────────────────
function CompanyRegScreen({ wallet, onRegister, onSkip }) {
    const [companyName, setCompanyName] = useState("");
    const [err, setErr] = useState("");
    const [checking, setChecking] = useState(false);
    async function doRegister() {
        if (!companyName.trim()) {
            setErr("Enter your company name.");
            return;
        }
        if (wallet < REG_COST) {
            setErr(`You need at least ${fmt(REG_COST)} to register.`);
            return;
        }
        setChecking(true);
        setErr("");
        // Check localStorage first (fast)
        const accs = loadAccounts();
        const localTaken = Object.values(accs).some(a => a.save && a.save.companyName && a.save.companyName.toLowerCase() === companyName.trim().toLowerCase());
        if (localTaken) {
            setErr("Company name already taken. Choose a unique name.");
            setChecking(false);
            return;
        }
        // Check Firebase (authoritative — covers all players on all devices)
        try {
            const fbTaken = await fbCheckCompanyName(companyName.trim());
            if (fbTaken) {
                setErr("Company name already taken by another player. Choose a unique name.");
                setChecking(false);
                return;
            }
        }
        catch (e) { }
        setChecking(false);
        onRegister(companyName.trim());
    }
    return (React.createElement("div", { style: { background: T.bg, fontFamily: "'Segoe UI',sans-serif", padding: 20, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" } },
        React.createElement("div", { style: { width: "100%", maxWidth: 420 } },
            React.createElement("div", { style: { textAlign: "center", marginBottom: 20 } },
                React.createElement("div", { style: { fontSize: 22, fontWeight: "bold", color: T.text, marginBottom: 4 } }, "\uD83C\uDFE2 Register Your Company"),
                React.createElement("div", { style: { fontSize: 13, color: T.muted } }, "Reduce your tax burden before you start driving")),
            React.createElement("div", { style: { background: T.card, border: `1px solid ${T.gold}55`, borderRadius: D.br, padding: 16, marginBottom: 14 } },
                React.createElement("div", { style: { fontWeight: "bold", fontSize: 13, color: T.gold, marginBottom: 8 } }, "Why Register?"),
                React.createElement("div", { style: { fontSize: 12, color: T.muted, lineHeight: 1.8 } },
                    "\u2705 ",
                    React.createElement("strong", { style: { color: T.text } }, "Without registration:"),
                    " 40% of all driving income is taxed immediately on exit.",
                    React.createElement("br", null),
                    "\u2705 ",
                    React.createElement("strong", { style: { color: T.text } }, "With registration:"),
                    " Deduct your business expenses first. Only 30% tax applies \u2014 and only if taxable income after deductions exceeds ",
                    React.createElement("strong", { style: { color: T.gold } }, fmt(COMPANY_TAX_THRESHOLD)),
                    " per drive.",
                    React.createElement("br", null),
                    "\u2705 You control how expenses are apportioned (salaries, rent, R&D, debt, etc.)")),
            React.createElement("div", { style: { background: T.card, border: `1px solid ${T.border}`, borderRadius: D.br, padding: 16, marginBottom: 14 } },
                React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 13 } },
                    React.createElement("span", { style: { color: T.muted } }, "Registration fee"),
                    React.createElement("span", { style: { fontFamily: "monospace", color: T.red, fontWeight: "bold" } },
                        "-",
                        fmt(REG_COST))),
                React.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 13 } },
                    React.createElement("span", { style: { color: T.muted } }, "Remaining to start with"),
                    React.createElement("span", { style: { fontFamily: "monospace", color: T.green, fontWeight: "bold" } }, fmt(wallet - REG_COST)))),
            err && React.createElement("div", { style: { background: "rgba(255,71,87,0.1)", border: `1px solid ${T.red}44`, borderRadius: D.brs, padding: "8px 12px", fontSize: 12, color: T.red, marginBottom: 10 } }, err),
            React.createElement("div", { style: { marginBottom: 12 } },
                React.createElement(Input, { value: companyName, onChange: setCompanyName, placeholder: "Enter your company name" })),
            React.createElement("div", { style: { display: "flex", gap: 10 } },
                React.createElement("button", { onClick: doRegister, disabled: checking, style: { flex: 2, padding: "12px", background: checking ? "#1e2d45" : `linear-gradient(135deg,${T.gold},${T.orange})`, color: checking ? "#6b7fa0" : "#05050a", border: "none", borderRadius: D.br, fontWeight: "bold", fontSize: 14, cursor: checking ? "not-allowed" : "pointer" } }, checking ? "Checking name..." : "Register (" + fmt(REG_COST) + ")"),
                React.createElement("button", { onClick: onSkip, style: { flex: 1, padding: "12px", background: "transparent", color: T.muted, border: `1px solid ${T.border}`, borderRadius: D.br, fontSize: 13, cursor: "pointer" } }, "Skip (Pay 40% flat tax)")))));
}
// ── TAX RULES ─────────────────────────────────────────────────────────────────
const INDIVIDUAL_TAX_RATE = 0.40; // 40% flat for unregistered individuals
const COMPANY_TAX_RATE = 0.30; // 30% for registered companies
const COMPANY_TAX_THRESHOLD = 500000; // Only applies when taxable income > $500K per drive
// ── TAX APPORTIONMENT SCREEN ──────────────────────────────────────────────────
function TaxApportionScreen({ drivingIncome, isRegistered, companyName, onConfirm }) {
    // Hooks must be at top
    const [vals, setVals] = useState({ salary: "", rent: "", rd: "", debt: "", misc: "" });
    const EXPENSE_DEFS = [
        { id: "salary", label: "Staff Salaries", icon: "ti-users", placeholder: "e.g. 50000" },
        { id: "rent", label: "Office Rent", icon: "ti-building", placeholder: "e.g. 20000" },
        { id: "rd", label: "R&D", icon: "ti-flask", placeholder: "e.g. 15000" },
        { id: "debt", label: "Debt Repayment", icon: "ti-credit-card", placeholder: "e.g. 30000" },
        { id: "misc", label: "Miscellaneous Ops", icon: "ti-dots", placeholder: "e.g. 5000" },
    ];
    const parsed = Object.fromEntries(Object.entries(vals).map(([k, v]) => [k, parseFloat(v) || 0]));
    const totalExpenses = Object.values(parsed).reduce((s, v) => s + v, 0);
    // Drive income minus all deductions = what's left (this is checked against $500K threshold)
    const incomeAfterDeductions = Math.max(0, drivingIncome - totalExpenses);
    // Registered company: 30% only if income AFTER deductions > $500K
    const companyTaxApplies = isRegistered && incomeAfterDeductions > COMPANY_TAX_THRESHOLD;
    const taxDue = isRegistered
        ? (companyTaxApplies ? Math.round(incomeAfterDeductions * COMPANY_TAX_RATE) : 0)
        : Math.round(drivingIncome * INDIVIDUAL_TAX_RATE);
    const netAfterTax = isRegistered
        ? (drivingIncome - totalExpenses - taxDue)
        : (drivingIncome - taxDue);
    function setVal(id, raw) {
        // Allow free typing — only digits and one decimal point
        const clean = raw.replace(/[^0-9.]/g, "");
        setVals(v => ({ ...v, [id]: clean }));
    }
    if (!isRegistered) {
        return (React.createElement("div", { style: { background: "rgba(7,12,24,0.96)", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Segoe UI',sans-serif", overflowY: "auto" } },
            React.createElement("div", { style: { maxWidth: 400, width: "100%" } },
                React.createElement("div", { style: { textAlign: "center", marginBottom: 16 } },
                    React.createElement("div", { style: { fontSize: 20, fontWeight: "bold", color: T.orange } }, "\uD83D\uDCCB Tax Deduction"),
                    React.createElement("div", { style: { fontSize: 12, color: T.muted, marginTop: 4 } }, "Unregistered Individual \u2014 Flat 40% Rate")),
                React.createElement("div", { style: { background: T.card, border: `1px solid ${T.orange}55`, borderRadius: D.br, padding: 16, marginBottom: 14 } },
                    React.createElement(Row, { label: "Driving income earned", val: fmt(drivingIncome), color: T.green }),
                    React.createElement(Row, { label: "Tax rate (unregistered)", val: "40%", color: T.orange }),
                    React.createElement("div", { style: { borderTop: `1px solid ${T.border}`, marginTop: 8, paddingTop: 8 } },
                        React.createElement(Row, { label: "Tax deducted", val: "-" + fmt(taxDue), color: T.red, bold: true }),
                        React.createElement(Row, { label: "You keep", val: fmt(netAfterTax), color: T.green, bold: true }))),
                React.createElement("div", { style: { background: T.card, border: `1px solid ${T.border}`, borderRadius: D.br, padding: 12, marginBottom: 14, fontSize: 12, color: T.muted, lineHeight: 1.7 } },
                    "\uD83D\uDCA1 ",
                    React.createElement("strong", { style: { color: T.text } }, "Tip:"),
                    " Register a company from the Hub. Registered businesses pay only 30% \u2014 and only when taxable income after deductions exceeds ",
                    React.createElement("strong", { style: { color: T.green } }, fmt(COMPANY_TAX_THRESHOLD)),
                    " per drive."),
                React.createElement("button", { onClick: () => onConfirm(taxDue, null), style: { width: "100%", padding: "12px", background: `linear-gradient(135deg,${T.cyan},#0086ff)`, color: "#05050a", border: "none", borderRadius: D.br, fontWeight: "bold", fontSize: 14, cursor: "pointer" } }, "Accept & Continue"))));
    }
    return (React.createElement("div", { style: { background: "rgba(7,12,24,0.96)", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 100, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: 20, fontFamily: "'Segoe UI',sans-serif", overflowY: "auto" } },
        React.createElement("div", { style: { maxWidth: 440, width: "100%", paddingBottom: 40 } },
            React.createElement("div", { style: { textAlign: "center", marginBottom: 14 } },
                React.createElement("div", { style: { fontSize: 20, fontWeight: "bold", color: T.cyan } },
                    "\uD83C\uDFE2 ",
                    companyName),
                React.createElement("div", { style: { fontSize: 12, color: T.muted, marginTop: 3 } },
                    "Apportion business expenses \u2014 tax applied only on remaining profit above ",
                    fmt(COMPANY_TAX_THRESHOLD))),
            React.createElement("div", { style: { background: T.card, border: `1px solid ${T.green}44`, borderRadius: D.br, padding: 12, marginBottom: 12 } },
                React.createElement(Row, { label: "Gross drive income this session", val: fmt(drivingIncome), color: T.green }),
                React.createElement("div", { style: { fontSize: 11, color: T.muted, marginTop: 6, lineHeight: 1.7 } },
                    "Deduct your business expenses below. Your ",
                    React.createElement("strong", { style: { color: T.text } }, "net income"),
                    " (gross minus expenses) is what gets checked against the ",
                    React.createElement("strong", { style: { color: T.gold } }, fmt(COMPANY_TAX_THRESHOLD)),
                    " threshold. Only if net income exceeds that does ",
                    React.createElement("strong", { style: { color: T.orange } }, "30% tax"),
                    " apply.")),
            EXPENSE_DEFS.map(e => (React.createElement("div", { key: e.id, style: { background: T.card, border: `1px solid ${T.border}`, borderRadius: D.brs, padding: "10px 14px", marginBottom: 8 } },
                React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } },
                    React.createElement("i", { className: `ti ${e.icon}`, style: { fontSize: 16, color: T.muted, flexShrink: 0 }, "aria-hidden": "true" }),
                    React.createElement("div", { style: { flex: 1 } },
                        React.createElement("div", { style: { fontSize: 12, color: T.text, marginBottom: 5, fontWeight: "bold" } }, e.label),
                        React.createElement("input", { type: "text", inputMode: "decimal", value: vals[e.id], placeholder: e.placeholder, onChange: ev => setVal(e.id, ev.target.value), style: {
                                background: T.surface,
                                border: `1px solid ${vals[e.id] ? T.cyan + "66" : T.border}`,
                                borderRadius: D.brs,
                                color: T.green,
                                padding: "8px 10px",
                                fontSize: 13,
                                width: "100%",
                                fontFamily: "monospace",
                                boxSizing: "border-box",
                                outline: "none",
                            } })),
                    React.createElement("div", { style: { textAlign: "right", minWidth: 70, flexShrink: 0 } },
                        React.createElement("div", { style: { fontSize: 11, color: T.muted } }, "Amount"),
                        React.createElement("div", { style: { fontSize: 13, fontWeight: "bold", fontFamily: "monospace", color: parsed[e.id] > 0 ? T.orange : T.muted } }, parsed[e.id] > 0 ? "-" + fmt(parsed[e.id]) : "—")))))),
            React.createElement("div", { style: { background: T.card, border: `1px solid ${T.border}`, borderRadius: D.br, padding: 14, marginTop: 4, marginBottom: 14 } },
                React.createElement(Row, { label: "Gross drive income", val: fmt(drivingIncome), color: T.green }),
                React.createElement(Row, { label: "Total expenses apportioned", val: "-" + fmt(totalExpenses), color: T.orange }),
                React.createElement("div", { style: { borderTop: `1px solid ${T.border2}`, margin: "6px 0", paddingTop: 6 } },
                    React.createElement(Row, { label: "Net income (gross \u2212 expenses)", val: fmt(incomeAfterDeductions), color: T.cyan, bold: true })),
                React.createElement("div", { style: { margin: "4px 0 8px", padding: "6px 0", borderBottom: `1px solid ${T.border2}` } }, companyTaxApplies
                    ? React.createElement(Row, { label: `Tax due — 30% of net income (net > ${fmt(COMPANY_TAX_THRESHOLD)})`, val: "-" + fmt(taxDue), color: T.red })
                    : React.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 12, padding: "2px 0" } },
                        React.createElement("span", { style: { color: T.green, fontWeight: "bold" } },
                            "\u2713 No tax \u2014 net income is below ",
                            fmt(COMPANY_TAX_THRESHOLD)),
                        React.createElement("span", { style: { fontFamily: "monospace", color: T.green, fontWeight: "bold" } }, "$0"))),
                React.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: "bold", paddingTop: 6 } },
                    React.createElement("span", { style: { color: T.text } }, "You keep"),
                    React.createElement("span", { style: { fontFamily: "monospace", color: T.green } }, fmt(netAfterTax)))),
            React.createElement("button", { onClick: () => onConfirm(taxDue, vals), style: { width: "100%", padding: "13px", background: taxDue === 0 ? `linear-gradient(135deg,${T.green},#00aa55)` : `linear-gradient(135deg,${T.cyan},#0086ff)`, color: "#05050a", border: "none", borderRadius: D.br, fontWeight: "bold", fontSize: 14, cursor: "pointer" } }, taxDue === 0 ? "✓ No Tax Due — Confirm & Continue" : `Confirm & Pay ${fmt(taxDue)} Tax (30%)`))));
}
function Row({ label, val, color, bold }) {
    return (React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: bold ? 14 : 12, fontWeight: bold ? "bold" : "normal", marginBottom: 6 } },
        React.createElement("span", { style: { color: T.muted } }, label),
        React.createElement("span", { style: { fontFamily: "monospace", color: color || T.text } }, val)));
}
// ── SHARE CARD ────────────────────────────────────────────────────────────────
function ShareCard({ username, netWorth, totalDrivingIncome, totalTaxPaid, portfolio, owned, companyName, onClose }) {
    const [copied, setCopied] = useState(false);
    const stocksOwned = ALL_STOCKS.filter(s => (portfolio[s.ticker] || 0) > 0);
    const propsOwned = PROPERTIES.filter(p => owned[p.id]);
    const progressText = `🏆 ${username}'s Market Legends Progress
💰 Net Worth: ${fmt(netWorth)}
🚗 Driving Income: ${fmt(totalDrivingIncome)}
💸 Tax Paid: ${fmt(totalTaxPaid)}
🏢 Company: ${companyName || "Unregistered"}
📈 Stocks: ${stocksOwned.map(s => s.ticker).join(", ") || "None"}
🏠 Properties: ${propsOwned.map(p => p.name).join(", ") || "None"}

🎮 Play Market Legends — Financial Life Simulator`;
    function copyText() {
        // Try modern clipboard API first, fall back to execCommand
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(progressText).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 3000);
            }).catch(() => fallbackCopy());
        }
        else {
            fallbackCopy();
        }
    }
    function fallbackCopy() {
        const ta = document.createElement("textarea");
        ta.value = progressText;
        ta.style.position = "fixed";
        ta.style.top = "-9999px";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        try {
            document.execCommand("copy");
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        }
        catch (e) { }
        document.body.removeChild(ta);
    }
    return (React.createElement("div", { style: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.88)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Segoe UI',sans-serif", overflowY: "auto" } },
        React.createElement("div", { style: { maxWidth: 380, width: "100%" } },
            React.createElement("div", { style: { background: "linear-gradient(135deg,#070c18,#0f1729)", border: `2px solid ${T.cyan}44`, borderRadius: 16, padding: 24, marginBottom: 14 } },
                React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 } },
                    React.createElement("div", null,
                        React.createElement("div", { style: { fontSize: 11, color: T.muted, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 2 } }, "Market Legends"),
                        React.createElement("div", { style: { fontSize: 18, fontWeight: "bold", color: T.text } },
                            "@",
                            username),
                        companyName && React.createElement("div", { style: { fontSize: 11, color: T.cyan, marginTop: 2 } },
                            "\uD83C\uDFE2 ",
                            companyName)),
                    React.createElement("div", { style: { textAlign: "right" } },
                        React.createElement("div", { style: { fontSize: 11, color: T.muted, marginBottom: 2 } }, "Net Worth"),
                        React.createElement("div", { style: { fontSize: 22, fontWeight: "bold", fontFamily: "monospace", color: T.green } }, fmt(netWorth)))),
                React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 } }, [
                    { l: "Driving Income", v: fmt(totalDrivingIncome), c: T.gold },
                    { l: "Tax Paid", v: fmt(totalTaxPaid), c: T.orange },
                    { l: "Stocks Owned", v: stocksOwned.length + " companies", c: T.purple },
                    { l: "Properties", v: propsOwned.length + " assets", c: T.cyan },
                ].map(m => (React.createElement("div", { key: m.l, style: { background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "10px 12px", border: "1px solid rgba(255,255,255,0.06)" } },
                    React.createElement("div", { style: { fontSize: 10, color: T.muted, marginBottom: 3 } }, m.l),
                    React.createElement("div", { style: { fontSize: 13, fontWeight: "bold", fontFamily: "monospace", color: m.c } }, m.v))))),
                stocksOwned.length > 0 && (React.createElement("div", { style: { display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 } }, stocksOwned.map(s => (React.createElement("span", { key: s.ticker, style: { fontSize: 10, padding: "2px 7px", borderRadius: 20, background: s.country === "NG" ? "rgba(0,229,160,0.1)" : "rgba(0,229,255,0.1)", color: s.country === "NG" ? "#00e5a0" : T.cyan, border: `1px solid ${s.country === "NG" ? "#00e5a044" : T.cyan + "44"}` } }, s.ticker))))),
                React.createElement("div", { style: { fontSize: 11, color: T.muted, textAlign: "center", marginTop: 8 } }, "\uD83C\uDFAE Play Market Legends \u2014 Financial Life Simulator")),
            React.createElement("div", { style: { background: T.card, border: `1px solid ${T.border}`, borderRadius: D.br, padding: 12, marginBottom: 12, fontSize: 11, color: T.muted, fontFamily: "monospace", whiteSpace: "pre-wrap", lineHeight: 1.6, maxHeight: 140, overflowY: "auto" } }, progressText),
            React.createElement("div", { style: { display: "flex", gap: 10 } },
                React.createElement("button", { onClick: copyText, style: { flex: 1, padding: "12px", background: copied ? `${T.green}18` : `${T.cyan}18`, border: `1px solid ${copied ? T.green : T.cyan}`, borderRadius: D.br, color: copied ? T.green : T.cyan, fontWeight: "bold", fontSize: 13, cursor: "pointer", transition: "all 0.2s" } }, copied ? "✓ Copied! Paste anywhere" : "📋 Copy Progress"),
                React.createElement("button", { onClick: onClose, style: { flex: 1, padding: "12px", background: "transparent", border: `1px solid ${T.border}`, borderRadius: D.br, color: T.muted, fontSize: 13, cursor: "pointer" } }, "Close")))));
}
// ── AI VALUATION ENGINE ───────────────────────────────────────────────────────
async function aiValuateCompany(companyName) {
    const prompt = `You are a professional stock analyst. A user wants to analyse "${companyName}" using these 7 investment criteria:

1. Revenue growing consistently for past 5 years
2. Profit growing consistently for past 5 years  
3. Operating cash flow growing consistently for past 5 years
4. Strong economic moat (score 7/10 or above)
5. ROE 10% or above
6. Current Ratio (Current Assets / Current Liabilities) 1 or above
7. Current price is at or below DCF intrinsic value using FCFE divided by (1+ROE) to the power n, where n runs from 1 to 10

Using your best available financial knowledge, respond ONLY with a valid JSON object, no markdown, no explanation, no backticks:
{
  "name": "Full company name",
  "ticker": "TICKER",
  "exchange": "Exchange",
  "sector": "Sector",
  "country": "Country",
  "currentPrice": 100.0,
  "revenue5yr": [x1,x2,x3,x4,x5],
  "profit5yr": [x1,x2,x3,x4,x5],
  "ocf5yr": [x1,x2,x3,x4,x5],
  "roe": 0.15,
  "currentRatio": 1.4,
  "fcfe": 50.0,
  "moatScore": 8,
  "moatDesc": "Brief competitive advantages",
  "confidence": "high or medium or low",
  "dataNote": "Note on data quality",
  "criteria": [
    {"id":"rev","label":"Revenue growing 5yr","pass":true,"reason":"..."},
    {"id":"pft","label":"Profit growing 5yr","pass":true,"reason":"..."},
    {"id":"ocf","label":"Operating cash flow growing","pass":true,"reason":"..."},
    {"id":"moat","label":"Strong economic moat","pass":true,"reason":"..."},
    {"id":"roe","label":"ROE 10% or above","pass":true,"reason":"..."},
    {"id":"cr","label":"Current Ratio 1 or above","pass":true,"reason":"..."},
    {"id":"dcf","label":"Price at or below intrinsic value","pass":false,"reason":"..."}
  ]
}
Revenue, profit and OCF values should be in millions. Always return JSON even if confidence is low.`;
    const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1500,
            messages: [{ role: "user", content: prompt }],
        }),
    });
    const data = await response.json();
    const raw = data.content.map(i => i.text || "").join("").trim();
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
}
function ValuationApp({ onClose }) {
    const [searchQ, setSearchQ] = useState("");
    const [selected, setSelected] = useState(null);
    const [aiQuery, setAiQuery] = useState("");
    const [aiResult, setAiResult] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState("");
    const [mode, setMode] = useState("ai");
    const [history, setHistory] = useState([]);
    const filtered = searchQ.trim().length > 0
        ? ALL_STOCKS.filter(s => s.ticker.toLowerCase().includes(searchQ.toLowerCase()) || s.name.toLowerCase().includes(searchQ.toLowerCase()))
        : ALL_STOCKS;
    async function runAI(query) {
        const q = query || aiQuery;
        if (!q.trim()) {
            setAiError("Enter a company name.");
            return;
        }
        setAiLoading(true);
        setAiError("");
        setAiResult(null);
        try {
            const data = await aiValuateCompany(q.trim());
            const intrinsic = computeDCF(data.fcfe, data.roe, 10);
            const score = data.criteria.filter(c => c.pass).length;
            const qualified = score >= 5;
            const result = { ...data, intrinsic, score, qualified };
            setAiResult(result);
            setHistory(h => [{ query: q.trim(), name: data.name, score, qualified, time: new Date().toLocaleTimeString() }, ...h.slice(0, 4)]);
        }
        catch (e) {
            setAiError("Analysis failed: " + e.message + ". Try a more well-known company or check your spelling.");
        }
        setAiLoading(false);
    }
    const CONF_COLOR = { high: T.green, medium: T.gold, low: T.orange };
    const EXAMPLES = ["Zenith Bank", "Access Bank", "Seplat Energy", "Stanbic IBTC", "Microsoft", "Berkshire Hathaway", "Safaricom", "Standard Bank South Africa"];
    return (React.createElement("div", { style: { background: T.bg, fontFamily: "'Segoe UI',sans-serif", padding: 16, minHeight: "100vh" } },
        React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 } },
            React.createElement("div", null,
                React.createElement("div", { style: { fontSize: 16, fontWeight: "bold", color: T.gold } }, "\uD83D\uDD2C Stock Valuation App"),
                React.createElement("div", { style: { fontSize: 10, color: T.muted } }, "7-Criteria Fundamental Analysis \u00B7 Powered by AI \u00B7 Any Company Worldwide")),
            React.createElement("button", { onClick: onClose, style: { background: "transparent", border: "1px solid " + T.border, borderRadius: D.brs, color: T.muted, padding: "5px 10px", cursor: "pointer", fontSize: 12 } }, "\u2715 Close")),
        React.createElement("div", { style: { display: "flex", gap: 4, marginBottom: 14, background: T.card, borderRadius: D.brs, padding: 4 } }, [{ id: "ai", label: "🤖 AI — Any Company" }, { id: "search", label: "🔍 Our 14 Stocks" }].map(m => (React.createElement("button", { key: m.id, onClick: () => { setMode(m.id); setAiResult(null); setAiError(""); setSelected(null); }, style: { flex: 1, padding: "8px", fontSize: 11, fontWeight: mode === m.id ? "bold" : "normal", color: mode === m.id ? T.gold : T.muted, background: mode === m.id ? T.gold + "18" : "transparent", border: "1px solid " + (mode === m.id ? T.gold + "44" : "transparent"), borderRadius: D.brs, cursor: "pointer" } }, m.label)))),
        mode === "ai" && (React.createElement("div", null,
            React.createElement("div", { style: { background: T.card, border: "1px solid " + T.cyan + "33", borderRadius: D.br, padding: 12, marginBottom: 12, fontSize: 12, color: T.muted, lineHeight: 1.7 } },
                "Type ",
                React.createElement("strong", { style: { color: T.text } }, "any company name"),
                " \u2014 Nigerian, US, or international. The AI will research its financials and score it against all 7 fundamental criteria automatically, then calculate its DCF intrinsic value.",
                React.createElement("div", { style: { marginTop: 5, fontSize: 11, color: T.orange } }, "\u26A0\uFE0F Accuracy is highest for major listed companies. Always verify with official filings before investing.")),
            React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 10 } },
                React.createElement("input", { value: aiQuery, onChange: e => setAiQuery(e.target.value), onKeyDown: e => e.key === "Enter" && !aiLoading && runAI(), placeholder: "e.g. Dangote Cement, Apple, MTN Nigeria, Zenith Bank\u2026", style: { flex: 1, background: T.surface, border: "1px solid " + T.border, borderRadius: D.br, color: T.text, padding: "11px 14px", fontSize: 13, boxSizing: "border-box" } }),
                React.createElement("button", { onClick: () => runAI(), disabled: aiLoading, style: { padding: "11px 18px", background: aiLoading ? T.surface : "linear-gradient(135deg," + T.gold + "," + T.orange + ")", color: aiLoading ? T.muted : "#05050a", border: "1px solid " + (aiLoading ? T.border : T.gold), borderRadius: D.br, fontWeight: "bold", fontSize: 13, cursor: aiLoading ? "not-allowed" : "pointer", whiteSpace: "nowrap", minWidth: 100 } }, aiLoading ? "Analysing…" : "🔬 Analyse")),
            !aiResult && !aiLoading && (React.createElement("div", { style: { marginBottom: 12 } },
                React.createElement("div", { style: { fontSize: 10, color: T.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 } }, "Quick examples \u2014 tap to analyse:"),
                React.createElement("div", { style: { display: "flex", gap: 5, flexWrap: "wrap" } }, EXAMPLES.map(ex => (React.createElement("button", { key: ex, onClick: () => { setAiQuery(ex); runAI(ex); }, style: { fontSize: 11, padding: "4px 10px", borderRadius: 20, border: "1px solid " + T.border, background: T.surface, color: T.muted, cursor: "pointer" } }, ex)))))),
            history.length > 0 && !aiLoading && (React.createElement("div", { style: { marginBottom: 12 } },
                React.createElement("div", { style: { fontSize: 10, color: T.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 } }, "Recent analyses:"),
                React.createElement("div", { style: { display: "flex", gap: 5, flexWrap: "wrap" } }, history.map((h, i) => (React.createElement("button", { key: i, onClick: () => { setAiQuery(h.query); runAI(h.query); }, style: { fontSize: 11, padding: "4px 10px", borderRadius: 20, border: "1px solid " + (h.qualified ? T.green + "55" : T.red + "44"), background: h.qualified ? "rgba(0,255,136,0.05)" : "rgba(255,71,87,0.05)", color: h.qualified ? T.green : T.red, cursor: "pointer" } },
                    h.name,
                    " (",
                    h.score,
                    "/7)")))))),
            aiLoading && (React.createElement("div", { style: { background: T.card, border: "1px solid " + T.gold + "44", borderRadius: D.br, padding: 20, textAlign: "center" } },
                React.createElement("div", { style: { fontSize: 28, marginBottom: 10 } }, "\uD83D\uDD2C"),
                React.createElement("div", { style: { fontWeight: "bold", fontSize: 14, color: T.gold, marginBottom: 12 } },
                    "Analysing ",
                    aiQuery,
                    "\u2026"),
                ["📊 Checking 5-year revenue trend", "📈 Evaluating profit growth", "💵 Reviewing operating cash flow", "🏰 Assessing economic moat", "📐 Calculating ROE", "⚖️ Checking current ratio", "🧮 Running DCF intrinsic value model"].map((step, i) => (React.createElement("div", { key: i, style: { display: "flex", alignItems: "center", gap: 8, padding: "5px 0", textAlign: "left" } },
                    React.createElement("div", { style: { width: 16, height: 16, borderRadius: "50%", background: T.gold + "33", border: "1px solid " + T.gold, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } },
                        React.createElement("div", { style: { width: 6, height: 6, borderRadius: "50%", background: T.gold } })),
                    React.createElement("span", { style: { fontSize: 11, color: T.muted } }, step)))))),
            aiError && (React.createElement("div", { style: { background: "rgba(255,71,87,0.1)", border: "1px solid " + T.red + "44", borderRadius: D.brs, padding: "10px 14px", fontSize: 12, color: T.red, marginBottom: 10 } }, aiError)),
            aiResult && !aiLoading && (React.createElement("div", null,
                React.createElement("div", { style: { background: T.card, border: "1px solid " + CONF_COLOR[aiResult.confidence || "medium"] + "44", borderRadius: D.br, padding: "10px 14px", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 } },
                    React.createElement("div", { style: { fontSize: 20 } }, aiResult.confidence === "high" ? "✅" : aiResult.confidence === "medium" ? "⚡" : "⚠️"),
                    React.createElement("div", { style: { flex: 1 } },
                        React.createElement("div", { style: { fontSize: 12, fontWeight: "bold", color: CONF_COLOR[aiResult.confidence || "medium"] } },
                            "AI Confidence: ",
                            (aiResult.confidence || "medium").toUpperCase()),
                        React.createElement("div", { style: { fontSize: 11, color: T.muted, marginTop: 2 } }, aiResult.dataNote)),
                    React.createElement("button", { onClick: () => { setAiResult(null); setAiQuery(""); }, style: { fontSize: 11, padding: "5px 10px", background: "transparent", border: "1px solid " + T.border, borderRadius: D.brs, color: T.muted, cursor: "pointer" } }, "New Search")),
                React.createElement(AIScoreCard, { r: aiResult }))))),
        mode === "search" && (React.createElement("div", null,
            React.createElement("input", { value: searchQ, onChange: e => setSearchQ(e.target.value), placeholder: "Search ticker or name (e.g. AAPL, Dangote, MTN)\u2026", style: { width: "100%", background: T.surface, border: "1px solid " + T.border, borderRadius: D.br, color: T.text, padding: "10px 14px", fontSize: 13, boxSizing: "border-box", marginBottom: 12 } }),
            React.createElement("div", { style: { display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 14 } },
                filtered.map(s => (React.createElement("button", { key: s.ticker, onClick: () => setSelected(selected?.ticker === s.ticker ? null : s), style: { fontSize: 11, padding: "5px 10px", borderRadius: 20, border: "1px solid " + (s.analysis.qualified ? T.green + "55" : T.border), background: selected?.ticker === s.ticker ? T.purple + "33" : T.surface, color: s.analysis.qualified ? T.green : T.muted, cursor: "pointer", fontWeight: "bold" } },
                    s.ticker,
                    " ",
                    s.country === "NG" ? "🇳🇬" : "🇺🇸"))),
                filtered.length === 0 && React.createElement("div", { style: { fontSize: 12, color: T.muted, padding: "10px 0" } }, "No match found. Switch to AI mode to analyse any company.")),
            selected && (() => {
                const s = selected;
                const a = s.analysis;
                const intrinsic = computeDCF(s.fcfe, s.roe, 10);
                return React.createElement(ScoreCard, { s: s, a: a, intrinsic: intrinsic });
            })()))));
}
function AIScoreCard({ r }) {
    const score = r.score || r.criteria.filter(c => c.pass).length;
    const qualified = r.qualified || (score >= 5);
    const intrinsic = r.intrinsic || computeDCF(r.fcfe, r.roe, 10);
    return (React.createElement("div", { style: { background: T.card, border: "1px solid " + (qualified ? T.green + "55" : T.red + "44"), borderRadius: D.br, padding: 14, marginBottom: 12 } },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, flexWrap: "wrap", gap: 8 } },
            React.createElement("div", null,
                React.createElement("div", { style: { fontWeight: "bold", fontSize: 15, color: T.text } }, r.name),
                React.createElement("div", { style: { fontSize: 11, color: T.muted } },
                    r.exchange,
                    " \u00B7 ",
                    r.sector,
                    " \u00B7 ",
                    r.country)),
            React.createElement("div", { style: { textAlign: "right" } },
                React.createElement("div", { style: { fontSize: 11, color: T.muted } }, "AI Score"),
                React.createElement("div", { style: { fontSize: 22, fontWeight: "bold", color: qualified ? T.green : T.red } },
                    score,
                    "/7"),
                React.createElement("div", { style: { fontSize: 10, fontWeight: "bold", color: qualified ? T.green : T.red } }, qualified ? "✓ QUALIFIED" : "✗ NOT QUALIFIED"))),
        r.moatDesc && React.createElement("div", { style: { fontSize: 12, color: T.muted, marginBottom: 10, fontStyle: "italic", background: T.surface, padding: "8px 10px", borderRadius: D.brs } },
            "\"",
            r.moatDesc,
            "\""),
        React.createElement("div", { style: { marginBottom: 10 } }, r.criteria.map(c => (React.createElement("div", { key: c.id, style: { padding: "8px 0", borderBottom: "1px solid " + T.border, fontSize: 12 } },
            React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 3 } },
                React.createElement("div", { style: { width: 20, height: 20, borderRadius: "50%", background: c.pass ? "rgba(0,255,136,0.15)" : "rgba(255,71,87,0.15)", border: "1px solid " + (c.pass ? T.green : T.red), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: c.pass ? T.green : T.red, flexShrink: 0, fontWeight: "bold" } }, c.pass ? "✓" : "✗"),
                React.createElement("span", { style: { color: c.pass ? T.text : T.muted, flex: 1, fontWeight: "bold" } }, c.label)),
            React.createElement("div", { style: { fontSize: 11, color: T.muted, marginLeft: 28, lineHeight: 1.5 } }, c.reason))))),
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, marginBottom: 10 } }, [
            { l: "ROE", v: (r.roe * 100).toFixed(1) + "%", ok: r.roe >= 0.10 },
            { l: "Current Ratio", v: (+r.currentRatio).toFixed(2), ok: r.currentRatio >= 1 },
            { l: "Intrinsic Val", v: "$" + Math.max(0, intrinsic).toLocaleString(), ok: r.currentPrice <= intrinsic },
            { l: "Market Price", v: "$" + r.currentPrice, ok: true },
            { l: "FCFE ($M)", v: "$" + r.fcfe, ok: r.fcfe > 0 },
            { l: "Moat", v: r.moatScore + "/10", ok: r.moatScore >= 7 },
        ].map(m => (React.createElement("div", { key: m.l, style: { background: T.surface, borderRadius: D.brs, padding: "8px 10px", border: "1px solid " + T.border } },
            React.createElement("div", { style: { fontSize: 9, color: T.muted, marginBottom: 3 } }, m.l),
            React.createElement("div", { style: { fontSize: 12, fontWeight: "bold", fontFamily: "monospace", color: m.ok ? T.green : T.orange } }, m.v))))),
        React.createElement("div", { style: { fontSize: 11, color: T.muted, background: T.surface, padding: "8px 10px", borderRadius: D.brs, lineHeight: 1.8 } },
            React.createElement("strong", { style: { color: T.cyan } }, "Revenue 5yr ($M):"),
            " ",
            r.revenue5yr.join(" → "),
            React.createElement("br", null),
            React.createElement("strong", { style: { color: T.cyan } }, "Profit 5yr ($M):"),
            " ",
            r.profit5yr.join(" → "),
            React.createElement("br", null),
            React.createElement("strong", { style: { color: T.cyan } }, "Op. Cash Flow ($M):"),
            " ",
            r.ocf5yr.join(" → "),
            React.createElement("br", null),
            React.createElement("strong", { style: { color: T.cyan } }, "DCF Formula:"),
            " \u03A3 FCFE/(1+ROE)^t, t=1..10 = ",
            React.createElement("strong", { style: { color: T.gold } },
                "$",
                intrinsic.toLocaleString()))));
}
function ScoreCard({ s, a, intrinsic }) {
    return (React.createElement("div", { style: { background: T.card, border: "1px solid " + (a.qualified ? T.green + "55" : T.red + "44"), borderRadius: D.br, padding: 14, marginBottom: 12 } },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, flexWrap: "wrap", gap: 8 } },
            React.createElement("div", null,
                React.createElement("div", { style: { fontWeight: "bold", fontSize: 14, color: T.text } }, s.name),
                React.createElement("div", { style: { fontSize: 11, color: T.muted } },
                    s.exchange,
                    " \u00B7 ",
                    s.sector)),
            React.createElement("div", { style: { textAlign: "right" } },
                React.createElement("div", { style: { fontSize: 11, color: T.muted } }, "Score"),
                React.createElement("div", { style: { fontSize: 20, fontWeight: "bold", color: a.qualified ? T.green : T.red } },
                    a.score,
                    "/7"),
                React.createElement("div", { style: { fontSize: 10, color: a.qualified ? T.green : T.red, fontWeight: "bold" } }, a.qualified ? "✓ QUALIFIED" : "✗ NOT QUALIFIED"))),
        s.moatDesc && React.createElement("div", { style: { fontSize: 12, color: T.muted, marginBottom: 10, fontStyle: "italic", background: T.surface, padding: "8px 10px", borderRadius: D.brs } },
            "\"",
            s.moatDesc,
            "\""),
        a.criteria.map(c => (React.createElement("div", { key: c.id, style: { display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: "1px solid " + T.border, fontSize: 12 } },
            React.createElement("div", { style: { width: 20, height: 20, borderRadius: "50%", background: c.pass ? "rgba(0,255,136,0.15)" : "rgba(255,71,87,0.15)", border: "1px solid " + (c.pass ? T.green : T.red), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: c.pass ? T.green : T.red, flexShrink: 0, fontWeight: "bold" } }, c.pass ? "✓" : "✗"),
            React.createElement("span", { style: { color: c.pass ? T.text : T.muted, flex: 1 } }, c.label)))),
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, marginTop: 10 } }, [{ l: "ROE", v: (s.roe * 100).toFixed(1) + "%", ok: s.roe >= 0.10 }, { l: "Current Ratio", v: (+s.currentRatio).toFixed(2), ok: s.currentRatio >= 1 }, { l: "Intrinsic", v: "$" + Math.max(0, intrinsic).toLocaleString(), ok: s.price <= intrinsic }, { l: "Price", v: "$" + s.basePrice, ok: true }, { l: "FCFE", v: "$" + s.fcfe, ok: s.fcfe > 0 }, { l: "Moat", v: s.moatScore + "/10", ok: s.moatScore >= 7 }].map(m => (React.createElement("div", { key: m.l, style: { background: T.surface, borderRadius: D.brs, padding: "8px 10px", border: "1px solid " + T.border } },
            React.createElement("div", { style: { fontSize: 9, color: T.muted, marginBottom: 3 } }, m.l),
            React.createElement("div", { style: { fontSize: 12, fontWeight: "bold", fontFamily: "monospace", color: m.ok ? T.green : T.orange } }, m.v))))),
        React.createElement("div", { style: { marginTop: 10, fontSize: 11, color: T.muted, background: T.surface, padding: "8px 10px", borderRadius: D.brs, lineHeight: 1.8 } },
            React.createElement("strong", { style: { color: T.cyan } }, "Revenue 5yr:"),
            " ",
            s.revenue5yr.join(" → "),
            React.createElement("br", null),
            React.createElement("strong", { style: { color: T.cyan } }, "Profit 5yr:"),
            " ",
            s.profit5yr.join(" → "),
            React.createElement("br", null),
            React.createElement("strong", { style: { color: T.cyan } }, "Op. Cash Flow:"),
            " ",
            s.ocf5yr.join(" → "))));
}
// ── MILESTONE CELEBRATION ─────────────────────────────────────────────────────
function MilestoneCelebration({ milestone, onClose }) {
    const [particles, setParticles] = useState(() => Array.from({ length: 32 }, (_, i) => ({
        id: i, x: Math.random() * 100, y: -10 - Math.random() * 20,
        vx: (Math.random() - 0.5) * 1.4, vy: 1 + Math.random() * 2,
        col: ["#f5c842", "#00e5ff", "#00ff88", "#ff9500", "#7c6fdf", "#ff4757"][i % 6],
        size: 6 + Math.random() * 8, rot: Math.random() * 360, vr: (Math.random() - 0.5) * 6,
    })));
    useEffect(() => {
        const id = setInterval(() => setParticles(ps => ps.map(p => ({ ...p, y: p.y + p.vy, x: p.x + p.vx, rot: p.rot + p.vr })).filter(p => p.y < 120)), 40);
        return () => clearInterval(id);
    }, []);
    useEffect(() => { const id = setTimeout(onClose, 4500); return () => clearTimeout(id); }, []);
    return (React.createElement("div", { style: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 999, background: "rgba(7,12,24,0.92)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI',sans-serif" }, onClick: onClose },
        React.createElement("div", { style: { position: "absolute", top: 0, left: 0, right: 0, height: "100%", pointerEvents: "none", overflow: "hidden" } }, particles.map(p => (React.createElement("div", { key: p.id, style: { position: "absolute", left: p.x + "%", top: p.y + "%", width: p.size, height: p.size, background: p.col, borderRadius: 2, transform: `rotate(${p.rot}deg)`, opacity: 0.9 } })))),
        React.createElement("div", { style: { background: "linear-gradient(135deg,#0f1729,#131d30)", border: `2px solid ${milestone.color}`, borderRadius: 20, padding: "32px 40px", textAlign: "center", maxWidth: 320, position: "relative", zIndex: 1 } },
            React.createElement("div", { style: { fontSize: 56, marginBottom: 10 } }, milestone.emoji),
            React.createElement("div", { style: { fontSize: 22, fontWeight: "bold", color: milestone.color, marginBottom: 6 } }, milestone.label),
            React.createElement("div", { style: { fontSize: 14, color: "#e8edf5", marginBottom: 4, lineHeight: 1.6 } }, milestone.msg),
            React.createElement("div", { style: { fontSize: 12, color: "#6b7fa0", marginTop: 14 } }, "Tap anywhere to continue"))));
}
// ── ONBOARDING TUTORIAL ───────────────────────────────────────────────────────
const TOUR_STEPS = [
    { target: "hub", title: "Welcome to Market Legends! 🎮", body: "This is your Hub — your financial command centre. Your wallet balance and net worth are always shown at the top.", icon: "ti-layout-dashboard" },
    { target: "runner", title: "Earn money driving 🚗", body: "Tap Runner to hit the road. Dodge bad stocks, collect good ones, and earn cash. Your income gets taxed when you exit.", icon: "ti-steering-wheel" },
    { target: "invest", title: "Invest your earnings 📈", body: "Use the Invest tab to buy stocks across Africa and the US, purchase properties, and lend money to earn interest.", icon: "ti-building" },
    { target: "learn", title: "Learn & earn XP 🎓", body: "Complete lessons in the Learn tab to unlock perks and earn XP. Quizzes also pop up mid-drive for bonus cash!", icon: "ti-school" },
    { target: "tax", title: "Manage your taxes 💼", body: "Register a company to cut your tax rate from 40% to 30% and unlock deductions. Every drive triggers a tax event.", icon: "ti-receipt-tax" },
];
function OnboardingTour({ onFinish }) {
    const [step, setStep] = useState(0);
    const s = TOUR_STEPS[step];
    const isLast = step === TOUR_STEPS.length - 1;
    return (React.createElement("div", { style: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 900, background: "rgba(7,12,24,0.88)", display: "flex", alignItems: "flex-end", justifyContent: "center", fontFamily: "'Segoe UI',sans-serif", padding: 16 } },
        React.createElement("div", { style: { background: "#0f1729", border: "1px solid #1e2d45", borderRadius: 16, padding: 24, width: "100%", maxWidth: 440, marginBottom: 20 } },
            React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 14 } },
                React.createElement("div", { style: { width: 42, height: 42, borderRadius: 10, background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } },
                    React.createElement("i", { className: `ti ${s.icon}`, style: { fontSize: 20, color: "#00e5ff" }, "aria-hidden": "true" })),
                React.createElement("div", { style: { fontWeight: "bold", fontSize: 15, color: "#e8edf5" } }, s.title)),
            React.createElement("div", { style: { fontSize: 13, color: "#6b7fa0", lineHeight: 1.7, marginBottom: 18 } }, s.body),
            React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" } },
                React.createElement("div", { style: { display: "flex", gap: 5 } }, TOUR_STEPS.map((_, i) => (React.createElement("div", { key: i, style: { width: i === step ? 16 : 6, height: 6, borderRadius: 3, background: i <= step ? "#00e5ff" : "#1e2d45", transition: "all 0.3s" } })))),
                React.createElement("div", { style: { display: "flex", gap: 8 } },
                    step > 0 && React.createElement("button", { onClick: () => setStep(s => s - 1), style: { padding: "8px 14px", background: "transparent", border: "1px solid #1e2d45", borderRadius: 8, color: "#6b7fa0", cursor: "pointer", fontSize: 13 } }, "Back"),
                    React.createElement("button", { onClick: () => isLast ? onFinish() : setStep(s => s + 1), style: { padding: "8px 18px", background: isLast ? "linear-gradient(135deg,#00ff88,#00e5ff)" : "rgba(0,229,255,0.1)", border: `1px solid ${isLast ? "#00ff88" : "#00e5ff"}`, borderRadius: 8, color: isLast ? "#05050a" : "#00e5ff", fontWeight: "bold", cursor: "pointer", fontSize: 13 } }, isLast ? "Let's Go! 🚀" : "Next →"))))));
}
// ── AI FINANCIAL COACH ────────────────────────────────────────────────────────
// ── FREE BUILT-IN FINANCIAL COACH (no API key needed) ────────────────────────
const COACH_KB = [
    // ROE
    { keys: ["roe", "return on equity", "returns on equity"],
        answer: (ctx) => `Return on Equity (ROE) measures how efficiently a company uses shareholder money to generate profit. The formula is: Net Profit ÷ Shareholder Equity × 100.

A good ROE is generally 10% or above — that's one of our 7 criteria for qualifying stocks in Market Legends. Companies like Dangote Cement and NVDA score high here because they generate strong profits relative to what shareholders invested.

Your current net worth is ${ctx.netWorth}. As you build wealth, ROE helps you pick companies that will grow your money faster. Always compare ROE within the same industry — banks naturally have different ROE than tech companies.` },
    // DCF
    { keys: ["dcf", "discounted cash flow", "intrinsic value", "valuation"],
        answer: (ctx) => `DCF (Discounted Cash Flow) is the gold standard for valuing a company. Our formula is: FCFE ÷ (1 + ROE)^n, summed over 10 years.

FCFE is the cash a company generates for its shareholders after all expenses. ROE is the discount rate — the higher it is, the harder a company must work to justify its price. N is the number of years (we use 10).

If the DCF value is HIGHER than the current price, the stock is undervalued — a potential buy. If it's lower, the stock may be overpriced. This is how smart investors like Warren Buffett decide what to pay for a business.` },
    // Economic moat
    { keys: ["moat", "economic moat", "competitive advantage", "competitive moat"],
        answer: (ctx) => `An economic moat is what protects a company from competitors — like a castle moat protects from attackers. Warren Buffett coined this term.

Strong moats include: brand loyalty (Cadbury's Bournvita), network effects (MTN Nigeria's subscriber base), cost advantages (Dangote Cement's scale), and switching costs (Apple's ecosystem).

In Market Legends, we rate moats from 1–10. A score of 7 or above passes our quality test. Companies with strong moats tend to grow consistently — which is why we look for 5 consecutive years of rising revenue, profit, and cash flow.` },
    // Tax
    { keys: ["tax", "taxes", "taxation", "tax rate", "40%", "30%"],
        answer: (ctx) => `In Market Legends, tax works like real life. Unregistered individuals pay a flat 40% on all driving income — no deductions allowed.

If you register a company (costs $9,500), you can deduct business expenses first — staff salaries, rent, R&D, debt repayment — before tax is applied. The company tax rate is 30%, and only kicks in when your taxable income exceeds $500,000 per drive session.

The lesson: structuring your income through a registered company can save you massive amounts in tax. That's exactly what real Nigerian entrepreneurs do when they incorporate with CAC. Your tax paid so far: ${ctx.taxPaid || "$0"}.` },
    // IPO
    { keys: ["ipo", "initial public offering", "go public", "listing", "stock exchange"],
        answer: (ctx) => `An IPO (Initial Public Offering) is when a private company sells shares to the public for the first time — becoming listed on a stock exchange like NGX or NASDAQ.

In Market Legends, you can launch your own IPO once your net worth reaches $70M AND you've unlocked the Stock Valuation App. This ensures you understand the market before listing.

When you go public, other players can buy shares in your company. If your business grows, their shares increase in value. Famous Nigerian IPOs include Dangote Cement (2010) and BUA Foods (2022). The goal: raise capital to expand even faster.` },
    // P2P / lending
    { keys: ["lend", "lending", "borrow", "loan", "p2p", "interest rate"],
        answer: (ctx) => `P2P (peer-to-peer) lending lets players lend money directly to each other — no bank needed. As a lender, you set your interest rate (10–100%) and repayment timeline (1–365 real calendar days).

As a borrower, you can request up to 80% of your income + assets. Lenders see your credit profile — if you've defaulted before, you'll be flagged red. If your finances are strong, you get a green credible badge.

The interest income you earn from lending is taxed — 30% if you're a registered company, 40% if you're an individual. This mirrors how real Nigerian money market funds and microfinance institutions operate.` },
    // Stocks
    { keys: ["stock", "stocks", "share", "shares", "equity", "buy stock", "sell stock"],
        answer: (ctx) => `A stock (or share) represents ownership in a company. When you buy shares, you become a part-owner — entitled to a portion of profits (dividends) and growth in value.

In Market Legends, we qualify stocks using 7 criteria: 5-year revenue growth, profit growth, cash flow growth, economic moat, ROE ≥ 10%, current ratio ≥ 1, and DCF intrinsic value above current price. Only companies passing 5 of 7 appear as green collectibles in the Runner game.

Our Nigerian stocks include Dangote Cement, BUA Foods, MTN Nigeria, Presco, and more — all real NGX-listed companies you can research and invest in today.` },
    // Current ratio
    { keys: ["current ratio", "liquidity", "current asset", "current liability"],
        answer: (ctx) => `The Current Ratio = Current Assets ÷ Current Liabilities. It measures a company's ability to pay short-term debts using short-term assets.

A ratio of 1.0 or above means the company can cover its immediate debts — that's our minimum threshold. A ratio of 2.0 means it has twice as many assets as liabilities — very safe.

Below 1.0 is a warning sign — the company may struggle to pay bills. This is why banks and investors always check liquidity before lending or investing. In our 7-criteria engine, current ratio ≥ 1 is one of the required checks.` },
    // Net worth
    { keys: ["net worth", "networth", "wealth", "rich"],
        answer: (ctx) => `Net worth = Total Assets − Total Liabilities. It's the truest measure of wealth.

In Market Legends, your net worth includes your wallet cash, stock portfolio value, and the liquidation value of all your investments (real estate, gold, crypto, bonds, etc.).

Your current net worth is ${ctx.netWorth}. To grow it faster: (1) earn driving income, (2) invest in income-generating assets, (3) register a company to reduce taxes, (4) lend to other players at interest, (5) buy qualified stocks that appreciate over time.` },
    // Diversification
    { keys: ["diversif", "portfolio", "spread", "risk"],
        answer: (ctx) => `Diversification means spreading investments across different asset classes so that one bad investment doesn't ruin you. "Don't put all your eggs in one basket."

In Market Legends, you can diversify across: stocks (AAPL, DANGCEM, MTNNG), real estate (Studio Apartment, Mall Unit), commodities (Gold, Oil), crypto (Bitcoin, Ethereum), and bonds (Treasury Bond, Eurobond).

Each asset has different volatility and income characteristics. Real estate gives steady daily income. Crypto is high risk/reward. Bonds are safest. A balanced portfolio weathers market crashes better than one concentrated in a single asset.` },
    // Passive income
    { keys: ["passive", "passive income", "rental", "rent income", "daily income"],
        answer: (ctx) => `Passive income is money that flows to you without active work — while you sleep, eat, or drive in the Runner game. It's the foundation of financial freedom.

In Market Legends, passive income comes from: rental properties (Studio Apartment, Duplex, Mall Unit), Treasury Bonds, Agricultural Land, and other income-generating assets. Your daily income is ${ctx.income || "$0"}.

The goal: build enough passive income to cover your bills automatically. Then your driving income becomes pure profit. Real-world examples: rental properties, dividend stocks, government bonds — all available in our game!` },
    // Company registration
    { keys: ["register", "company", "cac", "incorporate", "business registration"],
        answer: (ctx) => `Registering a company costs $9,500 in Market Legends — just like paying CAC (Corporate Affairs Commission) fees in real Nigeria.

Benefits: (1) Tax deductions — deduct salaries, rent, R&D, and debt before tax is applied. (2) Lower tax rate — 30% instead of 40%. (3) Company ledger — build a financial history of every expense. (4) IPO eligibility — you must be registered to list on the exchange.

${ctx.hasCompany === "Yes" ? "You already have a registered company — great! Make sure to apportion your expenses after each drive to maximise your deductions." : "You're currently unregistered — consider registering when you have $9,500. The tax savings will quickly cover the cost."}` },
    // Free cash flow
    { keys: ["fcfe", "free cash flow", "cash flow", "operating cash flow"],
        answer: (ctx) => `Free Cash Flow to Equity (FCFE) is the cash left over after a company pays all its expenses AND reinvests in the business — the money truly available to shareholders.

Formula: Operating Cash Flow − Capital Expenditure + Net Borrowing = FCFE

We use FCFE in our DCF formula: FCFE ÷ (1+ROE)^t, summed over 10 years. A growing FCFE over 5 years is one of our 7 qualifying criteria. It's the purest measure of business health — profits can be manipulated by accounting, but cash is real.` },
];
function askFinancialCoach(question, context) {
    return new Promise(resolve => {
        const q = question.toLowerCase();
        // Find best matching answer
        let best = null, bestScore = 0;
        for (const entry of COACH_KB) {
            const score = entry.keys.filter(k => q.includes(k)).length;
            if (score > bestScore) {
                bestScore = score;
                best = entry;
            }
        }
        if (best && bestScore > 0) {
            resolve(best.answer(context));
        }
        else {
            // General fallback
            resolve(`Great question! Here are the core principles to keep in mind as you build wealth in Market Legends:

📈 **Invest wisely**: Use our 7-criteria engine to find quality stocks — growing revenue, profit, cash flow, strong moat, ROE ≥ 10%, current ratio ≥ 1, and trading below DCF intrinsic value.

🏢 **Register your company**: Save on taxes by deducting business expenses before the 30% company tax rate applies.

🏠 **Build passive income**: Buy income-generating assets so money flows while you drive.

💸 **Lend to other players**: Earn 10–100% interest on P2P loans.

Your net worth is currently ${context.netWorth}. Keep driving, investing, and learning! 🚀`);
        }
    });
}
function AICoachModal({ netWorth, wallet, portfolio, xp, isRegistered, onClose }) {
    const [query, setQuery] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const SUGGESTIONS = ["Should I buy more stocks now?", "How does DCF valuation work?", "What is an economic moat?", "How can I reduce my tax?", "What is a good ROE?", "When should I register a company?", "Why is diversification important?"];
    const stocks = Object.entries(portfolio).filter(([, q]) => q > 0).map(([t, q]) => `${q}x${t}`).join(", ") || "none";
    async function ask(q) {
        const question = q || query;
        if (!question.trim())
            return;
        setLoading(true);
        setAnswer("");
        const ctx = { netWorth: netWorth.toLocaleString(), wallet: wallet.toLocaleString(), stocks, xp, hasCompany: isRegistered ? "Yes" : "No" };
        askFinancialCoach(question, ctx).then(a => {
            setAnswer(a);
            setHistory(h => [{ q: question, a }, ...h.slice(0, 4)]);
            setLoading(false);
        }).catch(() => setLoading(false));
    }
    return (React.createElement("div", { style: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(7,12,24,0.96)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, fontFamily: "'Segoe UI',sans-serif" } },
        React.createElement("div", { style: { background: "#0f1729", border: "1px solid #1e2d45", borderRadius: 16, width: "100%", maxWidth: 460, maxHeight: "88vh", overflowY: "auto" } },
            React.createElement("div", { style: { padding: "16px 20px", borderBottom: "1px solid #1e2d45", display: "flex", alignItems: "center", justifyContent: "space-between" } },
                React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } },
                    React.createElement("div", { style: { width: 36, height: 36, borderRadius: 10, background: "rgba(124,111,223,0.15)", border: "1px solid rgba(124,111,223,0.4)", display: "flex", alignItems: "center", justifyContent: "center" } },
                        React.createElement("i", { className: "ti ti-brain", style: { fontSize: 18, color: "#7c6fdf" }, "aria-hidden": "true" })),
                    React.createElement("div", null,
                        React.createElement("div", { style: { fontWeight: "bold", fontSize: 14, color: "#e8edf5" } }, "AI Financial Coach"),
                        React.createElement("div", { style: { fontSize: 10, color: "#6b7fa0" } }, "AI Financial Coach \u00B7 Personalised to your game"))),
                React.createElement("button", { onClick: onClose, style: { background: "transparent", border: "1px solid #1e2d45", borderRadius: 6, color: "#6b7fa0", padding: "4px 10px", cursor: "pointer", fontSize: 12 } }, "\u2715")),
            React.createElement("div", { style: { padding: "14px 16px" } },
                !answer && !loading && (React.createElement("div", { style: { marginBottom: 14 } },
                    React.createElement("div", { style: { fontSize: 11, color: "#6b7fa0", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 } }, "Ask me anything:"),
                    React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 5 } }, SUGGESTIONS.map((s, i) => (React.createElement("button", { key: i, onClick: () => { setQuery(s); ask(s); }, style: { fontSize: 11, padding: "5px 10px", borderRadius: 20, border: "1px solid #1e2d45", background: "#131d30", color: "#6b7fa0", cursor: "pointer" } }, s)))))),
                React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 14 } },
                    React.createElement("input", { value: query, onChange: e => setQuery(e.target.value), onKeyDown: e => e.key === "Enter" && !loading && ask(), placeholder: "Ask your coach anything\u2026", style: { flex: 1, background: "#131d30", border: "1px solid #1e2d45", borderRadius: 8, color: "#e8edf5", padding: "10px 12px", fontSize: 13 } }),
                    React.createElement("button", { onClick: () => ask(), disabled: loading || !query.trim(), style: { padding: "10px 16px", background: loading || !query.trim() ? "#131d30" : "linear-gradient(135deg,#7c6fdf,#00e5ff)", border: "none", borderRadius: 8, color: loading || !query.trim() ? "#6b7fa0" : "#05050a", fontWeight: "bold", cursor: loading || !query.trim() ? "not-allowed" : "pointer", fontSize: 13, whiteSpace: "nowrap" } }, loading ? "…" : "Ask ↗")),
                loading && (React.createElement("div", { style: { background: "#131d30", border: "1px solid rgba(124,111,223,0.3)", borderRadius: 10, padding: 16, textAlign: "center" } },
                    React.createElement("div", { style: { fontSize: 11, color: "#6b7fa0", marginBottom: 8 } }, "Your coach is thinking\u2026"),
                    React.createElement("div", { style: { display: "flex", justifyContent: "center", gap: 5 } }, [0, 1, 2].map(i => React.createElement("div", { key: i, style: { width: 8, height: 8, borderRadius: "50%", background: "#7c6fdf", animation: `pulse${i} 1s ease-in-out infinite`, opacity: 0.6 } }))))),
                answer && !loading && (React.createElement("div", { style: { background: "linear-gradient(135deg,rgba(124,111,223,0.08),rgba(0,229,255,0.05))", border: "1px solid rgba(124,111,223,0.3)", borderRadius: 10, padding: 16, marginBottom: 12 } },
                    React.createElement("div", { style: { fontSize: 10, color: "#7c6fdf", fontWeight: "bold", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 } }, "Coach says:"),
                    React.createElement("div", { style: { fontSize: 13, color: "#e8edf5", lineHeight: 1.8, whiteSpace: "pre-wrap" } }, answer),
                    React.createElement("button", { onClick: () => { setAnswer(""); setQuery(""); }, style: { marginTop: 12, fontSize: 11, padding: "5px 12px", background: "transparent", border: "1px solid #1e2d45", borderRadius: 6, color: "#6b7fa0", cursor: "pointer" } }, "Ask another question"))),
                history.length > 1 && (React.createElement("div", null,
                    React.createElement("div", { style: { fontSize: 11, color: "#6b7fa0", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 } }, "Previous questions:"),
                    history.slice(1).map((h, i) => (React.createElement("button", { key: i, onClick: () => { setQuery(h.q); ask(h.q); }, style: { display: "block", width: "100%", textAlign: "left", fontSize: 11, padding: "6px 10px", background: "#131d30", border: "1px solid #1e2d45", borderRadius: 6, color: "#6b7fa0", cursor: "pointer", marginBottom: 5 } },
                        "\"",
                        h.q,
                        "\"")))))))));
}
// ── MISTAKE DEBRIEF ───────────────────────────────────────────────────────────
async function getMistakeDebrief(ticker, buyPrice, sellPrice, analysis) {
    const loss = ((sellPrice - buyPrice) / buyPrice * 100).toFixed(1);
    const failedCriteria = analysis?.criteria?.filter(c => !c.pass).map(c => c.label).join(", ") || "unknown";
    const prompt = `A player in Market Legends just sold ${ticker} at a loss of ${loss}%. They bought at ${buyPrice.toFixed(2)} and sold at ${sellPrice.toFixed(2)}.

The stock failed these fundamental criteria: ${failedCriteria}.

Give a brief, educational debrief in 2-3 short paragraphs that:
1. Acknowledges the loss without being negative
2. Explains what the failed criteria reveal about the stock's weakness
3. Gives one actionable tip for next time using the 7-criteria framework

Keep it under 150 words. Be encouraging — frame it as a learning moment.`;
    const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 600, messages: [{ role: "user", content: prompt }] }),
    });
    const data = await response.json();
    return data.content.map(i => i.text || "").join("").trim();
}
function MistakeDebrief({ trade, stock, onClose }) {
    const [debrief, setDebrief] = useState("");
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getMistakeDebrief(trade.ticker, trade.buyPrice || trade.price, trade.price, stock?.analysis)
            .then(d => { setDebrief(d); setLoading(false); })
            .catch(() => { setDebrief("Every loss is a lesson. Use the 7-criteria checklist before your next trade to make sure the fundamentals are solid."); setLoading(false); });
    }, []);
    const loss = trade.buyPrice ? ((trade.price - trade.buyPrice) / trade.buyPrice * 100).toFixed(1) : null;
    return (React.createElement("div", { style: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(7,12,24,0.96)", zIndex: 600, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, fontFamily: "'Segoe UI',sans-serif" } },
        React.createElement("div", { style: { background: "#0f1729", border: "1px solid #ff4757", borderRadius: 16, width: "100%", maxWidth: 380, padding: 20 } },
            React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 14 } },
                React.createElement("div", { style: { fontSize: 28 } }, "\uD83D\uDCA1"),
                React.createElement("div", null,
                    React.createElement("div", { style: { fontWeight: "bold", fontSize: 15, color: "#e8edf5" } },
                        "Trade Debrief \u2014 ",
                        trade.ticker),
                    loss && React.createElement("div", { style: { fontSize: 11, color: "#ff4757", marginTop: 1 } },
                        loss,
                        "% from your entry price"))),
            loading ? (React.createElement("div", { style: { textAlign: "center", padding: "20px 0", color: "#6b7fa0", fontSize: 13 } }, "Analysing your trade\u2026")) : (React.createElement("div", { style: { background: "rgba(255,71,87,0.05)", border: "1px solid rgba(255,71,87,0.2)", borderRadius: 10, padding: 14, marginBottom: 14, fontSize: 13, color: "#e8edf5", lineHeight: 1.8, whiteSpace: "pre-wrap" } }, debrief)),
            React.createElement("button", { onClick: onClose, style: { width: "100%", padding: "11px", background: "rgba(0,229,255,0.1)", border: "1px solid #00e5ff", borderRadius: 8, color: "#00e5ff", fontWeight: "bold", cursor: "pointer", fontSize: 13 } }, "Got it \u2014 thanks, Coach!"))));
}
// ── DELETE ACCOUNT MODAL ─────────────────────────────────────────────────────
function DeleteAccountModal({ username, onConfirm, onCancel }) {
    const [confirmText, setConfirmText] = useState("");
    const [step, setStep] = useState(1); // 1=warn, 2=confirm
    const ready = confirmText.trim().toLowerCase() === username.toLowerCase();
    return (React.createElement("div", { style: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(7,12,24,0.97)", zIndex: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, fontFamily: "'Segoe UI',sans-serif" } },
        React.createElement("div", { style: { background: "#0f1729", border: "1px solid #ff4757", borderRadius: 16, width: "100%", maxWidth: 360, padding: 20 } }, step === 1 ? (React.createElement(React.Fragment, null,
            React.createElement("div", { style: { textAlign: "center", marginBottom: 16 } },
                React.createElement("div", { style: { fontSize: 40, marginBottom: 8 } }, "\u26A0\uFE0F"),
                React.createElement("div", { style: { fontWeight: "bold", fontSize: 16, color: "#ff4757", marginBottom: 6 } }, "Delete Account"),
                React.createElement("div", { style: { fontSize: 13, color: "#6b7fa0", lineHeight: 1.7 } },
                    "This will permanently delete ",
                    React.createElement("strong", { style: { color: "#e8edf5" } },
                        "@",
                        username),
                    " and all your game progress \u2014 wallet, stocks, properties, XP, streaks, everything.",
                    React.createElement("br", null),
                    React.createElement("br", null),
                    React.createElement("strong", { style: { color: "#ff4757" } }, "This cannot be undone."))),
            React.createElement("div", { style: { display: "flex", gap: 10 } },
                React.createElement("button", { onClick: onCancel, style: { flex: 1, padding: "11px", background: "transparent", border: "1px solid #1e2d45", borderRadius: 8, color: "#6b7fa0", cursor: "pointer", fontSize: 13 } }, "Cancel"),
                React.createElement("button", { onClick: () => setStep(2), style: { flex: 1, padding: "11px", background: "rgba(255,71,87,0.12)", border: "1px solid #ff4757", borderRadius: 8, color: "#ff4757", fontWeight: "bold", cursor: "pointer", fontSize: 13 } }, "Continue \u2192")))) : (React.createElement(React.Fragment, null,
            React.createElement("div", { style: { marginBottom: 14 } },
                React.createElement("div", { style: { fontWeight: "bold", fontSize: 14, color: "#e8edf5", marginBottom: 6 } }, "Type your username to confirm"),
                React.createElement("div", { style: { fontSize: 12, color: "#6b7fa0", marginBottom: 12 } },
                    "Type ",
                    React.createElement("strong", { style: { color: "#e8edf5" } },
                        "@",
                        username),
                    " exactly to confirm deletion:"),
                React.createElement("input", { value: confirmText, onChange: e => setConfirmText(e.target.value), placeholder: username, autoFocus: true, style: { width: "100%", background: "#131d30", border: `1px solid ${ready ? "#ff4757" : "#1e2d45"}`, borderRadius: 8, color: "#e8edf5", padding: "10px 12px", fontSize: 13, outline: "none" } })),
            React.createElement("div", { style: { display: "flex", gap: 10 } },
                React.createElement("button", { onClick: onCancel, style: { flex: 1, padding: "11px", background: "transparent", border: "1px solid #1e2d45", borderRadius: 8, color: "#6b7fa0", cursor: "pointer", fontSize: 13 } }, "Cancel"),
                React.createElement("button", { onClick: () => ready && onConfirm(), disabled: !ready, style: { flex: 1, padding: "11px", background: ready ? "#ff4757" : "#1e2d45", border: "none", borderRadius: 8, color: ready ? "#fff" : "#6b7fa0", fontWeight: "bold", cursor: ready ? "pointer" : "not-allowed", fontSize: 13, transition: "all 0.2s" } }, "Delete Forever")))))));
}
// ── ANIMATED WALLET DISPLAY ──────────────────────────────────────────────────
function AnimatedWallet({ value }) {
    const displayed = useAnimatedNumber(Math.round(value), 500);
    return (React.createElement("div", { style: { fontSize: 20, fontWeight: "bold", fontFamily: "monospace", color: "#00ff88", letterSpacing: 0.5 } }, fmt(displayed)));
}
function AnimatedStat({ value, color }) {
    const displayed = useAnimatedNumber(Math.round(value), 700);
    return React.createElement("div", { style: { fontSize: 13, fontWeight: "bold", fontFamily: "monospace", color } }, fmt(displayed));
}
// ── RUNNER ────────────────────────────────────────────────────────────────────
function MarketRunner({ wallet, onWalletChange, onBillPaid, onExitRoad, propIncome, carSkin, completedLessons, onLearnComplete, isRegistered = false }) {
    // All hooks at top — React rules
    const g = useRef({ gameActive: false, balance: wallet, startBalance: wallet, grossEarned: 0, billTimers: {}, lastTime: 0, spawnTimer: 0, speedMult: 1, obstacles: [], particles: [], floaters: [], shakeX: 0, shakeY: 0, shakeDur: 0, roadEvent: null, roadEventTimer: 0, passiveTimer: 0, learnTimer: LEARN_POPUP_INTERVAL_MS, driveStartTime: 0, roadEventsCollected: 0, quizzesPassed: 0, quizzesFailed: 0, car: { x: 220, y: 470, width: 40, height: 70, speed: 11, movingLeft: false, movingRight: false } });
    const [phase, setPhase] = useState("idle");
    const [dispBal, setDispBal] = useState(wallet);
    const [lastBill, setLastBill] = useState(null);
    const [roadEvt, setRoadEvt] = useState(null);
    const [quizPopup, setQuizPopup] = useState(null);
    const quizRef = useRef(null);
    const animRef = useRef(null);
    const canvasRef = useRef(null);
    const startBalanceRef = useRef(wallet);
    // Non-hook constants below
    const skin = CAR_SKINS.find(s => s.id === carSkin) || CAR_SKINS[0];
    const CW = 480, CH = 560;
    useEffect(() => {
        if (!g.current.gameActive) {
            g.current.balance = wallet;
            setDispBal(wallet);
        }
    }, [wallet]);
    function initBills(s) { BILL_TYPES.forEach(b => { s.billTimers[b.id] = b.interval + Math.random() * 2000; }); }
    function showQuiz() {
        const item = pickLesson(); // from 1000-item pool
        if (!item)
            return;
        g.current.gameActive = false;
        cancelAnimationFrame(animRef.current);
        // phase: "lesson" → player reads → clicks "Got it, take quiz" → "quiz" with timer
        setQuizPopup({ item, phase: "lesson", timeLeft: QUIZ_TIME_SECONDS, chosen: null, submitted: false, result: null });
    }
    function startQuizPhase() {
        setQuizPopup(prev => ({ ...prev, phase: "quiz" }));
        quizRef.current = setInterval(() => {
            setQuizPopup(prev => {
                if (!prev || prev.submitted || prev.phase !== "quiz")
                    return prev;
                const newTime = prev.timeLeft - 1;
                if (newTime <= 0) {
                    clearInterval(quizRef.current);
                    applyQuizResult(false, "timeout");
                    return { ...prev, timeLeft: 0, submitted: true, result: "timeout" };
                }
                return { ...prev, timeLeft: newTime };
            });
        }, 1000);
    }
    function submitQuiz(chosen) {
        clearInterval(quizRef.current);
        setQuizPopup(prev => {
            if (!prev || prev.submitted)
                return prev;
            const pass = chosen === prev.item.quiz.a;
            applyQuizResult(pass, "answered", prev.item, chosen);
            return { ...prev, chosen, submitted: true, result: pass ? "pass" : "fail" };
        });
    }
    function applyQuizResult(pass, reason, item) {
        const s = g.current;
        const boost = Math.round(s.grossEarned * DRIVE_BOOST);
        if (pass) {
            s.balance += boost;
            s.grossEarned += boost;
            s.quizzesPassed = (s.quizzesPassed || 0) + 1;
            setDispBal(Math.round(s.balance));
            onWalletChange(Math.max(0, s.balance));
            if (item && !completedLessons.includes(item.id))
                onLearnComplete(item.id, item.xpReward || 50);
        }
        else {
            const penalty = Math.round(s.grossEarned * DRIVE_PENALTY);
            s.balance = Math.max(0, s.balance - penalty);
            s.grossEarned = Math.max(0, s.grossEarned - penalty);
            s.quizzesFailed = (s.quizzesFailed || 0) + 1;
            setDispBal(Math.round(s.balance));
            onWalletChange(Math.max(0, s.balance));
        }
    }
    function closeQuiz() {
        setQuizPopup(null);
        // Resume game
        const s = g.current;
        s.gameActive = true;
        s.learnTimer = LEARN_POPUP_INTERVAL_MS; // reset timer
        s.lastTime = performance.now();
        animRef.current = requestAnimationFrame(loop);
    }
    function startGame() {
        const s = g.current;
        startBalanceRef.current = wallet;
        s.balance = wallet;
        s.startBalance = wallet;
        s.grossEarned = 0;
        s.obstacles = [];
        s.particles = [];
        s.floaters = [];
        s.speedMult = 1;
        s.spawnTimer = 0;
        s.roadEvent = null;
        s.roadEventTimer = 0;
        s.passiveTimer = 0;
        s.learnTimer = LEARN_POPUP_INTERVAL_MS;
        s.driveStartTime = Date.now();
        s.roadEventsCollected = 0;
        s.quizzesPassed = 0;
        s.quizzesFailed = 0;
        s.car.x = 220;
        s.car.movingLeft = false;
        s.car.movingRight = false;
        s.gameActive = true;
        initBills(s);
        setPhase("playing");
        setRoadEvt(null);
        setQuizPopup(null);
        s.lastTime = performance.now();
        animRef.current = requestAnimationFrame(loop);
    }
    function exitRoad() {
        const s = g.current;
        s.gameActive = false;
        cancelAnimationFrame(animRef.current);
        const grossEarned = Math.max(0, s.grossEarned);
        const finalBalance = Math.max(0, s.balance);
        const driveStats = {
            driveDurationMs: Date.now() - s.driveStartTime,
            roadEventsCollected: s.roadEventsCollected || 0,
            quizzesPassed: s.quizzesPassed || 0,
            quizzesFailed: s.quizzesFailed || 0,
        };
        onExitRoad(finalBalance, grossEarned, driveStats);
        setPhase("idle");
    }
    function loop(ts) { const s = g.current; if (!s.gameActive)
        return; const dt = Math.min(ts - s.lastTime, 100); s.lastTime = ts; update(s, dt); draw(s); animRef.current = requestAnimationFrame(loop); }
    function sp(s, x, y, good) { const col = good ? "#00ff88" : "#ff4757"; const sym = good ? ["$", "✦", "★"] : ["✗", "!", "▼"]; for (let i = 0; i < 8; i++)
        s.particles.push({ x, y, vx: (Math.random() - 0.5) * 4, vy: -(Math.random() * 3 + 1), life: 1, col, sym: sym[Math.floor(Math.random() * sym.length)], size: 11 + Math.random() * 6 }); }
    function fl(s, x, y, amt, good) { s.floaters.push({ x, y, vy: -1.2, life: 1, text: (good ? "+" : "") + fmt(amt), col: good ? T.green : T.red }); }
    function shake(s) { s.shakeX = (Math.random() - 0.5) * 6; s.shakeY = (Math.random() - 0.5) * 6; s.shakeDur = 250; }
    const techT = ["AAPL", "NVDA", "MTNNG"];
    function update(s, dt) {
        s.speedMult += 0.000015 * dt;
        if (s.shakeDur > 0) {
            s.shakeDur -= dt;
            if (s.shakeDur <= 0) {
                s.shakeX = 0;
                s.shakeY = 0;
            }
        }
        if (s.roadEvent) {
            s.roadEventTimer -= dt;
            if (s.roadEventTimer <= 0) {
                s.roadEvent = null;
                setRoadEvt(null);
            }
        }
        else if (Math.random() < 0.0003 * dt) {
            s.roadEventsCollected++;
            const ev = ROAD_EVENTS[Math.floor(Math.random() * ROAD_EVENTS.length)];
            s.roadEvent = ev;
            s.roadEventTimer = ev.duration;
            setRoadEvt(ev);
            haptic([50, 30, 50]);
        }
        s.passiveTimer += dt;
        if (s.passiveTimer >= 3000 && propIncome > 0) {
            const tick = Math.round(propIncome / 10);
            s.balance += tick;
            s.grossEarned += tick;
            s.passiveTimer = 0;
            fl(s, CW / 2, 80, tick, true);
        }
        // Learn quiz timer
        s.learnTimer -= dt;
        if (s.learnTimer <= 0) {
            showQuiz();
            return;
        }
        BILL_TYPES.forEach(b => {
            s.billTimers[b.id] -= dt;
            if (s.billTimers[b.id] <= 0) {
                s.balance -= b.amount;
                s.billTimers[b.id] = b.interval + Math.random() * 2000;
                setLastBill(b);
                onBillPaid(b.amount);
                fl(s, CW / 2, 120, b.amount, false);
                haptic(60);
                setTimeout(() => setLastBill(null), 2500);
                if (s.balance <= 0) {
                    exitRoad();
                    return;
                }
            }
        });
        if (s.car.movingLeft)
            s.car.x -= s.car.speed;
        if (s.car.movingRight)
            s.car.x += s.car.speed;
        s.car.x = Math.max(10, Math.min(CW - s.car.width - 10, s.car.x));
        s.spawnTimer += dt;
        if (s.spawnTimer > 1600) {
            spawnObs(s);
            s.spawnTimer = 0;
        }
        for (let i = s.obstacles.length - 1; i >= 0; i--) {
            const o = s.obstacles[i];
            o.y += s.roadEvent?.type === "crash" ? o.speed * 1.7 : o.speed;
            if (o.x < s.car.x + s.car.width && o.x + o.width > s.car.x && o.y < s.car.y + s.car.height && o.y + o.height > s.car.y) {
                const isTech = techT.includes(o.name);
                const mult = s.roadEvent?.type === "boom" && isTech ? 3 : s.roadEvent?.type === "bonus" ? 2 : 1;
                const raw = o.isGood ? Math.floor((1200 + Math.random() * 800) * mult) : Math.floor(2000 + Math.random() * 1000);
                if (o.isGood) {
                    s.balance += raw;
                    s.grossEarned += raw;
                    haptic(20);
                    sp(s, o.x + 35, o.y, true);
                    fl(s, o.x + 35, o.y, raw, true);
                }
                else {
                    s.balance -= raw;
                    haptic([80, 20, 80]);
                    shake(s);
                    sp(s, o.x + 35, o.y, false);
                    fl(s, o.x + 35, o.y, raw, false);
                }
                s.obstacles.splice(i, 1);
                if (s.balance <= 0) {
                    exitRoad();
                    return;
                }
                continue;
            }
            if (o.y > CH)
                s.obstacles.splice(i, 1);
        }
        for (let i = s.particles.length - 1; i >= 0; i--) {
            const p = s.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.12;
            p.life -= dt / 600;
            if (p.life <= 0)
                s.particles.splice(i, 1);
        }
        for (let i = s.floaters.length - 1; i >= 0; i--) {
            const f = s.floaters[i];
            f.y += f.vy;
            f.life -= dt / 1400;
            if (f.life <= 0)
                s.floaters.splice(i, 1);
        }
        setDispBal(Math.max(0, Math.round(s.balance)));
        onWalletChange(Math.max(0, s.balance));
    }
    function spawnObs(s) {
        const isGood = Math.random() > 0.45;
        let name;
        if (isGood) {
            name = QUALIFIED[Math.floor(Math.random() * QUALIFIED.length)].ticker;
        }
        else {
            const bad = ["BANKRUPT", "SCAM Co", "LIQ Corp", "DEBT Inc", "JUNK", "PUMP"];
            name = bad[Math.floor(Math.random() * bad.length)];
        }
        const lane = Math.floor(Math.random() * 3);
        const lw = CW / 3;
        const isNG = QUALIFIED.find(q => q.ticker === name && q.country === "NG");
        s.obstacles.push({ x: lane * lw + (lw / 2) - 35, y: -60, width: 70, height: 40, isGood, name, isNG, speed: (1.5 + Math.random() * 1.0) * s.speedMult });
    }
    function draw(s) {
        const el = canvasRef.current;
        if (!el)
            return;
        const ctx = el.getContext("2d");
        ctx.save();
        if (s.shakeDur > 0)
            ctx.translate(s.shakeX, s.shakeY);
        const rc = s.roadEvent?.type === "crash", rb = s.roadEvent?.type === "boom";
        ctx.fillStyle = rc ? "#1a0508" : "#070c18";
        ctx.fillRect(0, 0, CW, CH);
        ctx.strokeStyle = rc ? "#3a0a0f" : rb ? "#2a2500" : "#131d30";
        ctx.lineWidth = 2;
        ctx.setLineDash([18, 18]);
        [1, 2].forEach(i => { ctx.beginPath(); ctx.moveTo(CW / 3 * i, 0); ctx.lineTo(CW / 3 * i, CH); ctx.stroke(); });
        ctx.setLineDash([]);
        ctx.strokeStyle = "#1e2d45";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(5, 0);
        ctx.lineTo(5, CH);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(CW - 5, 0);
        ctx.lineTo(CW - 5, CH);
        ctx.stroke();
        s.obstacles.forEach(o => {
            const isTB = rb && techT.includes(o.name);
            const col = isTB ? T.gold : o.isGood ? (o.isNG ? "#00e5a0" : "#00ff88") : "#ff4757";
            ctx.strokeStyle = col;
            ctx.lineWidth = isTB ? 3 : 2;
            if (isTB) {
                ctx.shadowBlur = 15;
                ctx.shadowColor = T.gold;
            }
            ctx.strokeRect(o.x, o.y, o.width, o.height);
            ctx.shadowBlur = 0;
            ctx.fillStyle = "#0f1729";
            ctx.fillRect(o.x + 2, o.y + 2, o.width - 4, o.height - 4);
            ctx.fillStyle = col;
            ctx.font = `bold ${isTB ? 12 : 10}px monospace`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(o.name, o.x + o.width / 2, o.y + o.height / 2);
            if (o.isNG) {
                ctx.font = "bold 8px monospace";
                ctx.fillStyle = "#aaffdd";
                ctx.fillText("NGX", o.x + o.width / 2, o.y + o.height - 6);
            }
        });
        s.particles.forEach(p => { ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = p.col; ctx.font = `bold ${p.size}px monospace`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(p.sym, p.x, p.y); });
        ctx.globalAlpha = 1;
        s.floaters.forEach(f => { ctx.globalAlpha = Math.max(0, f.life); ctx.fillStyle = f.col; ctx.font = "bold 15px monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(f.text, f.x, f.y); });
        ctx.globalAlpha = 1;
        const c = s.car;
        ctx.strokeStyle = skin.color;
        ctx.lineWidth = 2.5;
        if (rb) {
            ctx.shadowBlur = 20;
            ctx.shadowColor = skin.glow;
        }
        ctx.strokeRect(c.x, c.y, c.width, c.height);
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#0a1220";
        ctx.fillRect(c.x + 1, c.y + 1, c.width - 2, c.height - 2);
        ctx.fillStyle = skin.color;
        ctx.fillRect(c.x + 5, c.y + 15, c.width - 10, 12);
        ctx.fillStyle = "#ff4757";
        ctx.fillRect(c.x + 4, c.y + c.height - 6, 8, 4);
        ctx.fillRect(c.x + c.width - 12, c.y + c.height - 6, 8, 4);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(c.x + 4, c.y + 2, 6, 4);
        ctx.fillRect(c.x + c.width - 10, c.y + 2, 6, 4);
        ctx.restore();
    }
    useEffect(() => {
        const s = g.current;
        const kd = e => { if (!s.gameActive)
            return; if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A')
            s.car.movingLeft = true; if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D')
            s.car.movingRight = true; };
        const ku = e => { if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A')
            s.car.movingLeft = false; if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D')
            s.car.movingRight = false; };
        document.addEventListener('keydown', kd);
        document.addEventListener('keyup', ku);
        return () => { document.removeEventListener('keydown', kd); document.removeEventListener('keyup', ku); cancelAnimationFrame(animRef.current); clearInterval(quizRef.current); };
    }, []);
    // ── EARLY RETURN: Mission Briefing (idle phase) ──────────────────────────
    if (phase === "idle") {
        return (React.createElement("div", { style: { background: "#070C18", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", maxWidth: 480, margin: "0 auto", fontFamily: "'Inter',sans-serif", position: "relative" } },
            React.createElement("style", null, `
          @keyframes runnerFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
          .rb-float{animation:runnerFloat 6s ease-in-out infinite;}
          .rb-glass{background:rgba(15,23,41,0.75);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.1);}
          .rb-launch{transition:transform 0.15s,box-shadow 0.15s;}
          .rb-launch:hover{transform:scale(1.05);box-shadow:0 0 22px rgba(0,229,255,0.45);}
          .rb-launch:active{transform:scale(0.95);}
          .rb-scanline{background:linear-gradient(to bottom,transparent 50%,rgba(0,229,255,0.04) 50%);background-size:100% 4px;}
        `),
            React.createElement("div", { className: "rb-scanline", style: { position: "absolute", inset: 0, opacity: 0.5, pointerEvents: "none", zIndex: 0 } }),
            React.createElement("div", { style: { position: "absolute", top: "10%", right: "-10%", width: 260, height: 260, background: "rgba(0,229,255,0.04)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none", zIndex: 0 } }),
            React.createElement("div", { style: { position: "absolute", bottom: "5%", left: "-5%", width: 180, height: 180, background: "rgba(0,255,136,0.03)", borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none", zIndex: 0 } }),
            React.createElement("div", { style: { position: "relative", zIndex: 2, padding: "12px 16px", display: "grid", gridTemplateColumns: "1fr auto", gap: 10, borderBottom: "1px solid rgba(255,255,255,0.07)" } },
                React.createElement("div", { className: "rb-glass", style: { borderRadius: 12, padding: "12px 16px" } },
                    React.createElement("div", { style: { fontSize: 9, color: "#6B7FA0", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 } }, "Current Session Balance"),
                    React.createElement("div", { style: { fontSize: 24, fontWeight: 800, color: "#00FF88", fontFamily: "monospace", letterSpacing: "-0.01em" } }, fmt(dispBal))),
                React.createElement("div", { className: "rb-glass", style: { borderRadius: 12, padding: "12px 14px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-end", gap: 4 } },
                    React.createElement("div", { style: { background: "rgba(147,0,10,0.25)", border: "1px solid rgba(255,180,171,0.35)", borderRadius: 8, padding: "4px 10px", display: "flex", alignItems: "center", gap: 5 } },
                        React.createElement("span", { style: { fontSize: 13 } }, "\u26A0\uFE0F"),
                        React.createElement("span", { style: { fontSize: 11, fontWeight: 700, color: "#ffb4ab" } },
                            isRegistered ? "30% tax" : "40% tax",
                            " on exit")),
                    React.createElement("div", { style: { fontSize: 9, color: "#6B7FA0" } }, isRegistered ? "Registered company rate" : "Unregistered penalty"))),
            React.createElement("div", { style: { position: "relative", zIndex: 2, padding: "16px" } },
                React.createElement("div", { className: "rb-glass", style: { borderRadius: 20, padding: "28px 20px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: 12, position: "relative" } },
                    React.createElement("div", { className: "rb-float", style: { marginBottom: 20 } },
                        React.createElement("div", { style: { width: 88, height: 88, borderRadius: "50%", border: "3px solid #00E5FF", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 30px rgba(0,229,255,0.3)", background: "rgba(0,229,255,0.06)" } },
                            React.createElement("span", { style: { fontSize: 42 } }, "\uD83D\uDE97"))),
                    React.createElement("h1", { style: { fontSize: "clamp(24px,6vw,34px)", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16, lineHeight: 1 } },
                        React.createElement("span", { style: { color: "#dee2f4" } }, "MARKET "),
                        React.createElement("span", { style: { color: "#00E5FF" } }, "RUNNER")),
                    React.createElement("div", { style: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12, marginBottom: 14 } }, [{ color: "#00FF88", label: "Qualified stocks" }, { color: "#00E5FF", label: "NGX stocks" }, { color: "#ffb4ab", label: "Bad stocks — dodge!" }].map(({ color, label }) => (React.createElement("div", { key: label, style: { display: "flex", alignItems: "center", gap: 6 } },
                        React.createElement("div", { style: { width: 10, height: 10, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}99` } }),
                        React.createElement("span", { style: { fontSize: 11, color: "#dee2f4" } },
                            React.createElement("span", { style: { color, fontWeight: 600 } }, label.split(" ")[0]),
                            " = ",
                            label.split(" ").slice(1).join(" ")))))),
                    React.createElement("p", { style: { fontSize: 13, color: "#6B7FA0", lineHeight: 1.75, maxWidth: 300, marginBottom: 24 } }, "Navigate the volatile market highway. Capture high-yield assets while avoiding toxic liabilities to maximise your portfolio."),
                    React.createElement("button", { onClick: () => startGame(), className: "rb-launch", style: { background: "#00E5FF", color: "#001f24", border: "none", padding: "16px 44px", fontSize: 15, fontWeight: 800, borderRadius: 14, cursor: "pointer", letterSpacing: "0.04em", fontFamily: "'Inter',sans-serif", boxShadow: "0 0 20px rgba(0,229,255,0.25)", position: "relative", zIndex: 99, display: "block", width: "100%", maxWidth: 320, touchAction: "manipulation", WebkitTapHighlightColor: "transparent" } }, "Launch Portfolio \u2192"),
                    React.createElement("div", { style: { display: "flex", gap: 10, marginTop: 18, opacity: 0.4 } }, ["←", "→"].map(a => (React.createElement("div", { key: a, style: { width: 44, height: 38, borderRadius: 7, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#dee2f4" } }, a))))),
                React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 } },
                    React.createElement("div", { className: "rb-glass", style: { borderRadius: 12, padding: "14px" } },
                        React.createElement("div", { style: { fontSize: 10, color: "#00E5FF", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 10 } }, "MISSION REWARDS"),
                        [{ label: "Passive Yield", val: propIncome > 0 ? `+${fmt(propIncome)}/Day` : "Buy assets", col: "#00FF88" }, { label: "Quiz Boost", val: "+30% income", col: "#dee2f4" }, { label: "Rare Drop", val: "15% chance", col: "#dee2f4" }].map(r => (React.createElement("div", { key: r.label, style: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 6, marginBottom: 6, fontSize: 11 } },
                            React.createElement("span", { style: { color: "#6B7FA0" } }, r.label),
                            React.createElement("span", { style: { color: r.col, fontWeight: 600 } }, r.val))))),
                    React.createElement("div", { className: "rb-glass", style: { borderRadius: 12, padding: "14px", display: "flex", flexDirection: "column" } },
                        React.createElement("div", { style: { fontSize: 11, fontWeight: 600, color: "#dee2f4", marginBottom: 2 } }, "Passive Income Track"),
                        React.createElement("div", { style: { fontSize: 10, color: "#6B7FA0", marginBottom: 10 } }, "Ticks while you drive"),
                        React.createElement("div", { style: { display: "flex", alignItems: "flex-end", gap: 3, flex: 1, minHeight: 48 } }, [[0.25, "rgba(255,255,255,0.05)"], [0.38, "rgba(255,255,255,0.07)"], [0.5, "rgba(255,255,255,0.1)"], [0.75, "rgba(0,229,255,0.25)"], [1, "#00E5FF"]].map(([h, bg], i) => (React.createElement("div", { key: i, style: { flex: 1, height: `${h * 100}%`, background: bg, borderRadius: 3, boxShadow: i === 4 ? "0 0 10px rgba(0,229,255,0.4)" : undefined } })))))))));
    }
    return (React.createElement("div", { style: { background: "#070C18", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", maxWidth: 480, margin: "0 auto", fontFamily: "'Inter',sans-serif" } },
        React.createElement("style", null, `
        .runner-glass{background:rgba(15,23,41,0.75);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.1);}
        .runner-neon-cyan{box-shadow:0 0 15px rgba(0,229,255,0.3);}
        .runner-neon-green{box-shadow:0 0 15px rgba(0,255,136,0.35);}
        .runner-btn-launch{transition:transform 0.15s,box-shadow 0.15s;}
        .runner-btn-launch:hover{transform:scale(1.04);box-shadow:0 0 22px rgba(0,229,255,0.5);}
        .runner-btn-launch:active{transform:scale(0.96);}
        .runner-float{animation:runnerFloat 6s ease-in-out infinite;}
        @keyframes runnerFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
        .runner-ticker{animation:runnerTick 4s linear infinite;}
        @keyframes runnerTick{0%{transform:translateY(-60px) scale(0.6);opacity:0;}20%{opacity:1;}100%{transform:translateY(520px) scale(1.1);opacity:0.4;}}
        .runner-scanline{background:linear-gradient(to bottom,transparent 50%,rgba(0,229,255,0.04) 50%);background-size:100% 4px;}
        .runner-lane{background:linear-gradient(to bottom,transparent 0%,rgba(0,229,255,0.15) 50%,transparent 100%);width:2px;height:100%;position:absolute;}
      `),
        phase === "playing" && (React.createElement("div", { style: { padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(0,229,255,0.1)", background: "rgba(7,12,24,0.92)", backdropFilter: "blur(12px)", fontFamily: "'Inter',sans-serif" } },
            React.createElement("div", { style: { background: "rgba(15,23,41,0.8)", border: "1px solid rgba(0,229,255,0.25)", borderRadius: 12, padding: "8px 14px", boxShadow: "0 0 14px rgba(0,229,255,0.12)" } },
                React.createElement("div", { style: { fontSize: 9, color: "#6B7FA0", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 } }, "Portfolio Balance"),
                React.createElement("div", { style: { fontSize: 20, fontWeight: 800, color: "#00FF88", fontFamily: "monospace", letterSpacing: "-0.01em" } }, fmt(dispBal))),
            React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 } },
                propIncome > 0 && (React.createElement("div", { style: { background: "rgba(0,145,57,0.2)", border: "1px solid rgba(0,255,136,0.3)", borderRadius: 20, padding: "4px 12px", display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: "#00FF88", boxShadow: "0 0 10px rgba(0,255,136,0.2)" } },
                    "\uD83D\uDCB0 DIVIDEND DAY! +",
                    fmt(propIncome),
                    "/day")),
                React.createElement("button", { onClick: exitRoad, style: { background: "rgba(147,0,10,0.35)", border: "1px solid rgba(255,180,171,0.4)", borderRadius: 8, padding: "7px 16px", color: "#ffb4ab", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter',sans-serif", letterSpacing: "0.02em" } }, "Exit Road")))),
        roadEvt && phase === "playing" && (React.createElement("div", { style: { background: `${roadEvt.color}18`, borderBottom: `1px solid ${roadEvt.color}`, padding: "5px 14px", display: "flex", alignItems: "center", gap: 10, justifyContent: "center" } },
            React.createElement("span", { style: { fontWeight: "bold", fontSize: 11, color: roadEvt.color } }, roadEvt.label),
            React.createElement("span", { style: { fontSize: 10, color: roadEvt.color, opacity: 0.8 } }, roadEvt.desc))),
        React.createElement("div", { style: { position: "relative", minHeight: 560 } },
            lastBill && (React.createElement("div", { style: { position: "absolute", top: "35%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 10, background: T.card, border: `1px solid ${lastBill.color}`, borderRadius: 10, padding: "10px 18px", textAlign: "center", pointerEvents: "none", whiteSpace: "nowrap" } },
                React.createElement("i", { className: `ti ${lastBill.icon}`, style: { fontSize: 18, color: lastBill.color, display: "block", marginBottom: 4 }, "aria-hidden": "true" }),
                React.createElement("div", { style: { fontWeight: "bold", fontSize: 12, color: lastBill.color } }, lastBill.label),
                React.createElement("div", { style: { fontSize: 11, color: lastBill.color, fontFamily: "monospace" } },
                    "-",
                    fmt(lastBill.amount)))),
            quizPopup && (React.createElement("div", { style: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(7,12,24,0.97)", zIndex: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 16, overflowY: "auto" } },
                quizPopup.phase === "lesson" && (React.createElement("div", { style: { width: "100%", maxWidth: 400 } },
                    React.createElement("div", { style: { textAlign: "center", marginBottom: 14 } },
                        React.createElement("div", { style: { fontSize: 26, marginBottom: 4 } }, "\uD83D\uDCD6"),
                        React.createElement("div", { style: { fontWeight: "bold", fontSize: 15, color: T.cyan } },
                            quizPopup.item.topic,
                            " \u2014 Learn First"),
                        React.createElement("div", { style: { fontSize: 11, color: T.muted, marginTop: 2 } }, "Read carefully \u2014 a timed quiz follows!")),
                    React.createElement("div", { style: { background: T.card, border: `1px solid ${T.cyan}44`, borderRadius: D.br, padding: 18, marginBottom: 14 } },
                        React.createElement("div", { style: { fontWeight: "bold", fontSize: 14, color: T.gold, marginBottom: 10 } }, quizPopup.item.lesson.title),
                        React.createElement("div", { style: { fontSize: 13, color: T.text, lineHeight: 1.8 } }, quizPopup.item.lesson.body)),
                    React.createElement("button", { onClick: startQuizPhase, style: { width: "100%", padding: "13px", background: `linear-gradient(135deg,${T.gold},${T.orange})`, color: "#05050a", border: "none", borderRadius: D.br, fontWeight: "bold", fontSize: 14, cursor: "pointer" } },
                        "\u2705 Got it \u2014 Take the Quiz (",
                        QUIZ_TIME_SECONDS,
                        "s timer starts now)"))),
                quizPopup.phase === "quiz" && (React.createElement("div", { style: { width: "100%", maxWidth: 400 } },
                    React.createElement("div", { style: { textAlign: "center", marginBottom: 10 } },
                        React.createElement("div", { style: { fontSize: 11, color: T.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 } },
                            quizPopup.item.topic,
                            " Quiz"),
                        !quizPopup.submitted && (React.createElement("div", { style: { margin: "0 auto 10px", position: "relative", width: 60, height: 60 } },
                            React.createElement("svg", { width: "60", height: "60", style: { transform: "rotate(-90deg)" } },
                                React.createElement("circle", { cx: "30", cy: "30", r: "26", fill: "none", stroke: T.border, strokeWidth: "4" }),
                                React.createElement("circle", { cx: "30", cy: "30", r: "26", fill: "none", stroke: quizPopup.timeLeft > 10 ? T.cyan : quizPopup.timeLeft > 5 ? T.orange : T.red, strokeWidth: "4", strokeDasharray: `${2 * Math.PI * 26}`, strokeDashoffset: `${2 * Math.PI * 26 * (1 - quizPopup.timeLeft / QUIZ_TIME_SECONDS)}`, strokeLinecap: "round", style: { transition: "stroke-dashoffset 1s linear,stroke 0.3s" } })),
                            React.createElement("div", { style: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 16, color: quizPopup.timeLeft > 10 ? T.cyan : quizPopup.timeLeft > 5 ? T.orange : T.red } }, quizPopup.timeLeft)))),
                    React.createElement("div", { style: { background: T.card, border: `1px solid ${T.gold}44`, borderRadius: D.br, padding: 14, marginBottom: 12 } },
                        React.createElement("div", { style: { fontWeight: "bold", fontSize: 13, color: T.text, lineHeight: 1.6, marginBottom: 12 } }, quizPopup.item.quiz.q),
                        quizPopup.item.quiz.o.map((opt, i) => {
                            const isCorrect = i === quizPopup.item.quiz.a;
                            const isChosen = i === quizPopup.chosen;
                            let bg = T.surface, border = T.border, color = T.muted;
                            if (quizPopup.submitted) {
                                if (isCorrect) {
                                    bg = "rgba(0,255,136,0.15)";
                                    border = T.green;
                                    color = T.green;
                                }
                                else if (isChosen) {
                                    bg = "rgba(255,71,87,0.15)";
                                    border = T.red;
                                    color = T.red;
                                }
                            }
                            else if (isChosen) {
                                bg = `${T.cyan}18`;
                                border = T.cyan;
                                color = T.cyan;
                            }
                            return (React.createElement("button", { key: i, onClick: () => { if (!quizPopup.submitted)
                                    submitQuiz(i); }, style: { width: "100%", textAlign: "left", padding: "10px 12px", marginBottom: 7, background: bg, border: `1px solid ${border}`, borderRadius: D.brs, color, cursor: quizPopup.submitted ? "default" : "pointer", fontSize: 12, fontWeight: (isChosen || isCorrect) && quizPopup.submitted ? "bold" : "normal", display: "flex", alignItems: "center", gap: 8 } },
                                React.createElement("span", { style: { minWidth: 22, height: 22, borderRadius: "50%", background: `${border}22`, border: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, flexShrink: 0 } }, String.fromCharCode(65 + i)),
                                opt));
                        })),
                    quizPopup.submitted && (React.createElement("div", null,
                        React.createElement("div", { style: { background: quizPopup.result === "pass" ? "rgba(0,255,136,0.12)" : "rgba(255,71,87,0.12)", border: `1px solid ${quizPopup.result === "pass" ? T.green : T.red}`, borderRadius: D.br, padding: 12, marginBottom: 12, textAlign: "center" } },
                            React.createElement("div", { style: { fontSize: 22, marginBottom: 6 } }, quizPopup.result === "pass" ? "🎉" : quizPopup.result === "timeout" ? "⏰" : "💡"),
                            React.createElement("div", { style: { fontWeight: "bold", fontSize: 13, color: quizPopup.result === "pass" ? T.green : T.red } }, quizPopup.result === "pass"
                                ? `Correct! +30% income boost · +${quizPopup.item.xpReward || 50} XP`
                                : quizPopup.result === "timeout"
                                    ? "Time's up! −30% income deducted"
                                    : "Wrong answer! −30% income deducted")),
                        React.createElement("button", { onClick: closeQuiz, style: { width: "100%", padding: "12px", background: `linear-gradient(135deg,${T.cyan},#0086ff)`, color: "#05050a", border: "none", borderRadius: D.br, fontWeight: "bold", fontSize: 14, cursor: "pointer" } }, "\uD83D\uDE97 Back to Driving"))),
                    quizPopup.timeLeft === 0 && !quizPopup.submitted && (React.createElement("div", null,
                        React.createElement("div", { style: { background: "rgba(255,71,87,0.12)", border: `1px solid ${T.red}`, borderRadius: D.br, padding: 12, marginBottom: 12, textAlign: "center" } },
                            React.createElement("div", { style: { fontSize: 22, marginBottom: 4 } }, "\u23F0"),
                            React.createElement("div", { style: { fontWeight: "bold", color: T.red } }, "Time's up! \u221230% income deducted")),
                        React.createElement("button", { onClick: closeQuiz, style: { width: "100%", padding: "12px", background: `linear-gradient(135deg,${T.cyan},#0086ff)`, color: "#05050a", border: "none", borderRadius: D.br, fontWeight: "bold", fontSize: 14, cursor: "pointer" } }, "\uD83D\uDE97 Back to Driving"))))))),
            phase !== "idle" && React.createElement("canvas", { ref: canvasRef, width: 480, height: 560, style: { display: "block", width: "100%" } })),
        phase !== "idle" && React.createElement("div", { style: { display: "flex", gap: 10, padding: "12px 14px", background: T.surface, borderTop: `1px solid ${T.border}` } }, [{ dir: "movingLeft", label: "←" }, { dir: "movingRight", label: "→" }].map(b => (React.createElement("div", { key: b.dir, onTouchStart: e => { e.preventDefault(); if (g.current.gameActive) {
                g.current.car[b.dir] = true;
                haptic(15);
            } }, onTouchEnd: e => { e.preventDefault(); g.current.car[b.dir] = false; }, onTouchCancel: e => { e.preventDefault(); g.current.car[b.dir] = false; }, onMouseDown: () => { if (g.current.gameActive)
                g.current.car[b.dir] = true; }, onMouseUp: () => { g.current.car[b.dir] = false; }, onMouseLeave: () => { g.current.car[b.dir] = false; }, style: { flex: 1, height: 64, borderRadius: 12, border: `1.5px solid ${T.border2}`, background: "rgba(0,229,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", userSelect: "none", WebkitUserSelect: "none", fontSize: 26, color: T.cyan, fontWeight: "bold", touchAction: "none" } }, b.label))))));
}
// ── LEARNING MODULES SCREEN ───────────────────────────────────────────────────
function LearnScreen({ completedLessons, xp, onComplete }) {
    const [active, setActive] = useState(null);
    const [step, setStep] = useState(0); // 0-2 lessons, 3 = quiz
    const [chosen, setChosen] = useState(null);
    const [result, setResult] = useState(null);
    function openModule(m) {
        if (xp < m.unlockAt)
            return;
        setActive(m);
        setStep(0);
        setChosen(null);
        setResult(null);
    }
    function next() {
        if (step < active.lessons.length - 1) {
            setStep(s => s + 1);
        }
        else {
            setStep(active.lessons.length);
        } // go to quiz
    }
    function submitQuiz() {
        if (chosen === null)
            return;
        const passed = chosen === active.quiz.answer;
        setResult(passed);
        if (passed && !completedLessons.includes(active.id))
            onComplete(active.id, active.xpReward);
    }
    if (active)
        return (React.createElement("div", { style: { background: T.bg, fontFamily: "'Segoe UI',sans-serif", padding: 16 } },
            React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 16 } },
                React.createElement("button", { onClick: () => setActive(null), style: { background: "transparent", border: `1px solid ${T.border}`, borderRadius: D.brs, color: T.muted, padding: "5px 10px", cursor: "pointer", fontSize: 12 } }, "\u2190 Back"),
                React.createElement("div", { style: { fontWeight: "bold", fontSize: 14, color: T.text } }, active.title)),
            React.createElement("div", { style: { display: "flex", gap: 4, marginBottom: 16 } }, [...active.lessons.map((_, i) => i), active.lessons.length].map(i => (React.createElement("div", { key: i, style: { flex: 1, height: 4, borderRadius: 2, background: i <= step ? T.cyan : T.border } })))),
            step < active.lessons.length ? (React.createElement("div", null,
                React.createElement("div", { style: { background: T.card, border: `1px solid ${T.cyan}44`, borderRadius: D.br, padding: 20, marginBottom: 14 } },
                    React.createElement("div", { style: { fontSize: 11, color: T.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 } },
                        "Lesson ",
                        step + 1,
                        " of ",
                        active.lessons.length),
                    React.createElement("div", { style: { fontWeight: "bold", fontSize: 15, color: T.cyan, marginBottom: 12 } }, active.lessons[step].q),
                    React.createElement("div", { style: { fontSize: 14, color: T.text, lineHeight: 1.8 } }, active.lessons[step].a)),
                React.createElement("button", { onClick: next, style: { width: "100%", padding: "12px", background: `linear-gradient(135deg,${T.cyan},#0086ff)`, color: "#05050a", border: "none", borderRadius: D.br, fontWeight: "bold", fontSize: 14, cursor: "pointer" } }, step < active.lessons.length - 1 ? "Next Lesson →" : "Take Quiz →"))) : (React.createElement("div", null,
                React.createElement("div", { style: { background: T.card, border: `1px solid ${T.gold}44`, borderRadius: D.br, padding: 16, marginBottom: 14 } },
                    React.createElement("div", { style: { fontSize: 11, color: T.gold, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 } }, "\uD83D\uDCDD Quiz"),
                    React.createElement("div", { style: { fontWeight: "bold", fontSize: 14, color: T.text, marginBottom: 14, lineHeight: 1.6 } }, active.quiz.q),
                    active.quiz.options.map((opt, i) => (React.createElement("button", { key: i, onClick: () => { if (!result)
                            setChosen(i); }, style: { width: "100%", textAlign: "left", padding: "11px 14px", marginBottom: 8, background: result != null ? (i === active.quiz.answer ? "rgba(0,255,136,0.15)" : i === chosen && chosen !== active.quiz.answer ? "rgba(255,71,87,0.15)" : T.surface) : chosen === i ? `${T.cyan}18` : T.surface, border: `1px solid ${result != null ? (i === active.quiz.answer ? T.green : i === chosen && chosen !== active.quiz.answer ? T.red : T.border) : chosen === i ? T.cyan : T.border}`, borderRadius: D.brs, color: result != null ? (i === active.quiz.answer ? T.green : i === chosen && chosen !== active.quiz.answer ? T.red : T.muted) : chosen === i ? T.cyan : T.muted, cursor: result != null ? "default" : "pointer", fontSize: 13 } },
                        String.fromCharCode(65 + i),
                        ". ",
                        opt)))),
                result === null
                    ? React.createElement("button", { onClick: submitQuiz, disabled: chosen === null, style: { width: "100%", padding: "12px", background: chosen !== null ? `linear-gradient(135deg,${T.gold},${T.orange})` : "transparent", color: chosen !== null ? "#05050a" : T.muted, border: `1px solid ${chosen !== null ? T.gold : T.border}`, borderRadius: D.br, fontWeight: "bold", fontSize: 14, cursor: chosen !== null ? "pointer" : "not-allowed" } }, "Submit Answer")
                    : React.createElement("div", null,
                        React.createElement("div", { style: { background: result ? "rgba(0,255,136,0.1)" : "rgba(255,71,87,0.1)", border: `1px solid ${result ? T.green : T.red}`, borderRadius: D.br, padding: 14, marginBottom: 12, textAlign: "center" } },
                            React.createElement("div", { style: { fontSize: 20, marginBottom: 6 } }, result ? "🎉" : "💡"),
                            React.createElement("div", { style: { fontWeight: "bold", fontSize: 14, color: result ? T.green : T.red } }, result ? "Correct! +" + active.xpReward + " XP earned" : "Not quite — review the lesson and try again.")),
                        React.createElement("button", { onClick: () => setActive(null), style: { width: "100%", padding: "12px", background: `linear-gradient(135deg,${T.cyan},#0086ff)`, color: "#05050a", border: "none", borderRadius: D.br, fontWeight: "bold", fontSize: 14, cursor: "pointer" } }, "Back to Modules"))))));
    const totalXP = LEARN_MODULES.reduce((s, m) => s + m.xpReward, 0);
    const earnedXP = LEARN_MODULES.filter(m => completedLessons.includes(m.id)).reduce((s, m) => s + m.xpReward, 0);
    return (React.createElement("div", null,
        React.createElement("div", { style: { background: T.card, border: `1px solid ${T.cyan}33`, borderRadius: D.br, padding: 12, marginBottom: 12 } },
            React.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 } },
                React.createElement("span", { style: { color: T.muted } }, "Learning XP earned"),
                React.createElement("span", { style: { fontFamily: "monospace", color: T.cyan } },
                    earnedXP,
                    " / ",
                    totalXP,
                    " XP")),
            React.createElement("div", { style: { height: 6, background: T.surface, borderRadius: 3 } },
                React.createElement("div", { style: { height: "100%", width: (earnedXP / totalXP * 100) + "%", background: `linear-gradient(90deg,${T.cyan},${T.purple})`, borderRadius: 3 } }))),
        LEARN_MODULES.map(m => {
            const done = completedLessons.includes(m.id);
            const locked = xp < m.unlockAt;
            return (React.createElement("div", { key: m.id, onClick: () => openModule(m), style: { background: T.card, border: `1px solid ${done ? T.green + "55" : locked ? T.border : T.cyan + "33"}`, borderRadius: D.br, padding: "13px 14px", marginBottom: 8, cursor: locked ? "not-allowed" : "pointer", opacity: locked ? 0.5 : 1 } },
                React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12 } },
                    React.createElement("div", { style: { width: 40, height: 40, borderRadius: "50%", background: done ? "rgba(0,255,136,0.15)" : locked ? T.surface : `${T.cyan}15`, border: `1px solid ${done ? T.green : locked ? T.border : T.cyan + "55"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } },
                        React.createElement("i", { className: `ti ${done ? "ti-check" : locked ? "ti-lock" : m.icon}`, style: { fontSize: 18, color: done ? T.green : locked ? T.muted : T.cyan }, "aria-hidden": "true" })),
                    React.createElement("div", { style: { flex: 1 } },
                        React.createElement("div", { style: { fontWeight: "bold", fontSize: 13, color: done ? T.green : locked ? T.muted : T.text } }, m.title),
                        React.createElement("div", { style: { fontSize: 11, color: T.muted, marginTop: 2 } },
                            m.lessons.length,
                            " lessons \u00B7 Quiz \u00B7 +",
                            m.xpReward,
                            " XP",
                            locked ? ` · Unlock at ${m.unlockAt} XP` : "")),
                    done && React.createElement("span", { style: { fontSize: 10, padding: "2px 8px", borderRadius: 20, background: "rgba(0,255,136,0.1)", color: T.green, border: `1px solid ${T.green}44` } }, "Done"),
                    !done && !locked && React.createElement("i", { className: "ti ti-chevron-right", style: { fontSize: 16, color: T.muted }, "aria-hidden": "true" }))));
        })));
}
// ── GLOBAL LEADERBOARD ────────────────────────────────────────────────────────
// ── FIREBASE CONFIG — PASTE YOUR VALUES HERE ─────────────────────────────────
// Get these from: Firebase Console → Your Project → Project Settings → Your Apps → Config
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyC7xNZRGA-t2rxVXn9Md1aaw42PycqE-oo",
    authDomain: "marketlengend.firebaseapp.com",
    databaseURL: "https://marketlengend-default-rtdb.firebaseio.com",
    projectId: "marketlengend",
    storageBucket: "marketlengend.firebasestorage.app",
    messagingSenderId: "637848488159",
    appId: "1:637848488159:web:5597855cc8eab35a58416a",
};
// Firebase helpers — initialised eagerly on page load
let _db = null;
function getDB() {
    if (_db)
        return _db;
    try {
        if (!firebase.apps || firebase.apps.length === 0)
            firebase.initializeApp(FIREBASE_CONFIG);
        _db = firebase.database();
    }
    catch (e) {
        console.error("Firebase init failed:", e);
    }
    return _db;
}
// Eagerly initialize Firebase on page load
(function () {
    try {
        getDB();
        console.log("Firebase initialized");
        // One-time cleanup: remove duplicate leaderboard entries
        // Leaderboard is keyed by username at /leaderboard/{username}
        // Duplicates happen when same player has entries under different key casing
        setTimeout(async () => {
            try {
                const db = getDB();
                if (!db)
                    return;
                const snap = await db.ref("leaderboard").once("value");
                const data = snap.val();
                if (!data)
                    return;
                const entries = Object.entries(data);
                // Group all entries by lowercase username
                const groups = {};
                entries.forEach(([key, val]) => {
                    if (!val)
                        return;
                    // Key IS the username in this leaderboard structure
                    const ukey = key.toLowerCase();
                    if (!groups[ukey])
                        groups[ukey] = [];
                    groups[ukey].push({ key, val });
                });
                // For any group with more than 1 entry, keep highest net worth, delete rest
                for (const [ukey, group] of Object.entries(groups)) {
                    if (group.length <= 1)
                        continue;
                    group.sort((a, b) => (b.val.netWorth || 0) - (a.val.netWorth || 0));
                    const keep = group[0];
                    const toDelete = group.slice(1);
                    for (const { key } of toDelete) {
                        await db.ref("leaderboard/" + key).remove();
                        console.log("Removed duplicate leaderboard entry:", key, "kept:", keep.key);
                    }
                }
                console.log("Leaderboard cleanup complete");
            }
            catch (e) {
                console.error("Cleanup error:", e);
            }
        }, 2000);
    }
    catch (e) { }
})();
function fbConfigured() {
    return FIREBASE_CONFIG.apiKey !== "PASTE_YOUR_apiKey_HERE";
}
function GlobalLeaderboard({ currentUser, netWorth, totalDrivingIncome, totalTaxPaid, companyName }) {
    const [board, setBoard] = useState([]);
    const [status, setStatus] = useState("loading"); // loading | live | offline
    // Write current player score + subscribe to live updates
    useEffect(() => {
        if (!fbConfigured()) {
            // Firebase not configured yet — fall back to localStorage so game still works
            setStatus("offline");
            let lb = [];
            try {
                const r = localStorage.getItem(LB_KEY);
                lb = r ? JSON.parse(r) : [];
            }
            catch { }
            lb = lb.filter(e => e.username !== currentUser);
            lb.push({ username: currentUser, netWorth: Math.round(netWorth), drivingIncome: Math.round(totalDrivingIncome), taxPaid: Math.round(totalTaxPaid), company: companyName || "Unregistered", updatedAt: Date.now() });
            // Deduplicate before sorting
            const seenLocal = new Set();
            const dedupedLB = lb.filter(p => { if (!p.username)
                return false; const k = p.username.toLowerCase(); if (seenLocal.has(k))
                return false; seenLocal.add(k); return true; });
            lb.length = 0;
            dedupedLB.forEach(p => lb.push(p));
            lb.sort((a, b) => b.netWorth - a.netWorth);
            lb = lb.slice(0, 100);
            try {
                localStorage.setItem(LB_KEY, JSON.stringify(lb));
            }
            catch { }
            setBoard(lb);
            return;
        }
        const db = getDB();
        if (!db) {
            setStatus("offline");
            return;
        }
        // Write this player's score
        const entry = { username: currentUser, netWorth: Math.round(netWorth), drivingIncome: Math.round(totalDrivingIncome), taxPaid: Math.round(totalTaxPaid), company: companyName || "Unregistered", updatedAt: Date.now() };
        db.ref("leaderboard/" + currentUser.toLowerCase()).set({ ...entry, username: currentUser }).catch(() => { });
        // Subscribe to live leaderboard (top 100 by netWorth)
        const ref = db.ref("leaderboard").orderByChild("netWorth").limitToLast(100);
        const handler = snapshot => {
            const data = snapshot.val() || {};
            // Deduplicate by username (case-insensitive) — keep highest net worth entry
            const seen = new Set();
            const deduped = Object.values(data).sort((a, b) => b.netWorth - a.netWorth).filter(p => {
                if (!p.username)
                    return false;
                const key = p.username.toLowerCase();
                if (seen.has(key))
                    return false;
                seen.add(key);
                return true;
            });
            const lb = deduped.slice(0, 100);
            setBoard(lb);
            setStatus("live");
        };
        ref.on("value", handler, () => setStatus("offline"));
        return () => ref.off("value", handler);
    }, [netWorth]);
    const myRank = board.findIndex(e => e.username === currentUser) + 1;
    const MEDALS = ["🥇", "🥈", "🥉"];
    return (React.createElement("div", null,
        React.createElement("div", { style: { background: status === "live" ? "rgba(0,255,136,0.06)" : status === "offline" ? "rgba(255,71,87,0.06)" : "rgba(245,200,66,0.06)", border: `1px solid ${status === "live" ? T.green : status === "offline" ? T.red : T.gold}44`, borderRadius: D.br, padding: "9px 14px", marginBottom: 10, display: "flex", alignItems: "center", gap: 8, fontSize: 11 } },
            React.createElement("span", { style: { fontSize: 14 } }, status === "live" ? "🌐" : status === "offline" ? "📴" : "⏳"),
            React.createElement("span", { style: { color: status === "live" ? T.green : status === "offline" ? T.red : T.gold, fontWeight: "bold" } }, status === "live" ? "Live global leaderboard — all players worldwide" : status === "offline" ? "Local only — add Firebase config for global leaderboard" : "Connecting to global leaderboard…")),
        React.createElement("div", { style: { background: T.card, border: `1px solid ${T.gold}44`, borderRadius: D.br, padding: 12, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" } },
            React.createElement("div", null,
                React.createElement("div", { style: { fontSize: 11, color: T.muted, marginBottom: 2 } }, "Your global rank"),
                React.createElement("div", { style: { fontSize: 22, fontWeight: "bold", color: T.gold } },
                    "#",
                    myRank || "—")),
            React.createElement("div", { style: { textAlign: "right" } },
                React.createElement("div", { style: { fontSize: 11, color: T.muted, marginBottom: 2 } }, "Your net worth"),
                React.createElement("div", { style: { fontSize: 16, fontWeight: "bold", fontFamily: "monospace", color: T.green } }, fmt(netWorth)))),
        status === "offline" && FIREBASE_CONFIG.apiKey === "PASTE_YOUR_apiKey_HERE" && (React.createElement("div", { style: { background: T.card, border: `1px solid ${T.orange}55`, borderRadius: D.br, padding: 14, marginBottom: 12, fontSize: 12, color: T.muted, lineHeight: 1.8 } },
            React.createElement("div", { style: { fontWeight: "bold", color: T.orange, marginBottom: 6 } }, "\uD83D\uDD27 Firebase setup required for global leaderboard"),
            "1. Go to ",
            React.createElement("strong", { style: { color: T.text } }, "console.firebase.google.com"),
            React.createElement("br", null),
            "2. Create a free project \u2192 Enable ",
            React.createElement("strong", { style: { color: T.text } }, "Realtime Database"),
            React.createElement("br", null),
            "3. Copy your config keys into ",
            React.createElement("strong", { style: { color: T.cyan } }, "FIREBASE_CONFIG"),
            " at the top of the script",
            React.createElement("br", null),
            "4. In Firebase rules, set read/write to ",
            React.createElement("strong", { style: { color: T.text } }, "true"),
            " (for open play)")),
        board.map((e, i) => (React.createElement("div", { key: e.username, style: { background: e.username === currentUser ? "rgba(0,229,255,0.05)" : T.card, border: `1px solid ${e.username === currentUser ? T.cyan + "55" : T.border}`, borderRadius: D.br, padding: "11px 14px", marginBottom: 7, display: "flex", alignItems: "center", gap: 12 } },
            React.createElement("div", { style: { width: 32, height: 32, borderRadius: "50%", background: i < 3 ? `${["#FFD700", "#C0C0C0", "#CD7F32"][i]}22` : T.surface, display: "flex", alignItems: "center", justifyContent: "center", fontSize: i < 3 ? 18 : 13, fontWeight: "bold", color: i < 3 ? "inherit" : T.muted, flexShrink: 0 } }, i < 3 ? MEDALS[i] : `#${i + 1}`),
            React.createElement("div", { style: { flex: 1 } },
                React.createElement("div", { style: { fontWeight: "bold", fontSize: 13, color: e.username === currentUser ? T.cyan : T.text } },
                    e.username,
                    " ",
                    e.username === currentUser && React.createElement("span", { style: { fontSize: 10, color: T.cyan } }, "(you)")),
                React.createElement("div", { style: { fontSize: 11, color: T.muted, marginTop: 1 } },
                    "\uD83C\uDFE2 ",
                    e.company)),
            React.createElement("div", { style: { textAlign: "right" } },
                React.createElement("div", { style: { fontWeight: "bold", fontSize: 13, fontFamily: "monospace", color: T.green } }, fmt(e.netWorth)),
                React.createElement("div", { style: { fontSize: 10, color: T.muted } },
                    "Drive: ",
                    fmt(e.drivingIncome)))))),
        board.length === 0 && React.createElement("div", { style: { textAlign: "center", color: T.muted, fontSize: 13, padding: "30px 0" } }, "No players yet. Complete a drive to join the leaderboard!")));
}
// ── STREAK BONUS MODAL ────────────────────────────────────────────────────────
function StreakBonusModal({ streak, bonus, onClose }) {
    useEffect(() => { const id = setTimeout(onClose, 4000); return () => clearTimeout(id); }, []);
    const flames = ["🔥", "🔥🔥", "🔥🔥🔥", "💥🔥💥", "⚡🔥⚡", "🌟🔥🌟", "👑🔥👑"];
    const msgs = ["Welcome back!", "2 days in a row!", "3-day streak!", "4 days strong!", "5-day legend!", "6 days! Unstoppable!", "7-DAY MAX STREAK!"];
    return (React.createElement("div", { style: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 950, background: "rgba(7,12,24,0.93)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI',sans-serif" }, onClick: onClose },
        React.createElement("div", { style: { background: "linear-gradient(135deg,#0f1729,#1a1040)", border: "2px solid #f5c842", borderRadius: 20, padding: "28px 36px", textAlign: "center", maxWidth: 300 } },
            React.createElement("div", { style: { fontSize: 48, marginBottom: 8 } }, flames[Math.min(streak - 1, 6)]),
            React.createElement("div", { style: { fontSize: 20, fontWeight: "bold", color: "#f5c842", marginBottom: 4 } }, msgs[Math.min(streak - 1, 6)]),
            React.createElement("div", { style: { fontSize: 13, color: "#6b7fa0", marginBottom: 16 } },
                "Day ",
                streak,
                " login streak"),
            React.createElement("div", { style: { background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.3)", borderRadius: 10, padding: "10px 18px", marginBottom: 14 } },
                React.createElement("div", { style: { fontSize: 11, color: "#6b7fa0", marginBottom: 2 } }, "Streak bonus added to wallet"),
                React.createElement("div", { style: { fontSize: 22, fontWeight: "bold", color: "#00ff88", fontFamily: "monospace" } },
                    "+\u20A6",
                    bonus.toLocaleString())),
            streak < 7 && React.createElement("div", { style: { fontSize: 11, color: "#6b7fa0" } }, "Come back tomorrow for a bigger bonus! (Max day 7: \u20A63,500)"),
            streak >= 7 && React.createElement("div", { style: { fontSize: 11, color: "#f5c842" } }, "\uD83C\uDFC6 Maximum streak reached! Keep it up!"),
            React.createElement("div", { style: { fontSize: 10, color: "#2a3a55", marginTop: 12 } }, "Tap to continue"))));
}
// ── DAILY CHALLENGES DATA ─────────────────────────────────────────────────────
function getTodaysChallenges() {
    // Seeded by day-of-year so everyone gets the same challenges each day
    const d = new Date();
    const seed = d.getFullYear() * 1000 + Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
    const pool = [
        { id: "drive1", icon: "🚗", title: "Hit the Road", desc: "Complete 1 drive today", type: "drives", target: 1, reward: 500 },
        { id: "drive3", icon: "🛣️", title: "Road Warrior", desc: "Complete 3 drives today", type: "drives", target: 3, reward: 1500 },
        { id: "earn5k", icon: "💵", title: "Earn ₦5,000", desc: "Earn ₦5,000 from driving today", type: "earned", target: 5000, reward: 1000 },
        { id: "earn10k", icon: "💰", title: "Big Earner", desc: "Earn ₦10,000 from driving today", type: "earned", target: 10000, reward: 2500 },
        { id: "buy2", icon: "📈", title: "Stock Picker", desc: "Buy stocks in 2 different companies", type: "buys", target: 2, reward: 800 },
        { id: "buy5", icon: "📊", title: "Diversifier", desc: "Buy stocks in 5 different companies", type: "buys", target: 5, reward: 2000 },
        { id: "nw1m", icon: "💎", title: "Million Club", desc: "Reach ₦1M net worth", type: "networth", target: 1000000, reward: 5000 },
        { id: "nw5m", icon: "🏆", title: "Five Million", desc: "Reach ₦5M net worth", type: "networth", target: 5000000, reward: 10000 },
        { id: "xp50", icon: "🎓", title: "Scholar", desc: "Earn 50 XP from lessons today", type: "xp", target: 50, reward: 1000 },
        { id: "streak3", icon: "🔥", title: "Streak Master", desc: "Maintain a 3-day login streak", type: "streak", target: 3, reward: 3000 },
    ];
    // Pick 3 challenges seeded by date
    const picks = [];
    for (let i = 0; i < 3; i++)
        picks.push(pool[(seed * 31 + i * 17) % pool.length]);
    return picks;
}
// ── CHALLENGES SCREEN (Daily + Friend vs Friend) ──────────────────────────────
function ChallengesScreen({ currentUser, netWorth, streak, totalChallengesWon, onChallengeWon }) {
    const [subTab, setSubTab] = useState("daily");
    const [challenges] = useState(getTodaysChallenges);
    const [fbChallenges, setFbChallenges] = useState([]);
    const [newChallenge, setNewChallenge] = useState({ opponent: "", stake: 1000, metric: "netWorth", days: 7 });
    const [sending, setSending] = useState(false);
    const [msg, setMsg] = useState("");
    // Load friend challenges from Firebase
    useEffect(() => {
        if (subTab !== "friend")
            return;
        try {
            const db = getDB();
            if (!db || !fbConfigured())
                return;
            const ref = db.ref("challenges").orderByChild("updatedAt").limitToLast(50);
            ref.on("value", snap => {
                const data = snap.val() || {};
                const all = Object.entries(data).map(([id, v]) => ({ id, ...v }))
                    .filter(c => c.player1 === currentUser || c.player2 === currentUser)
                    .sort((a, b) => b.updatedAt - a.updatedAt);
                setFbChallenges(all);
            });
            return () => ref.off();
        }
        catch (e) { }
    }, [subTab, currentUser]);
    async function sendChallenge() {
        if (!newChallenge.opponent.trim()) {
            setMsg("Enter opponent username");
            return;
        }
        if (newChallenge.opponent === currentUser) {
            setMsg("You can't challenge yourself!");
            return;
        }
        setSending(true);
        setMsg("");
        try {
            const db = getDB();
            if (!db || !fbConfigured()) {
                setMsg("Firebase not configured — global challenges unavailable.");
                setSending(false);
                return;
            }
            const id = `${currentUser}_vs_${newChallenge.opponent}_${Date.now()}`;
            await db.ref("challenges/" + id).set({
                id, player1: currentUser, player2: newChallenge.opponent,
                stake: Number(newChallenge.stake), metric: newChallenge.metric,
                days: Number(newChallenge.days), status: "pending",
                player1Start: Math.round(netWorth), player2Start: null,
                player1Current: Math.round(netWorth), player2Current: null,
                startDate: Date.now(), updatedAt: Date.now(),
            });
            setMsg("✅ Challenge sent! Tell your opponent to check their Versus tab.");
        }
        catch (e) {
            setMsg("Failed to send. Try again.");
        }
        setSending(false);
    }
    async function acceptChallenge(c) {
        try {
            const db = getDB();
            if (!db)
                return;
            await db.ref("challenges/" + c.id).update({ status: "active", player2Start: Math.round(netWorth), player2Current: Math.round(netWorth), updatedAt: Date.now() });
        }
        catch (e) { }
    }
    async function updateMyScore(c) {
        try {
            const db = getDB();
            if (!db)
                return;
            const field = c.player1 === currentUser ? "player1Current" : "player2Current";
            await db.ref("challenges/" + c.id).update({ [field]: Math.round(netWorth), updatedAt: Date.now() });
        }
        catch (e) { }
    }
    function challengeResult(c) {
        const myScore = c.player1 === currentUser ? c.player1Current : c.player2Current;
        const oppScore = c.player1 === currentUser ? c.player2Current : c.player1Current;
        const myStart = c.player1 === currentUser ? c.player1Start : c.player2Start;
        const oppStart = c.player1 === currentUser ? c.player2Start : c.player1Start;
        const myGain = (myScore - myStart) || 0;
        const oppGain = (oppScore - oppStart) || 0;
        const winning = myGain > oppGain;
        return { myScore, oppScore, myGain, oppGain, winning };
    }
    const METRICS = { netWorth: "Net Worth Growth", drivingIncome: "Driving Income" };
    return (React.createElement("div", { style: { paddingBottom: 20 } },
        React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 16 } }, [{ k: "daily", label: "📅 Daily Challenges" }, { k: "friend", label: "⚔️ Friend vs Friend" }].map(t => (React.createElement("button", { key: t.k, onClick: () => setSubTab(t.k), style: { flex: 1, padding: "10px 8px", borderRadius: D.br, border: `1px solid ${subTab === t.k ? T.cyan : T.border}`, background: subTab === t.k ? "rgba(0,229,255,0.08)" : T.card, color: subTab === t.k ? T.cyan : T.muted, fontWeight: subTab === t.k ? "bold" : "normal", cursor: "pointer", fontSize: 13 } }, t.label)))),
        subTab === "daily" && (React.createElement("div", null,
            React.createElement("div", { style: { background: T.card, border: `1px solid ${T.gold}55`, borderRadius: D.br, padding: 14, marginBottom: 14, display: "flex", alignItems: "center", gap: 14 } },
                React.createElement("div", { style: { fontSize: 36 } }, "\uD83D\uDD25"),
                React.createElement("div", { style: { flex: 1 } },
                    React.createElement("div", { style: { fontSize: 11, color: T.muted, marginBottom: 2 } }, "Current Login Streak"),
                    React.createElement("div", { style: { fontSize: 24, fontWeight: "bold", color: T.gold } },
                        streak,
                        " Day",
                        streak !== 1 ? "s" : ""),
                    React.createElement("div", { style: { fontSize: 11, color: T.muted, marginTop: 2 } },
                        "Tomorrow's bonus: \u20A6",
                        (Math.min(streak + 1, 7) * 500).toLocaleString())),
                React.createElement("div", { style: { textAlign: "right" } },
                    React.createElement("div", { style: { fontSize: 11, color: T.muted, marginBottom: 2 } }, "Challenges Won"),
                    React.createElement("div", { style: { fontSize: 20, fontWeight: "bold", color: T.purple } }, totalChallengesWon))),
            React.createElement("div", { style: { background: T.card, border: `1px solid ${T.border}`, borderRadius: D.br, padding: 14, marginBottom: 14 } },
                React.createElement("div", { style: { fontSize: 11, color: T.muted, marginBottom: 10 } }, "Streak progress (max day 7)"),
                React.createElement("div", { style: { display: "flex", gap: 6 } }, Array.from({ length: 7 }, (_, i) => (React.createElement("div", { key: i, style: { flex: 1, textAlign: "center" } },
                    React.createElement("div", { style: { height: 6, borderRadius: 3, background: i < streak ? T.gold : T.surface, marginBottom: 4, transition: "background 0.3s" } }),
                    React.createElement("div", { style: { fontSize: 9, color: i < streak ? T.gold : T.muted } },
                        "D",
                        i + 1),
                    React.createElement("div", { style: { fontSize: 9, color: i < streak ? T.green : T.muted } },
                        "\u20A6",
                        ((i + 1) * 500).toLocaleString())))))),
            React.createElement("div", { style: { fontSize: 11, color: T.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 } }, "Today's Challenges"),
            challenges.map((c, i) => {
                const prog = c.type === "streak" ? Math.min(streak, c.target) : c.type === "networth" ? Math.min(netWorth, c.target) : 0;
                const pct = Math.min(100, Math.round((prog / c.target) * 100));
                const done = c.type === "streak" ? streak >= c.target : c.type === "networth" ? netWorth >= c.target : false;
                return (React.createElement("div", { key: i, style: { background: done ? "rgba(0,255,136,0.05)" : T.card, border: `1px solid ${done ? T.green + "55" : T.border}`, borderRadius: D.br, padding: 14, marginBottom: 10 } },
                    React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 8 } },
                        React.createElement("span", { style: { fontSize: 24 } }, c.icon),
                        React.createElement("div", { style: { flex: 1 } },
                            React.createElement("div", { style: { fontWeight: "bold", fontSize: 13, color: done ? T.green : T.text } },
                                c.title,
                                " ",
                                done && "✅"),
                            React.createElement("div", { style: { fontSize: 11, color: T.muted } }, c.desc)),
                        React.createElement("div", { style: { textAlign: "right" } },
                            React.createElement("div", { style: { fontSize: 11, color: T.muted } }, "Reward"),
                            React.createElement("div", { style: { fontSize: 13, fontWeight: "bold", color: T.gold } },
                                "\u20A6",
                                c.reward.toLocaleString()))),
                    (c.type === "streak" || c.type === "networth") && (React.createElement("div", null,
                        React.createElement("div", { style: { height: 5, background: T.surface, borderRadius: 3, overflow: "hidden" } },
                            React.createElement("div", { style: { height: "100%", width: pct + "%", background: done ? T.green : T.cyan, borderRadius: 3, transition: "width 0.5s" } })),
                        React.createElement("div", { style: { fontSize: 10, color: T.muted, marginTop: 3 } },
                            pct,
                            "% complete"))),
                    (c.type === "drives" || c.type === "earned" || c.type === "buys" || c.type === "xp") && (React.createElement("div", { style: { fontSize: 11, color: T.muted, fontStyle: "italic" } }, "Tracked automatically during gameplay \u2014 complete in the Runner tab"))));
            }),
            React.createElement("div", { style: { fontSize: 11, color: T.muted, textAlign: "center", marginTop: 8 } }, "Challenges refresh every day at midnight"))),
        subTab === "friend" && (React.createElement("div", null,
            React.createElement("div", { style: { background: T.card, border: `1px solid ${T.purple}55`, borderRadius: D.br, padding: 14, marginBottom: 16 } },
                React.createElement("div", { style: { fontWeight: "bold", fontSize: 13, color: T.purple, marginBottom: 12 } }, "\u2694\uFE0F Challenge a Friend"),
                React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } },
                    React.createElement("input", { value: newChallenge.opponent, onChange: e => setNewChallenge(c => ({ ...c, opponent: e.target.value })), placeholder: "Opponent's username", style: { background: T.surface, border: `1px solid ${T.border}`, borderRadius: D.brs, color: T.text, padding: "9px 12px", fontSize: 13 } }),
                    React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 } },
                        React.createElement("div", null,
                            React.createElement("div", { style: { fontSize: 10, color: T.muted, marginBottom: 4 } }, "Duration (days)"),
                            React.createElement("select", { value: newChallenge.days, onChange: e => setNewChallenge(c => ({ ...c, days: e.target.value })), style: { width: "100%", background: T.surface, border: `1px solid ${T.border}`, borderRadius: D.brs, color: T.text, padding: "8px 10px", fontSize: 12 } }, [1, 3, 7, 14, 30].map(d => React.createElement("option", { key: d, value: d },
                                d,
                                " day",
                                d > 1 ? "s" : "")))),
                        React.createElement("div", null,
                            React.createElement("div", { style: { fontSize: 10, color: T.muted, marginBottom: 4 } }, "Metric"),
                            React.createElement("select", { value: newChallenge.metric, onChange: e => setNewChallenge(c => ({ ...c, metric: e.target.value })), style: { width: "100%", background: T.surface, border: `1px solid ${T.border}`, borderRadius: D.brs, color: T.text, padding: "8px 10px", fontSize: 12 } }, Object.entries(METRICS).map(([k, v]) => React.createElement("option", { key: k, value: k }, v)))))),
                msg && React.createElement("div", { style: { fontSize: 12, color: msg.startsWith("✅") ? T.green : T.red, marginTop: 8 } }, msg),
                React.createElement("button", { onClick: sendChallenge, disabled: sending, style: { width: "100%", marginTop: 12, padding: "11px", background: sending ? "transparent" : "linear-gradient(135deg,rgba(124,111,223,0.3),rgba(0,229,255,0.2))", border: `1px solid ${T.purple}`, borderRadius: D.brs, color: sending ? T.muted : T.purple, fontWeight: "bold", cursor: sending ? "not-allowed" : "pointer", fontSize: 13 } }, sending ? "Sending…" : "Send Challenge ⚔️")),
            fbChallenges.length === 0 ? (React.createElement("div", { style: { textAlign: "center", color: T.muted, fontSize: 13, padding: "30px 0" } },
                "No challenges yet. Challenge a friend above!",
                React.createElement("br", null),
                React.createElement("span", { style: { fontSize: 11, marginTop: 6, display: "block" } }, "Both players must use the same username they registered with."))) : fbChallenges.map(c => {
                const isP1 = c.player1 === currentUser;
                const opponent = isP1 ? c.player2 : c.player1;
                const res = c.status === "active" ? challengeResult(c) : null;
                const endDate = c.startDate ? (new Date(c.startDate + c.days * 86400000)).toLocaleDateString() : "-";
                return (React.createElement("div", { key: c.id, style: { background: T.card, border: `1px solid ${c.status === "active" ? T.cyan + "55" : c.status === "pending" ? T.gold + "55" : T.border}`, borderRadius: D.br, padding: 14, marginBottom: 10 } },
                    React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 } },
                        React.createElement("div", null,
                            React.createElement("div", { style: { fontWeight: "bold", fontSize: 13, color: T.text } },
                                "vs ",
                                React.createElement("span", { style: { color: T.cyan } }, opponent)),
                            React.createElement("div", { style: { fontSize: 11, color: T.muted } },
                                METRICS[c.metric],
                                " \u00B7 ",
                                c.days,
                                "d \u00B7 ends ",
                                endDate)),
                        React.createElement("div", { style: { padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: "bold",
                                background: c.status === "active" ? "rgba(0,229,255,0.1)" : c.status === "pending" ? "rgba(245,200,66,0.1)" : "rgba(107,127,160,0.1)",
                                color: c.status === "active" ? T.cyan : c.status === "pending" ? T.gold : T.muted } }, c.status === "active" ? "● LIVE" : c.status === "pending" ? "⏳ PENDING" : "✓ DONE")),
                    c.status === "active" && res && (React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 } },
                        React.createElement("div", { style: { background: res.winning ? "rgba(0,255,136,0.06)" : "rgba(255,71,87,0.06)", border: `1px solid ${res.winning ? T.green + "44" : T.red + "44"}`, borderRadius: D.brs, padding: 10, textAlign: "center" } },
                            React.createElement("div", { style: { fontSize: 10, color: T.muted, marginBottom: 2 } }, "You"),
                            React.createElement("div", { style: { fontSize: 14, fontWeight: "bold", color: res.winning ? T.green : T.red, fontFamily: "monospace" } }, fmt(res.myScore)),
                            React.createElement("div", { style: { fontSize: 10, color: res.myGain >= 0 ? T.green : T.red } },
                                "+",
                                fmt(res.myGain))),
                        React.createElement("div", { style: { background: T.surface, border: `1px solid ${T.border}`, borderRadius: D.brs, padding: 10, textAlign: "center" } },
                            React.createElement("div", { style: { fontSize: 10, color: T.muted, marginBottom: 2 } }, opponent),
                            React.createElement("div", { style: { fontSize: 14, fontWeight: "bold", color: T.text, fontFamily: "monospace" } }, fmt(res.oppScore || 0)),
                            React.createElement("div", { style: { fontSize: 10, color: T.muted } },
                                "+",
                                fmt(res.oppGain))))),
                    c.status === "active" && (React.createElement("button", { onClick: () => updateMyScore(c), style: { width: "100%", padding: "8px", background: "rgba(0,229,255,0.08)", border: `1px solid ${T.cyan}44`, borderRadius: D.brs, color: T.cyan, fontSize: 12, cursor: "pointer" } }, "\uD83D\uDD04 Sync my score")),
                    c.status === "pending" && !isP1 && (React.createElement("button", { onClick: () => acceptChallenge(c), style: { width: "100%", padding: "9px", background: "linear-gradient(135deg,rgba(0,255,136,0.15),rgba(0,229,255,0.1))", border: `1px solid ${T.green}`, borderRadius: D.brs, color: T.green, fontWeight: "bold", fontSize: 13, cursor: "pointer" } }, "\u2705 Accept Challenge")),
                    c.status === "pending" && isP1 && (React.createElement("div", { style: { fontSize: 11, color: T.muted, textAlign: "center" } },
                        "Waiting for ",
                        opponent,
                        " to accept\u2026"))));
            })))));
}
// ── IPO SCREEN ────────────────────────────────────────────────────────────────
function IPOScreen({ netWorth, wallet, companyName, isRegistered, ipoData, valuationUnlocked, onLaunchIPO, onSellShares, onBuyback }) {
    const [offerPct, setOfferPct] = useState("20");
    const [offerPrice, setOfferPrice] = useState("");
    const [err, setErr] = useState("");
    const unlocked = isRegistered && netWorth >= IPO_UNLOCK_NET_WORTH && valuationUnlocked;
    const ipoLockReason = !isRegistered ? "Register a company first" : !valuationUnlocked ? "Unlock the Stock Valuation App first (reach $50M driving income)" : netWorth < IPO_UNLOCK_NET_WORTH ? `Reach ${fmt(IPO_UNLOCK_NET_WORTH)} net worth (current: ${fmt(netWorth)})` : "";
    const isListed = ipoData && ipoData.stage === "Listed";
    const stage = ipoData ? ipoData.stage : "Private";
    const stageIdx = IPO_STAGES.indexOf(stage);
    function launchIPO() {
        setErr("");
        const pct = parseFloat(offerPct);
        const price = parseFloat(offerPrice);
        if (!pct || pct < 5 || pct > 49) {
            setErr("Offer between 5% and 49% of company.");
            return;
        }
        if (!price || price <= 0) {
            setErr("Set a valid IPO share price.");
            return;
        }
        const totalShares = 1000000; // 1 million total shares
        const offeredShares = Math.round(totalShares * (pct / 100));
        const raiseAmount = offeredShares * price;
        onLaunchIPO({ stage: "Listed", totalShares, offeredShares, sharePrice: price, offeredPct: pct, raiseAmount, sharesRemaining: offeredShares, marketCap: totalShares * price, listedDate: new Date().toLocaleDateString() });
    }
    function sellMore() {
        if (!ipoData || ipoData.sharesRemaining <= 0) {
            setErr("No shares left to sell.");
            return;
        }
        const revenue = ipoData.sharesRemaining * ipoData.sharePrice * 0.5;
        onSellShares(Math.round(revenue));
    }
    const currentMktCap = ipoData ? ipoData.totalShares * ipoData.sharePrice : 0;
    return (React.createElement("div", null,
        React.createElement("div", { style: { background: T.card, border: `1px solid ${T.border}`, borderRadius: D.br, padding: 14, marginBottom: 12 } },
            React.createElement("div", { style: { fontSize: 12, fontWeight: "bold", color: T.text, marginBottom: 10 } }, "Company Stage"),
            React.createElement("div", { style: { display: "flex", gap: 0, marginBottom: 8 } }, IPO_STAGES.map((s, i) => (React.createElement("div", { key: s, style: { flex: 1, textAlign: "center" } },
                React.createElement("div", { style: { height: 6, background: i <= stageIdx ? T.gold : T.border, borderRadius: i === 0 ? "3px 0 0 3px" : i === IPO_STAGES.length - 1 ? "0 3px 3px 0" : "0" } }),
                React.createElement("div", { style: { fontSize: 9, color: i <= stageIdx ? T.gold : T.muted, marginTop: 4, fontWeight: i === stageIdx ? "bold" : "normal" } }, s))))),
            ipoData && (React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 } },
                React.createElement(DCard, { label: "Market Cap", value: fmt(currentMktCap), color: T.gold }),
                React.createElement(DCard, { label: "Share Price", value: fmt(ipoData.sharePrice), color: T.cyan }),
                React.createElement(DCard, { label: "Shares Offered", value: ipoData.offeredPct + "%", color: T.purple }),
                React.createElement(DCard, { label: "Capital Raised", value: fmt(ipoData.raiseAmount), color: T.green })))),
        !unlocked && (React.createElement("div", { style: { background: T.card, border: `1px solid ${T.orange}55`, borderRadius: D.br, padding: 14, marginBottom: 12, fontSize: 13, color: T.muted, lineHeight: 1.8 } },
            React.createElement("div", { style: { fontWeight: "bold", color: T.orange, marginBottom: 8, fontSize: 14 } }, "\uD83D\uDD12 IPO Locked"),
            React.createElement("div", { style: { color: T.red, marginBottom: 8, fontSize: 12 } },
                "\u26A0\uFE0F ",
                ipoLockReason),
            React.createElement("div", { style: { background: T.surface, borderRadius: D.brs, padding: "10px 12px", marginBottom: 10, fontSize: 12, lineHeight: 1.8 } },
                React.createElement("strong", { style: { color: T.gold } }, "Why $70M?"),
                React.createElement("br", null),
                "Going public is the highest milestone in this game \u2014 and it should be earned. By the time you reach $70M net worth, you'll have:",
                React.createElement("br", null),
                "\u2705 Played enough drives to understand the market",
                React.createElement("br", null),
                "\u2705 Passed multiple timed learning quizzes on stocks, tax, ROE, DCF, and IPOs",
                React.createElement("br", null),
                "\u2705 Built real estate investments and a company ledger",
                React.createElement("br", null),
                "\u2705 Experienced market crashes, bull runs, and tax planning",
                React.createElement("br", null),
                React.createElement("br", null),
                React.createElement("strong", { style: { color: T.text } }, "This ensures every company that lists on the exchange genuinely knows what they're doing.")),
            React.createElement("div", { style: { marginBottom: 4, display: "flex", justifyContent: "space-between", fontSize: 12 } },
                React.createElement("span", null, "Progress to IPO"),
                React.createElement("span", { style: { fontFamily: "monospace", color: T.gold } },
                    fmt(netWorth),
                    " / ",
                    fmt(IPO_UNLOCK_NET_WORTH))),
            React.createElement("div", { style: { height: 8, background: T.surface, borderRadius: 4, marginBottom: 4 } },
                React.createElement("div", { style: { height: "100%", width: Math.min(100, (netWorth / IPO_UNLOCK_NET_WORTH) * 100) + "%", background: `linear-gradient(90deg,${T.orange},${T.gold})`, borderRadius: 4, transition: "width 0.5s" } })),
            React.createElement("div", { style: { fontSize: 11, color: T.muted } }, "Keep driving, learning, and investing to unlock your IPO."))),
        unlocked && !isListed && (React.createElement("div", null,
            React.createElement("div", { style: { background: T.card, border: `1px solid ${T.gold}44`, borderRadius: D.br, padding: 14, marginBottom: 12, fontSize: 12, color: T.muted, lineHeight: 1.7 } },
                React.createElement("div", { style: { fontWeight: "bold", color: T.gold, fontSize: 14, marginBottom: 6 } }, "\uD83D\uDE80 Launch Your IPO"),
                "You've built ",
                React.createElement("strong", { style: { color: T.text } }, companyName),
                " to a ",
                fmt(netWorth),
                " net worth. Now take it public \u2014 sell shares to raise capital and grow your empire further."),
            err && React.createElement("div", { style: { background: "rgba(255,71,87,0.1)", border: `1px solid ${T.red}44`, borderRadius: D.brs, padding: "8px 12px", fontSize: 12, color: T.red, marginBottom: 10 } }, err),
            React.createElement("div", { style: { marginBottom: 10 } },
                React.createElement("div", { style: { fontSize: 12, color: T.muted, marginBottom: 5 } }, "% of company to offer publicly (5\u201349%)"),
                React.createElement("input", { type: "number", min: "5", max: "49", value: offerPct, onChange: e => setOfferPct(e.target.value), style: { width: "100%", background: T.surface, border: `1px solid ${T.border}`, borderRadius: D.brs, color: T.text, padding: "9px 12px", fontSize: 13, boxSizing: "border-box" } })),
            React.createElement("div", { style: { marginBottom: 14 } },
                React.createElement("div", { style: { fontSize: 12, color: T.muted, marginBottom: 5 } }, "IPO share price ($)"),
                React.createElement("input", { type: "number", min: "0.01", value: offerPrice, onChange: e => setOfferPrice(e.target.value), placeholder: "e.g. 10.00", style: { width: "100%", background: T.surface, border: `1px solid ${T.border}`, borderRadius: D.brs, color: T.text, padding: "9px 12px", fontSize: 13, boxSizing: "border-box" } })),
            offerPrice && offerPct && (React.createElement("div", { style: { background: T.card, border: `1px solid ${T.green}44`, borderRadius: D.br, padding: 12, marginBottom: 14 } },
                React.createElement("div", { style: { fontSize: 12, color: T.muted, marginBottom: 4 } }, "If you IPO at these terms:"),
                React.createElement("div", { style: { fontSize: 13, color: T.green, fontWeight: "bold" } },
                    "You raise: ",
                    fmt(Math.round(1000000 * (parseFloat(offerPct) / 100) * parseFloat(offerPrice)))),
                React.createElement("div", { style: { fontSize: 12, color: T.muted } },
                    "Market Cap: ",
                    fmt(1000000 * parseFloat(offerPrice)),
                    " \u00B7 You retain ",
                    100 - parseFloat(offerPct),
                    "%"))),
            React.createElement("button", { onClick: launchIPO, style: { width: "100%", padding: "13px", background: `linear-gradient(135deg,${T.gold},${T.orange})`, color: "#05050a", border: "none", borderRadius: D.br, fontWeight: "bold", fontSize: 14, cursor: "pointer" } },
                "\uD83D\uDE80 List ",
                companyName,
                " on the Exchange"))),
        isListed && (React.createElement("div", null,
            React.createElement("div", { style: { background: "rgba(0,255,136,0.05)", border: `1px solid ${T.green}55`, borderRadius: D.br, padding: 14, marginBottom: 12 } },
                React.createElement("div", { style: { fontWeight: "bold", fontSize: 14, color: T.green, marginBottom: 4 } },
                    "\u2705 ",
                    companyName,
                    " is Public!"),
                React.createElement("div", { style: { fontSize: 12, color: T.muted, lineHeight: 1.7 } },
                    "Listed on ",
                    ipoData.listedDate,
                    " \u00B7 ",
                    ipoData.offeredPct,
                    "% offered at ",
                    fmt(ipoData.sharePrice),
                    "/share \u00B7 Capital raised: ",
                    React.createElement("strong", { style: { color: T.green } }, fmt(ipoData.raiseAmount)))),
            React.createElement("div", { style: { background: T.card, border: `1px solid ${T.border}`, borderRadius: D.br, padding: 14, marginBottom: 12 } },
                React.createElement("div", { style: { fontSize: 13, fontWeight: "bold", color: T.text, marginBottom: 10 } }, "Post-IPO Actions"),
                React.createElement("button", { onClick: sellMore, style: { width: "100%", padding: "11px", background: "rgba(0,229,255,0.08)", border: `1px solid ${T.cyan}`, borderRadius: D.brs, color: T.cyan, fontWeight: "bold", fontSize: 13, cursor: "pointer", marginBottom: 8 } }, "\uD83D\uDCB9 Secondary Offering \u2014 Sell remaining shares"),
                React.createElement("button", { onClick: onBuyback, style: { width: "100%", padding: "11px", background: "rgba(245,200,66,0.08)", border: `1px solid ${T.gold}`, borderRadius: D.brs, color: T.gold, fontWeight: "bold", fontSize: 13, cursor: "pointer" } }, "\uD83D\uDD04 Buyback \u2014 Increase your ownership stake")),
            React.createElement("div", { style: { fontSize: 11, color: T.muted, lineHeight: 1.7, background: T.card, borderRadius: D.br, padding: 12 } },
                React.createElement("strong", { style: { color: T.text } }, "What listing means:"),
                " Your company is now a public entity. The market cap reflects what investors believe your company is worth. As your driving income and net worth grow, so does your company's perceived value. A Blue Chip status is achieved when market cap exceeds ",
                fmt(10000000),
                ".")))));
}
// ── MAIN APP ──────────────────────────────────────────────────────────────────
const DEF_SAVE = { wallet: 10000, owned: {}, purchasePrices: {}, bankruptcyData: null, loans: [], loanHistory: [], portfolio: {}, totalBills: 0, day: 1, carSkin: "default", totalDrivingIncome: 0, totalTaxPaid: 0, totalPassiveIncome: 0, isRegistered: false, companyName: "", showRegPrompt: true, companyLedger: [], xp: 0, completedLessons: [], ipoData: null, streak: 0, lastLoginDate: null, totalChallengesWon: 0, assetPrices: null, valuationUnlocked: false };
// ── BANKRUPTCY SCREEN ─────────────────────────────────────────────────────────
function BankruptcyScreen({ user, debt, companyName, isRegistered, onBailout, onAcknowledge }) {
    const [bailouts, setBailouts] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // Load bail out offers from Firebase
        const db = getDB();
        if (!db) {
            setLoading(false);
            return;
        }
        const ref = db.ref("bailouts/" + user);
        ref.on("value", snap => {
            const v = snap.val();
            setBailouts(v ? Object.values(v).filter(b => b.status === "pending") : []);
            setLoading(false);
        });
        return () => ref.off();
    }, [user]);
    const totalBailout = bailouts.reduce((s, b) => s + b.amount, 0);
    const canRecover = totalBailout >= Math.abs(debt);
    async function acceptBailout() {
        const db = getDB();
        if (!db)
            return;
        // Accept all pending bailouts
        for (const b of bailouts) {
            await db.ref("bailouts/" + user + "/" + b.id + "/status").set("accepted");
            // Credit bail out amount to player
            await db.ref("p2p/pendingCredits/" + user + "/bailout_" + b.id).set({
                amount: b.amount, from: b.lender, at: new Date().toISOString(), type: "bailout"
            });
        }
        onBailout(totalBailout);
    }
    return (React.createElement("div", { style: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(7,12,24,0.98)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Segoe UI',sans-serif", overflowY: "auto" } },
        React.createElement("div", { style: { maxWidth: 420, width: "100%" } },
            React.createElement("div", { style: { textAlign: "center", marginBottom: 20 } },
                React.createElement("div", { style: { fontSize: 48, marginBottom: 8 } }, "\uD83D\uDCB8"),
                React.createElement("div", { style: { fontSize: 24, fontWeight: "bold", color: T.red, marginBottom: 4 } }, "BANKRUPTCY"),
                React.createElement("div", { style: { fontSize: 13, color: T.muted } }, companyName ? `${companyName} has gone bankrupt` : "Your finances have collapsed")),
            React.createElement("div", { style: { background: T.card, border: `1px solid ${T.red}55`, borderRadius: D.br, padding: 14, marginBottom: 12 } },
                React.createElement("div", { style: { fontWeight: "bold", fontSize: 13, color: T.red, marginBottom: 10 } }, "\uD83D\uDCCB Bankruptcy Summary"),
                React.createElement("div", { style: { fontSize: 12, color: T.muted, lineHeight: 1.8 } }, "Your net worth has fallen to zero or below. All assets are being liquidated to cover debts."),
                React.createElement("div", { style: { marginTop: 10, display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: "bold", borderTop: `1px solid ${T.border}`, paddingTop: 8 } },
                    React.createElement("span", { style: { color: T.text } }, "Debt remaining"),
                    React.createElement("span", { style: { fontFamily: "monospace", color: T.red } }, fmt(Math.abs(debt))))),
            React.createElement("div", { style: { background: T.card, border: `1px solid ${T.orange}44`, borderRadius: D.br, padding: 14, marginBottom: 12 } },
                React.createElement("div", { style: { fontWeight: "bold", fontSize: 13, color: T.orange, marginBottom: 8 } }, "\u26A0\uFE0F Debt Recovery Mode"),
                React.createElement("div", { style: { fontSize: 12, color: T.muted, lineHeight: 1.8 } },
                    "\u2726 ",
                    React.createElement("strong", { style: { color: T.text } }, "50% of all drive income"),
                    " will automatically go toward debt repayment",
                    React.createElement("br", null),
                    "\u2726 You ",
                    React.createElement("strong", { style: { color: T.text } }, "cannot invest or lend"),
                    " until debt is fully cleared",
                    React.createElement("br", null),
                    "\u2726 Your ",
                    React.createElement("strong", { style: { color: T.text } }, "credit score"),
                    " is flagged \u2014 lenders can see you're in debt",
                    React.createElement("br", null),
                    "\u2726 Other players have been ",
                    React.createElement("strong", { style: { color: T.text } }, "notified"),
                    " and can bail you out",
                    React.createElement("br", null),
                    "\u2726 Once debt is cleared, ",
                    React.createElement("strong", { style: { color: T.green } }, "full access is restored"))),
            React.createElement("div", { style: { background: T.card, border: `1px solid ${T.cyan}44`, borderRadius: D.br, padding: 14, marginBottom: 14 } },
                React.createElement("div", { style: { fontWeight: "bold", fontSize: 13, color: T.cyan, marginBottom: 8 } }, "\uD83E\uDD1D Bail Out Offers"),
                loading && React.createElement("div", { style: { fontSize: 12, color: T.muted } }, "Checking for bail out offers..."),
                !loading && bailouts.length === 0 && (React.createElement("div", { style: { fontSize: 12, color: T.muted, lineHeight: 1.7 } }, "No bail out offers yet. Other players have been notified of your bankruptcy. They can offer to help you recover.")),
                bailouts.map(b => (React.createElement("div", { key: b.id, style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${T.border}`, fontSize: 12 } },
                    React.createElement("div", null,
                        React.createElement("div", { style: { color: T.text, fontWeight: "bold" } }, b.lender),
                        React.createElement("div", { style: { color: T.muted, fontSize: 10 } }, "Offered to help")),
                    React.createElement("div", { style: { fontFamily: "monospace", color: T.green, fontWeight: "bold" } }, fmt(b.amount))))),
                bailouts.length > 0 && (React.createElement("div", { style: { marginTop: 10 } },
                    React.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: "bold", marginBottom: 8 } },
                        React.createElement("span", { style: { color: T.text } }, "Total bail out"),
                        React.createElement("span", { style: { fontFamily: "monospace", color: canRecover ? T.green : T.orange } }, fmt(totalBailout))),
                    canRecover ? (React.createElement("button", { onClick: acceptBailout, style: { width: "100%", padding: "11px", background: `linear-gradient(135deg,${T.green},#00aa55)`, color: "#05050a", border: "none", borderRadius: D.br, fontWeight: "bold", fontSize: 13, cursor: "pointer" } }, "\u2705 Accept Bail Out \u2014 Recover Now!")) : (React.createElement("div", { style: { fontSize: 11, color: T.orange, textAlign: "center" } },
                        "Need ",
                        fmt(Math.abs(debt) - totalBailout),
                        " more to fully recover"))))),
            React.createElement("button", { onClick: onAcknowledge, style: { width: "100%", padding: "12px", background: `linear-gradient(135deg,${T.orange},${T.red})`, color: "#fff", border: "none", borderRadius: D.br, fontWeight: "bold", fontSize: 13, cursor: "pointer" } }, "Enter Debt Recovery Mode \u2014 Start Repaying"))));
}
// ── BAIL OUT PANEL (for other players to offer help) ──────────────────────────
function BailOutPanel({ user, bankruptPlayers, wallet, showToast }) {
    const [amounts, setAmounts] = useState({});
    async function offerBailout(bankruptUser) {
        const amt = parseFloat(amounts[bankruptUser] || 0);
        if (!amt || amt < BAILOUT_MIN) {
            showToast(`Minimum bail out is ${fmt(BAILOUT_MIN)}`, T.red);
            return;
        }
        if (amt > wallet) {
            showToast("Not enough cash!", T.red);
            return;
        }
        const db = getDB();
        if (!db)
            return;
        const offer = { id: Date.now().toString(), lender: user, amount: amt, status: "pending", createdAt: new Date().toISOString() };
        await db.ref("bailouts/" + bankruptUser + "/" + offer.id).set(offer);
        // Deduct from lender wallet immediately
        await db.ref("p2p/pendingCredits/" + user + "/bailout_hold_" + offer.id).set({ amount: -amt, from: "bailout", at: new Date().toISOString() });
        setAmounts(a => ({ ...a, [bankruptUser]: "" }));
        showToast(`Bail out offer of ${fmt(amt)} sent to ${bankruptUser}!`, T.green);
    }
    if (!bankruptPlayers || bankruptPlayers.length === 0)
        return null;
    return (React.createElement("div", { style: { background: T.card, border: `1px solid ${T.orange}55`, borderRadius: D.br, padding: 14, marginBottom: 12 } },
        React.createElement("div", { style: { fontWeight: "bold", fontSize: 13, color: T.orange, marginBottom: 8 } }, "\uD83C\uDD98 Players Needing Bail Out"),
        React.createElement("div", { style: { fontSize: 11, color: T.muted, marginBottom: 10 } }, "These players have gone bankrupt. You can offer to bail them out \u2014 they'll repay you once they recover."),
        bankruptPlayers.map(p => (React.createElement("div", { key: p.username, style: { background: T.surface, borderRadius: D.brs, padding: "10px 12px", marginBottom: 8 } },
            React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, flexWrap: "wrap", gap: 4 } },
                React.createElement("div", null,
                    React.createElement("span", { style: { fontWeight: "bold", fontSize: 12, color: T.text } }, p.username),
                    p.companyName && React.createElement("span", { style: { fontSize: 10, color: T.muted, marginLeft: 6 } }, p.companyName)),
                React.createElement("span", { style: { fontSize: 11, color: T.red, fontFamily: "monospace" } },
                    "Debt: ",
                    fmt(Math.abs(p.debt || 0)))),
            React.createElement("div", { style: { display: "flex", gap: 6, alignItems: "center" } },
                React.createElement("input", { type: "number", min: BAILOUT_MIN, placeholder: `Min ${fmt(BAILOUT_MIN)}`, value: amounts[p.username] || "", onChange: e => setAmounts(a => ({ ...a, [p.username]: e.target.value })), style: { flex: 1, background: T.card, border: `1px solid ${T.border}`, borderRadius: D.brs, color: T.text, padding: "6px 10px", fontSize: 12 } }),
                React.createElement("button", { onClick: () => offerBailout(p.username), style: { padding: "6px 12px", background: `${T.orange}18`, border: `1px solid ${T.orange}`, borderRadius: D.brs, color: T.orange, cursor: "pointer", fontWeight: "bold", fontSize: 11, whiteSpace: "nowrap" } }, "\uD83E\uDD1D Bail Out")))))));
}
// ── IPO INVEST SECTION — proper component (hooks cannot be inside IIFE) ───────
function IPOInvestSection({ owned, qty, setQty, wallet, setWalletRaw, showToast, setShowIPOProfile, applyNonDriveTax }) {
    const [fbListed, setFbListed] = useState([]);
    useEffect(() => {
        const unsub = fbSubscribeIPO(setFbListed);
        return () => { if (typeof unsub === "function")
            unsub(); };
    }, []);
    if (!fbListed.length)
        return null;
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { style: { fontSize: 10, textTransform: "uppercase", letterSpacing: 1.4, color: T.muted, marginBottom: 8, marginTop: 4 } }, "Listed Companies \u2014 IPO Shares"),
        React.createElement("div", { style: { background: T.card, border: `1px solid ${T.gold}44`, borderRadius: D.br, padding: "10px 12px", marginBottom: 10, fontSize: 11, color: T.muted } }, "\uD83D\uDCA1 Buy shares in listed companies. Profits and losses are shared with shareholders proportionally."),
        fbListed.map(l => {
            const ipo = l.ipoData;
            if (!ipo)
                return null;
            const key = `ipo_${l.companyName}`;
            const sharesOwned = owned[key] || 0;
            const sharePrice = ipo.sharePrice || 100;
            const qty2 = qty[key] || 1;
            return (React.createElement("div", { key: key, style: { background: T.card, border: `1px solid ${T.gold}55`, borderRadius: D.br, padding: "11px 13px", marginBottom: 7 } },
                React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" } },
                    React.createElement("div", { style: { width: 34, height: 34, borderRadius: D.brs, background: "rgba(245,200,66,0.1)", border: `1px solid ${T.gold}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } },
                        React.createElement("i", { className: "ti ti-rocket", style: { fontSize: 16, color: T.gold }, "aria-hidden": "true" })),
                    React.createElement("div", { style: { flex: 1 } },
                        React.createElement("div", { style: { display: "flex", gap: 5, alignItems: "center", flexWrap: "wrap" } },
                            React.createElement("span", { style: { fontWeight: "bold", fontSize: 12, color: T.text } }, l.companyName),
                            React.createElement("span", { style: { fontSize: 9, padding: "1px 5px", borderRadius: 20, background: "rgba(245,200,66,0.1)", color: T.gold, border: `1px solid ${T.gold}44` } }, ipo.stage),
                            sharesOwned > 0 && React.createElement("span", { style: { fontSize: 9, padding: "1px 5px", borderRadius: 20, background: "rgba(0,229,255,0.1)", color: T.cyan, border: `1px solid ${T.cyan}44` } },
                                sharesOwned,
                                " shares")),
                        React.createElement("div", { style: { fontSize: 10, color: T.muted, marginTop: 1 } },
                            "Net Worth: $",
                            (l.netWorth || 0).toLocaleString(),
                            " \u00B7 Share price: $",
                            sharePrice.toLocaleString()),
                        React.createElement("div", { style: { fontSize: 10, color: T.green, marginTop: 1 } },
                            "Total shares: ",
                            (ipo.totalShares || 1000).toLocaleString())),
                    React.createElement("div", { style: { textAlign: "right", flexShrink: 0 } },
                        React.createElement("div", { style: { fontSize: 12, fontWeight: "bold", fontFamily: "monospace", color: T.gold, marginBottom: 5 } },
                            "$",
                            sharePrice.toLocaleString(),
                            "/share"),
                        React.createElement("div", { style: { display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" } },
                            React.createElement("button", { onClick: () => setShowIPOProfile({ companyName: l.companyName, ipoData: ipo, ownerSave: { netWorth: l.netWorth, totalDrivingIncome: l.totalDriveIncome || 0, companyLedger: [], isRegistered: true } }), style: { fontSize: 11, padding: "5px 8px", background: `${T.purple}18`, border: `1px solid ${T.purple}`, borderRadius: D.brs, color: T.purple, cursor: "pointer", fontWeight: "bold" } }, "Profile"),
                            React.createElement("input", { type: "number", min: "1", value: qty2, onChange: e => setQty(q => ({ ...q, [key]: e.target.value })), style: { width: 38, fontSize: 11, textAlign: "center", background: T.surface, border: `1px solid ${T.border}`, borderRadius: D.brs, color: T.text, padding: "3px" } }),
                            React.createElement("button", { onClick: () => {
                                    const cost = sharePrice * (+qty2 || 1);
                                    if (cost > wallet) {
                                        showToast("Not enough cash!", T.red);
                                        return;
                                    }
                                    setQty(q => ({ ...q, [key]: 1 }));
                                    setWalletRaw(w => +(w - cost).toFixed(2));
                                    // update owned via parent — use window event to communicate
                                    window.dispatchEvent(new CustomEvent("ml_buy_ipo_share", { detail: { key, qty: +qty2 || 1 } }));
                                    showToast(`Bought ${qty2} shares in ${l.companyName}`, T.green);
                                }, style: { fontSize: 11, padding: "5px 8px", background: "rgba(245,200,66,0.1)", border: `1px solid ${T.gold}`, borderRadius: D.brs, color: T.gold, cursor: "pointer", fontWeight: "bold" } }, "Buy"),
                            sharesOwned > 0 && React.createElement("button", { onClick: () => {
                                    const rev = sharePrice * sharesOwned;
                                    const gain = Math.max(0, rev - (sharePrice * sharesOwned * 0.9));
                                    const tax = applyNonDriveTax(gain);
                                    setWalletRaw(w => +(w + rev - tax).toFixed(2));
                                    window.dispatchEvent(new CustomEvent("ml_sell_ipo_share", { detail: { key } }));
                                    showToast(`Sold ${sharesOwned} shares for $${rev.toLocaleString()} · Tax: $${tax.toLocaleString()}`, T.gold);
                                }, style: { fontSize: 11, padding: "5px 8px", background: "rgba(255,71,87,0.1)", border: `1px solid ${T.red}`, borderRadius: D.brs, color: T.red, cursor: "pointer", fontWeight: "bold" } }, "Sell"))))));
        })));
}
// ── INVEST GUIDE COMPONENT ────────────────────────────────────────────────────
function InvestGuide({ wallet, propIncome, netWorth, activePassiveIncome, passiveExpiry }) {
    const [open, setOpen] = useState(false);
    const strategies = [
        {
            icon: "ti-home", color: "#00ff88", label: "Real Estate", range: "$3K – $150K",
            tip: "Best for steady daily income. Buy Studio Apartment first, then upgrade to Duplex and Mall Unit as you earn more. Income scales with asset price — the more valuable it becomes, the more rent it generates.",
            action: "Buy cheapest first. Reinvest daily income into the next property."
        },
        {
            icon: "ti-coin", color: "#f5c842", label: "Commodities (Gold, Oil, Silver)", range: "$800 – $5K",
            tip: "No daily income but prices fluctuate — buy low, sell high. Gold is safest (low volatility). Oil is highest risk/reward. Silver is mid-range. Watch the price ticker and sell when prices spike.",
            action: "Buy Gold as a safe store of value. Sell when price rises 20%+ above purchase price."
        },
        {
            icon: "ti-currency-bitcoin", color: "#f7931a", label: "Crypto (BTC, ETH, SOL)", range: "$1.2K – $2.5K",
            tip: "Highest volatility in the game — prices can jump or crash 6% in seconds. Don't invest money you can't afford to lose. But the upside is huge if you time it right.",
            action: "Only invest surplus cash. Buy during market crash events. Sell fast when price spikes."
        },
        {
            icon: "ti-certificate", color: "#00e5ff", label: "Bonds (Treasury, Corporate, Eurobond)", range: "$1K – $25K",
            tip: "Safest income in the game. Treasury Bond is rock-solid with minimal price movement. Corporate Bond gives more income. Eurobond has FX risk but highest yield. Perfect for players who want guaranteed daily income.",
            action: "Buy Treasury Bond early for reliable income. Add Corporate Bond as wallet grows."
        },
        {
            icon: "ti-tools-kitchen-2", color: "#7c6fdf", label: "Business Ventures", range: "$45K – $100K",
            tip: "Highest daily income of all assets. Fast Food Franchise, Logistics Company, and Fintech Startup generate $3K–$7K+ per day. Expensive to buy but income pays back the cost quickly.",
            action: "Save up from other income streams. Fintech Startup gives the best income-to-price ratio."
        },
        {
            icon: "ti-palette", color: "#ff6b81", label: "Collectibles (Art, Watch)", range: "$4K – $8K",
            tip: "No daily income but these appreciate over time with high volatility. Like crypto but slightly calmer. Good for players who enjoy speculating on value appreciation.",
            action: "Buy when prices dip. Hold and sell when prices climb. Don't rely on these for income."
        },
    ];
    const displayIncome = activePassiveIncome || 0;
    const incomeNeeded = Math.max(0, 2000 - displayIncome);
    const suggestion = displayIncome === 0 ? "Start with Treasury Bond ($1,004) for instant daily income, then Studio Apartment ($3,264) for rental income." : propIncome < 500 ? "Add a Duplex House or Corporate Bond to boost your daily income above $500/day." : propIncome < 2000 ? "You're building well! Target a Mall Unit or Fast Food Franchise for a major income jump." : "Excellent passive income! Consider Business Ventures (Fintech, Logistics) for maximum daily returns.";
    return (React.createElement("div", { style: { marginBottom: 14 } },
        React.createElement("div", { style: { background: T.card, border: `1px solid ${T.green}44`, borderRadius: D.br, padding: "12px 14px", marginBottom: 10 } },
            React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 6 } },
                React.createElement("div", null,
                    React.createElement("div", { style: { fontSize: 11, fontWeight: "bold", color: T.green } }, "\uD83D\uDCB0 Your Daily Passive Income"),
                    React.createElement("div", { style: { fontSize: 22, fontWeight: "bold", fontFamily: "monospace", color: displayIncome > 0 ? T.green : T.muted } },
                        displayIncome > 0 ? fmt(displayIncome) : "Drive to earn",
                        React.createElement("span", { style: { fontSize: 12, color: T.muted } }, "/day"))),
                React.createElement("div", { style: { textAlign: "right" } },
                    React.createElement("div", { style: { fontSize: 10, color: T.muted, marginBottom: 2 } }, "Goal: $2,000/day"),
                    React.createElement("div", { style: { height: 6, width: 120, background: T.surface, borderRadius: 3 } },
                        React.createElement("div", { style: { height: "100%", width: Math.min(100, (propIncome / 2000) * 100) + "%", background: `linear-gradient(90deg,${T.green},${T.cyan})`, borderRadius: 3, transition: "width 0.5s" } })))),
            React.createElement("div", { style: { fontSize: 11, color: T.muted, background: T.surface, borderRadius: D.brs, padding: "8px 10px", lineHeight: 1.6 } },
                "\uD83D\uDCA1 ",
                React.createElement("strong", { style: { color: T.text } }, "Coach says:"),
                " ",
                suggestion)),
        React.createElement("button", { onClick: () => setOpen(o => !o), style: { width: "100%", padding: "10px 14px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: D.br, color: T.text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12, fontWeight: "bold", marginBottom: open ? 10 : 0 } },
            React.createElement("span", null,
                "\uD83D\uDCD6 How to invest \u2014 Strategy Guide (",
                strategies.length,
                " asset classes)"),
            React.createElement("i", { className: `ti ${open ? "ti-chevron-up" : "ti-chevron-down"}`, style: { fontSize: 14, color: T.muted }, "aria-hidden": "true" })),
        open && (React.createElement("div", null,
            strategies.map((s, i) => (React.createElement("div", { key: i, style: { background: T.card, border: `1px solid ${s.color}33`, borderRadius: D.br, padding: "12px 14px", marginBottom: 8 } },
                React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 8 } },
                    React.createElement("div", { style: { width: 34, height: 34, borderRadius: D.brs, background: `${s.color}18`, border: `1px solid ${s.color}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } },
                        React.createElement("i", { className: `ti ${s.icon}`, style: { fontSize: 17, color: s.color }, "aria-hidden": "true" })),
                    React.createElement("div", { style: { flex: 1 } },
                        React.createElement("div", { style: { fontWeight: "bold", fontSize: 13, color: T.text } }, s.label),
                        React.createElement("div", { style: { fontSize: 10, color: T.muted } },
                            "Price range: ",
                            React.createElement("span", { style: { color: s.color, fontFamily: "monospace" } }, s.range)))),
                React.createElement("div", { style: { fontSize: 12, color: T.muted, lineHeight: 1.7, marginBottom: 8 } }, s.tip),
                React.createElement("div", { style: { background: `${s.color}0f`, border: `1px solid ${s.color}33`, borderRadius: D.brs, padding: "7px 10px", fontSize: 11, color: s.color } },
                    React.createElement("strong", null, "Strategy:"),
                    " ",
                    s.action)))),
            React.createElement("div", { style: { background: T.card, border: `1px solid ${T.gold}44`, borderRadius: D.br, padding: "12px 14px", marginBottom: 8 } },
                React.createElement("div", { style: { fontWeight: "bold", fontSize: 13, color: T.gold, marginBottom: 8 } }, "\uD83C\uDFC6 The Master Strategy"),
                React.createElement("div", { style: { fontSize: 12, color: T.muted, lineHeight: 1.8 } },
                    React.createElement("strong", { style: { color: T.text } }, "Step 1:"),
                    " Drive to earn cash \u2192 buy Treasury Bond for instant daily income",
                    React.createElement("br", null),
                    React.createElement("strong", { style: { color: T.text } }, "Step 2:"),
                    " Stack real estate \u2192 Studio \u2192 Duplex \u2192 Mall Unit \u2192 Warehouse",
                    React.createElement("br", null),
                    React.createElement("strong", { style: { color: T.text } }, "Step 3:"),
                    " Add Bonds for safe income + Gold as store of value",
                    React.createElement("br", null),
                    React.createElement("strong", { style: { color: T.text } }, "Step 4:"),
                    " When you have $50K+, buy Business Ventures for maximum daily income",
                    React.createElement("br", null),
                    React.createElement("strong", { style: { color: T.text } }, "Step 5:"),
                    " Lend to other players at 15\u201325% interest for extra passive returns",
                    React.createElement("br", null),
                    React.createElement("strong", { style: { color: T.text } }, "Step 6:"),
                    " Register your company to cut taxes + build toward IPO at $70M net worth"))))));
}
// ── P2P LENDING MARKETPLACE ───────────────────────────────────────────────────
function P2PMarketplace({ user, wallet, netWorth, totalDrivingIncome, isRegistered, propValue, onWalletChange, showToast }) {
    const [p2pView, setP2pView] = useState("browse");
    const [reqAmt, setReqAmt] = useState("");
    const [reqRate, setReqRate] = useState("15");
    const [reqDays, setReqDays] = useState("30");
    const [reqNote, setReqNote] = useState("");
    // Live Firebase subscription — falls back to localStorage if offline
    const [p2pData, setP2pDataState] = useState({ requests: [], active: [] });
    const [fbConnected, setFbConnected] = useState(false);
    useEffect(() => {
        let reqRef = null, actRef = null, retryTimer = null;
        function subscribe() {
            const db = getDB();
            if (!db) {
                // Retry every 2 seconds until Firebase is ready
                retryTimer = setTimeout(subscribe, 2000);
                return;
            }
            setFbConnected(true);
            reqRef = db.ref("p2p/requests");
            actRef = db.ref("p2p/active");
            reqRef.on("value", snap => {
                const val = snap.val();
                const requests = val ? Object.values(val).filter(r => r && r.status === "open") : [];
                setP2pDataState(prev => ({ ...prev, requests }));
            });
            actRef.on("value", snap => {
                const val = snap.val();
                const active = val ? Object.values(val).filter(a => a && a.status !== undefined) : [];
                setP2pDataState(prev => ({ ...prev, active }));
            });
        }
        subscribe();
        return () => {
            clearTimeout(retryTimer);
            if (reqRef)
                reqRef.off();
            if (actRef)
                actRef.off();
        };
    }, []);
    function refresh() {
        const db = getDB();
        if (!db)
            setP2pDataState(loadP2P());
    }
    // Max borrowable = 80% of (driving income + prop value)
    const maxBorrow = Math.floor((totalDrivingIncome + propValue) * 0.80);
    // Check borrower creditworthiness
    function getBorrowerScore(borrowerSave) {
        if (!borrowerSave)
            return { label: "Unknown", color: T.muted, flag: "" };
        const bNW = borrowerSave.netWorth || 0;
        // Check past defaults
        const myLends = p2pData.active || [];
        const defaulted = myLends.some(l => l.borrower === borrowerSave.username && l.status === "defaulted");
        if (defaulted)
            return { label: "⛔ Defaulter", color: T.red, flag: "defaulted" };
        if (bNW < 500)
            return { label: "⚠️ Low Net Worth", color: T.orange, flag: "poor" };
        return { label: "✅ Credible", color: T.green, flag: "good" };
    }
    async function submitRequest() {
        const amt = parseFloat(reqAmt);
        if (!amt || amt <= 0) {
            showToast("Enter a valid amount", T.red);
            return;
        }
        if (amt > maxBorrow) {
            showToast(`Max you can borrow is ${fmt(maxBorrow)} (80% of your income+assets)`, T.red);
            return;
        }
        const rate = parseFloat(reqRate);
        if (rate < 10 || rate > 100) {
            showToast("Interest rate must be 10–100%", T.red);
            return;
        }
        const days = parseInt(reqDays);
        if (days < 1 || days > 365) {
            showToast("Repayment days must be 1–365", T.red);
            return;
        }
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + days);
        const req = {
            id: Date.now().toString(),
            borrower: user,
            amount: amt,
            rate,
            days,
            dueDate: dueDate.toISOString().split("T")[0],
            note: reqNote,
            status: "open",
            createdAt: new Date().toISOString(),
            borrowerNetWorth: Math.round(netWorth),
            borrowerDriveIncome: Math.round(totalDrivingIncome),
            borrowerDeviceID: getDeviceID(), // for self-lending detection
            acceptableAfter: new Date(Date.now() + (days * 24 * 60 * 60 * 1000 * 0.5)).toISOString(), // 50% of loan duration must pass before repayment
        };
        await fbPostLoanRequest(req);
        setReqAmt("");
        setReqNote("");
        showToast(`Loan request of ${fmt(amt)} posted at ${rate}% — visible to all players!`, T.cyan);
    }
    async function acceptLoan(req) {
        if (wallet < req.amount) {
            showToast("Not enough cash to fund this loan", T.red);
            return;
        }
        // Block self-lending — same device check
        if (req.borrowerDeviceID && req.borrowerDeviceID === getDeviceID()) {
            showToast("⛔ Cannot lend to yourself — same device detected", T.red);
            return;
        }
        // Block same username
        if (req.borrower === user) {
            showToast("⛔ Cannot lend to your own loan request", T.red);
            return;
        }
        await fbAcceptLoan(req, user);
        onWalletChange(w => +(w - req.amount).toFixed(2));
        showToast(`Funded ${fmt(req.amount)} to ${req.borrower} at ${req.rate}% — live on Firebase!`, T.green);
    }
    async function rejectLoan(req) {
        await fbRejectLoan(req.id);
        showToast("Loan request rejected", T.muted);
    }
    async function repayLoan(loan) {
        const repay = Math.round(loan.amount * (1 + loan.rate / 100));
        if (wallet < repay) {
            showToast(`Need ${fmt(repay)} to repay (incl. ${loan.rate}% interest)`, T.red);
            return;
        }
        // Enforce 50% wait period — must wait half the loan duration before repaying
        if (loan.acceptableAfter) {
            const earliest = new Date(loan.acceptableAfter);
            const now = new Date();
            if (now < earliest) {
                const hoursLeft = Math.ceil((earliest - now) / (1000 * 60 * 60));
                showToast(`⏳ Cannot repay yet — wait ${hoursLeft} more hour${hoursLeft === 1 ? "" : "s"} (50% of loan duration must pass)`, T.orange);
                return;
            }
        }
        await fbRepayLoan(loan.id);
        onWalletChange(w => +(w - repay).toFixed(2));
        const db = getDB();
        if (db)
            await db.ref("p2p/pendingCredits/" + loan.lender + "/" + loan.id).set({ amount: repay, from: user, at: new Date().toISOString() });
        showToast(`Repaid ${fmt(repay)} to ${loan.lender} (incl. ${fmt(repay - loan.amount)} interest)`, T.green);
    }
    const myRequests = (p2pData.requests || []).filter(r => r.borrower === user && r.status === "open");
    const myLoansOut = (p2pData.active || []).filter(l => l.lender === user && l.status === "active");
    const myBorrowings = (p2pData.active || []).filter(l => l.borrower === user && l.status === "active");
    const openRequests = (p2pData.requests || []).filter(r => r.status === "open" && r.borrower !== user);
    const accs = loadAccounts();
    const TABS2 = [{ id: "browse", label: "Browse Requests" }, { id: "request", label: "Request Loan" }, { id: "mylends", label: "My Lendings" }, { id: "myborrow", label: "My Borrowings" }];
    return (React.createElement("div", null,
        React.createElement("div", { style: { background: T.card, border: `1px solid ${fbConnected ? T.green + "44" : T.cyan}33`, borderRadius: D.br, padding: "10px 12px", marginBottom: 10, fontSize: 11, color: T.muted, lineHeight: 1.7 } },
            fbConnected ? React.createElement("span", { style: { color: T.green, fontWeight: "bold" } }, "\uD83D\uDD34 LIVE \u2014 Firebase connected \u00B7 Visible to all players worldwide") : React.createElement("span", { style: { color: T.orange } }, "\u26A0\uFE0F Offline mode \u2014 requests saved locally only"),
            React.createElement("br", null),
            "\uD83D\uDCA1 ",
            React.createElement("strong", { style: { color: T.text } }, "P2P Lending:"),
            " Lend to real players. Set your own interest (10\u2013100%) and repayment timeframe (1\u2013365 real calendar days).",
            React.createElement("br", null),
            "\uD83D\uDD12 ",
            React.createElement("strong", { style: { color: T.text } }, "Anti-exploit:"),
            " Same-device lending is blocked. Repayment requires 50% of loan duration to pass first."),
        React.createElement("div", { style: { display: "flex", gap: 4, marginBottom: 12, overflowX: "auto" } }, TABS2.map(t => React.createElement("button", { key: t.id, onClick: () => setP2pView(t.id), style: { flex: 1, minWidth: 70, padding: "6px 4px", fontSize: 10, fontWeight: p2pView === t.id ? "bold" : "normal", color: p2pView === t.id ? T.cyan : T.muted, background: p2pView === t.id ? "rgba(0,229,255,0.08)" : "transparent", border: `1px solid ${p2pView === t.id ? T.cyan + "44" : "transparent"}`, borderRadius: D.brs, cursor: "pointer", whiteSpace: "nowrap" } }, t.label))),
        p2pView === "browse" && (React.createElement("div", null,
            openRequests.length === 0 && React.createElement("div", { style: { textAlign: "center", color: T.muted, fontSize: 12, padding: "20px 0" } }, "No open loan requests. Be the first to request one!"),
            openRequests.map(req => {
                const borrowerAcc = accs[req.borrower];
                const bs = borrowerAcc ? getBorrowerScore(borrowerAcc.save) : { label: "Unknown", color: T.muted, flag: "" };
                const repayAmt = Math.round(req.amount * (1 + req.rate / 100));
                const overdue = new Date() > new Date(req.dueDate);
                return (React.createElement("div", { key: req.id, style: { background: T.card, border: `1px solid ${T.border}`, borderRadius: D.br, padding: "12px 14px", marginBottom: 8 } },
                    React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, flexWrap: "wrap", gap: 6 } },
                        React.createElement("div", null,
                            React.createElement("div", { style: { fontWeight: "bold", fontSize: 13, color: T.text } }, req.borrower),
                            React.createElement("span", { style: { fontSize: 10, padding: "2px 8px", borderRadius: 20, background: `${bs.color}18`, color: bs.color, border: `1px solid ${bs.color}44` } }, bs.label)),
                        React.createElement("div", { style: { textAlign: "right" } },
                            React.createElement("div", { style: { fontSize: 16, fontWeight: "bold", fontFamily: "monospace", color: T.cyan } }, fmt(req.amount)),
                            React.createElement("div", { style: { fontSize: 10, color: T.green } },
                                req.rate,
                                "% interest \u2192 repay ",
                                fmt(repayAmt)))),
                    borrowerAcc?.save && React.createElement("div", { style: { background: T.surface, borderRadius: D.brs, padding: "8px 10px", marginBottom: 8, fontSize: 11 } },
                        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 } },
                            React.createElement("div", { style: { color: T.muted } },
                                "Net Worth: ",
                                React.createElement("span", { style: { color: T.text, fontFamily: "monospace" } }, fmt(borrowerAcc.save.netWorth || 0))),
                            React.createElement("div", { style: { color: T.muted } },
                                "Drive Income: ",
                                React.createElement("span", { style: { color: T.text, fontFamily: "monospace" } }, fmt(borrowerAcc.save.totalDrivingIncome || 0))),
                            React.createElement("div", { style: { color: T.muted } },
                                "Company: ",
                                React.createElement("span", { style: { color: borrowerAcc.save.isRegistered ? T.gold : T.muted } }, borrowerAcc.save.isRegistered ? borrowerAcc.save.companyName : "Unregistered")),
                            React.createElement("div", { style: { color: T.muted } },
                                "Due: ",
                                React.createElement("span", { style: { color: overdue ? T.red : T.text } }, req.dueDate)))),
                    req.note && React.createElement("div", { style: { fontSize: 11, color: T.muted, marginBottom: 8, fontStyle: "italic" } },
                        "\"",
                        req.note,
                        "\""),
                    bs.flag !== "defaulted" && !overdue && React.createElement("div", { style: { display: "flex", gap: 8 } },
                        React.createElement("button", { onClick: () => acceptLoan(req), style: { flex: 1, padding: "8px", background: "rgba(0,255,136,0.1)", border: `1px solid ${T.green}`, borderRadius: D.brs, color: T.green, cursor: "pointer", fontWeight: "bold", fontSize: 12 } }, "\u2705 Accept & Fund"),
                        React.createElement("button", { onClick: () => rejectLoan(req), style: { flex: 1, padding: "8px", background: "rgba(255,71,87,0.1)", border: `1px solid ${T.red}`, borderRadius: D.brs, color: T.red, cursor: "pointer", fontWeight: "bold", fontSize: 12 } }, "\u274C Reject")),
                    bs.flag === "defaulted" && React.createElement("div", { style: { padding: "8px", background: "rgba(255,71,87,0.1)", borderRadius: D.brs, fontSize: 11, color: T.red, textAlign: "center" } }, "\u26D4 This borrower has defaulted on previous loans")));
            }))),
        p2pView === "request" && (React.createElement("div", null,
            React.createElement("div", { style: { background: T.card, border: `1px solid ${T.border}`, borderRadius: D.br, padding: 14, marginBottom: 12 } },
                React.createElement("div", { style: { fontSize: 12, color: T.muted, marginBottom: 10 } },
                    "Max you can request: ",
                    React.createElement("strong", { style: { color: T.cyan, fontFamily: "monospace" } }, fmt(maxBorrow)),
                    " (80% of drive income + assets)"),
                [
                    { label: "Amount to borrow", val: reqAmt, set: setReqAmt, placeholder: `Max ${fmt(maxBorrow)}`, type: "number" },
                    { label: "Interest rate % (10–100)", val: reqRate, set: setReqRate, placeholder: "e.g. 15", type: "number" },
                    { label: "Repayment days (1–365 real calendar days)", val: reqDays, set: setReqDays, placeholder: "e.g. 30", type: "number" },
                    { label: "Note to lenders (optional)", val: reqNote, set: setReqNote, placeholder: "Why do you need this loan?", type: "text" },
                ].map(f => React.createElement("div", { key: f.label, style: { marginBottom: 10 } },
                    React.createElement("div", { style: { fontSize: 11, color: T.muted, marginBottom: 4 } }, f.label),
                    React.createElement("input", { type: f.type, value: f.val, onChange: e => f.set(e.target.value), placeholder: f.placeholder, style: { width: "100%", background: T.surface, border: `1px solid ${T.border}`, borderRadius: D.brs, color: T.text, padding: "8px 10px", fontSize: 13, boxSizing: "border-box" } }))),
                reqAmt && reqRate && React.createElement("div", { style: { background: T.surface, borderRadius: D.brs, padding: "8px 10px", marginBottom: 10, fontSize: 11 } },
                    React.createElement("div", { style: { color: T.muted } },
                        "You'll receive: ",
                        React.createElement("strong", { style: { color: T.green, fontFamily: "monospace" } }, fmt(parseFloat(reqAmt) || 0))),
                    React.createElement("div", { style: { color: T.muted } },
                        "You'll repay: ",
                        React.createElement("strong", { style: { color: T.orange, fontFamily: "monospace" } }, fmt(Math.round((parseFloat(reqAmt) || 0) * (1 + (parseFloat(reqRate) || 0) / 100)))),
                        " by ",
                        (() => { const d = new Date(); d.setDate(d.getDate() + (parseInt(reqDays) || 0)); return d.toDateString(); })())),
                React.createElement("button", { onClick: submitRequest, style: { width: "100%", padding: "11px", background: `linear-gradient(135deg,${T.cyan},#0086ff)`, color: "#05050a", border: "none", borderRadius: D.br, fontWeight: "bold", fontSize: 13, cursor: "pointer" } }, "Post Loan Request")),
            myRequests.length > 0 && React.createElement(React.Fragment, null,
                React.createElement("div", { style: { fontSize: 11, color: T.muted, marginBottom: 8 } }, "Your open requests:"),
                myRequests.map(r => React.createElement("div", { key: r.id, style: { background: T.card, border: `1px solid ${T.cyan}44`, borderRadius: D.brs, padding: "8px 12px", marginBottom: 6, fontSize: 11, display: "flex", justifyContent: "space-between" } },
                    React.createElement("span", { style: { color: T.text } },
                        fmt(r.amount),
                        " at ",
                        r.rate,
                        "% \u2014 due ",
                        r.dueDate),
                    React.createElement("span", { style: { color: T.gold } }, "Pending lender")))))),
        p2pView === "mylends" && (React.createElement("div", null,
            myLoansOut.length === 0 && React.createElement("div", { style: { textAlign: "center", color: T.muted, fontSize: 12, padding: "20px 0" } }, "No active lendings. Browse requests to fund a loan."),
            myLoansOut.map(l => {
                const repayAmt = Math.round(l.amount * (1 + l.rate / 100));
                const taxRate = isRegistered ? 0.30 : 0.40;
                const interest = repayAmt - l.amount;
                const netInterest = Math.round(interest * (1 - taxRate));
                const overdue = new Date() > new Date(l.dueDate);
                return (React.createElement("div", { key: l.id, style: { background: T.card, border: `1px solid ${overdue ? T.red + "55" : T.green + "55"}`, borderRadius: D.br, padding: "12px 14px", marginBottom: 8 } },
                    React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 6 } },
                        React.createElement("span", { style: { fontWeight: "bold", color: T.text } }, l.borrower),
                        React.createElement("span", { style: { fontFamily: "monospace", color: T.cyan } }, fmt(l.amount))),
                    React.createElement("div", { style: { fontSize: 11, color: T.muted } },
                        "Rate: ",
                        l.rate,
                        "% \u00B7 Due: ",
                        React.createElement("span", { style: { color: overdue ? T.red : T.text } }, l.dueDate)),
                    React.createElement("div", { style: { fontSize: 11, color: T.green, marginTop: 2 } },
                        "Expected repayment: ",
                        fmt(repayAmt),
                        " \u00B7 Net after ",
                        taxRate * 100,
                        "% tax on interest: ",
                        React.createElement("strong", null, fmt(l.amount + netInterest))),
                    overdue && React.createElement("div", { style: { marginTop: 6, fontSize: 11, color: T.red } }, "\u26A0\uFE0F Overdue \u2014 borrower is flagged as defaulter")));
            }))),
        p2pView === "myborrow" && (React.createElement("div", null,
            myBorrowings.length === 0 && React.createElement("div", { style: { textAlign: "center", color: T.muted, fontSize: 12, padding: "20px 0" } }, "No active borrowings."),
            myBorrowings.map(l => {
                const repayAmt = Math.round(l.amount * (1 + l.rate / 100));
                const overdue = new Date() > new Date(l.dueDate);
                return (React.createElement("div", { key: l.id, style: { background: T.card, border: `1px solid ${overdue ? T.red + "55" : T.border}`, borderRadius: D.br, padding: "12px 14px", marginBottom: 8 } },
                    React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 6 } },
                        React.createElement("span", { style: { fontWeight: "bold", color: T.text } },
                            "Lender: ",
                            l.lender),
                        React.createElement("span", { style: { fontFamily: "monospace", color: T.orange } }, fmt(repayAmt))),
                    React.createElement("div", { style: { fontSize: 11, color: T.muted } },
                        "Rate: ",
                        l.rate,
                        "% \u00B7 Due: ",
                        React.createElement("span", { style: { color: overdue ? T.red : T.text } }, l.dueDate)),
                    overdue && React.createElement("div", { style: { fontSize: 11, color: T.red, marginTop: 2 } }, "\u26A0\uFE0F Overdue \u2014 you are flagged as a defaulter"),
                    (() => {
                        const earliest = l.acceptableAfter ? new Date(l.acceptableAfter) : null;
                        const now = new Date();
                        const canRepay = !earliest || now >= earliest;
                        const hoursLeft = earliest && !canRepay ? Math.ceil((earliest - now) / (1000 * 60 * 60)) : 0;
                        return canRepay ? (React.createElement("button", { onClick: () => repayLoan(l), style: { marginTop: 8, width: "100%", padding: "8px", background: "rgba(0,255,136,0.1)", border: `1px solid ${T.green}`, borderRadius: D.brs, color: T.green, cursor: "pointer", fontWeight: "bold", fontSize: 12 } },
                            "Repay ",
                            fmt(repayAmt))) : (React.createElement("div", { style: { marginTop: 8, padding: "8px 12px", background: "rgba(255,149,0,0.1)", border: `1px solid ${T.orange}`, borderRadius: D.brs, fontSize: 11, color: T.orange, textAlign: "center" } },
                            "\u23F3 Early repayment locked \u2014 ",
                            hoursLeft,
                            " hour",
                            hoursLeft === 1 ? "" : "s",
                            " remaining",
                            React.createElement("br", null),
                            React.createElement("span", { style: { fontSize: 10, color: T.muted } }, "Must wait 50% of loan duration")));
                    })()));
            })))));
}
// ── IPO COMPANY PROFILE (public view) ────────────────────────────────────────
function IPOProfile({ companyName, ipoData, ownerSave, onClose }) {
    if (!ipoData || !ownerSave)
        return null;
    const ledger = ownerSave.companyLedger || [];
    const totalIncome = ledger.reduce((s, r) => s + (r.driveIncome || 0), 0);
    const totalExpenses = ledger.reduce((s, r) => s + (r.totalExpenses || 0), 0);
    const totalTax = ledger.reduce((s, r) => s + (r.taxPaid || 0), 0);
    return (React.createElement("div", { style: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.88)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Segoe UI',sans-serif", overflowY: "auto" } },
        React.createElement("div", { style: { maxWidth: 420, width: "100%", background: T.surface, border: `1px solid ${T.gold}44`, borderRadius: D.br, padding: 20 } },
            React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 } },
                React.createElement("div", null,
                    React.createElement("div", { style: { fontWeight: "bold", fontSize: 16, color: T.gold } },
                        "\uD83C\uDFE2 ",
                        companyName),
                    React.createElement("div", { style: { fontSize: 11, color: T.muted } },
                        ipoData.stage,
                        " \u00B7 Public Company")),
                React.createElement("button", { onClick: onClose, style: { background: "transparent", border: `1px solid ${T.border}`, borderRadius: D.brs, color: T.muted, padding: "5px 10px", cursor: "pointer", fontSize: 12 } }, "\u2715")),
            React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 } }, [{ l: "Share Price", v: fmt(ipoData.sharePrice || 0), c: T.gold }, { l: "Total Shares", v: (ipoData.totalShares || 0).toLocaleString(), c: T.text }, { l: "Shares Offered", v: (ipoData.sharesOffered || 0).toLocaleString(), c: T.cyan }, { l: "Stage", v: ipoData.stage, c: T.green }, { l: "Total Drive Income", v: fmt(totalIncome), c: T.green }, { l: "Total Expenses", v: fmt(totalExpenses), c: T.orange }, { l: "Total Tax Paid", v: fmt(totalTax), c: T.red }, { l: "Net Worth", v: fmt(ownerSave.netWorth || 0), c: T.cyan }].map(m => (React.createElement("div", { key: m.l, style: { background: T.card, borderRadius: D.brs, padding: "8px 10px", border: `1px solid ${T.border}` } },
                React.createElement("div", { style: { fontSize: 9, color: T.muted, marginBottom: 2 } }, m.l),
                React.createElement("div", { style: { fontSize: 13, fontWeight: "bold", fontFamily: "monospace", color: m.c } }, m.v))))),
            ledger.length > 0 && React.createElement(React.Fragment, null,
                React.createElement("div", { style: { fontWeight: "bold", fontSize: 12, color: T.cyan, marginBottom: 8 } },
                    "Financial Ledger (",
                    ledger.length,
                    " drives)"),
                React.createElement("div", { style: { maxHeight: 180, overflowY: "auto" } }, ledger.slice(0, 10).map((r, i) => (React.createElement("div", { key: i, style: { display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${T.border}`, fontSize: 11 } },
                    React.createElement("span", { style: { color: T.muted } },
                        "Drive #",
                        ledger.length - i,
                        " \u00B7 ",
                        r.date),
                    React.createElement("span", { style: { color: T.green, fontFamily: "monospace" } }, fmt(r.driveIncome)),
                    React.createElement("span", { style: { color: T.orange, fontFamily: "monospace" } },
                        "-",
                        fmt(r.totalExpenses)),
                    React.createElement("span", { style: { color: T.red, fontFamily: "monospace" } },
                        "tax:",
                        fmt(r.taxPaid))))))))));
}
function App() {
    // Auth
    const [user, setUser] = useState(null);
    const [savedForUser, setSavedForUser] = useState(null);
    // Game state (loaded after login)
    const [gameReady, setGameReady] = useState(false);
    const [wallet, setWalletRaw] = useState(10000);
    const [owned, setOwned] = useState({});
    const [purchasePrices, setPurchasePrices] = useState({}); // tracks price paid for each asset
    const [loans, setLoans] = useState([]);
    const [portfolio, setPortfolio] = useState({});
    const [totalBills, setTotalBills] = useState(0);
    const [day, setDay] = useState(1);
    const [carSkin, setCarSkin] = useState("default");
    const [totalDrivingIncome, setTDI] = useState(0);
    const [totalTaxPaid, setTTP] = useState(0);
    const [isRegistered, setIsRegistered] = useState(false);
    const [companyName, setCompanyName] = useState("");
    const [showRegPrompt, setShowRegPrompt] = useState(true);
    const [companyLedger, setCompanyLedger] = useState([]); // persistent expense records
    const [bankruptcyData, setBankruptcyData] = useState(null); // {debt, declaredAt, status:'bankrupt'|'recovering'|null}
    const [showBankruptcy, setShowBankruptcy] = useState(false);
    const [bankruptPlayers, setBankruptPlayers] = useState([]); // other players who are bankrupt
    // New passive income system — earned from drive performance
    const [passiveIncomeData, setPassiveIncomeData] = useState({
        dailyPassive: 0, // current passive income per real day
        expiresAt: 0, // timestamp when passive income expires
        lastMultiplier: 0, // multiplier from last drive
        assetBoost: 1.0, // current asset boost
        quizzesPassed: 0, // total quizzes passed
        quizzesFailed: 0, // total quizzes failed
    });
    const [xp, setXp] = useState(0);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [ipoData, setIpoData] = useState(null);
    const [tab, setTab] = useState("hub");
    const [prices, setPrices] = useState(() => Object.fromEntries(ALL_STOCKS.map(s => [s.ticker, s.basePrice])));
    const [prevPrices, setPrevPrices] = useState(() => Object.fromEntries(ALL_STOCKS.map(s => [s.ticker, s.basePrice])));
    const [priceHistory, setPH] = useState(() => Object.fromEntries(ALL_STOCKS.map(s => [s.ticker, [s.basePrice]])));
    const [marketEvent, setMktEvt] = useState(null);
    const [toast, setToast] = useState(null);
    const [tradeHistory, setTrades] = useState([]);
    const [qty, setQty] = useState({});
    const [lendAmt, setLendAmt] = useState({});
    const [taxModal, setTaxModal] = useState(null);
    const [showShare, setShowShare] = useState(false);
    const [showValuation, setShowValuation] = useState(false);
    const [showCoach, setShowCoach] = useState(false);
    const [assetPrices, setAssetPrices] = useState(() => initAssetPrices());
    const [showIPOProfile, setShowIPOProfile] = useState(null);
    const [openLoanCount, setOpenLoanCount] = useState(0); // {companyName,ipoData,ownerSave}
    const [showDeleteAccount, setShowDeleteAccount] = useState(false);
    const [milestone, setMilestone] = useState(null);
    const [shownMilestones, setShownMilestones] = useState([]);
    const [streak, setStreak] = useState(0);
    const [lastLoginDate, setLastLoginDate] = useState(null);
    const [streakBonus, setStreakBonus] = useState(null); // {day, bonus}
    const [totalChallengesWon, setTotalChallengesWon] = useState(0);
    const [showChallenges, setShowChallenges] = useState(false);
    const [showTour, setShowTour] = useState(false);
    const [debrief, setDebrief] = useState(null);
    const pricesRef = useRef(prices);
    pricesRef.current = prices;
    const stockValue = ALL_STOCKS.reduce((s, st) => s + (portfolio[st.ticker] || 0) * prices[st.ticker], 0);
    const propIncome = assetPrices ? PROPERTIES.filter(p => owned[p.id] && p.baseIncome > 0).reduce((s, p) => s + assetIncome(p, assetPrices), 0) : 0;
    const propValue = assetPrices ? PROPERTIES.filter(p => owned[p.id]).reduce((s, p) => s + (assetLiquidate(p, assetPrices) || 0), 0) : 0;
    const netWorth = wallet + stockValue + propValue;
    const loansOut = loans.reduce((s, l) => s + l.amount, 0);
    const valuationUnlocked = totalDrivingIncome >= VALUATION_UNLOCK;
    // Tick asset prices every 5 seconds
    useEffect(() => {
        const id = setInterval(() => { setAssetPrices(prev => tickAssetPrices(prev)); }, 5000);
        return () => clearInterval(id);
    }, []);
    // Subscribe to open P2P loan count for badge notification
    useEffect(() => {
        const db = getDB();
        if (!db)
            return;
        const ref = db.ref("p2p/requests");
        ref.on("value", snap => {
            const v = snap.val();
            const count = v ? Object.values(v).filter(r => r && r.status === "open" && r.borrower !== user).length : 0;
            setOpenLoanCount(count);
        });
        return () => ref.off();
    }, [user]);
    // Listen for IPO share buy/sell events from IPOInvestSection component
    useEffect(() => {
        const onBuy = e => { const { key, qty } = e.detail; setOwned(o => ({ ...o, [key]: (o[key] || 0) + qty })); };
        const onSell = e => { const { key } = e.detail; setOwned(o => ({ ...o, [key]: 0 })); };
        window.addEventListener("ml_buy_ipo_share", onBuy);
        window.addEventListener("ml_sell_ipo_share", onSell);
        return () => { window.removeEventListener("ml_buy_ipo_share", onBuy); window.removeEventListener("ml_sell_ipo_share", onSell); };
    }, []);
    // Listen for pending loan repayments credited to this player from Firebase
    useEffect(() => {
        if (!user || !gameReady)
            return;
        const db = getDB();
        if (!db)
            return;
        const ref = db.ref("p2p/pendingCredits/" + user);
        ref.on("value", snap => {
            const credits = snap.val();
            if (!credits)
                return;
            let total = 0;
            Object.entries(credits).forEach(([id, credit]) => {
                total += credit.amount || 0;
                db.ref("p2p/pendingCredits/" + user + "/" + id).remove();
            });
            if (total > 0) {
                setWalletRaw(w => +(w + total).toFixed(2));
                showToast(`💰 Received ${fmt(total)} in loan repayments!`, T.green);
            }
        });
        return () => ref.off();
    }, [user, gameReady]);
    // Publish IPO to Firebase when ipoData changes to Listed/Blue Chip
    useEffect(() => {
        if (!ipoData || !companyName || !gameReady)
            return;
        if (ipoData.stage === "Listed" || ipoData.stage === "Blue Chip") {
            const ownerSave = { netWorth, totalDrivingIncome, companyLedger, companyName, isRegistered, username: user };
            fbPublishIPO(companyName, ipoData, ownerSave).catch(() => { });
        }
    }, [ipoData && ipoData.stage]);
    // Auto-login on refresh — restore session from localStorage
    useEffect(() => {
        if (gameReady)
            return; // already logged in
        const savedUser = loadSession();
        if (savedUser) {
            const accs = loadAccounts();
            if (accs[savedUser]) {
                loadUserSave(savedUser, accs[savedUser].save || null);
            }
            else {
                clearSession(); // account no longer exists
            }
        }
    }, []);
    // Milestone detection
    const prevNetWorthRef = useRef(0);
    useEffect(() => {
        if (!gameReady)
            return;
        const prev = prevNetWorthRef.current;
        const hit = MILESTONES.filter(m => netWorth >= m.threshold && prev < m.threshold && !shownMilestones.includes(m.threshold));
        if (hit.length > 0) {
            setMilestone(hit[hit.length - 1]);
            setShownMilestones(s => [...s, ...hit.map(m => m.threshold)]);
        }
        prevNetWorthRef.current = netWorth;
    }, [netWorth, gameReady]);
    function loadUserSave(username, save) {
        const s = save || DEF_SAVE;
        setWalletRaw(s.wallet || 10000);
        setOwned(s.owned || {});
        setPurchasePrices(s.purchasePrices || {});
        setLoans(s.loans || []);
        setPortfolio(s.portfolio || {});
        setTotalBills(s.totalBills || 0);
        setDay(s.day || 1);
        setCarSkin(s.carSkin || "default");
        setTDI(s.totalDrivingIncome || 0);
        setTTP(s.totalTaxPaid || 0);
        setIsRegistered(s.isRegistered || false);
        setCompanyName(s.companyName || "");
        setShowRegPrompt(s.showRegPrompt !== false);
        setCompanyLedger(s.companyLedger || []);
        setBankruptcyData(s.bankruptcyData || null);
        setPassiveIncomeData(s.passiveIncomeData || { dailyPassive: 0, expiresAt: 0, lastMultiplier: 0, assetBoost: 1.0, quizzesPassed: 0, quizzesFailed: 0 });
        setXp(s.xp || 0);
        setCompletedLessons(s.completedLessons || []);
        setIpoData(s.ipoData || null);
        setShownMilestones(s.shownMilestones || []);
        setTotalChallengesWon(s.totalChallengesWon || 0);
        // ── Daily streak logic ──
        const today = new Date().toDateString();
        const last = s.lastLoginDate || null;
        let newStreak = s.streak || 0;
        let bonus = 0;
        if (last !== today) {
            const yesterday = new Date(Date.now() - 86400000).toDateString();
            if (last === yesterday) {
                newStreak += 1;
            }
            else if (last !== today) {
                newStreak = 1;
            }
            bonus = Math.min(newStreak, 7) * 500; // ₦500 per streak day, max ₦3500
            setStreakBonus({ day: newStreak, bonus });
            setWalletRaw(w => +(w + bonus).toFixed(2));
        }
        setStreak(newStreak);
        setLastLoginDate(today);
        const isNew = !save || (s.wallet === 10000 && s.totalDrivingIncome === 0);
        if (isNew)
            setShowTour(true);
        saveSession(username);
        setUser(username);
        setGameReady(true);
    }
    async function handleLogin(username, save) {
        // Try to get latest save from Firebase (may be more up to date than what auth returned)
        try {
            const fbSave = await fbLoadGameState(username);
            loadUserSave(username, fbSave || save);
        }
        catch (e) {
            loadUserSave(username, save);
        }
    }
    function persistSave(overrides = {}) {
        const s = { wallet, owned, purchasePrices, passiveIncomeData, bankruptcyData, loans, portfolio, totalBills, day, carSkin, totalDrivingIncome, totalTaxPaid, isRegistered, companyName, showRegPrompt, companyLedger, xp, completedLessons, ipoData, shownMilestones, streak, lastLoginDate, totalChallengesWon, ...overrides };
        // Save locally for instant response
        doSave(s);
        const accs = loadAccounts();
        if (accs[user]) {
            accs[user].save = s;
            saveAccounts(accs);
        }
        // Save to Firebase — survives domain changes, device switches, browser clears
        fbSaveGameState(user, s).catch(() => { });
    }
    useEffect(() => { if (gameReady)
        persistSave(); }, [wallet, owned, loans, portfolio, totalBills, day, carSkin, totalDrivingIncome, totalTaxPaid, isRegistered, companyName, showRegPrompt, companyLedger, xp, completedLessons, ipoData]);
    useEffect(() => {
        if (!gameReady)
            return;
        const id = setInterval(() => {
            const ev = Math.random() < 0.12 ? MARKET_EVENTS[Math.floor(Math.random() * MARKET_EVENTS.length)] : null;
            if (ev) {
                setMktEvt(ev);
                setTimeout(() => setMktEvt(null), 5000);
            }
            setPrevPrices(() => ({ ...pricesRef.current }));
            setPrices(prev => { const n = { ...prev }; ALL_STOCKS.forEach(s => { const m = ev && ev.tickers.includes(s.ticker) ? ev.mult : 1; n[s.ticker] = rw(prev[s.ticker], s.volatility, m); }); return n; });
            setPH(ph => { const n = { ...ph }; ALL_STOCKS.forEach(s => { n[s.ticker] = [...(ph[s.ticker] || []).slice(-39), pricesRef.current[s.ticker]]; }); return n; });
        }, 2500);
        return () => clearInterval(id);
    }, [gameReady]);
    // Computed active passive income — expires after 24 real hours
    const activePassiveIncome = (passiveIncomeData && passiveIncomeData.expiresAt > Date.now()) ? (passiveIncomeData.dailyPassive || 0) : 0;
    // Check for bankruptcy whenever net worth changes
    useEffect(() => {
        if (!gameReady || !user)
            return;
        if ((bankruptcyData && (bankruptcyData.status === "recovering" || bankruptcyData.status === "bankrupt")))
            return; // already handled
        if (netWorth <= BANKRUPTCY_THRESHOLD && wallet <= 0) {
            // Liquidate all assets first
            let recovered = 0;
            const newOwned = { ...owned };
            PROPERTIES.forEach(p => {
                if (newOwned[p.id]) {
                    recovered += (assetPrices && assetPrices[p.id]) || p.baseCost || 0;
                    newOwned[p.id] = false;
                }
            });
            const remainingDebt = Math.max(0, Math.abs(netWorth) - recovered);
            const bd = {
                status: remainingDebt > 0 ? "bankrupt" : "recovered",
                debt: -remainingDebt,
                declaredAt: new Date().toISOString(),
                totalDebt: remainingDebt,
            };
            setOwned(newOwned);
            setWalletRaw(Math.max(0, recovered - remainingDebt));
            setBankruptcyData(bd);
            if (remainingDebt > 0) {
                setShowBankruptcy(true);
                // Notify Firebase so other players can offer bail out
                const db = getDB();
                if (db)
                    db.ref("bankrupt/" + user).set({
                        username: user, companyName, debt: -remainingDebt,
                        declaredAt: bd.declaredAt, status: "bankrupt"
                    }).catch(() => { });
            }
        }
    }, [netWorth, wallet, gameReady]);
    // Listen to bankrupt players from Firebase for bail out panel
    useEffect(() => {
        if (!gameReady || !user)
            return;
        const db = getDB();
        if (!db)
            return;
        const ref = db.ref("bankrupt");
        ref.on("value", snap => {
            const v = snap.val();
            if (!v) {
                setBankruptPlayers([]);
                return;
            }
            const players = Object.values(v)
                .filter(p => p.status === "bankrupt" && p.username !== user);
            setBankruptPlayers(players);
        });
        return () => ref.off();
    }, [gameReady, user]);
    useEffect(() => {
        if (!gameReady)
            return;
        // Tick every 60 real seconds — pay out 1/1440th of daily passive income
        const id = setInterval(() => {
            const now = Date.now();
            setPassiveIncomeData(pd => {
                if (pd.expiresAt <= now)
                    return pd; // expired — no passive income
                const tickAmount = Math.round(pd.dailyPassive / 1440); // per minute
                if (tickAmount > 0) {
                    setWalletRaw(w => +(w + tickAmount).toFixed(2));
                    showToast(`+${fmt(tickAmount)} passive income`, T.green);
                }
                return pd;
            });
            setDay(d => d + 1);
        }, 60000); // every 60 real seconds
        return () => clearInterval(id);
    }, [gameReady]);
    function showToast(msg, color = T.cyan) { setToast({ msg, color }); setTimeout(() => setToast(null), 3500); }
    function handleRegister(name) {
        setIsRegistered(true);
        setCompanyName(name);
        setWalletRaw(w => +(w - REG_COST).toFixed(2));
        setShowRegPrompt(false);
        showToast(`${name} registered successfully!`, T.gold);
        persistSave({ isRegistered: true, companyName: name, showRegPrompt: false, wallet: wallet - REG_COST });
    }
    function handleSkipReg() { setShowRegPrompt(false); persistSave({ showRegPrompt: false }); }
    function handleExitRoad(finalBalance, earned, driveStats) {
        setWalletRaw(finalBalance);
        setTaxModal({ balance: finalBalance, earned });
        // Calculate new passive income based on drive performance
        if (earned > 0 && driveStats) {
            let multiplier = PASSIVE_BASE;
            if (driveStats.driveDurationMs >= 5 * 60 * 1000)
                multiplier += PASSIVE_LONG_DRIVE;
            multiplier += (driveStats.quizzesPassed * PASSIVE_QUIZ_PASS);
            multiplier += (driveStats.quizzesFailed * PASSIVE_QUIZ_FAIL);
            multiplier += (driveStats.roadEventsCollected * PASSIVE_ROAD_EVENT);
            multiplier = Math.max(0.01, multiplier); // minimum 1%
            const assetBoost = getAssetBoost(owned);
            const dailyPassive = Math.round(earned * multiplier * assetBoost);
            const expiresAt = Date.now() + PASSIVE_EXPIRY_MS;
            setPassiveIncomeData(pd => ({
                ...pd,
                dailyPassive,
                expiresAt,
                lastMultiplier: multiplier,
                assetBoost,
                quizzesPassed: pd.quizzesPassed + (driveStats.quizzesPassed || 0),
                quizzesFailed: pd.quizzesFailed + (driveStats.quizzesFailed || 0),
            }));
            showToast(`Drive complete! Passive income: ${fmt(dailyPassive)}/day for 24hrs (${(multiplier * 100).toFixed(0)}% × ${assetBoost}× asset boost)`, T.gold);
        }
    }
    function handleTaxConfirm(taxAmount, expenseBreakdown) {
        const earned = taxModal.earned;
        const totalExpenses = expenseBreakdown
            ? Object.values(expenseBreakdown).reduce((s, v) => s + (parseFloat(v) || 0), 0)
            : 0;
        const netIncome = Math.max(0, earned - totalExpenses);
        let totalDeduction = taxAmount;
        let debtRepayment = 0;
        // If in debt recovery mode — 50% of drive income goes to debt repayment
        if (bankruptcyData && bankruptcyData.status === "recovering" && (bankruptcyData.debt || 0) < 0) {
            debtRepayment = Math.round(earned * DEBT_REPAY_RATE);
            const newDebt = Math.min(0, (bankruptcyData.debt || 0) + debtRepayment);
            totalDeduction += debtRepayment;
            if (newDebt >= 0) {
                setBankruptcyData(bd => ({ ...bd, status: "recovered", debt: 0, recoveredAt: new Date().toISOString() }));
                const db = getDB();
                if (db)
                    db.ref("bankrupt/" + user + "/status").set("recovered").catch(() => { });
                showToast("🎉 Debt fully cleared! Full access restored!", T.green);
            }
            else {
                setBankruptcyData(bd => ({ ...bd, debt: newDebt }));
                showToast(`💸 ${fmt(debtRepayment)} went to debt repayment. Remaining: ${fmt(Math.abs(newDebt))}`, T.orange);
            }
        }
        setWalletRaw(w => +(w - totalDeduction).toFixed(2));
        setTDI(t => t + earned);
        setTTP(t => t + taxAmount);
        // Save full record to company ledger
        if (isRegistered && expenseBreakdown) {
            const record = {
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
                driveIncome: earned,
                expenses: expenseBreakdown,
                totalExpenses,
                taxableIncome: netIncome,
                taxPaid: taxAmount,
                day,
            };
            setCompanyLedger(l => [record, ...l.slice(0, 49)]);
        }
        const saved = taxModal; // capture before clearing
        setTaxModal(null);
        showToast(taxAmount > 0
            ? `Tax paid: ${fmt(taxAmount)} · Net income: ${fmt(netIncome)}`
            : `No tax due · Net income: ${fmt(netIncome)}`, taxAmount > 0 ? T.orange : T.green);
    }
    function buyStock(ticker) {
        const q = parseInt(qty[ticker] || 1), cost = prices[ticker] * q;
        if (cost > wallet) {
            showToast("Not enough cash!", T.red);
            return;
        }
        setPortfolio(p => ({ ...p, [ticker]: (p[ticker] || 0) + q }));
        setWalletRaw(w => +(w - cost).toFixed(2));
        const trade = { action: "BUY", ticker, qty: q, price: prices[ticker], time: new Date().toLocaleTimeString() };
        setTrades(h => [trade, ...h.slice(0, 29)]);
        showToast(`Bought ${q} × ${ticker}`, T.green);
    }
    function sellStock(ticker) {
        const q = parseInt(qty[ticker] || 1);
        if ((portfolio[ticker] || 0) < q) {
            showToast("Not enough shares!", T.red);
            return;
        }
        const sellPrice = prices[ticker];
        // Find last buy price for debrief
        const lastBuy = tradeHistory.find(t => t.action === "BUY" && t.ticker === ticker);
        const isLoss = lastBuy && sellPrice < lastBuy.price;
        setPortfolio(p => ({ ...p, [ticker]: p[ticker] - q }));
        setWalletRaw(w => +(w + sellPrice * q).toFixed(2));
        const trade = { action: "SELL", ticker, qty: q, price: sellPrice, buyPrice: lastBuy?.price, time: new Date().toLocaleTimeString() };
        setTrades(h => [trade, ...h.slice(0, 29)]);
        showToast(`Sold ${q} × ${ticker}`, T.gold);
        if (isLoss) {
            const stock = ALL_STOCKS.find(s => s.ticker === ticker);
            setTimeout(() => setDebrief({ trade, stock }), 800);
        }
    }
    function buyProp(p) { if (owned[p.id]) {
        showToast("Already owned!", T.red);
        return;
    } const currentCost = (assetPrices && assetPrices[p.id]) || p.baseCost || p.cost || 0; if (wallet < currentCost) {
        showToast("Not enough cash!", T.red);
        return;
    } setOwned(o => ({ ...o, [p.id]: true })); setPurchasePrices(pp => ({ ...pp, [p.id]: currentCost })); setWalletRaw(w => +(w - currentCost).toFixed(2)); showToast(`Purchased ${p.name} for ${fmt(currentCost)}!`, T.green); }
    function applyNonDriveTax(gain) {
        // 30% for registered company, 40% for individuals on non-drive income
        if (gain <= 0)
            return 0;
        const rate = isRegistered ? 0.30 : 0.40;
        const tax = Math.round(gain * rate);
        setTTP(t => t + tax);
        return tax;
    }
    function sellProp(p) { if (!owned[p.id])
        return; const val = p.id === "crypto" ? Math.round((assetLiquidate(p, assetPrices) || p.baseCost) * (0.85 + Math.random() * 0.4)) : assetLiquidate(p, assetPrices) || p.baseCost; const gain = Math.max(0, val - (p.baseCost || 0)); const tax = applyNonDriveTax(gain); setOwned(o => ({ ...o, [p.id]: false })); setWalletRaw(w => +(w + val - tax).toFixed(2)); showToast(`Sold ${p.name} for ${fmt(val)} · Tax on gain: ${fmt(tax)}`, T.gold); }
    function lend(f) {
        const amt = parseInt(lendAmt[f.id] || 0);
        if (!amt || amt <= 0) {
            showToast("Enter amount", T.red);
            return;
        }
        if (amt > wallet) {
            showToast("Not enough cash!", T.red);
            return;
        }
        if (loans.find(l => l.friendId === f.id)) {
            showToast(`${f.name} has active loan`, T.red);
            return;
        }
        setWalletRaw(w => +(w - amt).toFixed(2));
        setLoans(ls => [...ls, { friendId: f.id, friend: f.name, amount: amt, interest: f.interest, dueDay: day + f.daysToRepay }]);
        setLendAmt(la => ({ ...la, [f.id]: "" }));
        showToast(`Lent ${fmt(amt)} to ${f.name}`, T.cyan);
    }
    function logout() { clearSession(); setUser(null); setGameReady(false); }
    function deleteAccount() {
        // Remove from localStorage accounts
        const accs = loadAccounts();
        delete accs[user];
        saveAccounts(accs);
        // Clear local save
        try {
            localStorage.removeItem(SAVE_KEY);
        }
        catch { }
        // Remove from Firebase leaderboard if configured
        if (fbConfigured()) {
            const db = getDB();
            if (db)
                db.ref("leaderboard/" + user).remove().catch(() => { });
        }
        clearSession();
        setUser(null);
        setGameReady(false);
    }
    function handleLearnComplete(lessonId, xpReward) {
        setCompletedLessons(l => [...l, lessonId]);
        setXp(x => x + xpReward);
        showToast(`+${xpReward} XP — Lesson complete!`, T.cyan);
    }
    function handleLaunchIPO(data) {
        setIpoData(data);
        setWalletRaw(w => +(w + data.raiseAmount).toFixed(2));
        showToast(`🚀 ${companyName} is now publicly listed! Raised ${fmt(data.raiseAmount)}`, T.gold);
    }
    function handleSellShares(revenue) {
        setIpoData(prev => ({ ...prev, sharesRemaining: 0, stage: "Listed" }));
        setWalletRaw(w => +(w + revenue).toFixed(2));
        showToast(`💰 Secondary offering complete — ${fmt(revenue)} raised`, T.green);
    }
    function handleBuyback(cost) {
        if (wallet < cost) {
            showToast("Not enough cash for buyback!", T.red);
            return;
        }
        setIpoData(prev => ({ ...prev, stage: "Blue Chip" }));
        setWalletRaw(w => +(w - cost).toFixed(2));
        showToast(`🏆 Share buyback complete — ${companyName} is now Blue Chip!`, T.gold);
    }
    if (!gameReady)
        return React.createElement(AuthScreen, { onLogin: handleLogin });
    if (showRegPrompt)
        return React.createElement(CompanyRegScreen, { wallet: wallet, onRegister: handleRegister, onSkip: handleSkipReg });
    const tabs = [
        { id: "hub", label: "Hub", icon: "ti-layout-dashboard" },
        { id: "invest", label: "Invest", icon: "ti-building" },
        { id: "lend", label: "Lend", icon: "ti-cash" },
        { id: "tax", label: "Tax", icon: "ti-receipt-tax" },
        { id: "leaderboard", label: "Ranks", icon: "ti-trophy" },
        { id: "challenges", label: "Versus", icon: "ti-sword" },
        { id: "ipo", label: "IPO", icon: "ti-rocket" },
        { id: "runner", label: "Runner", icon: "ti-steering-wheel" },
    ];
    const ST = (t) => React.createElement("div", { style: { fontSize: 10, textTransform: "uppercase", letterSpacing: 1.4, color: T.muted, marginBottom: 8, marginTop: 4 } }, t);
    return (React.createElement("div", { style: { fontFamily: "'Segoe UI',sans-serif", maxWidth: 700, margin: "0 auto", background: T.bg, minHeight: "100%", padding: "0 0 24px" } },
        React.createElement("h2", { className: "sr-only" }, "Market Legends"),
        taxModal && React.createElement(TaxApportionScreen, { drivingIncome: taxModal.earned, isRegistered: isRegistered, companyName: companyName, onConfirm: handleTaxConfirm }),
        showShare && React.createElement(ShareCard, { username: user, netWorth: netWorth, totalDrivingIncome: totalDrivingIncome, totalTaxPaid: totalTaxPaid, portfolio: portfolio, owned: owned, companyName: companyName, onClose: () => setShowShare(false) }),
        showValuation && React.createElement("div", { style: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(7,12,24,0.97)", zIndex: 150, overflowY: "auto" } },
            React.createElement(ValuationApp, { onClose: () => setShowValuation(false) })),
        streakBonus && React.createElement(StreakBonusModal, { streak: streakBonus.day, bonus: streakBonus.bonus, onClose: () => setStreakBonus(null) }),
        showBankruptcy && bankruptcyData && (React.createElement(BankruptcyScreen, { user: user, debt: bankruptcyData.debt || 0, companyName: companyName, isRegistered: isRegistered, onBailout: (amount) => {
                setWalletRaw(w => +(w + amount).toFixed(2));
                setBankruptcyData(bd => ({ ...bd, status: "recovered", recoveredAt: new Date().toISOString() }));
                setShowBankruptcy(false);
                const db = getDB();
                if (db)
                    db.ref("bankrupt/" + user + "/status").set("recovered").catch(() => { });
                showToast("🎉 You've been bailed out! Back in business!", T.green);
            }, onAcknowledge: () => {
                setBankruptcyData(bd => ({ ...bd, status: "recovering" }));
                setShowBankruptcy(false);
            } })),
        showIPOProfile && React.createElement(IPOProfile, { companyName: showIPOProfile.companyName, ipoData: showIPOProfile.ipoData, ownerSave: showIPOProfile.ownerSave, onClose: () => setShowIPOProfile(null) }),
        showCoach && React.createElement(AICoachModal, { netWorth: netWorth, wallet: wallet, portfolio: portfolio, xp: xp, isRegistered: isRegistered, onClose: () => setShowCoach(false) }),
        milestone && React.createElement(MilestoneCelebration, { milestone: milestone, onClose: () => setMilestone(null) }),
        showTour && React.createElement(OnboardingTour, { onFinish: () => setShowTour(false) }),
        debrief && React.createElement(MistakeDebrief, { trade: debrief.trade, stock: debrief.stock, onClose: () => setDebrief(null) }),
        showDeleteAccount && React.createElement(DeleteAccountModal, { username: user, onConfirm: deleteAccount, onCancel: () => setShowDeleteAccount(false) }),
        toast && (React.createElement("div", { style: { background: T.card, border: `1px solid ${toast.color}`, borderRadius: D.br, padding: "10px 16px", marginBottom: 10, fontSize: 13, fontWeight: "bold", color: toast.color, display: "flex", alignItems: "center", gap: 8, fontFamily: "monospace" } },
            React.createElement("i", { className: "ti ti-info-circle", style: { fontSize: 16 }, "aria-hidden": "true" }),
            toast.msg)),
        React.createElement("div", { style: { background: T.surface, border: `1px solid ${T.border}`, borderRadius: D.br, padding: "12px 16px", marginBottom: 10 } },
            React.createElement("div", { style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 10 } },
                React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } },
                    React.createElement("i", { className: "ti ti-chart-candle", style: { fontSize: 22, color: T.cyan }, "aria-hidden": "true" }),
                    React.createElement("div", null,
                        React.createElement("div", { style: { fontSize: 10, textTransform: "uppercase", letterSpacing: 1.2, color: T.muted, marginBottom: 1 } },
                            "Market Legends \u00B7 Day ",
                            day,
                            " \u00B7 @",
                            user),
                        React.createElement(AnimatedWallet, { value: wallet }),
                        isRegistered && React.createElement("div", { style: { fontSize: 10, color: T.gold } },
                            "\uD83C\uDFE2 ",
                            companyName),
                        !isRegistered && React.createElement("div", { style: { fontSize: 10, color: T.orange } }, "Unregistered \u00B7 40% tax on exit"))),
                React.createElement("div", { style: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" } },
                    React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(2,auto)", gap: "6px 14px", textAlign: "right" } },
                        React.createElement("div", null,
                            React.createElement("div", { style: { fontSize: 9, textTransform: "uppercase", letterSpacing: 1, color: T.muted, marginBottom: 1 } }, "Net Worth"),
                            React.createElement(AnimatedStat, { value: netWorth, color: T.cyan })),
                        React.createElement("div", null,
                            React.createElement("div", { style: { fontSize: 9, textTransform: "uppercase", letterSpacing: 1, color: T.muted, marginBottom: 1 } }, "Tax Paid"),
                            React.createElement("div", { style: { fontSize: 13, fontWeight: "bold", fontFamily: "monospace", color: T.orange } }, fmt(totalTaxPaid))),
                        React.createElement("div", null,
                            React.createElement("div", { style: { fontSize: 9, textTransform: "uppercase", letterSpacing: 1, color: T.muted, marginBottom: 1 } }, "XP"),
                            React.createElement("div", { style: { fontSize: 13, fontWeight: "bold", fontFamily: "monospace", color: T.purple } },
                                xp,
                                " pts")),
                        React.createElement("div", null,
                            React.createElement("div", { style: { fontSize: 9, textTransform: "uppercase", letterSpacing: 1, color: T.muted, marginBottom: 1 } }, "Income/Day"),
                            React.createElement("div", { style: { fontSize: 13, fontWeight: "bold", fontFamily: "monospace", color: T.green } }, fmt(propIncome)))),
                    React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 5 } },
                        React.createElement("button", { onClick: () => setShowCoach(true), style: { fontSize: 10, padding: "5px 10px", background: "rgba(124,111,223,0.18)", border: `1px solid ${T.purple}`, borderRadius: D.brs, color: T.purple, cursor: "pointer", fontWeight: "bold", whiteSpace: "nowrap" } }, "\uD83E\uDDE0 Coach"),
                        React.createElement("button", { onClick: () => setShowShare(true), style: { fontSize: 10, padding: "5px 10px", background: `${T.purple}18`, border: `1px solid ${T.purple}`, borderRadius: D.brs, color: T.purple, cursor: "pointer", fontWeight: "bold", whiteSpace: "nowrap" } }, "\uD83D\uDCE4 Share"),
                        React.createElement("button", { onClick: logout, style: { fontSize: 10, padding: "5px 10px", background: "transparent", border: `1px solid ${T.border}`, borderRadius: D.brs, color: T.muted, cursor: "pointer" } }, "Logout"),
                        React.createElement("button", { onClick: () => setShowDeleteAccount(true), style: { fontSize: 10, padding: "5px 10px", background: "rgba(255,71,87,0.08)", border: `1px solid #ff475744`, borderRadius: D.brs, color: "#ff4757", cursor: "pointer" } }, "\uD83D\uDDD1 Delete")))),
            !isRegistered && (React.createElement("div", { style: { marginTop: 10, display: "flex", alignItems: "center", gap: 10 } },
                React.createElement("div", { style: { flex: 1, height: 4, background: T.surface, borderRadius: 2 } },
                    React.createElement("div", { style: { height: "100%", width: Math.min(100, (totalDrivingIncome / VALUATION_UNLOCK) * 100) + "%", background: `linear-gradient(90deg,${T.orange},${T.gold})`, borderRadius: 2 } })),
                React.createElement("div", { style: { fontSize: 10, color: T.muted, whiteSpace: "nowrap" } }, valuationUnlocked ? "🔬 Valuation App Unlocked!" : fmt(totalDrivingIncome) + " / " + fmt(VALUATION_UNLOCK) + " for Valuation App"))),
            valuationUnlocked && (React.createElement("button", { onClick: () => setShowValuation(true), style: { marginTop: 10, width: "100%", padding: "8px", background: `linear-gradient(135deg,${T.gold},${T.orange})`, color: "#05050a", border: "none", borderRadius: D.brs, fontWeight: "bold", fontSize: 12, cursor: "pointer" } }, "\uD83D\uDD2C Open Stock Valuation App \u2014 7 Criteria Analysis"))),
        marketEvent && (React.createElement("div", { style: { background: T.card, border: `1.5px solid ${marketEvent.mult > 1 ? T.green : T.red}`, borderRadius: D.br, padding: "10px 14px", marginBottom: 10, display: "flex", alignItems: "center", gap: 12 } },
            React.createElement("span", { style: { fontSize: 20 } }, marketEvent.emoji),
            React.createElement("div", { style: { flex: 1 } },
                React.createElement("div", { style: { fontWeight: "bold", fontSize: 12, color: marketEvent.mult > 1 ? T.green : T.red } }, marketEvent.headline),
                React.createElement("div", { style: { fontSize: 11, color: T.muted, marginTop: 1 } },
                    marketEvent.detail,
                    " \u00B7 ",
                    marketEvent.tickers.join(", "))),
            React.createElement("div", { style: { fontWeight: "bold", fontSize: 16, fontFamily: "monospace", color: marketEvent.mult > 1 ? T.green : T.red } },
                marketEvent.mult > 1 ? "+" : "",
                ((marketEvent.mult - 1) * 100).toFixed(0),
                "%"))),
        !isRegistered && !showRegPrompt && (React.createElement("div", { style: { background: T.card, border: `1px solid ${T.gold}44`, borderRadius: D.br, padding: "10px 14px", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 } },
            React.createElement("div", { style: { fontSize: 12, color: T.muted } },
                "\uD83C\uDFE2 Register your company to reduce tax. Cost: ",
                React.createElement("span", { style: { color: T.gold, fontWeight: "bold" } }, fmt(REG_COST))),
            React.createElement("button", { onClick: () => setShowRegPrompt(true), style: { fontSize: 11, padding: "5px 12px", background: `${T.gold}18`, border: `1px solid ${T.gold}`, borderRadius: D.brs, color: T.gold, cursor: "pointer", fontWeight: "bold", whiteSpace: "nowrap" } }, "Register Now"))),
        React.createElement("div", { style: { display: "flex", background: T.surface, border: `1px solid ${T.border}`, borderRadius: D.br, padding: 3, gap: 1, marginBottom: 12, overflowX: "auto" } }, tabs.map(t => (React.createElement("button", { key: t.id, onClick: () => setTab(t.id), style: { flex: 1, minWidth: 46, padding: "7px 2px", fontSize: 9, fontWeight: tab === t.id ? "bold" : "normal", color: tab === t.id ? T.cyan : T.muted, background: tab === t.id ? "rgba(0,229,255,0.08)" : "transparent", border: `1px solid ${tab === t.id ? T.cyan + "44" : "transparent"}`, borderRadius: D.brs, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, whiteSpace: "nowrap", position: "relative" } },
            React.createElement("div", { style: { position: "relative", display: "inline-block" } },
                React.createElement("i", { className: `ti ${t.icon}`, style: { fontSize: 15 }, "aria-hidden": "true" }),
                t.badge && openLoanCount > 0 && React.createElement("span", { style: { position: "absolute", top: -5, right: -7, background: T.red, color: "#fff", borderRadius: "50%", width: 14, height: 14, fontSize: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", lineHeight: 1 } }, openLoanCount > 9 ? "9+" : openLoanCount)),
            t.label)))),
        React.createElement("div", { style: { padding: "0 2px" } }, tab === "hub" && (React.createElement("div", { style: { fontFamily: "'Inter',sans-serif" } },
            React.createElement("style", null, `
            .hub-glass{background:rgba(22,27,40,0.75);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.07);box-shadow:0 8px 32px rgba(0,0,0,0.35);}
            .hub-glass:hover{border-color:rgba(0,229,255,0.2);}
            .hub-stat-card{transition:transform 0.15s,box-shadow 0.15s;}
            .hub-stat-card:hover{transform:translateY(-2px);box-shadow:0 12px 36px rgba(0,0,0,0.4);}
            .hub-bill-row:hover{background:rgba(255,255,255,0.03);}
            .hub-btn-coach{transition:filter 0.15s;}
            .hub-btn-coach:hover{filter:brightness(1.1);}
          `),
            React.createElement("div", { style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 } },
                React.createElement("div", null,
                    React.createElement("h1", { style: { fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 3 } }, "Executive Terminal"),
                    React.createElement("p", { style: { fontSize: 12, color: "#6B7FA0" } },
                        "Market status: ",
                        React.createElement("span", { style: { color: "#00ffa3", fontWeight: 600 } }, "Operational"),
                        " · Day ",
                        React.createElement("span", { style: { color: "#e2e8f0" } }, day),
                        " · Streak ",
                        React.createElement("span", { style: { color: "#f5c842" } },
                            "\uD83D\uDD25 ",
                            streak || 0))),
                React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 14 } },
                    React.createElement("div", { style: { textAlign: "right" } },
                        React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6, marginBottom: 2 } },
                            React.createElement("span", { style: { fontSize: 10, background: "rgba(0,229,255,0.15)", color: "#00e5ff", padding: "2px 8px", borderRadius: 20, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" } }, netWorth >= 100000000 ? "Elite Legend" : netWorth >= 10000000 ? "High Value" : netWorth >= 1000000 ? "Rising Star" : "Starter"),
                            React.createElement(AnimatedStat, { value: netWorth, color: "#fff" }),
                            React.createElement("span", { style: { fontSize: 12, color: "#00e5ff", fontWeight: 600 } }, "NW")),
                        React.createElement("p", { style: { fontSize: 11, color: "#94a3b8" } },
                            "Wallet: ",
                            React.createElement("span", { style: { color: "#00ff88", fontWeight: 700, fontFamily: "monospace" } }, fmt(wallet)))),
                    React.createElement("div", { style: { width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#00e5ff,#3b82f6)", padding: 1.5, flexShrink: 0 } },
                        React.createElement("div", { style: { width: "100%", height: "100%", background: "#0e131f", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 } }, companyName ? companyName[0].toUpperCase() : "👤")))),
            marketEvent ? (React.createElement("div", { style: { marginBottom: 16, position: "relative", overflow: "hidden", borderRadius: 12 } },
                React.createElement("div", { style: { position: "absolute", inset: 0, background: `linear-gradient(90deg,${marketEvent.impact > 0 ? "rgba(0,255,136,0.12)" : "rgba(255,71,87,0.12)"},transparent)` } }),
                React.createElement("div", { className: "hub-glass", style: { borderRadius: 12, borderLeft: `4px solid ${marketEvent.impact > 0 ? "#00ff88" : "#ff4757"}`, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 } },
                    React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 14 } },
                        React.createElement("div", { style: { width: 44, height: 44, background: marketEvent.impact > 0 ? "rgba(0,255,136,0.1)" : "rgba(255,71,87,0.1)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 } }, marketEvent.impact > 0 ? "📈" : "💥"),
                        React.createElement("div", null,
                            React.createElement("div", { style: { fontWeight: 700, fontSize: 14, color: marketEvent.impact > 0 ? "#00ffa3" : "#ff4757", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 3 } },
                                "Market Pulse: ",
                                marketEvent.name),
                            React.createElement("div", { style: { fontSize: 12, color: "#94a3b8", maxWidth: 380 } }, marketEvent.desc))),
                    React.createElement("div", { style: { textAlign: "right", flexShrink: 0 } },
                        React.createElement("div", { style: { fontSize: 26, fontWeight: 900, color: marketEvent.impact > 0 ? "#00ff88" : "#ff4757" } },
                            marketEvent.impact > 0 ? "+" : "",
                            marketEvent.impact,
                            "%"),
                        React.createElement("div", { style: { fontSize: 10, color: "#64748b", fontWeight: 700, textTransform: "uppercase" } }, "Live"))))) : (React.createElement("div", { className: "hub-glass", style: { borderRadius: 12, borderLeft: "4px solid #00e5ff", padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 } },
                React.createElement("span", { style: { fontSize: 16 } }, "\uD83D\uDCE1"),
                React.createElement("span", { style: { fontSize: 12, color: "#94a3b8" } }, "Markets stable \u2014 no active events. Drive to generate income."))),
            React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12, marginBottom: 16 } },
                React.createElement("div", { className: "hub-glass hub-stat-card", style: { borderRadius: 16, padding: "18px 16px" } },
                    React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 } },
                        React.createElement("div", { style: { padding: 8, background: "rgba(0,229,255,0.1)", borderRadius: 8, color: "#00e5ff" } },
                            React.createElement("i", { className: "ti ti-cash", style: { fontSize: 18 }, "aria-hidden": "true" })),
                        React.createElement("span", { style: { fontSize: 10, color: "#64748b", fontWeight: 700, textTransform: "uppercase" } }, "Cash")),
                    React.createElement(AnimatedStat, { value: wallet, color: "#00e5ff" }),
                    React.createElement("p", { style: { fontSize: 11, color: "#64748b", marginTop: 4 } }, "Available balance")),
                React.createElement("div", { className: "hub-glass hub-stat-card", style: { borderRadius: 16, padding: "18px 16px", boxShadow: "0 0 18px rgba(0,229,255,0.1)" } },
                    React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 } },
                        React.createElement("div", { style: { padding: 8, background: "rgba(0,229,255,0.1)", borderRadius: 8, color: "#00e5ff" } },
                            React.createElement("i", { className: "ti ti-wallet", style: { fontSize: 18 }, "aria-hidden": "true" })),
                        React.createElement("span", { style: { fontSize: 10, color: "#64748b", fontWeight: 700, textTransform: "uppercase" } }, "Net Worth")),
                    React.createElement(AnimatedStat, { value: netWorth, color: "#fff" }),
                    React.createElement("p", { style: { fontSize: 11, color: "#64748b", marginTop: 4 } }, stockValue > 0 ? `${fmt(stockValue)} in stocks` : loansOut > 0 ? `${fmt(loansOut)} lent out` : "Build your wealth")),
                React.createElement("div", { className: "hub-glass hub-stat-card", style: { borderRadius: 16, padding: "18px 16px" } },
                    React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 } },
                        React.createElement("div", { style: { padding: 8, background: "rgba(0,255,163,0.1)", borderRadius: 8, color: "#00ffa3" } },
                            React.createElement("i", { className: "ti ti-trending-up", style: { fontSize: 18 }, "aria-hidden": "true" })),
                        React.createElement("span", { style: { fontSize: 10, color: "#64748b", fontWeight: 700, textTransform: "uppercase" } }, "Cashflow")),
                    React.createElement("div", { style: { fontSize: 20, fontWeight: 700, color: activePassiveIncome > 0 ? "#00ffa3" : "#64748b", fontFamily: "monospace" } },
                        activePassiveIncome > 0 ? fmt(activePassiveIncome) : "$0",
                        React.createElement("span", { style: { fontSize: 11, fontWeight: 400 } }, "/day")),
                    React.createElement("p", { style: { fontSize: 11, color: "#64748b", marginTop: 4 } }, activePassiveIncome > 0 ? `Expires ${new Date(passiveIncomeData.expiresAt).toLocaleTimeString()}` : "Drive to activate")),
                React.createElement("div", { className: "hub-glass hub-stat-card", style: { borderRadius: 16, padding: "18px 16px", borderLeft: "4px solid rgba(255,149,0,0.6)" } },
                    React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 } },
                        React.createElement("div", { style: { padding: 8, background: "rgba(255,149,0,0.1)", borderRadius: 8, color: "#ff9500" } },
                            React.createElement("i", { className: "ti ti-receipt-tax", style: { fontSize: 18 }, "aria-hidden": "true" })),
                        React.createElement("span", { style: { fontSize: 10, color: "#64748b", fontWeight: 700, textTransform: "uppercase" } }, "Liabilities")),
                    React.createElement("div", { style: { fontSize: 20, fontWeight: 700, color: "#ff9500", fontFamily: "monospace" } }, fmt(totalTaxPaid)),
                    React.createElement("p", { style: { fontSize: 11, color: "#64748b", marginTop: 4 } }, "Accumulated tax"),
                    React.createElement("button", { onClick: () => setTab("tax"), style: { marginTop: 10, width: "100%", padding: "4px", fontSize: 10, border: "1px solid rgba(255,149,0,0.3)", borderRadius: 6, background: "rgba(255,149,0,0.05)", color: "#ff9500", cursor: "pointer", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" } }, "Tax Center \u2192"))),
            React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 } },
                React.createElement("h2", { style: { fontSize: 15, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 8 } },
                    React.createElement("span", { style: { width: 3, height: 20, background: "#ff007a", borderRadius: 4, display: "inline-block" } }),
                    "Overhead & Operational Expenses")),
            React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr", gap: 12 } },
                React.createElement("div", { className: "hub-glass", style: { borderRadius: 12, overflow: "hidden" } },
                    React.createElement("table", { style: { width: "100%", borderCollapse: "collapse" } },
                        React.createElement("thead", null,
                            React.createElement("tr", { style: { background: "rgba(255,255,255,0.04)" } }, ["Category", "Service", "Amount", "Status"].map(h => (React.createElement("th", { key: h, style: { padding: "10px 14px", textAlign: h === "Amount" || h === "Status" ? "right" : "left", fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" } }, h))))),
                        React.createElement("tbody", null, BILL_TYPES.map((b, i) => (React.createElement("tr", { key: b.id, className: "hub-bill-row", style: { borderTop: "1px solid rgba(255,255,255,0.05)" } },
                            React.createElement("td", { style: { padding: "11px 14px" } },
                                React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } },
                                    React.createElement("span", { style: { width: 32, height: 32, borderRadius: 6, background: `${b.color}18`, color: b.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 } },
                                        React.createElement("i", { className: `ti ${b.icon}`, "aria-hidden": "true" })),
                                    React.createElement("span", { style: { fontSize: 12, fontWeight: 500, color: "#e2e8f0" } }, b.label))),
                            React.createElement("td", { style: { padding: "11px 14px", fontSize: 12, color: "#64748b" } }, b.desc || b.label),
                            React.createElement("td", { style: { padding: "11px 14px", fontSize: 12, fontWeight: 700, color: "#fff", textAlign: "right", fontFamily: "monospace" } }, fmt(b.amount)),
                            React.createElement("td", { style: { padding: "11px 14px", textAlign: "right" } },
                                React.createElement("span", { style: { fontSize: 10, padding: "3px 8px", borderRadius: 5, fontWeight: 700,
                                        background: i % 3 === 2 ? "rgba(255,71,87,0.1)" : i % 3 === 1 ? "rgba(100,116,139,0.3)" : "rgba(0,255,163,0.1)",
                                        color: i % 3 === 2 ? "#ff4757" : i % 3 === 1 ? "#64748b" : "#00ffa3" } }, i % 3 === 2 ? "Overdue" : i % 3 === 1 ? "Pending" : "Paid")))))))),
                React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 } },
                    React.createElement("div", { className: "hub-glass", style: { borderRadius: 12, padding: "16px 14px", borderLeft: "2px solid rgba(0,229,255,0.4)" } },
                        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 } },
                            React.createElement("div", { style: { width: 38, height: 38, borderRadius: 8, background: "rgba(0,229,255,0.1)", color: "#00e5ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 } },
                                React.createElement("i", { className: "ti ti-users", "aria-hidden": "true" })),
                            React.createElement("div", null,
                                React.createElement("p", { style: { fontSize: 10, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" } }, "Loans Out"),
                                React.createElement("p", { style: { fontSize: 18, fontWeight: 700, color: "#fff", fontFamily: "monospace" } }, fmt(loansOut)))),
                        React.createElement("div", { style: { height: 4, background: "#1e293b", borderRadius: 4 } },
                            React.createElement("div", { style: { height: "100%", width: loansOut > 0 ? "60%" : "0%", background: "#00e5ff", borderRadius: 4, transition: "width 0.5s" } }))),
                    React.createElement("div", { className: "hub-glass", style: { borderRadius: 12, padding: "16px 14px", borderLeft: "2px solid rgba(124,111,223,0.5)" } },
                        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 } },
                            React.createElement("div", { style: { width: 38, height: 38, borderRadius: 8, background: "rgba(124,111,223,0.1)", color: "#7c6fdf", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 } },
                                React.createElement("i", { className: "ti ti-star", "aria-hidden": "true" })),
                            React.createElement("div", null,
                                React.createElement("p", { style: { fontSize: 10, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" } }, "XP Points"),
                                React.createElement("p", { style: { fontSize: 18, fontWeight: 700, color: "#fff" } },
                                    xp,
                                    " ",
                                    React.createElement("span", { style: { fontSize: 11, color: "#7c6fdf" } }, "pts")))),
                        React.createElement("div", { style: { height: 4, background: "#1e293b", borderRadius: 4 } },
                            React.createElement("div", { style: { height: "100%", width: Math.min(100, (xp % 500) / 500 * 100) + "%", background: "#7c6fdf", borderRadius: 4, transition: "width 0.5s" } })))),
                React.createElement("div", { className: "hub-glass", style: { borderRadius: 12, padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, border: "1px dashed rgba(255,255,255,0.1)" } },
                    React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 14 } },
                        React.createElement("div", { style: { width: 46, height: 46, borderRadius: "50%", background: "#0e131f", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 } }, "\uD83E\uDDE0"),
                        React.createElement("div", null,
                            React.createElement("div", { style: { fontWeight: 700, fontSize: 13, color: "#fff", marginBottom: 2 } }, "Advisory Council"),
                            React.createElement("div", { style: { fontSize: 11, color: "#64748b" } }, "Consult with your personal AI Wealth Coach"))),
                    React.createElement("button", { className: "hub-btn-coach", onClick: () => setShowCoach(true), style: { padding: "9px 18px", background: "#00e5ff", color: "#05050a", fontWeight: 700, borderRadius: 8, border: "none", fontSize: 12, cursor: "pointer", whiteSpace: "nowrap", boxShadow: "0 4px 15px rgba(0,229,255,0.25)" } }, "Chat Now")))))),
        ")}",
        tab === "invest" && (React.createElement("div", null,
            bankruptcyData && bankruptcyData.status === "recovering" && (React.createElement("div", { style: { background: T.card, border: `1px solid ${T.red}`, borderRadius: D.br, padding: "12px 14px", marginBottom: 12, textAlign: "center" } },
                React.createElement("div", { style: { fontSize: 20, marginBottom: 6 } }, "\uD83D\uDD12"),
                React.createElement("div", { style: { fontWeight: "bold", fontSize: 13, color: T.red, marginBottom: 4 } }, "\u26A0\uFE0F Debt Recovery Mode \u2014 Investing Locked"),
                React.createElement("div", { style: { fontSize: 12, color: T.muted } },
                    "Drive to repay your debt of ",
                    React.createElement("strong", { style: { color: T.red, fontFamily: "monospace" } }, fmt(Math.abs(bankruptcyData.debt || 0))),
                    ". 50% of each drive goes to repayment automatically."))),
            wallet < 500 && React.createElement("div", { style: { background: T.card, border: `1px solid ${T.red}`, borderRadius: D.br, padding: "9px 12px", marginBottom: 10, fontSize: 12, color: T.red, display: "flex", gap: 8, alignItems: "center" } },
                React.createElement("i", { className: "ti ti-alert-circle", style: { fontSize: 14 }, "aria-hidden": "true" }),
                "Wallet low! Sell an investment to reload."),
            React.createElement(InvestGuide, { wallet: wallet, propIncome: propIncome, netWorth: netWorth, activePassiveIncome: activePassiveIncome, passiveExpiry: passiveIncomeData.expiresAt }),
            ST("Properties & Assets"),
            PROPERTIES.map(p => {
                const isOwned = owned[p.id];
                return (React.createElement("div", { key: p.id, style: { background: T.card, border: `1px solid ${isOwned ? T.green + "55" : T.border}`, borderRadius: D.br, padding: "11px 13px", marginBottom: 7 } },
                    React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" } },
                        React.createElement("div", { style: { width: 34, height: 34, borderRadius: D.brs, background: isOwned ? "rgba(0,255,136,0.1)" : T.surface, border: `1px solid ${isOwned ? T.green : T.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } },
                            React.createElement("i", { className: `ti ${p.icon}`, style: { fontSize: 16, color: isOwned ? T.green : T.muted }, "aria-hidden": "true" })),
                        React.createElement("div", { style: { flex: 1 } },
                            React.createElement("div", { style: { display: "flex", gap: 5, alignItems: "center", flexWrap: "wrap" } },
                                React.createElement("span", { style: { fontWeight: "bold", fontSize: 12, color: T.text } }, p.name),
                                React.createElement("span", { style: { fontSize: 9, padding: "1px 5px", borderRadius: 20, background: T.surface, color: T.muted, border: `1px solid ${T.border}` } }, p.type),
                                isOwned && React.createElement("span", { style: { fontSize: 9, padding: "1px 5px", borderRadius: 20, background: "rgba(0,255,136,0.1)", color: T.green, border: `1px solid ${T.green}55` } }, "Owned")),
                            React.createElement("div", { style: { fontSize: 10, color: T.muted, marginTop: 1 } }, p.desc),
                            React.createElement("div", { style: { fontSize: 10, color: T.green, marginTop: 1 } },
                                assetIncome(p, assetPrices || {}) > 0 ? `+${fmt(assetIncome(p, assetPrices || {}))}/day` : "No income",
                                " \u00B7 Current: ",
                                fmt((assetPrices && assetPrices[p.id]) || p.baseCost)),
                            isOwned && purchasePrices[p.id] && (() => {
                                const bought = purchasePrices[p.id];
                                const current = (assetPrices && assetPrices[p.id]) || p.baseCost;
                                const gain = current - bought;
                                const gainPct = ((gain / bought) * 100).toFixed(1);
                                const isProfit = gain >= 0;
                                const signal = gain / bought >= 0.15 ? "🟢 Good time to sell" : gain / bought <= -0.10 ? "🔴 Wait — selling at a loss" : gain / bought >= 0.05 ? "🟡 Small profit — up to you" : "⚪ Near purchase price";
                                return (React.createElement("div", { style: { marginTop: 3 } },
                                    React.createElement("span", { style: { fontSize: 10, color: T.muted } },
                                        "Bought: ",
                                        React.createElement("span", { style: { fontFamily: "monospace", color: T.text } }, fmt(bought))),
                                    React.createElement("span", { style: { fontSize: 10, marginLeft: 8, color: isProfit ? T.green : T.red, fontFamily: "monospace" } },
                                        isProfit ? "+" : "",
                                        fmt(gain),
                                        " (",
                                        gainPct,
                                        "%)"),
                                    React.createElement("div", { style: { fontSize: 10, marginTop: 2 } }, signal)));
                            })()),
                        React.createElement("div", { style: { textAlign: "right", flexShrink: 0 } },
                            React.createElement("div", { style: { fontSize: 12, fontWeight: "bold", fontFamily: "monospace", color: T.text, marginBottom: 5 } }, fmt((assetPrices && assetPrices[p.id]) || p.baseCost)),
                            !isOwned ? React.createElement("button", { onClick: () => buyProp(p), style: { fontSize: 11, padding: "5px 11px", background: "rgba(0,255,136,0.1)", border: `1px solid ${T.green}`, borderRadius: D.brs, color: T.green, cursor: "pointer", fontWeight: "bold" } }, "Buy")
                                : React.createElement("button", { onClick: () => sellProp(p), style: { fontSize: 11, padding: "5px 11px", background: "rgba(255,71,87,0.1)", border: `1px solid ${T.red}`, borderRadius: D.brs, color: T.red, cursor: "pointer", fontWeight: "bold" } }, "Sell")))));
            }),
            React.createElement(IPOInvestSection, { owned: owned, qty: qty, setQty: setQty, wallet: wallet, setWalletRaw: setWalletRaw, showToast: showToast, setShowIPOProfile: setShowIPOProfile, applyNonDriveTax: applyNonDriveTax }),
            React.createElement("div", { style: { background: T.card, border: `1px solid ${T.cyan}33`, borderRadius: D.br, padding: "10px 12px", marginTop: 8, fontSize: 12, color: T.muted, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 } },
                React.createElement("span", null, "\uD83D\uDCB8 P2P Lending has its own tab now"),
                React.createElement("button", { onClick: () => setTab("lend"), style: { fontSize: 11, padding: "6px 12px", background: `${T.cyan}18`, border: `1px solid ${T.cyan}`, borderRadius: D.brs, color: T.cyan, cursor: "pointer", fontWeight: "bold", whiteSpace: "nowrap" } }, "Go to Lend \u2192")))),
        tab === "lend" && (React.createElement("div", null,
            bankruptcyData && bankruptcyData.status === "recovering" && (React.createElement("div", { style: { background: T.card, border: `1px solid ${T.red}`, borderRadius: D.br, padding: "12px 14px", marginBottom: 12, textAlign: "center" } },
                React.createElement("div", { style: { fontSize: 20, marginBottom: 4 } }, "\uD83D\uDD12"),
                React.createElement("div", { style: { fontWeight: "bold", fontSize: 13, color: T.red, marginBottom: 4 } }, "Lending Locked \u2014 Debt Recovery Mode"),
                React.createElement("div", { style: { fontSize: 12, color: T.muted } }, "Clear your debt first. Drive to repay \u2014 50% of each session goes to debt."))),
            openLoanCount > 0 && (React.createElement("div", { style: { background: "rgba(255,71,87,0.1)", border: `1px solid ${T.red}`, borderRadius: D.br, padding: "9px 12px", marginBottom: 10, fontSize: 12, color: T.red, display: "flex", gap: 8, alignItems: "center" } },
                React.createElement("i", { className: "ti ti-bell", style: { fontSize: 14 }, "aria-hidden": "true" }),
                openLoanCount,
                " loan ",
                openLoanCount === 1 ? "request" : "requests",
                " waiting for a lender!")),
            React.createElement(P2PMarketplace, { user: user, wallet: wallet, netWorth: netWorth, totalDrivingIncome: totalDrivingIncome, isRegistered: isRegistered, propValue: propValue, onWalletChange: setWalletRaw, showToast: showToast }))),
        tab === "tax" && (React.createElement("div", null,
            React.createElement("div", { style: { background: T.card, border: `1px solid ${T.orange}55`, borderRadius: D.br, padding: 14, marginBottom: 12 } },
                React.createElement("div", { style: { fontWeight: "bold", fontSize: 14, color: T.orange, marginBottom: 8 } }, "\uD83D\uDCCB Tax Summary"),
                React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 } },
                    React.createElement(DCard, { label: "Driving Income", value: fmt(totalDrivingIncome), color: T.green, icon: "ti-steering-wheel" }),
                    React.createElement(DCard, { label: "Total Tax Paid", value: fmt(totalTaxPaid), color: T.orange, icon: "ti-receipt-tax" })),
                React.createElement("div", { style: { fontSize: 12, color: T.muted, lineHeight: 1.8, background: T.surface, borderRadius: D.brs, padding: "10px 12px" } },
                    React.createElement("strong", { style: { color: T.text } }, "Status:"),
                    " ",
                    isRegistered ? React.createElement("span", { style: { color: T.gold } },
                        "\uD83C\uDFE2 Registered \u2014 ",
                        companyName) : React.createElement("span", { style: { color: T.orange } }, "Unregistered Individual"),
                    React.createElement("br", null),
                    React.createElement("strong", { style: { color: T.text } }, "Drive income tax:"),
                    " ",
                    isRegistered
                        ? React.createElement("span", { style: { color: T.green } },
                            "30% on profit after deductions (if > ",
                            fmt(COMPANY_TAX_THRESHOLD),
                            ")")
                        : React.createElement("span", { style: { color: T.orange } }, "40% flat rate"),
                    React.createElement("br", null),
                    React.createElement("strong", { style: { color: T.text } }, "Non-drive income tax"),
                    " (assets, lending, IPO): ",
                    isRegistered ? React.createElement("span", { style: { color: T.green } }, "30% on gains") : React.createElement("span", { style: { color: T.orange } }, "40% on gains"))),
            React.createElement("div", { style: { background: T.card, border: `1px solid ${T.border}`, borderRadius: D.br, padding: 14, marginBottom: 12 } },
                React.createElement("div", { style: { fontWeight: "bold", fontSize: 13, color: T.cyan, marginBottom: 8 } }, "\uD83D\uDCD0 How Your Tax Is Calculated"),
                React.createElement("div", { style: { fontSize: 12, color: T.muted, lineHeight: 1.9, background: T.surface, borderRadius: D.brs, padding: "10px 12px", fontFamily: "monospace" } }, isRegistered
                    ? React.createElement(React.Fragment, null,
                        React.createElement("span", { style: { color: T.cyan } }, "Driving Income"),
                        " \u2212 Your Apportioned Expenses = Taxable Income",
                        React.createElement("br", null),
                        React.createElement("span", { style: { color: T.orange } },
                            "Tax Due = Taxable Income \u00D7 30% (only if Taxable Income > ",
                            fmt(COMPANY_TAX_THRESHOLD),
                            ")"),
                        React.createElement("br", null),
                        React.createElement("span", { style: { color: T.green } },
                            "Below ",
                            fmt(COMPANY_TAX_THRESHOLD),
                            " \u2014 no tax at all"))
                    : React.createElement(React.Fragment, null,
                        React.createElement("span", { style: { color: T.orange } }, "Tax = Driving Income \u00D7 40%"),
                        React.createElement("br", null),
                        React.createElement("span", { style: { color: T.green } }, "Net = Driving Income \u00D7 60%")))),
            React.createElement("div", { style: { background: T.card, border: `1px solid ${T.border}`, borderRadius: D.br, padding: 14 } },
                React.createElement("div", { style: { fontWeight: "bold", fontSize: 13, color: T.gold, marginBottom: 8 } }, "\uD83C\uDFE2 Valuation App Progress"),
                React.createElement("div", { style: { marginBottom: 6, display: "flex", justifyContent: "space-between", fontSize: 12 } },
                    React.createElement("span", { style: { color: T.muted } }, "Driving income"),
                    React.createElement("span", { style: { fontFamily: "monospace", color: T.text } },
                        fmt(totalDrivingIncome),
                        " / ",
                        fmt(VALUATION_UNLOCK))),
                React.createElement("div", { style: { height: 8, background: T.surface, borderRadius: 4, marginBottom: 8 } },
                    React.createElement("div", { style: { height: "100%", width: Math.min(100, (totalDrivingIncome / VALUATION_UNLOCK) * 100) + "%", background: `linear-gradient(90deg,${T.orange},${T.gold})`, borderRadius: 4 } })),
                valuationUnlocked ? React.createElement("div", { style: { fontSize: 12, color: T.green, fontWeight: "bold" } }, "\u2713 Valuation App unlocked! Access it from the header.") : React.createElement("div", { style: { fontSize: 12, color: T.muted } },
                    "Earn ",
                    fmt(VALUATION_UNLOCK - totalDrivingIncome),
                    " more in driving income to unlock.")),
            isRegistered && (React.createElement("div", { style: { marginTop: 14 } },
                React.createElement("div", { style: { fontWeight: "bold", fontSize: 13, color: T.cyan, marginBottom: 8 } },
                    "\uD83D\uDCD2 ",
                    companyName,
                    " \u2014 Expense Ledger"),
                React.createElement("div", { style: { fontSize: 11, color: T.muted, marginBottom: 10, lineHeight: 1.6 } }, "Every expense you apportion after each drive is permanently recorded here. This is your company's official financial history \u2014 proof of your operational costs."),
                companyLedger.length === 0 ? (React.createElement("div", { style: { background: T.card, border: `1px solid ${T.border}`, borderRadius: D.br, padding: 20, textAlign: "center", color: T.muted, fontSize: 12 } }, "No expense records yet. Complete a drive and apportion your expenses to build your company ledger.")) : (React.createElement("div", null,
                    React.createElement("div", { style: { background: T.card, border: `1px solid ${T.gold}44`, borderRadius: D.br, padding: 12, marginBottom: 10 } },
                        React.createElement("div", { style: { fontWeight: "bold", fontSize: 12, color: T.gold, marginBottom: 8 } }, "Cumulative Company Summary"),
                        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 } }, [
                            { l: "Total Drive Income", v: fmt(companyLedger.reduce((s, r) => s + r.driveIncome, 0)), c: T.green },
                            { l: "Total Expenses", v: fmt(companyLedger.reduce((s, r) => s + r.totalExpenses, 0)), c: T.orange },
                            { l: "Total Tax Paid", v: fmt(companyLedger.reduce((s, r) => s + r.taxPaid, 0)), c: T.red },
                            { l: "Records", v: companyLedger.length + " drives", c: T.cyan },
                        ].map(m => (React.createElement("div", { key: m.l, style: { background: T.surface, borderRadius: D.brs, padding: "7px 9px" } },
                            React.createElement("div", { style: { fontSize: 9, color: T.muted, marginBottom: 2 } }, m.l),
                            React.createElement("div", { style: { fontSize: 12, fontWeight: "bold", fontFamily: "monospace", color: m.c } }, m.v)))))),
                    companyLedger.map((r, i) => (React.createElement("div", { key: i, style: { background: T.card, border: `1px solid ${T.border}`, borderRadius: D.br, padding: 12, marginBottom: 8 } },
                        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 4 } },
                            React.createElement("div", { style: { fontWeight: "bold", fontSize: 12, color: T.text } },
                                "Drive #",
                                companyLedger.length - i),
                            React.createElement("div", { style: { fontSize: 10, color: T.muted } },
                                r.date,
                                " \u00B7 ",
                                r.time,
                                " \u00B7 Day ",
                                r.day)),
                        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, marginBottom: 8 } },
                            React.createElement(Row, { label: "Drive income", val: fmt(r.driveIncome), color: T.green }),
                            React.createElement(Row, { label: "Total deducted", val: "-" + fmt(r.totalExpenses), color: T.orange }),
                            React.createElement(Row, { label: "Taxable income", val: fmt(r.taxableIncome), color: T.text }),
                            React.createElement(Row, { label: "Tax paid", val: fmt(r.taxPaid), color: r.taxPaid > 0 ? T.red : T.green })),
                        r.expenses && Object.entries(r.expenses).filter(([, v]) => parseFloat(v) > 0).length > 0 && (React.createElement("div", { style: { background: T.surface, borderRadius: D.brs, padding: "8px 10px" } },
                            React.createElement("div", { style: { fontSize: 10, color: T.muted, marginBottom: 5, fontWeight: "bold" } }, "Expense breakdown:"),
                            [
                                { k: "salary", l: "Staff Salaries" },
                                { k: "rent", l: "Office Rent" },
                                { k: "rd", l: "R&D" },
                                { k: "debt", l: "Debt Repayment" },
                                { k: "misc", l: "Miscellaneous" },
                            ].filter(e => parseFloat(r.expenses[e.k]) > 0).map(e => (React.createElement("div", { key: e.k, style: { display: "flex", justifyContent: "space-between", fontSize: 11, padding: "2px 0" } },
                                React.createElement("span", { style: { color: T.muted } }, e.l),
                                React.createElement("span", { style: { fontFamily: "monospace", color: T.orange } },
                                    "-",
                                    fmt(parseFloat(r.expenses[e.k]))))))))))))))))),
        tab === "leaderboard" && (React.createElement(GlobalLeaderboard, { currentUser: user, netWorth: netWorth, totalDrivingIncome: totalDrivingIncome, totalTaxPaid: totalTaxPaid, companyName: companyName })),
        tab === "challenges" && (React.createElement(ChallengesScreen, { currentUser: user, netWorth: netWorth, streak: streak, totalChallengesWon: totalChallengesWon, onChallengeWon: () => setTotalChallengesWon(c => c + 1) })),
        tab === "ipo" && (React.createElement(IPOScreen, { netWorth: netWorth, wallet: wallet, companyName: companyName, isRegistered: isRegistered, ipoData: ipoData, valuationUnlocked: valuationUnlocked, onLaunchIPO: handleLaunchIPO, onSellShares: handleSellShares, onBuyback: handleBuyback })),
        tab === "runner" && (React.createElement(MarketRunner, { wallet: wallet, onWalletChange: v => setWalletRaw(v), onBillPaid: amt => setTotalBills(t => t + amt), onExitRoad: handleExitRoad, propIncome: propIncome, carSkin: carSkin, completedLessons: completedLessons, onLearnComplete: handleLearnComplete, isRegistered: isRegistered }))));
    div >
    ;
    ;
}

export default App
