import React, { useState } from 'react'
import './App.css'

// Sample portfolio data for Joe Root
const portfolioData = {
  user: {
    name: 'Graham Gooch',
    email: 'graham.gooch@example.com',
    totalValue: 125750.50,
    totalGain: 8750.50,
    gainPercentage: 7.48
  },
  stocks: [
    {
      symbol: 'AAPL',
      company: 'Apple Inc.',
      shares: 50,
      avgPrice: 145.20,
      currentPrice: 158.75,
      totalValue: 7937.50,
      gain: 677.50,
      gainPercentage: 9.33,
      sector: 'Technology'
    },
    {
      symbol: 'MSFT',
      company: 'Microsoft Corporation',
      shares: 30,
      avgPrice: 280.50,
      currentPrice: 315.20,
      totalValue: 9456.00,
      gain: 1041.00,
      gainPercentage: 12.37,
      sector: 'Technology'
    },
    {
      symbol: 'GOOGL',
      company: 'Alphabet Inc.',
      shares: 25,
      avgPrice: 120.80,
      currentPrice: 135.45,
      totalValue: 3386.25,
      gain: 366.25,
      gainPercentage: 12.13,
      sector: 'Technology'
    },
    {
      symbol: 'TSLA',
      company: 'Tesla, Inc.',
      shares: 15,
      avgPrice: 180.30,
      currentPrice: 165.80,
      totalValue: 2487.00,
      gain: -217.50,
      gainPercentage: -8.04,
      sector: 'Automotive'
    },
    {
      symbol: 'JPM',
      company: 'JPMorgan Chase & Co.',
      shares: 40,
      avgPrice: 140.25,
      currentPrice: 152.30,
      totalValue: 6092.00,
      gain: 482.00,
      gainPercentage: 8.59,
      sector: 'Financial'
    },
    {
      symbol: 'JNJ',
      company: 'Johnson & Johnson',
      shares: 35,
      avgPrice: 165.40,
      currentPrice: 172.15,
      totalValue: 6025.25,
      gain: 236.25,
      gainPercentage: 4.08,
      sector: 'Healthcare'
    },
    {
      symbol: 'AMZN',
      company: 'Amazon.com, Inc.',
      shares: 20,
      avgPrice: 320.75,
      currentPrice: 345.60,
      totalValue: 6912.00,
      gain: 497.00,
      gainPercentage: 7.75,
      sector: 'Consumer Discretionary'
    },
    {
      symbol: 'NVDA',
      company: 'NVIDIA Corporation',
      shares: 12,
      avgPrice: 450.20,
      currentPrice: 520.30,
      totalValue: 6243.60,
      gain: 841.20,
      gainPercentage: 15.58,
      sector: 'Technology'
    }
  ]
}

// Market indices data
const marketIndices = [
  { name: 'S&P 500', value: '4,185.48', change: '+0.63%', positive: true },
  { name: 'NASDAQ', value: '12,888.95', change: '+1.02%', positive: true },
  { name: 'DOW', value: '33,886.47', change: '-0.12%', positive: false },
  { name: 'NIFTY 50', value: '19,425.35', change: '+0.85%', positive: true },
  { name: 'SENSEX', value: '64,363.78', change: '+0.72%', positive: true },
  { name: 'FTSE 100', value: '7,456.49', change: '+0.45%', positive: true }
]

// Navigation menu data
const middleLayerMenus = [
  'Stocks', 'Mutual Funds', 'F & O', 'Commodity', 'IPO', 'FD/Bonds', 'Insurance', 'NPS'
]

const bottomLayerMenus = {
  'Stocks': ['Watch List', 'Portfolio', 'Place Order', 'Order Book', 'Trade Book', 'Funds', 'Reports', 'Demat Holdings'],
  'Mutual Funds': ['My Funds', 'Explore', 'SIP', 'Lumpsum', 'Switch', 'Reports'],
  'F & O': ['Positions', 'Orders', 'Trades', 'Margin', 'Reports'],
  'Commodity': ['Positions', 'Orders', 'Trades', 'Reports'],
  'IPO': ['Active IPOs', 'My Applications', 'Reports'],
  'FD/Bonds': ['My FDs', 'Bonds', 'Reports'],
  'Insurance': ['My Policies', 'Buy Insurance', 'Claims', 'Reports'],
  'NPS': ['My NPS', 'Contribute', 'Reports']
}

// Sector color mapping
const sectorColors = {
  'Technology': '#e0f2fe', // Light blue
  'Financial': '#f0fdf4', // Light green
  'Healthcare': '#fef3c7', // Light yellow
  'Consumer Discretionary': '#fce7f3', // Light pink
  'Automotive': '#f3e8ff' // Light purple
}

