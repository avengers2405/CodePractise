"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Play, BarChart3, CheckCircle, XCircle, TimerIcon } from "lucide-react"
import { ProblemDisplay } from "@/components/problem-display"
import { CodeEditor } from "@/components/code-editor"
import { useTimer } from "@/hooks/use-timer"

// Simple problem data
const problems = [
  {
    id: 1,
    title: "Minimum Window Substring",
    difficulty: "Hard" as const,
    description:
      'Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string "".',
    examples: [
      {
        input: 's = "ADOBECODEBANC", t = "ABC"',
        output: '"BANC"',
        explanation: "The minimum window substring \"BANC\" includes 'A', 'B', and 'C' from string t.",
      },
    ],
    constraints: ["m == s.length", "n == t.length", "1 <= m, n <= 10^5"],
  },
  {
    id: 2,
    title: "Two Sum",
    difficulty: "Easy" as const,
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
    ],
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9"],
  },
]

export default function HomePage() {
  const [currentView, setCurrentView] = useState<"coding" | "analysis">("coding")
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0)
  const [submissionResult, setSubmissionResult] = useState<string | null>(null)
  const [currentCode, setCurrentCode] = useState("")
  const [currentLanguage, setCurrentLanguage] = useState<"cpp" | "python" | "java" | "javascript">("cpp")
  const [solvedCount, setSolvedCount] = useState(0)
  const [splitRatio, setSplitRatio] = useState(50) // 50% split initially
  const isDraggingRef = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const { currentTime, totalTime, formatTime, resetCurrentTimer } = useTimer()

  const currentProblem = problems[currentProblemIndex]

  useEffect(() => {
    resetCurrentTimer()
  }, [currentProblemIndex])

  const handleMouseDown = () => {
    isDraggingRef.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseMove = (e: globalThis.MouseEvent) => {
    if (!isDraggingRef.current || !containerRef.current) return
    
    const container = containerRef.current
    const containerRect = container.getBoundingClientRect()
    const newRatio = ((e.clientX - containerRect.left) / containerRect.width) * 100
    
    const constrainedRatio = Math.min(Math.max(newRatio, 10), 90)
    setSplitRatio(constrainedRatio)
  }

  const handleMouseUp = () => {
    isDraggingRef.current = false
    document.body.style.cursor = 'default'
    document.body.style.userSelect = ''
    
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  const handleSubmit = () => {
    if (!currentCode.trim()) {
      setSubmissionResult("error")
      return
    }

    const isCorrect = Math.random() > 0.5
    setSubmissionResult(isCorrect ? "correct" : "wrong")

    if (isCorrect) {
      setSolvedCount((s) => s + 1)
      setTimeout(() => {
        if (currentProblemIndex < problems.length - 1) {
          setCurrentProblemIndex(currentProblemIndex + 1)
          setCurrentCode("")
          setSubmissionResult(null)
        }
      }, 2000)
    }
  }

  const canViewAnalysis = solvedCount >= problems.length

  if (currentView === "analysis") {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-bold text-foreground">CodePlatform</h1>
              <nav className="flex gap-4">
                <Button variant="ghost" onClick={() => setCurrentView("coding")} className="gap-2">
                  <Play className="h-4 w-4" />
                  Problems
                </Button>
                {canViewAnalysis && (
                  <Button variant="default" className="gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Analysis
                  </Button>
                )}
              </nav>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <TimerIcon className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Overall</span>
                <span className="font-medium text-foreground">{formatTime(totalTime)}</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <TimerIcon className="h-4 w-4 text-accent" />
                <span className="text-muted-foreground">Current</span>
                <span className="font-medium text-foreground">{formatTime(currentTime)}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Analysis Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card p-4 rounded-lg border">
              <h3 className="font-semibold">Problems Solved</h3>
              <p className="text-2xl font-bold text-primary">{solvedCount}</p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <h3 className="font-semibold">Average Time</h3>
              <p className="text-2xl font-bold text-primary">0:00</p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <h3 className="font-semibold">Success Rate</h3>
              <p className="text-2xl font-bold text-primary">0%</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-foreground">CodePlatform</h1>
            <nav className="flex gap-4">
              <Button variant="default" className="gap-2">
                <Play className="h-4 w-4" />
                Problems
              </Button>
              {canViewAnalysis && (
                <Button variant="ghost" onClick={() => setCurrentView("analysis")} className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analysis
                </Button>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <TimerIcon className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Overall</span>
              <span className="font-medium text-foreground">{formatTime(totalTime)}</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <TimerIcon className="h-4 w-4 text-accent" />
              <span className="text-muted-foreground">Current</span>
              <span className="font-medium text-foreground">{formatTime(currentTime)}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col h-[calc(100vh-73px)]">
        <div className="px-6 py-4 border-b border-border bg-card">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              {currentProblem.id}. {currentProblem.title}
            </h2>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden" ref={containerRef}>
          <div 
            className="border-r border-border overflow-auto bg-card/80" 
            style={{ width: `${splitRatio}%` }}
          >
            <ProblemDisplay problem={currentProblem} />
          </div>
          
          <div 
            className="w-1 hover:w-2 bg-border hover:bg-primary cursor-col-resize flex-shrink-0 transition-colors"
            onMouseDown={handleMouseDown}
          />
          
          <div 
            className="flex flex-col overflow-auto" 
            style={{ width: `${100 - splitRatio}%` }}
          >
            <div className="flex flex-col h-full p-4">
              <div className="flex items-center justify-between mb-3 px-3 py-2 bg-card/80 rounded-t-lg border border-border shadow-sm">
                <h3 className="font-medium text-sm">Code Editor</h3>
                <div className="flex gap-2 items-center">
                  <span className="text-xs text-muted-foreground">Language:</span>
                  <select 
                    value={currentLanguage}
                    onChange={(e) => setCurrentLanguage(e.target.value as any)}
                    className="text-xs bg-background border border-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="cpp">C++</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="javascript">JavaScript</option>
                  </select>
                </div>
              </div>
              
              <div className="flex-1 rounded-b-lg overflow-hidden shadow-lg border border-border border-t-0 bg-white dark:bg-slate-900">
                <CodeEditor
                  onCodeChange={setCurrentCode}
                  onLanguageChange={setCurrentLanguage}
                  initialLanguage={currentLanguage}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {submissionResult && (
                <div className="flex items-center gap-2">
                  {submissionResult === "correct" && (
                    <>
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span className="font-medium text-primary">Accepted! Moving to next problem...</span>
                    </>
                  )}
                  {submissionResult === "wrong" && (
                    <>
                      <XCircle className="h-5 w-5 text-destructive" />
                      <span className="font-medium text-destructive">Wrong Answer</span>
                    </>
                  )}
                  {submissionResult === "error" && (
                    <>
                      <XCircle className="h-5 w-5 text-destructive" />
                      <span className="font-medium text-destructive">Please write some code</span>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
                Submit Solution
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
