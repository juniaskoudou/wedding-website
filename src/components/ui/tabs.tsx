"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type TabsContextValue = {
  value: string
  setValue: (v: string) => void
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

function useTabs() {
  const ctx = React.useContext(TabsContext)
  if (!ctx) throw new Error("Tabs components must be used within <Tabs>")
  return ctx
}

function Tabs({
  defaultValue,
  value: controlled,
  onValueChange,
  className,
  children,
}: {
  defaultValue?: string
  value?: string
  onValueChange?: (v: string) => void
  className?: string
  children: React.ReactNode
}) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue ?? "")
  const value = controlled ?? uncontrolled
  const setValue = React.useCallback(
    (v: string) => {
      if (controlled === undefined) setUncontrolled(v)
      onValueChange?.(v)
    },
    [controlled, onValueChange]
  )
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

function TabsList({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("inline-flex items-center gap-1 border-b border-border", className)}>
      {children}
    </div>
  )
}

function TabsTrigger({
  value,
  className,
  children,
}: {
  value: string
  className?: string
  children: React.ReactNode
}) {
  const { value: active, setValue } = useTabs()
  const isActive = active === value
  return (
    <button
      type="button"
      data-state={isActive ? "active" : "inactive"}
      onClick={() => setValue(value)}
      className={cn(
        "-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "border-foreground text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground",
        className
      )}
    >
      {children}
    </button>
  )
}

function TabsContent({
  value,
  className,
  children,
}: {
  value: string
  className?: string
  children: React.ReactNode
}) {
  const { value: active } = useTabs()
  if (active !== value) return null
  return <div className={className}>{children}</div>
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
