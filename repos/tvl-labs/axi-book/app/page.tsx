import React from 'react'
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Welcome to the Axi Programming Tutorial</h2>
      <p className="mb-4">
        This interactive tutorial will guide you through the basics of Axi programming language.
        Use the sidebar to navigate through different chapters and topics.
      </p>
      <Button asChild>
        <a href="/intro">Start with Introduction</a>
      </Button>
    </div>
  )
}