'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Settings, Wallet, Calendar, Trash2, Download, Moon, Sun, IndianRupee } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function SettingsPage() {
    const [salaryConfig, setSalaryConfig] = useState<{
        amount: number
        payDay: number
        balance: number
    } | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [editAmount, setEditAmount] = useState('')
    const [editPayDay, setEditPayDay] = useState('')
    const [editBalance, setEditBalance] = useState('')

    useEffect(() => {
        const saved = localStorage.getItem('salaryConfig')
        if (saved) {
            const config = JSON.parse(saved)
            setSalaryConfig(config)
            setEditAmount(config.amount.toString())
            setEditPayDay(config.payDay.toString())
            setEditBalance(config.balance.toString())
        }
    }, [])

    const handleSave = () => {
        const config = {
            amount: parseFloat(editAmount) || 0,
            payDay: parseInt(editPayDay) || 1,
            balance: parseFloat(editBalance) || 0,
        }
        setSalaryConfig(config)
        localStorage.setItem('salaryConfig', JSON.stringify(config))
        setIsEditing(false)
    }

    const handleClearData = () => {
        if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
            localStorage.removeItem('salaryConfig')
            localStorage.removeItem('transactions')
            setSalaryConfig(null)
            window.location.reload()
        }
    }

    const handleExportData = () => {
        const data = {
            salaryConfig: localStorage.getItem('salaryConfig'),
            transactions: localStorage.getItem('transactions'),
            exportedAt: new Date().toISOString(),
        }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `salaryguard-backup-${new Date().toISOString().split('T')[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="p-4 space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-4"
            >
                <h1 className="text-2xl font-bold text-white">Settings</h1>
                <p className="text-sm text-slate-400">Configure your financial settings</p>
            </motion.div>

            {/* Salary Configuration */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card className="border-slate-800 bg-slate-900/50 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20">
                                <Wallet className="h-6 w-6 text-emerald-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">Salary Details</h2>
                                <p className="text-sm text-slate-400">Your income configuration</p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditing(!isEditing)}
                            className="border-slate-700 bg-slate-800 text-white hover:bg-slate-700"
                        >
                            {isEditing ? 'Cancel' : 'Edit'}
                        </Button>
                    </div>

                    {isEditing ? (
                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                                    <IndianRupee className="h-4 w-4" />
                                    Monthly Salary
                                </label>
                                <Input
                                    type="number"
                                    value={editAmount}
                                    onChange={(e) => setEditAmount(e.target.value)}
                                    className="border-slate-700 bg-slate-800 text-white"
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                                    <Calendar className="h-4 w-4" />
                                    Payday (Day of Month)
                                </label>
                                <Input
                                    type="number"
                                    min="1"
                                    max="31"
                                    value={editPayDay}
                                    onChange={(e) => setEditPayDay(e.target.value)}
                                    className="border-slate-700 bg-slate-800 text-white"
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                                    <Wallet className="h-4 w-4" />
                                    Current Balance
                                </label>
                                <Input
                                    type="number"
                                    value={editBalance}
                                    onChange={(e) => setEditBalance(e.target.value)}
                                    className="border-slate-700 bg-slate-800 text-white"
                                />
                            </div>
                            <Button
                                onClick={handleSave}
                                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600"
                            >
                                Save Changes
                            </Button>
                        </div>
                    ) : salaryConfig ? (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between rounded-xl bg-slate-800/50 p-4">
                                <span className="text-slate-400">Monthly Salary</span>
                                <span className="font-semibold text-white">
                                    ₹{salaryConfig.amount.toLocaleString('en-IN')}
                                </span>
                            </div>
                            <div className="flex items-center justify-between rounded-xl bg-slate-800/50 p-4">
                                <span className="text-slate-400">Payday</span>
                                <span className="font-semibold text-white">
                                    {salaryConfig.payDay}th of each month
                                </span>
                            </div>
                            <div className="flex items-center justify-between rounded-xl bg-slate-800/50 p-4">
                                <span className="text-slate-400">Current Balance</span>
                                <span className="font-semibold text-emerald-400">
                                    ₹{salaryConfig.balance.toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-center text-slate-500 py-4">
                            No salary configured yet. Go to Home to set up.
                        </p>
                    )}
                </Card>
            </motion.div>

            {/* Data Management */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Card className="border-slate-800 bg-slate-900/50 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20">
                            <Settings className="h-6 w-6 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Data Management</h2>
                            <p className="text-sm text-slate-400">Export or clear your data</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Button
                            variant="outline"
                            onClick={handleExportData}
                            className="w-full justify-start border-slate-700 bg-slate-800 text-white hover:bg-slate-700"
                        >
                            <Download className="mr-3 h-4 w-4 text-blue-400" />
                            Export Data (JSON)
                        </Button>

                        <Button
                            variant="outline"
                            onClick={handleClearData}
                            className="w-full justify-start border-red-900/50 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                        >
                            <Trash2 className="mr-3 h-4 w-4" />
                            Clear All Data
                        </Button>
                    </div>
                </Card>
            </motion.div>

            {/* App Info */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Card className="border-slate-800 bg-slate-900/50 p-6">
                    <div className="text-center">
                        <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                            SalaryGuard
                        </h3>
                        <p className="text-sm text-slate-400 mt-1">Version 1.0.0</p>
                        <p className="text-xs text-slate-500 mt-4">
                            Your personal financial shield. Never lose track of your salary again.
                        </p>
                    </div>
                </Card>
            </motion.div>
        </div>
    )
}
