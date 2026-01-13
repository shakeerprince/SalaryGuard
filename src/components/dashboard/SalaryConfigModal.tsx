'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, Calendar, IndianRupee, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'

interface SalaryConfigModalProps {
    onSave: (amount: number, payDay: number, balance: number) => void
    currentAmount?: number
    currentPayDay?: number
    currentBalance?: number
}

export function SalaryConfigModal({
    onSave,
    currentAmount = 0,
    currentPayDay = 1,
    currentBalance = 0
}: SalaryConfigModalProps) {
    const [open, setOpen] = useState(false)
    const [amount, setAmount] = useState(currentAmount.toString())
    const [payDay, setPayDay] = useState(currentPayDay.toString())
    const [balance, setBalance] = useState(currentBalance.toString())
    const [step, setStep] = useState(1)

    const handleSave = () => {
        onSave(
            parseFloat(amount) || 0,
            parseInt(payDay) || 1,
            parseFloat(balance) || 0
        )
        setOpen(false)
        setStep(1)
    }

    const isValidStep1 = parseFloat(amount) > 0 && parseInt(payDay) >= 1 && parseInt(payDay) <= 31
    const isValidStep2 = parseFloat(balance) >= 0

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="border-dashed border-slate-600 bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                    <Wallet className="mr-2 h-4 w-4" />
                    Configure Salary
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm border-slate-700 bg-slate-900">
                <DialogHeader>
                    <DialogTitle className="text-center text-white">
                        {step === 1 ? 'Setup Your Salary' : 'Current Balance'}
                    </DialogTitle>
                </DialogHeader>

                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6 py-4"
                        >
                            {/* Salary Amount */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm text-slate-400">
                                    <IndianRupee className="h-4 w-4" />
                                    Monthly Salary
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                                    <Input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="50000"
                                        className="border-slate-700 bg-slate-800 pl-8 text-lg text-white placeholder:text-slate-500"
                                    />
                                </div>
                            </div>

                            {/* Pay Day */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm text-slate-400">
                                    <Calendar className="h-4 w-4" />
                                    Payday (Day of Month)
                                </label>
                                <div className="relative">
                                    <Input
                                        type="number"
                                        min="1"
                                        max="31"
                                        value={payDay}
                                        onChange={(e) => setPayDay(e.target.value)}
                                        placeholder="1"
                                        className="border-slate-700 bg-slate-800 text-lg text-white placeholder:text-slate-500"
                                    />
                                </div>
                                <p className="text-xs text-slate-500">
                                    Enter 1-31 (defaults to last day if month has fewer days)
                                </p>
                            </div>

                            <Button
                                onClick={() => setStep(2)}
                                disabled={!isValidStep1}
                                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600"
                            >
                                Next
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-6 py-4"
                        >
                            {/* Current Balance */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm text-slate-400">
                                    <Wallet className="h-4 w-4" />
                                    Current Account Balance
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                                    <Input
                                        type="number"
                                        value={balance}
                                        onChange={(e) => setBalance(e.target.value)}
                                        placeholder="35000"
                                        className="border-slate-700 bg-slate-800 pl-8 text-lg text-white placeholder:text-slate-500"
                                    />
                                </div>
                                <p className="text-xs text-slate-500">
                                    How much do you have in your account right now?
                                </p>
                            </div>

                            {/* Summary */}
                            <div className="rounded-xl bg-slate-800/50 p-4 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Monthly Salary:</span>
                                    <span className="text-white">₹{parseFloat(amount).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Payday:</span>
                                    <span className="text-white">{payDay}th of each month</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Current Balance:</span>
                                    <span className="text-emerald-400">₹{parseFloat(balance || '0').toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setStep(1)}
                                    className="flex-1 border-slate-700 bg-slate-800 text-white hover:bg-slate-700"
                                >
                                    Back
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={!isValidStep2}
                                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600"
                                >
                                    <Check className="mr-2 h-4 w-4" />
                                    Save
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Step Indicator */}
                <div className="flex justify-center gap-2 pb-2">
                    <div className={`h-2 w-2 rounded-full transition-colors ${step === 1 ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                    <div className={`h-2 w-2 rounded-full transition-colors ${step === 2 ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                </div>
            </DialogContent>
        </Dialog>
    )
}
