import './globals.css'
import { SearchProvider } from '@/context/SearchContext'

export const metadata = {
    title: 'StockFlow - SaaS Inventory',
    description: 'Manage your SaaS inventory with ease.',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="text-gray-900 bg-gray-50 min-h-screen">
                <SearchProvider>
                    {children}
                </SearchProvider>
            </body>
        </html>
    )
}
