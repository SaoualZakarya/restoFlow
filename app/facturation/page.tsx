"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Receipt, CreditCard, Banknote, FileText } from "lucide-react"
import type { Invoice } from "@/lib/types"

export default function FacturationPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      const response = await fetch("/api/invoices")
      const data = await response.json()
      setInvoices(data)
    } catch (error) {
      console.error("Erreur lors du chargement des factures:", error)
    } finally {
      setLoading(false)
    }
  }

  const getPaymentIcon = (method: Invoice["paymentMethod"]) => {
    const icons = {
      carte: CreditCard,
      espèces: Banknote,
      chèque: FileText,
    }
    return icons[method]
  }

  const totalRevenue = invoices.filter((inv) => inv.status === "payée").reduce((sum, inv) => sum + inv.total, 0)

  const totalTax = invoices.filter((inv) => inv.status === "payée").reduce((sum, inv) => sum + inv.tax, 0)

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Facturation</h1>
        <p className="text-muted-foreground mt-1">Consultez toutes les factures et paiements</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Revenu Total</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{totalRevenue.toFixed(2)} €</div>
            <p className="text-xs text-muted-foreground mt-1">Factures payées</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">TVA Collectée</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{totalTax.toFixed(2)} €</div>
            <p className="text-xs text-muted-foreground mt-1">10% sur les ventes</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Nombre de Factures</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{invoices.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Total des factures</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Historique des Factures</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Facture</TableHead>
                <TableHead>Commande</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Montant HT</TableHead>
                <TableHead>TVA</TableHead>
                <TableHead>Total TTC</TableHead>
                <TableHead>Paiement</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => {
                const PaymentIcon = getPaymentIcon(invoice.paymentMethod)
                return (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.orderId}</TableCell>
                    <TableCell>{new Date(invoice.createdAt).toLocaleDateString("fr-FR")}</TableCell>
                    <TableCell>{invoice.amount.toFixed(2)} €</TableCell>
                    <TableCell>{invoice.tax.toFixed(2)} €</TableCell>
                    <TableCell className="font-semibold">{invoice.total.toFixed(2)} €</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <PaymentIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="capitalize">{invoice.paymentMethod}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={invoice.status === "payée" ? "default" : "secondary"}>{invoice.status}</Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
