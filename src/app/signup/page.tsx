'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, User, UserPlus, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

export default function SignupPage() {
    const router = useRouter()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || 'Registration failed')
            } else {
                setSuccess(true)
                setTimeout(() => {
                    router.push('/login')
                }, 2000)
            }
        } catch {
            setError('An error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm"
            >
                {/* Logo */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                        SalaryGuard
                    </h1>
                    <p className="text-sm text-slate-400 mt-2">Create your account to get started</p>
                </div>

                {/* Signup Form */}
                <Card className="border-slate-800 bg-slate-900/50 p-6">
                    {success ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-8 text-center"
                        >
                            <CheckCircle className="mx-auto h-16 w-16 text-emerald-400" />
                            <h3 className="mt-4 text-lg font-semibold text-white">Account Created!</h3>
                            <p className="mt-2 text-sm text-slate-400">Redirecting to login...</p>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-2 rounded-lg bg-red-500/20 p-3 text-sm text-red-400"
                                >
                                    <AlertCircle className="h-4 w-4" />
                                    {error}
                                </motion.div>
                            )}

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm text-slate-400">
                                    <User className="h-4 w-4" />
                                    Name
                                </label>
                                <Input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm text-slate-400">
                                    <Mail className="h-4 w-4" />
                                    Email
                                </label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm text-slate-400">
                                    <Lock className="h-4 w-4" />
                                    Password
                                </label>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
                                />
                                <p className="text-xs text-slate-500">Minimum 6 characters</p>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600"
                            >
                                {isLoading ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        className="h-5 w-5 rounded-full border-2 border-white border-t-transparent"
                                    />
                                ) : (
                                    <>
                                        <UserPlus className="mr-2 h-4 w-4" />
                                        Create Account
                                    </>
                                )}
                            </Button>
                        </form>
                    )}

                    {!success && (
                        <div className="mt-6 text-center">
                            <p className="text-sm text-slate-400">
                                Already have an account?{' '}
                                <Link href="/login" className="text-emerald-400 hover:text-emerald-300">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    )}
                </Card>
            </motion.div>
        </div>
    )
}
