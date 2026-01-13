'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, Sparkles } from 'lucide-react'
import { FuelGauge } from '@/components/dashboard/FuelGauge'
import { SalaryConfigModal } from '@/components/dashboard/SalaryConfigModal'
import { QuickAddFAB } from '@/components/expense/QuickAddFAB'
import { Card } from '@/components/ui/card'

interface Transaction {
  id: string
  amount: number
  category: string
  description: string
  date: string
  type: 'EXPENSE' | 'INCOME'
}

export default function HomePage() {
  const [salaryConfig, setSalaryConfig] = useState<{
    amount: number
    payDay: number
    balance: number
  } | null>(null)

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentDate, setCurrentDate] = useState<Date | null>(null)

  // Load data on mount (client-side only)
  useEffect(() => {
    // Set current date only on client
    setCurrentDate(new Date())

    const saved = localStorage.getItem('salaryConfig')
    if (saved) {
      setSalaryConfig(JSON.parse(saved))
    }
    const savedTransactions = localStorage.getItem('transactions')
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions))
    } else {
      // Default empty transactions instead of mock
      setTransactions([])
    }
    setIsLoaded(true)
  }, [])

  const handleSaveConfig = (amount: number, payDay: number, balance: number) => {
    const config = { amount, payDay, balance }
    setSalaryConfig(config)
    localStorage.setItem('salaryConfig', JSON.stringify(config))
  }

  const handleAddExpense = (expense: { amount: number; category: string; description: string }) => {
    const newExpense: Transaction = {
      id: Date.now().toString(),
      ...expense,
      date: new Date().toISOString(),
      type: 'EXPENSE',
    }
    const updated = [newExpense, ...transactions]
    setTransactions(updated)
    localStorage.setItem('transactions', JSON.stringify(updated))

    // Update balance
    if (salaryConfig) {
      const newBalance = salaryConfig.balance - expense.amount
      const updatedConfig = { ...salaryConfig, balance: newBalance }
      setSalaryConfig(updatedConfig)
      localStorage.setItem('salaryConfig', JSON.stringify(updatedConfig))
    }
  }

  // Calculate stats using memoization and client date
  const todaySpent = useMemo(() => {
    if (!currentDate) return 0
    return transactions
      .filter(t => {
        const tDate = new Date(t.date)
        return tDate.toDateString() === currentDate.toDateString() && t.type === 'EXPENSE'
      })
      .reduce((sum, t) => sum + t.amount, 0)
  }, [transactions, currentDate])

  const monthTotal = useMemo(() => {
    return transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0)
  }, [transactions])

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
        className="flex items-center justify-between pt-4"
      >
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            SalaryGuard
          </h1>
          <p className="text-sm text-slate-400">Your financial shield</p>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <SalaryConfigModal
            onSave={handleSaveConfig}
            currentAmount={salaryConfig?.amount}
            currentPayDay={salaryConfig?.payDay}
            currentBalance={salaryConfig?.balance}
          />
        </motion.div>
      </motion.div>

      {/* Fuel Gauge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        {salaryConfig ? (
          <FuelGauge
            salaryAmount={salaryConfig.amount}
            currentBalance={salaryConfig.balance}
            payDay={salaryConfig.payDay}
          />
        ) : (
          <Card className="border-dashed border-slate-700 bg-slate-900/50 p-8 text-center">
            <Sparkles className="mx-auto mb-4 h-12 w-12 text-slate-600" />
            <h3 className="text-lg font-semibold text-slate-300">
              Set Up Your Salary
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Configure your salary details to see your financial fuel gauge
            </p>
            <div className="mt-4">
              <SalaryConfigModal
                onSave={handleSaveConfig}
                currentAmount={0}
                currentPayDay={1}
                currentBalance={0}
              />
            </div>
          </Card>
        )}
      </motion.div>

      {/* Quick Stats */}
      {salaryConfig && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-4"
        >
          <Card className="border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/20">
                <ArrowDownRight className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Spent Today</p>
                <p className="text-lg font-bold text-white">
                  ₹{todaySpent.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </Card>

          <Card className="border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20">
                <ArrowUpRight className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">This Month</p>
                <p className="text-lg font-bold text-white">
                  ₹{monthTotal.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
          <button className="text-sm text-emerald-400 hover:text-emerald-300">
            View All
          </button>
        </div>

        <div className="space-y-3">
          {transactions.length === 0 ? (
            <Card className="border-slate-800 bg-slate-900/50 p-8 text-center">
              <p className="text-slate-400">No transactions yet</p>
              <p className="text-sm text-slate-500 mt-1">Tap + to add your first expense</p>
            </Card>
          ) : (
            transactions.slice(0, 5).map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Card className="border-slate-800 bg-slate-900/50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${transaction.type === 'EXPENSE'
                          ? 'bg-red-500/20'
                          : 'bg-emerald-500/20'
                        }`}>
                        {transaction.type === 'EXPENSE' ? (
                          <ArrowDownRight className="h-5 w-5 text-red-400" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5 text-emerald-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">{transaction.description}</p>
                        <p className="text-xs text-slate-400">{transaction.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${transaction.type === 'EXPENSE' ? 'text-red-400' : 'text-emerald-400'
                        }`}>
                        {transaction.type === 'EXPENSE' ? '-' : '+'}₹{transaction.amount.toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(transaction.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* Quick Add FAB */}
      <QuickAddFAB onAddExpense={handleAddExpense} />
    </div>
  )
}
