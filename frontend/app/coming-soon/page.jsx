'use client'
import Sidebar from '@/components/Sidebar'
import { Rocket, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ComingSoonPage() {
    return (
        <Sidebar>
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">


                {/* Text Content */}
                <div className="max-w-md animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                        Feature Coming Soon
                    </h1>
                    <p className="text-slate-500 font-medium leading-relaxed mb-10">
                        We're currently building this advanced module to help you scale your business even faster. Stay tuned for the upcoming release!
                    </p>

                    {/* Animated Dots */}
                    <div className="flex justify-center gap-1.5 mb-10">
                        <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce"></div>
                    </div>

                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:translate-y-[-2px] active:translate-y-0"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </Sidebar>
    )
}
