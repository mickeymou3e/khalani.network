import React from 'react'
import { Sidebar } from './components/Sidebar'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground">
        <div className="flex h-screen">
          <aside className="w-64 flex-shrink-0 border-r border-border">
            <Sidebar />
          </aside>
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="bg-primary text-primary-foreground p-4 shadow-md">
              <div className="container mx-auto">
                <h1 className="text-3xl font-bold">Axi for the Working Proof Engineer</h1>
              </div>
            </header>
            <main className="flex-1 overflow-y-auto p-6">
              <div className="container mx-auto">
                {children}
              </div>
            </main>
            <footer className="bg-secondary text-secondary-foreground p-4">
              <div className="container mx-auto text-center">
                © 2024 Khalani Labs. All rights reserved.
              </div>
            </footer>
          </div>
        </div>
      </body>
    </html>
  )
}