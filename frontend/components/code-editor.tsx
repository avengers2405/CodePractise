"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, RotateCcw } from "lucide-react"

type Language = "cpp" | "python" | "java" | "javascript"

interface CodeEditorProps {
  onCodeChange?: (code: string) => void
  onLanguageChange?: (language: Language) => void
  initialLanguage?: Language
}

const languageTemplates: Record<Language, string> = {
  cpp: ``,
  python: ``,
  java: ``,
  javascript: ``,
}

const languageNames: Record<Language, string> = {
  cpp: "C++",
  python: "Python",
  java: "Java",
  javascript: "JavaScript",
}

export function CodeEditor({ onCodeChange, onLanguageChange, initialLanguage = "cpp" }: CodeEditorProps) {
  const [language, setLanguage] = useState<Language>(initialLanguage)
  const [code, setCode] = useState(languageTemplates[initialLanguage])
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const onCodeChangeRef = useRef<typeof onCodeChange>(onCodeChange)
  useEffect(() => {
    onCodeChangeRef.current = onCodeChange
  }, [onCodeChange])

  useEffect(() => {
    const newCode = languageTemplates[language]
    if (newCode !== code) {
      setCode(newCode)
      onCodeChangeRef.current?.(newCode)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language])

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
    onLanguageChange?.(newLanguage)
  }

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
    onCodeChangeRef.current?.(newCode) // use ref to avoid re-renders caused by changing function identity
  }

  const resetCode = () => {
    const template = languageTemplates[language]
    setCode(template)
    onCodeChangeRef.current?.(template)
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
    } catch (err) {
      console.error("Failed to copy code:", err)
    }
  }

  const getLineNumbers = () => {
    const lines = code.split("\n").length
    return Array.from({ length: Math.max(lines, 20) }, (_, i) => i + 1)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault()
      const textarea = e.currentTarget
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newCode = code.substring(0, start) + "    " + code.substring(end)
      setCode(newCode)
      onCodeChangeRef.current?.(newCode)

      // Set cursor position after the inserted tab
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4
      }, 0)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-muted/40 rounded text-sm text-muted-foreground border border-border/50">
            {languageNames[language]}
          </div>
          <span className="text-xs text-muted-foreground">Auto</span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={copyCode} className="h-8 px-2">
            <Copy className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" onClick={resetCode} className="h-8 px-2">
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex bg-card relative">
        {/* Line Numbers */}
        <div className="flex flex-col bg-muted/30 border-r border-border px-3 py-4 text-xs font-mono text-muted-foreground select-none min-w-[3rem]">
          {getLineNumbers().map((lineNum) => (
            <div key={lineNum} className="leading-6 text-right">
              {lineNum}
            </div>
          ))}
        </div>

        {/* Code Input Area */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-full p-4 bg-transparent text-sm font-mono text-foreground leading-6 resize-none outline-none border-none"
            placeholder="Write your solution here..."
            spellCheck={false}
            style={{
              tabSize: 4,
              fontFamily: 'var(--font-mono), Consolas, "Courier New", monospace',
            }}
          />

          {/* Syntax highlighting overlay would go here in a real implementation */}
          <div className="absolute inset-0 pointer-events-none p-4 text-sm font-mono leading-6 whitespace-pre-wrap overflow-hidden">
            <SyntaxHighlight code={code} language={language} />
          </div>
        </div>
      </div>
    </div>
  )
}

// Simple syntax highlighting component
function SyntaxHighlight({ code, language }: { code: string; language: Language }) {
  const getHighlightedCode = () => {
    let highlightedCode = code

    // Basic keyword highlighting based on language
    const keywords: Record<Language, string[]> = {
      cpp: ["class", "public", "private", "protected", "string", "int", "void", "return", "if", "else", "for", "while"],
      python: ["class", "def", "return", "if", "else", "elif", "for", "while", "import", "from", "pass", "self"],
      java: [
        "class",
        "public",
        "private",
        "protected",
        "String",
        "int",
        "void",
        "return",
        "if",
        "else",
        "for",
        "while",
      ],
      javascript: ["function", "var", "let", "const", "return", "if", "else", "for", "while", "class"],
    }

    // Replace keywords with highlighted versions
    keywords[language].forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "g")
      highlightedCode = highlightedCode.replace(regex, `<span class="text-primary font-medium">${keyword}</span>`)
    })

    // Highlight strings
    highlightedCode = highlightedCode.replace(/"([^"]*)"/g, '<span class="text-secondary">"$1"</span>')
    highlightedCode = highlightedCode.replace(/'([^']*)'/g, "<span class=\"text-secondary\">'$1'</span>")

    // Highlight comments
    if (language === "cpp" || language === "java" || language === "javascript") {
      highlightedCode = highlightedCode.replace(/\/\/.*$/gm, '<span class="text-muted-foreground">$&</span>')
      highlightedCode = highlightedCode.replace(/\/\*[\s\S]*?\*\//g, '<span class="text-muted-foreground">$&</span>')
    } else if (language === "python") {
      highlightedCode = highlightedCode.replace(/#.*$/gm, '<span class="text-muted-foreground">$&</span>')
    }

    // Highlight numbers
    highlightedCode = highlightedCode.replace(/\b\d+\b/g, '<span class="text-accent">$&</span>')

    return highlightedCode
  }

  return <div className="text-transparent" dangerouslySetInnerHTML={{ __html: getHighlightedCode() }} />
}
