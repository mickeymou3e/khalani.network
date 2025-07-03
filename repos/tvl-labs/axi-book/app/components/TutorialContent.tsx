"use client"

import React from 'react'
import { InteractiveArticle, Section } from './InteractiveArticle'

interface TutorialContentProps {
    title: string
    slug: string
    sections: Section[]
}

export default function TutorialContent({ title, sections }: TutorialContentProps) {





    return (
        <InteractiveArticle
            title={title}
            description={`Learn about ${title} in Axi programming language.`}
            sections={sections}

        />
    )
}