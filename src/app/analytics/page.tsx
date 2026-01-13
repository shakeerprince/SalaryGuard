'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Eye, EyeOff, TrendingDown, Repeat, DollarSign, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface Transaction {
    id: string
    amount: number
    category: string
    description: string
    date: string
    type: string
}

export default function AnalyticsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const saved = localStorage.getItem('transactions')
        if (saved) {
            setTransactions(JSON.parse(saved))
        }
        setIsLoaded(true)
    }, [])

    // Calculate Black Hole (small transactions < ₹100)
    const smallTransactions = transactions.filter(
        (t) => t.type === 'EXPENSE' && t.amount < 100
    )
    const blackHoleTotal = smallTransactions.reduce((sum, t) => sum + t.amount, 0)

    // Detect potential subscriptions (same amount appearing multiple times)
    const amountFrequency: Record<number, Transaction[]> = {}
    transactions
        .filter((t) => t.type === 'EXPENSE')
        .forEach((t) => {
            if (!amountFrequency[t.amount]) {
                amountFrequency[t.amount] = []
            }
            amountFrequency[t.amount].push(t)
        })

    const likelySubscriptions = Object.entries(amountFrequency)
        .filter(([_, txns]) => txns.length >= 2)
        .map(([amount, txns]) => ({
            amount: parseFloat(amount),
            count: txns.length,
            description: txns[0].description,
            category: txns[0].category,
        }))

    // Category breakdown
    const categoryTotals: Record<string, number> = {}
    transactions
        .filter((t) => t.type === 'EXPENSE')
        .forEach((t) => {
            categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount
        })

    const totalExpenses = transactions
        .filter((t) => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0)

    const sortedCategories = Object.entries(categoryTotals)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)

    if (!isLoaded) {
        return (
            <div className="flex h-screen items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="h-8 w-8 rounded-full border-2 border-emerald-500 border-t-transparent"
                />
            </div>
        )
    }

    return (
        <div className="p-4 space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-4"
            >
                <h1 className="text-2xl font-bold text-white">Analytics</h1>
                <p className="text-sm text-slate-400">Understand where your money goes</p>
            </motion.div>

            {/* Black Hole Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card className="border-0 bg-gradient-to-br from-purple-900/50 via-slate-900 to-slate-900 p-6 overflow-hidden relative">
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-purple-500/20 blur-3xl" />
                    <div className="absolute -left-8 -bottom-8 h-24 w-24 rounded-full bg-violet-500/20 blur-3xl" />

                    <div className="relative">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20">
                                <Eye className="h-6 w-6 text-purple-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">The Black Hole</h2>
                                <p className="text-sm text-slate-400">Small spends that add up</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">
                                    Transactions under ₹100
                                </p>
                                <p className="text-3xl font-bold text-purple-400">
                                    ₹{blackHoleTotal.toLocaleString('en-IN')}
                                </p>
                                <p className="text-sm text-slate-500 mt-1">
                                    {smallTransactions.length} small spends this month
                                </p>
                            </div>

                            <div className="rounded-xl bg-purple-500/10 p-4">
                                <p className="text-sm text-purple-300">
                                    💡 You could have saved <span className="font-bold">₹{blackHoleTotal.toLocaleString('en-IN')}</span> by cutting small discretionary spends
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Subscription Detective */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Card className="border-slate-800 bg-slate-900/50 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20">
                            <Repeat className="h-6 w-6 text-amber-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Subscription Detective</h2>
                            <p className="text-sm text-slate-400">Likely recurring charges</p>
                        </div>
                    </div>

                    {likelySubscriptions.length > 0 ? (
                        <div className="space-y-3">
                            {likelySubscriptions.map((sub, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    className="flex items-center justify-between rounded-xl bg-slate-800/50 p-4"
                                >
                                    <div>
                                        <p className="font-medium text-white">{sub.description || sub.category}</p>
                                        <p className="text-xs text-slate-400">
                                            Appeared {sub.count}x
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-amber-400">
                                            ₹{sub.amount.toLocaleString('en-IN')}
                                        </p>
                                        <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-400">
                                            Recurring?
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-400">
                            <Repeat className="mx-auto h-12 w-12 mb-3 opacity-30" />
                            <p>No recurring patterns detected yet</p>
                            <p className="text-sm text-slate-500">Add more transactions to see insights</p>
                        </div>
                    )}
                </Card>
            </motion.div>

            {/* Category Breakdown */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Card className="border-slate-800 bg-slate-900/50 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20">
                            <TrendingDown className="h-6 w-6 text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Category Breakdown</h2>
                            <p className="text-sm text-slate-400">Where your money went</p>
                        </div>
                    </div>

                    {sortedCategories.length > 0 ? (
                        <div className="space-y-4">
                            {sortedCategories.map(([category, amount], index) => {
                                const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
                                return (
                                    <div key={category}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-slate-300">{category}</span>
                                            <span className="text-sm font-medium text-white">
                                                ₹{amount.toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                        <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                                            />
                                        </div>
                                        <span className="text-xs text-slate-500">{percentage.toFixed(1)}%</span>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-400">
                            <TrendingDown className="mx-auto h-12 w-12 mb-3 opacity-30" />
                            <p>No expenses recorded yet</p>
                            <p className="text-sm text-slate-500">Start tracking to see insights</p>
                        </div>
                    )}
                </Card>
            </motion.div>
        </div>
    )
}
