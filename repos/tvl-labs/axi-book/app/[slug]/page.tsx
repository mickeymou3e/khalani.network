import React from 'react'
import { chapters } from '@/app/lib/chapters'
import TutorialContent from '@/app/components/TutorialContent'
import { notFound } from 'next/navigation'
import { Section } from '@/app/components/InteractiveArticle'
export async function generateStaticParams() {
    return chapters.flatMap(chapter => chapter.pages.map(page => ({ slug: page.slug })))
}

export default function TutorialPage({ params }: { params: { slug: string } }) {
    const { slug } = params
    const page = chapters.flatMap(chapter => chapter.pages).find(page => page.slug === slug)

    if (!page) {
        notFound()
    }

    return <TutorialContent title={page.title} sections={page.sections as Section[]} slug={slug} />
}