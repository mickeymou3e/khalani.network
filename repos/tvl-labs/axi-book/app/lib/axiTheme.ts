import { editor } from 'monaco-editor'

export const axiTheme: editor.IStandaloneThemeData = {
    base: 'vs',
    inherit: true,
    rules: [
        { token: 'comment', foreground: '008000', fontStyle: 'italic' },
        { token: 'keyword', foreground: '0000FF', fontStyle: 'bold' },
        { token: 'string', foreground: 'A31515' },
        { token: 'number', foreground: '098658' },
        { token: 'operator', foreground: '000000' },
        { token: 'delimiter', foreground: '000000' },
        { token: 'type', foreground: '267F99' },
        { token: 'identifier', foreground: '001080' },
        { token: 'function', foreground: '795E26' },
        { token: 'variable', foreground: '001080' },
        { token: 'parameter', foreground: '001080' },
        { token: 'property', foreground: '001080' },
        { token: 'constant', foreground: '0070C1', fontStyle: 'bold' },
        { token: 'control', foreground: 'AF00DB' },
        { token: 'builtin', foreground: '0000FF' },
    ],
    colors: {
        'editor.foreground': '#000000',
        'editor.background': '#FFFFFF',
        'editor.selectionBackground': '#ADD6FF',
        'editor.lineHighlightBackground': '#F7F7F7',
        'editorCursor.foreground': '#000000',
        'editorWhitespace.foreground': '#BFBFBF',
        'editorLineNumber.foreground': '#237893',
        'editor.selectionHighlightBackground': '#E5EBF1',
        'editor.wordHighlightBackground': '#E5EBF1',
        'editor.wordHighlightStrongBackground': '#CCCCCC',
        'editor.findMatchBackground': '#A8AC94',
        'editor.findMatchHighlightBackground': '#EA5C0055',
    }
}