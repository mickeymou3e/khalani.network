'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { chapters } from '@/app/lib/chapters'
import { cn } from '@/app/lib/utils'
export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="h-full overflow-y-auto bg-secondary p-4">
            <nav>
                {chapters.map((chapter, chapterIndex) => (
                    <div key={chapterIndex} className="mb-6">
                        <h2 className="font-bold text-lg mb-2 text-primary">{chapter.title}</h2>
                        <ul className="space-y-2">
                            {chapter.pages.map((page, pageIndex) => (
                                <li key={pageIndex}>
                                    <Link
                                        href={`/${page.slug}`}
                                        className={cn(
                                            "block p-2 rounded-md transition-colors",
                                            pathname === `/${page.slug}`
                                                ? "bg-accent text-accent-foreground"
                                                : "text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
                                        )}
                                    >
                                        {page.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>
        </div>
    )
}