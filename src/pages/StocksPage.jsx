import React, { useEffect, useState } from 'react'

function StocksPage() {
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    async function fetchStocks() {
      try {
        setLoading(true)
        setError('')
        const response = await fetch('/api/stocks/')
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`)
        }
        const data = await response.json()
        if (isMounted) {
          const stocksArray = data?.data || []
          setStocks(stocksArray)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load stocks')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchStocks()
    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return (
      <div className="construction-message">
        <div className="construction-content">
          <h2>Loading stocks...</h2>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="construction-message">
        <div className="construction-content">
          <h2>Could not load stocks</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!stocks.length) {
    return (
      <div className="construction-message">
        <div className="construction-content">
          <h2>No stocks found</h2>
          <p>The API returned an empty list.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="portfolio-table">
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Name</th>
              <th>Exchange</th>
              <th>Sector</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((s, idx) => (
              <tr key={idx}>
                <td className="symbol">{s.symbol || s.ticker || '-'}</td>
                <td className="company">{s.name || s.company || '-'}</td>
                <td className="exchange">{s.exchange || '-'}</td>
                <td className="sector">{s.sector || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StocksPage


