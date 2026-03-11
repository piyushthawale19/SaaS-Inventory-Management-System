'use client'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Package, Minus, PlusCircle, MinusCircle, Image as ImageIcon, X } from 'lucide-react'
import { useSearch } from '@/context/SearchContext'

export default function ProductsPage() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [form, setForm] = useState(null)
    const [error, setError] = useState('')
    const [updatingId, setUpdatingId] = useState(null)
    const { searchQuery, setSearchQuery } = useSearch()
    const [isSearchFocused, setIsSearchFocused] = useState(false)

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products', { credentials: 'include' })
            if (!res.ok) throw new Error('Failed to fetch')
            const json = await res.json()
            setProducts(json)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        const isEdit = !!form.id
        const method = isEdit ? 'PUT' : 'POST'
        const url = isEdit ? `/api/products/${form.id}` : '/api/products'

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
                credentials: 'include'
            })
            if (!res.ok) {
                const d = await res.json()
                throw new Error(d.error || 'Failed to save')
            }
            setForm(null)
            fetchProducts()
        } catch (err) {
            setError(err.message)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            })
            if (res.ok) fetchProducts()
        } catch (err) {
            console.error(err)
        }
    }

    const adjustQuantity = async (id, currentQty, delta) => {
        const newQty = Math.max(0, currentQty + delta)
        setUpdatingId(id)
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity: newQty }),
                credentials: 'include'
            })
            if (res.ok) {
                setProducts(prev => prev.map(p => p.id === id ? { ...p, quantity: newQty } : p))
            }
        } catch (err) {
            console.error('Failed to adjust quantity', err)
        } finally {
            setUpdatingId(null)
        }
    }

    // --- Search & Filtering Logic ---
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // --- Pagination Logic ---
    const totalItems = filteredProducts.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const paginatedProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem)

    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    if (loading) return <Sidebar><div className="flex h-full items-center justify-center text-slate-400">Loading Inventory...</div></Sidebar>

    return (
        <Sidebar>
            <div className="mb-10 flex flex-col gap-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Inventory</h1>
                        <p className="text-slate-400 mt-1 font-bold">Manage your product stock levels and pricing</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Realistic Elastic Search Bar */}
                        <div className={`relative transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isSearchFocused ? 'w-96 scale-105' : 'w-56 scale-100'} group`}>
                            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-all duration-300 ${isSearchFocused ? 'text-primary rotate-12 scale-110' : 'text-slate-400 opacity-60'}`} />
                            <input
                                type="text"
                                placeholder="Search inventory..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value)
                                    setCurrentPage(1)
                                }}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                                className={`w-full pl-11 pr-10 py-3 bg-white border rounded-2xl text-sm font-bold placeholder:text-slate-400 transition-all duration-500 outline-none
                                    ${isSearchFocused
                                        ? 'border-primary/40 ring-8 ring-primary/5 shadow-2xl shadow-blue-100'
                                        : 'border-slate-100 shadow-sm'}`}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-400 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <button
                            className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-hover shadow-lg shadow-blue-100 flex items-center gap-2 transition-all active:scale-95 hover:translate-y-[-2px]"
                            onClick={() => {
                                setForm({ name: '', sku: '', quantity: 0, costPrice: 0, sellingPrice: 0, lowStockThreshold: '' })
                                setError('')
                            }}
                        >
                            <Plus className="w-5 h-5" />
                            Add Product
                        </button>
                    </div>
                </div>

                {/* Filters & Stats Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shadow-inner text-xl">📉</div>
                        <div>
                            <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest leading-tight">Out of Stock</p>
                            <p className="text-2xl font-black text-slate-900">{products.filter(p => p.quantity === 0).length}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-inner text-xl">⚠️</div>
                        <div>
                            <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest leading-tight">Low Stock Alerts</p>
                            <p className="text-2xl font-black text-slate-900">{products.filter(p => p.quantity <= (p.lowStockThreshold || 10) && p.quantity > 0).length}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner text-xl">💰</div>
                        <div>
                            <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest leading-tight">Inventory Value</p>
                            <p className="text-2xl font-black text-slate-900">${products.reduce((acc, p) => acc + (p.quantity * p.sellingPrice), 0).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {form && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <h2 className="text-xl font-extrabold text-slate-900">{form.id ? 'Edit Product' : 'New Product'}</h2>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${(parseInt(form.quantity) || 0) === 0 ? 'bg-red-100 text-red-600' :
                                    (parseInt(form.quantity) || 0) <= (parseInt(form.lowStockThreshold) || 10) ? 'bg-amber-100 text-amber-600' :
                                        'bg-emerald-100 text-emerald-600'
                                    }`}>
                                    {(parseInt(form.quantity) || 0) === 0 ? 'Out of Stock' :
                                        (parseInt(form.quantity) || 0) <= (parseInt(form.lowStockThreshold) || 10) ? 'Low Stock' :
                                            'In Stock'}
                                </span>
                            </div>
                            <button onClick={() => setForm(null)} className="text-slate-400 hover:text-slate-600">✕</button>
                        </div>
                        <form className="p-8 space-y-8" onSubmit={handleSubmit}>
                            {error && <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-xl">{error}</div>}

                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] uppercase font-black text-slate-400 mb-4 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                        General Information
                                    </p>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="col-span-2">
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Product Name</label>
                                            <input required className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary/10 transition-all outline-none" type="text" placeholder="e.g. Ultra-Responsive Wireless Gaming Mouse" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">SKU Number</label>
                                            <input required className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary/10 transition-all outline-none" type="text" placeholder="WGM-2024-001" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Quantity on Hand</label>
                                            <input required className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary/10 transition-all outline-none" type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] uppercase font-black text-slate-400 mb-4 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                        Pricing & Threshold
                                    </p>
                                    <div className="grid grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Cost Price</label>
                                            <input className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none" type="number" step="0.01" value={form.costPrice} onChange={e => setForm({ ...form, costPrice: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Selling Price</label>
                                            <input className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none" type="number" step="0.01" value={form.sellingPrice} onChange={e => setForm({ ...form, sellingPrice: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Low Stock Threshold</label>
                                            <input className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary/10 transition-all outline-none" type="number" value={form.lowStockThreshold || ''} onChange={e => setForm({ ...form, lowStockThreshold: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" className="px-6 py-3 text-slate-400 font-bold hover:text-slate-900 transition-all" onClick={() => setForm(null)}>Cancel</button>
                                <button type="submit" className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover shadow-lg shadow-blue-100 transition-all">
                                    {form.id ? 'Update Product' : 'Save Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                                <th className="px-8 py-6">Product</th>
                                <th className="px-8 py-6">SKU</th>
                                <th className="px-10 py-6 text-center">Stock Level</th>
                                <th className="px-8 py-6">Price</th>
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {paginatedProducts.map(p => (
                                <tr key={p.id} className="hover:bg-slate-50/40 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-primary/40 transition-colors">
                                                <ImageIcon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 leading-tight">{p.name}</p>
                                                <p className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Category</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-bold text-slate-500 font-mono">{p.sku}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-center gap-4">
                                            <button
                                                disabled={updatingId === p.id}
                                                onClick={() => adjustQuantity(p.id, p.quantity, -1)}
                                                className="p-1 rounded-md text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-30"
                                            >
                                                <MinusCircle className="w-5 h-5" />
                                            </button>
                                            <span className={`w-12 text-center font-black text-lg ${updatingId === p.id ? 'animate-pulse text-slate-300' : 'text-slate-900'}`}>
                                                {p.quantity}
                                            </span>
                                            <button
                                                disabled={updatingId === p.id}
                                                onClick={() => adjustQuantity(p.id, p.quantity, 1)}
                                                className="p-1 rounded-md text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 transition-all disabled:opacity-30"
                                            >
                                                <PlusCircle className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 font-bold text-slate-600">${p.sellingPrice.toFixed(2)}</td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${p.quantity === 0 ? 'bg-red-100 text-red-600' :
                                            p.quantity <= (p.lowStockThreshold || 10) ? 'bg-amber-100 text-amber-600' :
                                                'bg-emerald-100 text-emerald-600'
                                            }`}>
                                            {p.quantity === 0 ? 'Out of Stock' :
                                                p.quantity <= (p.lowStockThreshold || 10) ? 'Low Stock' :
                                                    'In Stock'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => setForm(p)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(p.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center text-slate-400">
                                        <Package className="w-12 h-12 mx-auto mb-4 opacity-10" />
                                        <p className="font-bold">No products found for "{searchQuery}"</p>
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="mt-4 text-primary text-sm font-bold hover:underline"
                                        >
                                            Clear search
                                        </button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* --- Pagination Footer --- */}
                <div className="p-8 border-t border-slate-50 flex items-center justify-between bg-slate-50/20">
                    <p className="text-xs font-bold text-slate-400 tracking-tight">Total Inventory Records: {totalItems}</p>

                    <div className="flex gap-2">
                        <button
                            onClick={() => paginate(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 border border-slate-100 rounded-xl text-xs font-bold text-slate-400 hover:bg-white hover:border-slate-200 transition-all disabled:opacity-30"
                        >
                            Prev
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => paginate(i + 1)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${currentPage === i + 1
                                    ? 'bg-white border border-slate-200 text-slate-900 shadow-sm'
                                    : 'border border-slate-100 text-slate-400 hover:bg-white hover:border-slate-200'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages || totalItems === 0}
                            className="px-4 py-2 border border-slate-100 rounded-xl text-xs font-bold text-slate-400 hover:bg-white hover:border-slate-200 transition-all disabled:opacity-30"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </Sidebar>
    )
}
