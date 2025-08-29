"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Play, BarChart3, CheckCircle, XCircle, TimerIcon, Loader2 } from "lucide-react"
import { ProblemDisplay } from "@/components/problem-display"
import { CodeEditor } from "@/components/code-editor"
import { useTimer } from "@/hooks/use-timer"

// Define problem type for TypeScript
interface Problem {
  id: number
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  description: string
  examples: Array<{
    input: string
    output: string
    explanation?: string
  }>
  constraints: string[]
}

export default function HomePage() {
  const [currentView, setCurrentView] = useState<"coding" | "analysis">("coding")
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [submissionResult, setSubmissionResult] = useState<string | null>(null)
  const [currentCode, setCurrentCode] = useState("")
  const [currentLanguage, setCurrentLanguage] = useState<"cpp" | "python" | "java" | "javascript">("cpp")
  const [solvedCount, setSolvedCount] = useState(0)
  const [splitRatio, setSplitRatio] = useState(50) // 50% split initially
  const isDraggingRef = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const { currentTime, totalTime, formatTime, resetCurrentTimer } = useTimer()

  // Fetch the first problem when the component mounts
  useEffect(() => {
    fetchProblem(1)
  }, [])

  // Fetch a problem by ID
  const fetchProblem = async (id: number) => {
    try {
      setIsLoading(true)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/problems/${id}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch problem: ${response.statusText}`)
      }
      
      const problem = await response.json()
      setCurrentProblem(problem)
      setCurrentCode("")  // Clear the code editor
      setSubmissionResult(null)  // Reset submission status
      resetCurrentTimer()  // Reset the timer for this problem
    } catch (error) {
      console.error("Error fetching problem:", error)
    } finally {
      setIsLoading(false)
    }
  }

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

  const handleSubmit = async () => {
    if (!currentCode.trim() || !currentProblem) {
      setSubmissionResult("error")
      return
    }

    try {
      // Show loading state
      setSubmissionResult("loading")
      
      // Send code to backend for evaluation
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/submission`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problemId: currentProblem.id,
          code: currentCode,
          language: currentLanguage
        }),
      })

      if (!response.ok) {
        throw new Error('Submission failed')
      }

      const result = await response.json()
      setSubmissionResult(result.status) // "Accepted", "Wrong Answer", etc.

      if (result.status === "Accepted") {
        setSolvedCount((s) => s + 1)
        
        // Fetch next problem after a delay
        setTimeout(() => {
          // Get the next problem ID by incrementing current ID
          const nextProblemId = currentProblem.id + 1
          fetchProblem(nextProblemId)
        }, 2000)
      }
    } catch (error) {
      console.error('Error submitting solution:', error)
      setSubmissionResult("error")
    }
  }

  const canViewAnalysis = solvedCount > 0

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
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <h2 className="text-lg font-semibold text-foreground">Loading problem...</h2>
              </div>
            ) : currentProblem ? (
              <h2 className="text-lg font-semibold text-foreground">
                {currentProblem.id}. {currentProblem.title}
              </h2>
            ) : (
              <h2 className="text-lg font-semibold text-destructive">
                No more problems available
              </h2>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : currentProblem ? (
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
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="max-w-md p-6 text-center">
              <h3 className="text-xl font-bold mb-2">Congratulations!</h3>
              <p>You've completed all the available problems.</p>
            </div>
          </div>
        )}

        <div className="border-t border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {submissionResult && (
                <div className="flex items-center gap-2">
                  {submissionResult === "Accepted" && (
                    <>
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span className="font-medium text-primary">Accepted! Moving to next problem...</span>
                    </>
                  )}
                  {submissionResult === "Wrong Answer" && (
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
                  {submissionResult === "loading" && (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span className="font-medium text-muted-foreground">Submitting...</span>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={handleSubmit} 
                className="bg-primary hover:bg-primary/90"
                disabled={isLoading || !currentProblem}
              >
                Submit Solution
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
