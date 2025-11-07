"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DashboardStats } from "@/lib/types"
import { TrendingUp, ShoppingCart, Calendar, DollarSign } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/dashboard/stats")
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !stats) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    )
  }

  const statCards = [
    {
      title: "Revenu du Jour",
      value: `${stats.todayRevenue.toFixed(2)} €`,
      icon: DollarSign,
      trend: "+12.5%",
    },
    {
      title: "Commandes",
      value: stats.todayOrders.toString(),
      icon: ShoppingCart,
      trend: "+8.2%",
    },
    {
      title: "Réservations",
      value: stats.todayReservations.toString(),
      icon: Calendar,
      trend: "+15.3%",
    },
    {
      title: "Commandes Actives",
      value: stats.activeOrders.toString(),
      icon: TrendingUp,
      trend: "En temps réel",
    },
  ]

  return (
    <div className="flex-1 space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Tableau de Bord</h1>
        <p className="text-muted-foreground mt-1">Vue d'ensemble de votre restaurant</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
                <p className="text-xs text-primary mt-1">{stat.trend}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Revenu par Jour</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Derniers 7 jours</p>
          </CardHeader>
          <CardContent className="pt-4 ">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={stats.revenueByDay} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis
                  dataKey="date"
                  stroke="#ffffff"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#ffffff" }}
                />
                <YAxis
                  stroke="#ffffff"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}€`}
                  tick={{ fill: "#ffffff" }}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--accent))", opacity: 0.1 }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "#ffffff",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  labelStyle={{
                    color: "#ffffff",
                    fontWeight: 600,
                    marginBottom: "4px",
                  }}
                  formatter={(value: number) => [`${value.toFixed(2)} €`, "Revenu"]}
                />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Plats Populaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.popularItems.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium text-card-foreground">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-primary">{item.count} ventes</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Statistiques Clés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Valeur Moyenne Commande</p>
              <p className="text-2xl font-bold text-card-foreground">{stats.averageOrderValue.toFixed(2)} €</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Commandes Aujourd'hui</p>
              <p className="text-2xl font-bold text-card-foreground">{stats.todayOrders}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Taux d'Occupation</p>
              <p className="text-2xl font-bold text-card-foreground">78%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
