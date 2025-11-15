"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Clock, CheckCircle, XCircle, Plus, Minus, Trash2 } from "lucide-react"
import type { Order, MenuItem } from "@/lib/types"

export default function CommandesPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [newOrder, setNewOrder] = useState({
    tableNumber: 1,
    notes: "",
    items: [] as { menuItemId: string; menuItemName: string; quantity: number; price: number; notes: string }[],
  })

  useEffect(() => {
    fetchOrders()
    fetchMenuItems()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders")
      const data = await response.json()
      const transformedOrders = data.map((order: any) => ({
        id: order.id,
        tableNumber: order.table_number,
        status: order.status,
        total: order.total,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        items:
          order.order_items?.map((item: any) => ({
            menuItemId: item.menu_item_id,
            menuItemName: item.menu_items?.name || "Item",
            quantity: item.quantity,
            price: item.price,
            notes: item.notes,
          })) || [],
      }))
      setOrders(transformedOrders)
    } catch (error) {
      console.error("Erreur lors du chargement des commandes:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMenuItems = async () => {
    try {
      const response = await fetch("/api/menus")
      const data = await response.json()
      setMenuItems(data)
    } catch (error) {
      console.error("Erreur lors du chargement des menus:", error)
    }
  }

  const updateOrderStatus = async (orderId: string, status: Order["status"]) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      const updated = await response.json()
      const transformedOrder = {
        id: updated.id,
        tableNumber: updated.table_number,
        status: updated.status,
        total: updated.total,
        createdAt: updated.created_at,
        updatedAt: updated.updated_at,
        items:
          updated.order_items?.map((item: any) => ({
            menuItemId: item.menu_item_id,
            menuItemName: item.menu_items?.name || "Item",
            quantity: item.quantity,
            price: item.price,
            notes: item.notes,
          })) || [],
      }
      setOrders(orders.map((order) => (order.id === transformedOrder.id ? transformedOrder : order)))
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error)
    }
  }

  const addItemToOrder = (menuItem: MenuItem) => {
    const existingItem = newOrder.items.find((item) => item.menuItemId === menuItem.id)
    if (existingItem) {
      setNewOrder({
        ...newOrder,
        items: newOrder.items.map((item) =>
          item.menuItemId === menuItem.id ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      })
    } else {
      setNewOrder({
        ...newOrder,
        items: [
          ...newOrder.items,
          {
            menuItemId: menuItem.id,
            menuItemName: menuItem.name,
            quantity: 1,
            price: menuItem.price,
            notes: "",
          },
        ],
      })
    }
  }

  const updateItemQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      setNewOrder({
        ...newOrder,
        items: newOrder.items.filter((item) => item.menuItemId !== menuItemId),
      })
    } else {
      setNewOrder({
        ...newOrder,
        items: newOrder.items.map((item) => (item.menuItemId === menuItemId ? { ...item, quantity } : item)),
      })
    }
  }

  const removeItemFromOrder = (menuItemId: string) => {
    setNewOrder({
      ...newOrder,
      items: newOrder.items.filter((item) => item.menuItemId !== menuItemId),
    })
  }

  const calculateTotal = () => {
    return newOrder.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const handleSubmitOrder = async () => {
    if (newOrder.items.length === 0) {
      alert("Veuillez ajouter au moins un item à la commande")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableNumber: newOrder.tableNumber,
          notes: newOrder.notes,
          total: calculateTotal(),
          items: newOrder.items,
        }),
      })

      if (response.ok) {
        // Reset form
        setNewOrder({
          tableNumber: 1,
          notes: "",
          items: [],
        })
        setIsDialogOpen(false)
        // Refresh orders
        await fetchOrders()
      } else {
        const error = await response.json()
        alert(`Erreur: ${error.error}`)
      }
    } catch (error) {
      console.error("Erreur lors de la création de la commande:", error)
      alert("Erreur lors de la création de la commande")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusBadge = (status: Order["status"]) => {
    const variants = {
      "en attente": { variant: "secondary" as const, icon: Clock },
      "en préparation": { variant: "default" as const, icon: Clock },
      prêt: { variant: "default" as const, icon: CheckCircle },
      servi: { variant: "default" as const, icon: CheckCircle },
      payé: { variant: "default" as const, icon: CheckCircle },
    }

    const config = variants[status]
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    )
  }

  const menuByCategory = menuItems.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = []
      acc[item.category].push(item)
      return acc
    },
    {} as Record<string, MenuItem[]>,
  )

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Gestion des Commandes</h1>
          <p className="text-muted-foreground mt-1">Suivez et gérez toutes les commandes en cours</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nouvelle Commande
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer une Nouvelle Commande</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Table Number */}
              <div className="space-y-2">
                <Label htmlFor="tableNumber">Numéro de Table</Label>
                <Input
                  id="tableNumber"
                  type="number"
                  min="1"
                  value={newOrder.tableNumber}
                  onChange={(e) => setNewOrder({ ...newOrder, tableNumber: Number.parseInt(e.target.value) || 1 })}
                />
              </div>

              {/* Menu Items Selection */}
              <div className="space-y-4">
                <Label>Sélectionner les Items</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  {Object.entries(menuByCategory).map(([category, items]) => (
                    <div key={category} className="space-y-2">
                      <h3 className="font-semibold text-sm uppercase text-muted-foreground">{category}</h3>
                      <div className="space-y-2">
                        {items.map((item) => (
                          <Button
                            key={item.id}
                            variant="outline"
                            className="w-full justify-between h-auto py-3 bg-transparent"
                            onClick={() => addItemToOrder(item)}
                            disabled={!item.available}
                          >
                            <div className="text-left">
                              <div className="font-medium">{item.name}</div>
                              <div className="text-xs text-muted-foreground">{item.description}</div>
                            </div>
                            <div className="font-semibold">{item.price.toFixed(2)} €</div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Items */}
              {newOrder.items.length > 0 && (
                <div className="space-y-2">
                  <Label>Items Sélectionnés</Label>
                  <div className="space-y-2">
                    {newOrder.items.map((item) => (
                      <div key={item.menuItemId} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{item.menuItemName}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.price.toFixed(2)} € × {item.quantity}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => updateItemQuantity(item.menuItemId, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => updateItemQuantity(item.menuItemId, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => removeItemFromOrder(item.menuItemId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="font-semibold min-w-[80px] text-right">
                          {(item.price * item.quantity).toFixed(2)} €
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-primary">{calculateTotal().toFixed(2)} €</span>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optionnel)</Label>
                <Textarea
                  id="notes"
                  placeholder="Instructions spéciales..."
                  value={newOrder.notes}
                  onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                  Annuler
                </Button>
                <Button onClick={handleSubmitOrder} disabled={isSubmitting || newOrder.items.length === 0}>
                  {isSubmitting ? "Création..." : "Créer la Commande"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <Card key={order.id} className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-card-foreground">Table {order.tableNumber}</CardTitle>
                {getStatusBadge(order.status)}
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{order.tableNumber}</span>
                <span>
                  {new Date(order.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-card-foreground">
                      {item.quantity} x {item.menuItemName}
                    </span>
                    <span className="font-medium text-primary">{(item.price * item.quantity).toFixed(2)} €</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-3">
                <div className="flex justify-between font-semibold">
                  <span className="text-card-foreground">Total</span>
                  <span className="text-primary">{order.total.toFixed(2)} €</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Serveur: {order.serverName}</p>
              </div>

              <div className="space-y-2">
                <Select
                  value={order.status}
                  onValueChange={(value) => updateOrderStatus(order.id, value as Order["status"])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en attente">En attente</SelectItem>
                    <SelectItem value="en préparation">En préparation</SelectItem>
                    <SelectItem value="prêt">Prêt</SelectItem>
                    <SelectItem value="servi">Servi</SelectItem>
                    <SelectItem value="payé">Payé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {orders.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <XCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-card-foreground">Aucune commande</p>
            <p className="text-sm text-muted-foreground">Les commandes apparaîtront ici</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