// Portfolio statistics colors
const statsColors = [
  '#fef3c7', // Light yellow
  '#e0f2fe', // Light blue
  '#f0fdf4', // Light green
  '#fce7f3'  // Light pink
]

function App() {
  const { user, stocks } = portfolioData
  const [selectedMiddleMenu, setSelectedMiddleMenu] = useState('Stocks')
  const [selectedBottomMenu, setSelectedBottomMenu] = useState('Portfolio')
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatPercentage = (percentage) => {
    return `${percentage > 0 ? '+' : ''}${percentage.toFixed(2)}%`
  }

  // Group stocks by sector
  const stocksBySector = stocks.reduce((acc, stock) => {
    if (!acc[stock.sector]) {
      acc[stock.sector] = []
    }
    acc[stock.sector].push(stock)
    return acc
  }, {})

  // Calculate sector totals
  const sectorTotals = Object.keys(stocksBySector).map(sector => {
    const sectorStocks = stocksBySector[sector]
    const totalValue = sectorStocks.reduce((sum, stock) => sum + stock.totalValue, 0)
    const totalGain = sectorStocks.reduce((sum, stock) => sum + stock.gain, 0)
    const totalGainPercentage = (totalGain / (totalValue - totalGain)) * 100

    return {
      sector,
      totalValue,
      totalGain,
      totalGainPercentage,
      stockCount: sectorStocks.length
    }
  })

  // Check if portfolio should be displayed
  const shouldShowPortfolio = selectedMiddleMenu === 'Stocks' && selectedBottomMenu === 'Portfolio'

  // Calculate financial metrics
  const totalInvested = user.totalValue - user.totalGain
  const currentPortfolioValue = user.totalValue
  const totalGainLoss = user.totalGain
  const absoluteReturn = user.gainPercentage
  const xirr = 8.75 // Sample XIRR value

  return (
    <div className="app">
      {/* Top Navigation Bar */}
      <nav className="top-nav">
        {/* Top Layer */}
        <div className="nav-top-layer">
          <div className="nav-left">
            <div className="brand">
              <h1 className="brand-text">Stockerr</h1>
            </div>
            <div className="market-indices">
              {marketIndices.map((index, idx) => (
                <div key={idx} className="index-item">
                  <span className="index-name">{index.name}</span>
                  <span className="index-value">{index.value}</span>
                  <span className={`index-change ${index.positive ? 'positive' : 'negative'}`}>
                    {index.change}
                  </span>
                </div>
              ))}
            </div>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search stocks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button className="search-btn">🔍</button>
            </div>
          </div>
          <div className="nav-right">
            <div className="user-menu">
              <button 
                className="user-button"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
              >
                <div className="user-avatar">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face" 
                    alt="Joe Root"
                    className="avatar-image"
                  />
                </div>
                <span className="user-name">{user.name}</span>
                <span className="dropdown-arrow">▼</span>
              </button>
              {showUserDropdown && (
                <div className="user-dropdown">
                  <div className="dropdown-item">Profile</div>
                  <div className="dropdown-item">Settings</div>
                  <div className="dropdown-item">Help</div>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-item logout">Logout</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Middle Layer */}
        <div className="nav-middle-layer">
          <div className="middle-menu">
            {middleLayerMenus.map((menu, index) => (
              <button
                key={index}
                className={`middle-menu-item ${selectedMiddleMenu === menu ? 'active' : ''}`}
                onClick={() => {
                  setSelectedMiddleMenu(menu)
                  // Reset bottom menu to first item when middle menu changes
                  setSelectedBottomMenu(bottomLayerMenus[menu]?.[0] || '')
                }}
              >
                {menu}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Layer */}
        <div className="nav-bottom-layer">
          <div className="bottom-menu">
            {bottomLayerMenus[selectedMiddleMenu]?.map((menu, index) => (
              <button 
                key={index} 
                className={`bottom-menu-item ${selectedBottomMenu === menu ? 'active' : ''}`}
                onClick={() => setSelectedBottomMenu(menu)}
              >
                {menu}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Financial Metrics Layer */}
      <div className="financial-metrics-layer">
        <div className="metrics-container">
          <div className="metric-item">
            <span className="metric-label">Total Invested</span>
            <span className="metric-value">{formatCurrency(totalInvested)}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Current Portfolio Value</span>
            <span className="metric-value">{formatCurrency(currentPortfolioValue)}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Total Gain/Loss</span>
            <span className={`metric-value ${totalGainLoss >= 0 ? 'positive' : 'negative'}`}>
              {formatCurrency(totalGainLoss)}
            </span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Absolute Return</span>
            <span className={`metric-value ${absoluteReturn >= 0 ? 'positive' : 'negative'}`}>
              {formatPercentage(absoluteReturn)}
            </span>
          </div>
          <div className="metric-item">
            <span className="metric-label">XIRR</span>
            <span className="metric-value positive">{formatPercentage(xirr)}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {shouldShowPortfolio ? (
          <>
            {/* Sector Tiles */}
            <div className="sector-tiles-container">
              <div className="sector-tiles">
                {sectorTotals.map((sectorData, index) => (
                  <div 
                    key={index} 
                    className="sector-tile"
                    style={{ backgroundColor: sectorColors[sectorData.sector] || '#f8fafc' }}
                  >
                    <div className="sector-tile-header">
                      <h4>{sectorData.sector}</h4>
                      <span className="stock-count">{sectorData.stockCount} stocks</span>
                    </div>
                    <div className="sector-tile-values">
                      <p className="sector-total">{formatCurrency(sectorData.totalValue)}</p>
                      <p className={`sector-gain ${sectorData.totalGainPercentage >= 0 ? 'positive' : 'negative'}`}>
                        {formatCurrency(sectorData.totalGain)} ({formatPercentage(sectorData.totalGainPercentage)})
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="sector-holdings">
              {Object.keys(stocksBySector).map((sector, sectorIndex) => (
                <div key={sectorIndex} className="sector-section">
                  <div 
                    className="sector-title"
                    style={{ backgroundColor: sectorColors[sector] || '#f8fafc' }}
                  >
                    <h3>{sector}</h3>
                    <div className="sector-summary">
                      <span>{stocksBySector[sector].length} stocks</span>
                      <span className="sector-total-value">
                        {formatCurrency(stocksBySector[sector].reduce((sum, stock) => sum + stock.totalValue, 0))}
                      </span>
                    </div>
                  </div>
                  
                  <div className="portfolio-table">
                    <div className="table-container">
                      <table>
                        <thead>
                          <tr>
                            <th>Symbol</th>
                            <th>Company</th>
                            <th>Shares</th>
                            <th>Avg Price</th>
                            <th>Current Price</th>
                            <th>Total Value</th>
                            <th>Gain/Loss</th>
                            <th>% Change</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stocksBySector[sector].map((stock, index) => (
                            <tr key={index}>
                              <td className="symbol">{stock.symbol}</td>
                              <td className="company">{stock.company}</td>
                              <td className="shares">{stock.shares}</td>
                              <td className="price">{formatCurrency(stock.avgPrice)}</td>
                              <td className="price">{formatCurrency(stock.currentPrice)}</td>
                              <td className="value">{formatCurrency(stock.totalValue)}</td>
                              <td className={`gain ${stock.gain >= 0 ? 'positive' : 'negative'}`}>
                                {formatCurrency(stock.gain)}
                              </td>
                              <td className={`percentage ${stock.gainPercentage >= 0 ? 'positive' : 'negative'}`}>
                                {formatPercentage(stock.gainPercentage)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="portfolio-stats">
              <h3>Portfolio Statistics</h3>
              <div className="stats-grid">
                <div 
                  className="stat-card"
                  style={{ backgroundColor: statsColors[0] }}
                >
                  <h4>Total Stocks</h4>
                  <p>{stocks.length}</p>
                </div>
                <div 
                  className="stat-card"
                  style={{ backgroundColor: statsColors[1] }}
                >
                  <h4>Top Performer</h4>
                  <p>{stocks.reduce((max, stock) => 
                    stock.gainPercentage > max.gainPercentage ? stock : max
                  ).symbol} ({formatPercentage(stocks.reduce((max, stock) => 
                    stock.gainPercentage > max.gainPercentage ? stock : max
                  ).gainPercentage)})</p>
                </div>
                <div 
                  className="stat-card"
                  style={{ backgroundColor: statsColors[2] }}
                >
                  <h4>Largest Position</h4>
                  <p>{stocks.reduce((max, stock) => 
                    stock.totalValue > max.totalValue ? stock : max
                  ).symbol} ({formatCurrency(stocks.reduce((max, stock) => 
                    stock.totalValue > max.totalValue ? stock : max
                  ).totalValue)})</p>
                </div>
                <div 
                  className="stat-card"
                  style={{ backgroundColor: statsColors[3] }}
                >
                  <h4>Average Return</h4>
                  <p>{formatPercentage(stocks.reduce((sum, stock) => 
                    sum + stock.gainPercentage, 0) / stocks.length)}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="construction-message">
            <div className="construction-content">
              <h1>🚧</h1>
              <h2>Page Under Construction</h2>
              <p>This feature is currently being developed. Please check back later!</p>
              <div className="construction-details">
                <p><strong>Selected:</strong> {selectedMiddleMenu} → {selectedBottomMenu}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
