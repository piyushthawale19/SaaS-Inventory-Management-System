'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            })
            const data = await res.json()
            if (res.ok) {
                router.push('/dashboard')
            } else {
                setError(data.error || 'Invalid credentials')
            }
        } catch (err) {
            setError('Connection failed. Is the server running?')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc] p-4 font-sans">
            <div className="flex flex-col items-center mb-8">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 mb-3">
                    <Box className="w-7 h-7" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900">StockFlow</h1>
            </div>

            <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-8 border border-slate-100">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
                    <p className="text-slate-500 mt-1">Enter your credentials to access your account</p>
                </div>

                {error && (
                    <div className="p-3 mb-6 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg animate-in fade-in slide-in-from-top-1">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                            <input
                                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between mb-1.5">
                            <label className="text-sm font-semibold text-slate-700">Password</label>
                            <button type="button" className="text-xs font-semibold text-primary hover:text-primary-hover">Forgot password?</button>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                required value={password} onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 py-1">
                        <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" />
                        <label htmlFor="remember" className="text-sm text-slate-600">Remember me for 30 days</label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover shadow-lg shadow-blue-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-100"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-3 text-slate-400 font-medium">Or continue with</span>
                    </div>
                </div>

                <button className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all">
                    <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                    Google
                </button>

                <p className="mt-8 text-center text-sm text-slate-500">
                    Don't have an account? <a href="/signup" className="text-primary font-bold hover:underline">Create account</a>
                </p>

                <p className="mt-12 text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                    © 2024 STOCKFLOW SYSTEMS INC.
                </p>
            </div>
        </div>
    )
}
