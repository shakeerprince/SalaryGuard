'use client'

import { motion } from 'framer-motion'
import { Plus, ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

const categories = [
    { name: 'Transport', emoji: '🚗', color: 'bg-blue-500/20 text-blue-400' },
    { name: 'Food', emoji: '🍔', color: 'bg-orange-500/20 text-orange-400' },
    { name: 'Shopping', emoji: '🛍️', color: 'bg-pink-500/20 text-pink-400' },
    { name: 'Entertainment', emoji: '🎬', color: 'bg-purple-500/20 text-purple-400' },
    { name: 'Bills', emoji: '📄', color: 'bg-red-500/20 text-red-400' },
    { name: 'Health', emoji: '💊', color: 'bg-green-500/20 text-green-400' },
    { name: 'Groceries', emoji: '🥬', color: 'bg-emerald-500/20 text-emerald-400' },
    { name: 'Others', emoji: '📦', color: 'bg-slate-500/20 text-slate-400' },
]

export default function AddPage() {
    const [amount, setAmount] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [description, setDescription] = useState('')
    const [type, setType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE')

    const handleSubmit = () => {
        if (!amount || !selectedCategory) return

        const expense = {
            id: Date.now().toString(),
            amount: parseFloat(amount),
            category: selectedCategory,
            description,
            type,
            date: new Date(),
        }

        // Save to localStorage
        const saved = localStorage.getItem('transactions')
        const transactions = saved ? JSON.parse(saved) : []
        transactions.unshift(expense)
        localStorage.setItem('transactions', JSON.stringify(transactions))

        // Update balance
        const configStr = localStorage.getItem('salaryConfig')
        if (configStr) {
            const config = JSON.parse(configStr)
            const delta = type === 'EXPENSE' ? -parseFloat(amount) : parseFloat(amount)
            config.balance = config.balance + delta
            localStorage.setItem('salaryConfig', JSON.stringify(config))
        }

        // Reset form
        setAmount('')
        setSelectedCategory(null)
        setDescription('')

        // Redirect to home
        window.location.href = '/'
    }

    return (
        <div className="p-4 space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-4"
            >
                <h1 className="text-2xl font-bold text-white">Add Transaction</h1>
                <p className="text-sm text-slate-400">Record your income or expense</p>
            </motion.div>

            {/* Type Toggle */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex gap-2"
            >
                <Button
                    variant={type === 'EXPENSE' ? 'default' : 'outline'}
                    onClick={() => setType('EXPENSE')}
                    className={`flex-1 ${type === 'EXPENSE'
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-500/50'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border-slate-700'}`}
                >
                    <ArrowDownRight className="mr-2 h-4 w-4" />
                    Expense
                </Button>
                <Button
                    variant={type === 'INCOME' ? 'default' : 'outline'}
                    onClick={() => setType('INCOME')}
                    className={`flex-1 ${type === 'INCOME'
                        ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border-emerald-500/50'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border-slate-700'}`}
                >
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    Income
                </Button>
            </motion.div>

            {/* Amount Input */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Card className="border-slate-800 bg-slate-900/50 p-6">
                    <label className="text-sm text-slate-400 mb-2 block">Amount</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-slate-400">₹</span>
                        <Input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0"
                            className="border-0 bg-transparent text-4xl font-bold text-white pl-10 focus:ring-0 h-16"
                        />
                    </div>
                </Card>
            </motion.div>

            {/* Category Selection */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <label className="text-sm text-slate-400 mb-3 block">Category</label>
                <div className="grid grid-cols-4 gap-3">
                    {categories.map((category) => (
                        <motion.button
                            key={category.name}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedCategory(category.name)}
                            className={`flex flex-col items-center gap-2 rounded-xl p-3 transition-all ${selectedCategory === category.name
                                    ? `${category.color} ring-2 ring-current`
                                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
                                }`}
                        >
                            <span className="text-2xl">{category.emoji}</span>
                            <span className="text-xs">{category.name}</span>
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            {/* Description */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <label className="text-sm text-slate-400 mb-2 block">Description (Optional)</label>
                <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What was this for?"
                    className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
                />
            </motion.div>

            {/* Submit Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <Button
                    onClick={handleSubmit}
                    disabled={!amount || !selectedCategory}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-6 text-lg hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50"
                >
                    <Plus className="mr-2 h-5 w-5" />
                    Add {type === 'EXPENSE' ? 'Expense' : 'Income'}
                </Button>
            </motion.div>
        </div>
    )
}
