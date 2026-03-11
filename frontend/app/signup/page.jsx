'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Building2, Mail, Lock, CheckCircle2 } from 'lucide-react'

export default function SignupPage() {
    const router = useRouter()
    const [form, setForm] = useState({ orgName: '', email: '', password: '', confirmPassword: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSignup = async (e) => {
        e.preventDefault()
        if (form.password !== form.confirmPassword) return setError('Passwords do not match')
        setError('')
        setLoading(true)
        try {
            const res = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
                credentials: 'include'
            })
            const data = await res.json()
            if (res.ok) {
                router.push('/dashboard')
            } else {
                setError(data.error || 'Signup failed')
            }
        } catch (err) {
            setError('Network error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#f8fafc] p-4 font-sans text-slate-900">
            <div className="w-full max-w-[500px] bg-white rounded-2xl shadow-2xl p-10 border border-slate-100 flex flex-col items-center">
                <div className="flex items-center gap-2 mb-6 self-start">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                        <Box className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold">StockFlow</span>
                </div>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold">Create your account</h2>
                    <p className="text-slate-500 mt-2">Start managing your inventory better today</p>
                </div>

                <div className="w-full h-1 bg-slate-100 rounded-full mb-8 relative overflow-hidden">
                    <div className="absolute left-0 top-0 h-full w-1/3 bg-primary"></div>
                </div>

                {error && <div className="w-full p-3 mb-6 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl">{error}</div>}

                <form onSubmit={handleSignup} className="w-full space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Organization Name</label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                            <input
                                type="text" required value={form.orgName} onChange={(e) => setForm({ ...form, orgName: e.target.value })}
                                placeholder="Acme Corp"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Work Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                            <input
                                type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                                placeholder="name@company.com"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                            <input
                                type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Confirm Password</label>
                        <div className="relative">
                            <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                            <input
                                type="password" required value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 px-6 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 group"
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                        {!loading && <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>}
                    </button>
                </form>

                <div className="mt-8 text-sm text-slate-600">
                    Already have an account? <a href="/login" className="text-primary font-bold hover:underline">Sign in instead</a>
                </div>

                <div className="mt-12 text-center text-[10px] text-slate-400 font-medium">
                    © 2024 StockFlow Inc. All rights reserved. <br />
                    <a href="#" className="hover:underline">Privacy Policy</a> • <a href="#" className="hover:underline">Terms of Service</a>
                </div>
            </div>
        </div>
    )
}
