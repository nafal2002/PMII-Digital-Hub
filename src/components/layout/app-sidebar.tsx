'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Archive, BookOpen, Bot, CalendarDays, FileText, Home, Users } from 'lucide-react'
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import { Logo } from '@/components/icons'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Beranda', icon: Home },
  { href: '/modules', label: 'Kaderisasi', icon: BookOpen },
  { href: '/events', label: 'Kegiatan', icon: CalendarDays },
  { href: '/membership', label: 'Keanggotaan', icon: Users },
  { href: '/archive', label: 'Arsip', icon: Archive },
  { href: '/summarize', label: 'Ringkasan Dokumen', icon: Bot },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 p-2">
          <Logo className="size-8 text-primary" />
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold font-headline text-primary">PMII Hub</h1>
            <p className="text-xs text-muted-foreground">Digital Center</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className="w-full justify-start"
                >
                    <Link href={item.href}>
                        <item.icon className="size-4 mr-2" />
                        <span>{item.label}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
