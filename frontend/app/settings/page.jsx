'use client'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { Settings, Bell, Shield, Users, Info } from 'lucide-react'

export default function SettingsPage() {
    const [loading, setLoading] = useState(true)
    const [threshold, setThreshold] = useState(10)
    const [msg, setMsg] = useState('')

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings', { credentials: 'include' })
                if (res.ok) {
                    const data = await res.json()
                    setThreshold(data.defaultLowStockThreshold)
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchSettings()
    }, [])

    const handleSave = async (e) => {
        e.preventDefault()
        setMsg('')
        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ defaultLowStockThreshold: threshold }),
                credentials: 'include'
            })
            if (res.ok) {
                setMsg('Settings updated successfully!')
                setTimeout(() => setMsg(''), 3000)
            } else {
                setMsg('Failed to update settings')
            }
        } catch (err) {
            setMsg('Network error')
        }
    }

    if (loading) return <Sidebar><div className="flex h-full items-center justify-center text-slate-400 uppercase tracking-widest font-black text-xs">Loading Settings...</div></Sidebar>

    const tabs = [
        { name: 'General', active: false },
        { name: 'Inventory Settings', active: true },
        { name: 'Notifications', active: false },
        { name: 'Security', active: false },
        { name: 'Team', active: false },
    ]

    return (
        <Sidebar>
            <div className="mb-10">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
                <p className="text-slate-400 mt-1 font-bold">Manage your warehouse preferences and system configurations.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-8 border-b border-slate-100 mb-10 overflow-x-auto shrink-0">
                {tabs.map(tab => (
                    <button
                        key={tab.name}
                        className={`pb-4 text-sm font-bold tracking-tight border-b-2 transition-all shrink-0 ${tab.active ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        {tab.name}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-8 border-b border-slate-50">
                            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Inventory Settings</h3>
                            <p className="text-sm text-slate-400 font-medium mt-1">Configure how stock is monitored and tracked across your organization.</p>
                        </div>

                        <form onSubmit={handleSave} className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                <div>
                                    <label className="block text-sm font-bold text-slate-900 tracking-tight mb-2">Default Low Stock Threshold</label>
                                    <p className="text-xs text-slate-400 font-medium leading-relaxed">Set the default level at which products are marked as 'Low Stock'. Individual products can override this value.</p>
                                </div>
                                <div className="relative">
                                    <input
                                        type="number"
                                        required
                                        value={threshold}
                                        onChange={(e) => setThreshold(e.target.value)}
                                        className="w-full pl-4 pr-16 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary/10 transition-all outline-none text-slate-900 font-bold"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase">Units</span>
                                </div>
                            </div>

                            <hr className="border-slate-50" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start opacity-70">
                                <div>
                                    <label className="block text-sm font-bold text-slate-900 tracking-tight mb-2 uppercase tracking-wide text-[10px]">Restocking (Coming Soon)</label>
                                    <p className="text-xs text-slate-400 font-medium leading-relaxed">Enable automated purchase orders when stock reaches threshold.</p>
                                </div>
                                <div className="flex justify-end">
                                    <div className="w-12 h-6 bg-slate-200 rounded-full flex items-center px-1">
                                        <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4">
                                {msg && <p className="text-xs font-bold text-emerald-600 animate-in fade-in duration-500">{msg}</p>}
                                <div className="flex gap-3 ml-auto">
                                    <button type="button" className="px-6 py-2.5 text-slate-400 font-bold hover:text-slate-900 transition-all">Cancel</button>
                                    <button type="submit" className="px-8 py-2.5 bg-primary text-white font-extrabold rounded-xl hover:bg-primary-hover shadow-lg shadow-blue-100 transition-all">
                                        Save Settings
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>


                </div>

                {/* Sidebar help */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-3xl border border-slate-100">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">Quick Stats</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-xs font-bold">
                                <span className="text-slate-400">Total Notifications</span>
                                <span className="text-slate-900">12</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-bold">
                                <span className="text-slate-400">Team Members</span>
                                <span className="text-slate-900">3</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-bold">
                                <span className="text-slate-400">Security Level</span>
                                <span className="text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">High</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Sidebar>
    )
}
