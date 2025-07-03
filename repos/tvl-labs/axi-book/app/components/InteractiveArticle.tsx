"use client"

import React from 'react'
import AxiTutorial from './AxiTutorial'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface TextSection {
    type: 'text'
    title: string
    content: string
}

interface CodeSection {
    type: 'code'
    title: string
    initialCode: string
}

type Section = TextSection | CodeSection

interface InteractiveArticleProps {
    title: string
    description: string
    sections: Section[]
}

export function InteractiveArticle({ title, description, sections }: InteractiveArticleProps) {
    return (
        <div className="space-y-8">
            <Card className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
            </Card>

            {sections.map((section, index) => (
                <Card key={index} className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]">
                    <CardHeader>
                        <CardTitle>{section.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {section.type === 'text' ? (
                            <div className="prose dark:prose-invert max-w-none">
                                {section.content.split('\n').map((paragraph, i) => (
                                    <p key={i} className="mb-4">{paragraph}</p>
                                ))}
                            </div>
                        ) : (
                            <AxiTutorial initialCode={section.initialCode} />
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export { type Section }