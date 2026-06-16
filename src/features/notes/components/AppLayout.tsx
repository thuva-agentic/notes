import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface AppLayoutProps {
  sidebar: ReactNode
  children: ReactNode
  className?: string
}

export const AppLayout = ({ sidebar, children, className }: AppLayoutProps) => (
  <div className={cn('flex h-screen bg-background text-foreground', className)}>
    <aside className="flex h-full w-72 min-w-56 max-w-md resize-x overflow-hidden border-r bg-sidebar text-sidebar-foreground">
      <div className="flex h-full w-full min-w-56 flex-col">{sidebar}</div>
    </aside>
    <main className="flex min-w-0 flex-1 flex-col overflow-hidden">{children}</main>
  </div>
)
