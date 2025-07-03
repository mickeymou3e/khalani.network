"use client"

import React, { useState, useEffect } from 'react'
import Editor, { loader } from '@monaco-editor/react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { editor, languages } from 'monaco-editor'

loader.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.34.0/min/vs' } })

interface AxiTutorialProps {
    initialCode: string
}

export default function AxiTutorial({ initialCode }: AxiTutorialProps) {
    const [code, setCode] = useState(initialCode)
    const [output, setOutput] = useState('')
    const [isRunning, setIsRunning] = useState(false)

    useEffect(() => {
        loader.init().then(monaco => {
            monaco.languages.register({ id: 'axi' })
            monaco.languages.setMonarchTokensProvider('axi', axiLanguageDef as languages.IMonarchLanguage)
            monaco.editor.defineTheme('axiTheme', axiTheme)
        })
    }, [])

    const runCode = async (code: string) => {
        // This is where you'd implement the API call to your Axi code evaluation server
        // For now, we'll just return a placeholder result
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/validity`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ath: code })
        });

        const rdr = res.body?.getReader();
        if (!rdr) {
            throw new Error('Response body is null');
        }
        let msg = "";
        rdr.read().then(function process({ done, value }: ReadableStreamReadResult<Uint8Array>): Promise<void> | void {
            if (done) {
                const execRes = JSON.parse(msg).message;
                // Assuming setExecResult is a state setter function defined elsewhere
                setOutput(`${execRes}`)
            } else {
                const dcdr = new TextDecoder()
                const val = dcdr.decode(value)
                msg = msg.concat(val)
                return rdr?.read().then(process)
            }


        })


    }

    const handleRunCode = async () => {
        setIsRunning(true)
        try {
            await runCode(code)

        } catch (error: unknown) {
            if (error instanceof Error) {
                setOutput(`Error: ${error.message}`)
            } else {
                setOutput('Error: An unknown error occurred')
            }
        } finally {
            setIsRunning(false)
        }
    }

    const handleResetCode = () => {
        setCode(initialCode)
    }

    const handleClearOutput = () => {
        setOutput('')
    }

    return (
        <div className="space-y-4">
            <Editor
                height="300px"
                defaultLanguage="axi"
                defaultValue={code}
                onChange={(value) => setCode(value || '')}
                theme="axiTheme"
                options={{ minimap: { enabled: false } }}
                className="border border-[hsl(var(--border))] rounded-md overflow-hidden"
            />
            <div className="flex space-x-2">
                <Button onClick={handleRunCode} disabled={isRunning}>
                    {isRunning ? 'Running...' : 'Run'}
                </Button>
                <Button onClick={handleResetCode} variant="outline">
                    Reset Code
                </Button>
                <Button onClick={handleClearOutput} variant="outline">
                    Clear Output
                </Button>
            </div>
            <Textarea
                value={output}
                readOnly
                rows={5}
                className="font-mono bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]"
                placeholder="Output will appear here..."
            />
        </div>
    )
}

const axiLanguageDef = {

    keywords: ["define", "!", "force", "load", "print", "eval", "let", "domain", "declare", "match", "check", "assert", "assume", "exists",
        "forall", "chain", "absurd", "pick-witness", "pick-any", "conclude", "by-induction", "holds", "module", "open", "induction", "function", "include", "load"
    ],
    typeKeywords: ["datatype", "structure"],
    operators: [
        ":=", "&", "|", "=", "=>", "==>", "->", "?"
    ],


    symbols: /[:=\->&\?\|]+/,
    declarations: ["module", "extend-module"],
    tokenizer: {
        root: [
            [/[a-zA-Z\-][\w$]*/, {
                cases: {
                    '@typeKeywords': 'keyword',
                    '@keywords': 'keyword',
                    '@default': 'identifier',
                    '@declarations': { token: 'keyword.decl', bracket: '@open' },
                    '==by-induction': 'keyword'
                }
            }
            ],
            //[/\[([A-Z\s]+)\]/, 'type.identifier'],

            [/[{}()\[\]]/, '@brackets'],
            [/@symbols/, {
                cases: {
                    '@operators': 'operator',
                    '@default': ''
                }
            }],
            [/#(.*)$/, 'comment'],
            [':=', 'operator'],
            ['=', 'operator'],
            [/\d+/, 'number'],
            //[/[A-Z][\w\$]*/, 'type.identifier' ],  // to show class names nicely
            // whitespace
            //{ include: '@whitespace' },
        ],

    }
}


export const axiTheme: editor.IStandaloneThemeData = {
    base: 'vs-dark',
    inherit: true,
    rules: [
        { token: 'keyword', foreground: '#FFA500' },
        { token: 'symbol', foreground: '#345BEB' },
        { token: 'comment', foreground: '#acadb0' },
        { token: 'identifier', foreground: '#91a6e3' },
        { token: 'type.identifier', foreground: '#7d5bb0' },
        { token: 'operator.validity', foreground: '#FFA500' }
    ],
    colors: {
        "editor.background": "#000000a2",
        "editorGutter.background": "#151a42",

        "minimap.background": "#151a42",
        "scrollbar.background": "#151a42",
        "scrollbarSlider.background": "#151a42",

        "editor.lineHightlightBackground": "#151a42",

        "editor.lineHighlightBorder": "#151a42",
    }
}