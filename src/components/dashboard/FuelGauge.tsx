'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Fuel, Flame, TrendingDown, AlertTriangle, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface FuelGaugeProps {
    salaryAmount: number
    currentBalance: number
    payDay: number // Day of month (1-31)
}

export function FuelGauge({ salaryAmount, currentBalance, payDay }: FuelGaugeProps) {
    const [isAnimating, setIsAnimating] = useState(false)

    // Calculate days until next payday
    const today = new Date()
    const currentDay = today.getDate()
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()

    let daysUntilPayday: number
    if (currentDay <= payDay) {
        daysUntilPayday = payDay - currentDay
    } else {
        daysUntilPayday = (daysInMonth - currentDay) + payDay
    }

    // Calculate percentages
    const totalDaysInCycle = daysInMonth
    const daysElapsed = currentDay > payDay
        ? currentDay - payDay
        : currentDay + (daysInMonth - payDay)

    const daysLeftPercent = (daysUntilPayday / totalDaysInCycle) * 100
    const moneyLeftPercent = salaryAmount > 0 ? (currentBalance / salaryAmount) * 100 : 0

    // Danger zone: money percent is less than days percent
    const isDangerZone = moneyLeftPercent < daysLeftPercent
    const isWarningZone = moneyLeftPercent < daysLeftPercent + 10 && !isDangerZone
    const isSafeZone = !isDangerZone && !isWarningZone

    // Trigger animation on mount
    useEffect(() => {
        setIsAnimating(true)
    }, [])

    const getStatusColor = () => {
        if (isDangerZone) return 'from-red-500 to-orange-500'
        if (isWarningZone) return 'from-amber-500 to-yellow-500'
        return 'from-emerald-500 to-teal-500'
    }

    const getGlowColor = () => {
        if (isDangerZone) return 'shadow-red-500/50'
        if (isWarningZone) return 'shadow-amber-500/50'
        return 'shadow-emerald-500/50'
    }

    const StatusIcon = isDangerZone ? AlertTriangle : isWarningZone ? TrendingDown : Sparkles

    return (
        <Card className={`relative overflow-hidden border-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 ${isDangerZone ? 'ring-2 ring-red-500/50' : ''}`}>
            {/* Animated background particles */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className={`absolute h-1 w-1 rounded-full ${isDangerZone ? 'bg-red-500/30' : 'bg-emerald-500/30'}`}
                        initial={{
                            x: Math.random() * 400,
                            y: Math.random() * 400,
                            opacity: 0
                        }}
                        animate={{
                            y: [null, Math.random() * 400],
                            opacity: [0, 0.8, 0]
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2
                        }}
                    />
                ))}
            </div>

            {/* Header */}
            <div className="relative mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <motion.div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${getStatusColor()} shadow-lg ${getGlowColor()}`}
                        animate={{
                            boxShadow: isDangerZone
                                ? ['0 0 20px rgba(239,68,68,0.5)', '0 0 40px rgba(239,68,68,0.3)', '0 0 20px rgba(239,68,68,0.5)']
                                : undefined
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <Fuel className="h-6 w-6 text-white" />
                    </motion.div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Salary Fuel</h2>
                        <p className="text-sm text-slate-400">Your financial velocity</p>
                    </div>
                </div>
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', delay: 0.3 }}
                >
                    <StatusIcon className={`h-6 w-6 ${isDangerZone ? 'text-red-400' : isWarningZone ? 'text-amber-400' : 'text-emerald-400'}`} />
                </motion.div>
            </div>

            {/* Main Gauge Display */}
            <div className="relative mb-6">
                {/* Background Track */}
                <div className="relative h-4 overflow-hidden rounded-full bg-slate-700/50 backdrop-blur">
                    {/* Days Remaining Indicator (subtle line) */}
                    <motion.div
                        className="absolute top-0 h-full w-0.5 bg-white/60 z-10"
                        initial={{ left: '0%' }}
                        animate={{ left: `${100 - daysLeftPercent}%` }}
                        transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.5 }}
                    >
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-slate-300">
                            Day {daysElapsed}
                        </div>
                    </motion.div>

                    {/* Money Fill Bar */}
                    <motion.div
                        className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${getStatusColor()} shadow-lg ${getGlowColor()}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(moneyLeftPercent, 100)}%` }}
                        transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
                    >
                        {/* Shine effect */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        />
                    </motion.div>
                </div>

                {/* Labels below gauge */}
                <div className="mt-3 flex justify-between text-sm">
                    <span className="text-slate-400">Empty</span>
                    <span className="text-slate-400">Full</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Money Left */}
                <motion.div
                    className="rounded-2xl bg-slate-800/50 p-4 backdrop-blur"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="mb-1 text-sm text-slate-400">Balance Left</div>
                    <div className={`text-2xl font-bold ${isDangerZone ? 'text-red-400' : 'text-white'}`}>
                        ₹{currentBalance.toLocaleString('en-IN')}
                    </div>
                    <div className={`text-sm ${isDangerZone ? 'text-red-400' : isWarningZone ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {moneyLeftPercent.toFixed(1)}% of salary
                    </div>
                </motion.div>

                {/* Days Left */}
                <motion.div
                    className="rounded-2xl bg-slate-800/50 p-4 backdrop-blur"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="mb-1 text-sm text-slate-400">Days to Payday</div>
                    <div className="text-2xl font-bold text-white">
                        {daysUntilPayday}
                    </div>
                    <div className="text-sm text-slate-400">
                        {daysLeftPercent.toFixed(1)}% of cycle
                    </div>
                </motion.div>
            </div>

            {/* Status Message */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={isDangerZone ? 'danger' : isWarningZone ? 'warning' : 'safe'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex items-center gap-2 rounded-xl p-3 ${isDangerZone
                            ? 'bg-red-500/20 text-red-300'
                            : isWarningZone
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                >
                    {isDangerZone ? (
                        <>
                            <Flame className="h-5 w-5 animate-pulse" />
                            <span className="text-sm font-medium">⚠️ Burning through funds faster than time!</span>
                        </>
                    ) : isWarningZone ? (
                        <>
                            <TrendingDown className="h-5 w-5" />
                            <span className="text-sm font-medium">📊 Getting close to the edge - slow down spending</span>
                        </>
                    ) : (
                        <>
                            <Sparkles className="h-5 w-5" />
                            <span className="text-sm font-medium">✨ Great pace! Your spending is on track</span>
                        </>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Burn Rate Indicator */}
            <motion.div
                className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                <span>Daily burn rate:</span>
                <span className={`font-semibold ${isDangerZone ? 'text-red-400' : 'text-white'}`}>
                    ₹{daysUntilPayday > 0 ? Math.round(currentBalance / daysUntilPayday).toLocaleString('en-IN') : 0}/day
                </span>
                <span>to last till payday</span>
            </motion.div>
        </Card>
    )
}
