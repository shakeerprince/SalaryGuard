'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Sparkles, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

interface QuickAddFABProps {
    onAddExpense: (expense: { amount: number; category: string; description: string }) => void
}

// Category mapping for natural language processing
const categoryKeywords: Record<string, string[]> = {
    'Transport': ['uber', 'ola', 'cab', 'taxi', 'bus', 'metro', 'train', 'fuel', 'petrol', 'diesel', 'parking', 'toll'],
    'Food': ['food', 'lunch', 'dinner', 'breakfast', 'restaurant', 'cafe', 'coffee', 'tea', 'snack', 'zomato', 'swiggy', 'dominos', 'pizza', 'burger'],
    'Shopping': ['amazon', 'flipkart', 'myntra', 'clothes', 'shoes', 'electronics', 'shopping', 'mall', 'market', 'store'],
    'Entertainment': ['netflix', 'prime', 'hotstar', 'movie', 'theater', 'game', 'spotify', 'youtube'],
    'Bills': ['electricity', 'water', 'gas', 'internet', 'wifi', 'phone', 'mobile', 'recharge', 'bill', 'rent', 'emi'],
    'Health': ['medicine', 'doctor', 'hospital', 'pharmacy', 'medical', 'gym', 'fitness'],
    'Groceries': ['grocery', 'vegetables', 'fruits', 'milk', 'bread', 'bigbasket', 'blinkit', 'zepto', 'instamart'],
    'Others': [],
}

function parseExpenseInput(input: string): { amount: number; category: string; description: string } {
    // Extract amount - look for numbers (possibly with comma separators)
    const amountMatch = input.match(/(\d[\d,]*(?:\.\d+)?)/);
    const amount = amountMatch
        ? parseFloat(amountMatch[1].replace(/,/g, ''))
        : 0;

    // Remove amount from input to get description
    let description = input
        .replace(/(\d[\d,]*(?:\.\d+)?)/g, '')
        .replace(/for|spent|on|\brs\b|\brunees\b|₹/gi, '')
        .trim();

    // Capitalize first letter
    description = description.charAt(0).toUpperCase() + description.slice(1);

    // Detect category from keywords
    let category = 'Others';
    const lowerInput = input.toLowerCase();

    for (const [cat, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some(keyword => lowerInput.includes(keyword))) {
            category = cat;
            break;
        }
    }

    return { amount, category, description };
}

export function QuickAddFAB({ onAddExpense }: QuickAddFABProps) {
    const [open, setOpen] = useState(false)
    const [input, setInput] = useState('')
    const [parsed, setParsed] = useState<{ amount: number; category: string; description: string } | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)

    const handleInputChange = (value: string) => {
        setInput(value)
        if (value.trim()) {
            const result = parseExpenseInput(value)
            setParsed(result)
        } else {
            setParsed(null)
        }
    }

    const handleSubmit = () => {
        if (parsed && parsed.amount > 0) {
            setIsProcessing(true)

            // Simulate haptic feedback delay
            setTimeout(() => {
                onAddExpense(parsed)
                setInput('')
                setParsed(null)
                setIsProcessing(false)
                setOpen(false)
            }, 500)
        }
    }

    return (
        <>
            {/* FAB Button */}
            <motion.button
                className="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setOpen(true)}
            >
                <Plus className="h-7 w-7 text-white" strokeWidth={2.5} />
            </motion.button>

            {/* Quick Add Modal */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-sm border-slate-700 bg-slate-900 p-0 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 p-6">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-white">
                                <Sparkles className="h-5 w-5 text-emerald-400" />
                                Quick Add Expense
                            </DialogTitle>
                        </DialogHeader>

                        <p className="mt-2 text-sm text-slate-400">
                            Type naturally, e.g. &quot;250 for uber to office&quot;
                        </p>
                    </div>

                    <div className="p-6 space-y-4">
                        {/* Input Area */}
                        <div className="relative">
                            <textarea
                                value={input}
                                onChange={(e) => handleInputChange(e.target.value)}
                                placeholder="250 for uber to office"
                                className="w-full min-h-[100px] rounded-xl border-slate-700 bg-slate-800 p-4 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                                autoFocus
                            />
                        </div>

                        {/* Parsed Preview */}
                        <AnimatePresence>
                            {parsed && parsed.amount > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="rounded-xl bg-slate-800/50 p-4 space-y-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-400">Amount</span>
                                        <span className="text-lg font-bold text-emerald-400">
                                            ₹{parsed.amount.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-400">Category</span>
                                        <span className="rounded-full bg-slate-700 px-3 py-1 text-sm text-white">
                                            {parsed.category}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-400">Note</span>
                                        <span className="text-sm text-white">
                                            {parsed.description || 'No description'}
                                        </span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit Button */}
                        <Button
                            onClick={handleSubmit}
                            disabled={!parsed || parsed.amount <= 0 || isProcessing}
                            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50"
                        >
                            {isProcessing ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    className="h-5 w-5 rounded-full border-2 border-white border-t-transparent"
                                />
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Add Expense
                                </>
                            )}
                        </Button>

                        {/* Quick Examples */}
                        <div className="pt-2">
                            <p className="text-xs text-slate-500 mb-2">Try these examples:</p>
                            <div className="flex flex-wrap gap-2">
                                {['500 swiggy dinner', '100 metro', '299 netflix'].map((example) => (
                                    <button
                                        key={example}
                                        onClick={() => handleInputChange(example)}
                                        className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                                    >
                                        {example}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
