import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("http://localhost:8000/api/dashboard")
      .then(res => res.json())
      .then(data => {
        setSummary(data)
        setLoading(false)
      })
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {loading ? (
        <p>Loading dashboard...</p>
      ) : (
        <>
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold">Total PnL</h2>
              <p className="text-xl font-bold text-green-600">
                ₹{summary?.total_pnl.toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold">Open Positions</h2>
              <p className="text-xl font-bold">{summary?.open_positions}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold">Strategies Deployed</h2>
              <p className="text-xl font-bold">{summary?.strategies_active}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold">Followed Traders</h2>
              <p className="text-xl font-bold">{summary?.traders_followed}</p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
