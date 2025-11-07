"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { SidebarNav } from "./sidebar-nav"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const isLoginPage = pathname === "/login"

  useEffect(() => {
    if (!isLoading && !user && !isLoginPage) {
      router.push("/login")
    }
  }, [user, isLoading, isLoginPage, router])

  if (isLoginPage) {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarNav />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
