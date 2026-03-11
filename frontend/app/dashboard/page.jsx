'use client'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { useRouter } from 'next/navigation'
import { Package, Layers, AlertTriangle, ChevronRight, ShoppingCart, Image as ImageIcon } from 'lucide-react'

export default function DashboardPage() {
    const router = useRouter()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await fetch('/api/dashboard', { credentials: 'include' })
                if (res.status === 401) return router.push('/login')
                const json = await res.json()
                setData(json)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchDashboard()
    }, [router])

    if (loading) return <Sidebar><div className="flex h-full items-center justify-center text-slate-400 animate-pulse">Loading Dashboard...</div></Sidebar>

    const stats = [
        { title: 'Total Products', val: data?.totalProducts, change: '+2.4% from last month', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
        { title: 'Total Inventory Units', val: data?.totalStock?.toLocaleString(), change: '+1.2% stock efficiency', icon: Layers, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { title: 'Low Stock Items', val: data?.lowStockItems?.length, change: 'Requires immediate action', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
    ]

    return (
        <Sidebar>
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Overview</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                {stats.map((stat) => (
                    <div key={stat.title} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 group hover:border-primary/20 transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`${stat.bg} p-3 rounded-xl ${stat.color} shadow-inner`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.title}</h3>
                        <p className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">{stat.val || 0}</p>
                        <p className={`text-xs font-bold ${stat.title.includes('Low') ? 'text-amber-600' : 'text-emerald-600'}`}>
                            {stat.change}
                        </p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Low Stock Alerts</h2>
                        <p className="text-sm text-slate-400 mt-1 font-medium">Inventory items currently below their safety threshold</p>
                    </div>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-hover shadow-lg shadow-blue-100 transition-all">
                        <ShoppingCart className="w-4 h-4" />
                        Create Restock Order
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-extrabold">
                                <th className="px-8 py-5">Product Name</th>
                                <th className="px-8 py-5">SKU</th>
                                <th className="px-8 py-5">Quantity</th>
                                <th className="px-8 py-5">Threshold</th>
                                <th className="px-8 py-5">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {data?.lowStockItems?.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">✅</div>
                                            <p className="font-bold text-slate-900">All stock levels healthy</p>
                                            <p className="text-sm text-slate-400 mt-1">No products are currently low in stock.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                data?.lowStockItems?.map(item => (
                                    <tr key={item.id} className="hover:bg-slate-50/40 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-white transition-colors group-hover:text-primary/40">
                                                    <ImageIcon className="w-5 h-5" />
                                                </div>
                                                <span className="font-bold text-slate-900">{item.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-sm font-semibold text-slate-500">{item.sku}</td>
                                        <td className="px-8 py-5">
                                            <span className="text-amber-600 font-extrabold text-lg">{item.quantity}</span>
                                        </td>
                                        <td className="px-8 py-5 text-sm font-bold text-slate-500">{item.threshold}</td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${item.quantity <= (item.threshold / 2)
                                                ? 'bg-red-100 text-red-600'
                                                : 'bg-amber-100 text-amber-600'
                                                }`}>
                                                {item.quantity <= (item.threshold / 2) ? 'Critical' : 'Low Stock'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-6 border-t border-slate-50 flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-400">Showing {data?.lowStockItems?.length} items</p>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-400 hover:bg-slate-50 transition-all">Previous</button>
                        <button className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 hover:bg-slate-50 transition-all">Next</button>
                    </div>
                </div>
            </div>
        </Sidebar>
    )
}
