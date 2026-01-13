'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, PlusCircle, BarChart3, Settings } from 'lucide-react'

const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/add', icon: PlusCircle, label: 'Add' },
    { href: '/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/settings', icon: Settings, label: 'Settings' },
]

export function BottomNav() {
    const pathname = usePathname()

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto max-w-lg">
                <div className="flex items-center justify-around py-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        const Icon = item.icon

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="relative flex flex-col items-center gap-1 px-4 py-2"
                            >
                                <motion.div
                                    initial={false}
                                    animate={{
                                        scale: isActive ? 1.1 : 1,
                                        y: isActive ? -2 : 0,
                                    }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    className="relative"
                                >
                                    <Icon
                                        className={`h-6 w-6 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'
                                            }`}
                                    />
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeIndicator"
                                            className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary"
                                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                </motion.div>
                                <span
                                    className={`text-xs font-medium transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'
                                        }`}
                                >
                                    {item.label}
                                </span>
                            </Link>
                        )
                    })}
                </div>
            </div>
            {/* Safe area padding for iOS */}
            <div className="h-safe-area-inset-bottom" />
        </nav>
    )
}
