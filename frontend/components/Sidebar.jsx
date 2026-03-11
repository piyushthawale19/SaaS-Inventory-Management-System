'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { LayoutDashboard, Package, Settings, LogOut, ShoppingCart, BarChart3, Box, Search as SearchIcon } from 'lucide-react'
import { useSearch } from '@/context/SearchContext'

export default function Sidebar({ children }) {
    const router = useRouter()
    const pathname = usePathname()
    const [user, setUser] = useState({ orgName: 'StockFlow', email: '', name: 'Loading...' })
    const { searchQuery, setSearchQuery } = useSearch()
    const [isTopFocused, setIsTopFocused] = useState(false)

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const res = await fetch('/api/auth/me', { credentials: 'include' })
                if (res.ok) {
                    const data = await res.json()
                    setUser({
                        orgName: data.orgName,
                        email: data.email,
                        name: data.email.split('@')[0] // Fallback name from email
                    })
                }
            } catch (err) {
                console.error('Failed to fetch user', err)
            }
        }
        fetchMe()
    }, [])

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
        router.push('/login')
    }

    const links = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Products', href: '/products', icon: Package },
        { name: 'Orders', href: '/coming-soon', icon: ShoppingCart },
        { name: 'Reports', href: '/coming-soon', icon: BarChart3 },
        { name: 'Settings', href: '/settings', icon: Settings },
    ]

    return (
        <div className="flex h-screen bg-[#f6f6f8] font-sans">
            <aside className="w-68 bg-white border-r border-slate-200 flex flex-col py-6 px-4">
                <div className="flex items-center gap-3 px-3 mb-10">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-blue-200">
                        <Box className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-slate-900 leading-tight">{user.orgName}</span>
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Inventory Pro</span>
                    </div>
                </div>

                <nav className="flex-1 space-y-1">
                    {links.map((link) => {
                        const Icon = link.icon
                        const isActive = pathname === link.href
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive
                                    ? 'bg-primary/10 text-primary shadow-sm'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
                                {link.name}
                            </Link>
                        )
                    })}
                </nav>

                <div className="mt-auto border-t border-slate-100 pt-6">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>
            <main className="flex-1 overflow-auto flex flex-col">
                {/* Top Header */}
                <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-slate-100 shrink-0">
                    <div className="flex-1 max-w-md">
                        <div className={`relative transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isTopFocused ? 'max-w-xl scale-[1.02]' : 'max-w-md scale-100'}`}>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsTopFocused(true)}
                                onBlur={() => setIsTopFocused(false)}
                                placeholder="Search everything..."
                                className={`w-full pl-11 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm font-semibold placeholder:text-slate-400 transition-all duration-300 outline-none
                                    ${isTopFocused
                                        ? 'border-primary/30 ring-4 ring-primary/5 bg-white shadow-lg'
                                        : 'border-slate-100'}`}
                            />
                            <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${isTopFocused ? 'text-primary scale-110' : 'text-slate-400 scale-100'}`}>
                                <SearchIcon className="w-4 h-4" />
                            </div>
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-50 relative">
                            🔔
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
                            <div className="text-right">
                                <p className="text-sm font-bold text-slate-900 capitalize">{user.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase truncate max-w-[120px]">{user.email}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-primary font-bold border-2 border-white shadow-sm overflow-hidden">
                                <img src={`https://ui-avatars.com/api/?name=${user.name}&background=eff6ff&color=2463eb`} alt="Avatar" />
                            </div>
                        </div>
                    </div>
                </header>
                <div className="p-10">
                    {children}
                </div>
            </main>
        </div>
    )
}
