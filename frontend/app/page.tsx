"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Play, BarChart3, CheckCircle, XCircle, TimerIcon, Loader2, X } from "lucide-react"
import { ProblemDisplay } from "@/components/problem-display"
import { CodeEditor } from "@/components/code-editor"
import { useTimer } from "@/hooks/use-timer"
import { nanoid } from 'nanoid'


interface Problem {
  id: number
  title: string
  description: string
  examples: Array<{
    input: string
    output: string
    explanation?: string
  }>
  constraints: string[]
}

interface CookieValues {
  VJ_cf_clearance: string
  VJ_ext_name: string
  VJ_JSESSIONID: string
}

const CookieDialog = ({ 
  cookieValues, 
  setCookieValues, 
  validatingCookies, 
  cookieError, 
  onSubmit 
}: {
  cookieValues: CookieValues
  setCookieValues: React.Dispatch<React.SetStateAction<CookieValues>>
  validatingCookies: boolean
  cookieError: string
  onSubmit: () => void
}) => {
  // Use useCallback to prevent function recreation
  const handleCfClearanceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCookieValues(prev => ({...prev, VJ_cf_clearance: e.target.value}))
  }, [setCookieValues])

  const handleExtNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCookieValues(prev => ({...prev, VJ_ext_name: e.target.value}))
  }, [setCookieValues])

  const handleJSessionIdChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCookieValues(prev => ({...prev, VJ_JSESSIONID: e.target.value}))
  }, [setCookieValues])

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border shadow-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">VJudge Cookie Configuration</h2>
        </div>
        
        <p className="text-sm text-muted-foreground mb-6">
          Please enter your VJudge cookies to continue. You can find these in your browser's developer tools.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">VJ_cf_clearance</label>
            <input
              type="text"
              value={cookieValues.VJ_cf_clearance}
              onChange={handleCfClearanceChange}
              className="w-full p-2 border rounded-md bg-background text-foreground"
              placeholder="Enter VJ_cf_clearance value"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">VJ_ext_name</label>
            <input
              type="text"
              value={cookieValues.VJ_ext_name}
              onChange={handleExtNameChange}
              className="w-full p-2 border rounded-md bg-background text-foreground"
              placeholder="Enter VJ_ext_name value"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">VJ_JSESSIONID</label>
            <input
              type="text"
              value={cookieValues.VJ_JSESSIONID}
              onChange={handleJSessionIdChange}
              className="w-full p-2 border rounded-md bg-background text-foreground"
              placeholder="Enter VJ_JSESSIONID value"
            />
          </div>
        </div>
        
        {cookieError && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive">{cookieError}</p>
          </div>
        )}
        
        <div className="flex gap-3 mt-6">
          <Button 
            onClick={onSubmit}
            disabled={validatingCookies || !cookieValues.VJ_cf_clearance || !cookieValues.VJ_ext_name || !cookieValues.VJ_JSESSIONID}
            className="flex-1"
          >
            {validatingCookies ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Validating...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const [currentView, setCurrentView] = useState<"coding" | "analysis">("coding")
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [submissionResult, setSubmissionResult] = useState<string | null>(null)
  const [currentCode, setCurrentCode] = useState("")
  const [currentLanguage, setCurrentLanguage] = useState<"cpp" | "python" | "java" | "javascript">("cpp")
  const [solvedCount, setSolvedCount] = useState(0)
  const [splitRatio, setSplitRatio] = useState(50)
  const isDraggingRef = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [testId, setTestId] = useState<string | null>(null)
  const [testActive, setTestActive] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  // Cookie validation states
  const [showCookieDialog, setShowCookieDialog] = useState(false)
  const [cookiesValid, setCookiesValid] = useState(false)
  const [cookieValues, setCookieValues] = useState<CookieValues>({
    VJ_cf_clearance: "",
    VJ_ext_name: "",
    VJ_JSESSIONID: ""
  })
  const [validatingCookies, setValidatingCookies] = useState(false)
  const [cookieError, setCookieError] = useState("")

  const { currentTime, totalTime, formatTime, resetCurrentTimer, startTimers, stopTimers, resetAllTimers } = useTimer()

  // Cookie management functions
  const getCookie = (name: string): string => {
    if (typeof document === 'undefined') return ""
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(';').shift() || ""
    return ""
  }

  const setCookie = (name: string, value: string) => {
    if (typeof document === 'undefined') return
    document.cookie = `${name}=${value}; path=/; max-age=86400` // 24 hours
  }

  const validateCookies = async (cookies: CookieValues): Promise<boolean> => {
    try {
      const cookieString = `JSESSIONID=${cookies.VJ_JSESSIONID}; ext_name=${cookies.VJ_ext_name}; cf_clearance=${cookies.VJ_cf_clearance}`

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/credentials/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ cookieString })
      })

      const responseText = await response.text()
      console.log('response: '+responseText)
      return responseText.includes("avengers2")
    } catch (error) {
      console.error("Error validating cookies:", error)
      return false
    }
  }

  const handleCookieSubmit = async () => {
    setValidatingCookies(true)
    setCookieError("")
    
    try {
      const isValid = await validateCookies(cookieValues)
      if (isValid) {
        // Save cookies
        setCookie("VJ_cf_clearance", cookieValues.VJ_cf_clearance)
        setCookie("VJ_ext_name", cookieValues.VJ_ext_name)
        setCookie("VJ_JSESSIONID", cookieValues.VJ_JSESSIONID)
        
        setCookiesValid(true)
        setShowCookieDialog(false)
        setCookieError("")
        
        // Check for test session after successful validation
        const storedTestId = localStorage.getItem('test_id')
        if (storedTestId) {
          checkTestStatus(storedTestId)
        } else {
          setCheckingSession(false)
        }
      } else {
        setCookieError("Invalid cookies. Please check the values and try again.")
      }
    } catch (error) {
      setCookieError("Failed to validate cookies. Please check your network connection.")
    } finally {
      setValidatingCookies(false)
    }
  }

  // Check for existing session on component mount
  useEffect(() => {
    console.log("cookiesValid useEffect vala useEffect runs: "+cookiesValid);
    const initializeApp = async () => {
      const vjCfClearance = getCookie("VJ_cf_clearance")
      const vjExtName = getCookie("VJ_ext_name")
      const vjJSessionId = getCookie("VJ_JSESSIONID")

      if (vjCfClearance && vjExtName && vjJSessionId) {
        const cookies = {
          VJ_cf_clearance: vjCfClearance,
          VJ_ext_name: vjExtName,
          VJ_JSESSIONID: vjJSessionId
        }

        // Set the values first, then validate
        setCookieValues(cookies)
        
        const isValid = await validateCookies(cookies)
        if (isValid) {
          setCookiesValid(true)
          setShowCookieDialog(false)
          
          // Check for test session
          const storedTestId = localStorage.getItem('test_id')
          if (storedTestId) {
            checkTestStatus(storedTestId)
          } else {
            setCheckingSession(false)
          }
        } else {
          setCookiesValid(false)
          setShowCookieDialog(true)
          setCheckingSession(false)
        }
      } else {
        setCookiesValid(false)
        setShowCookieDialog(true)
        setCheckingSession(false)
      }
    }

    initializeApp()
  }, []) // Only run once on mount

  // Add a separate useEffect to handle test session checking only when cookies become valid
  // useEffect(() => {
  //   console.log("cookiesValid useEffect vala useEffect runs: "+cookiesValid);
  //   if (cookiesValid) {
  //     const storedTestId = localStorage.getItem('test_id')
  //     if (storedTestId) {
  //       checkTestStatus(storedTestId)
  //     } else {
  //       setCheckingSession(false)
  //     }
  //   }
  // }, [cookiesValid])

  // Check if test is active with backend
  const checkTestStatus = async (id: string) => {
    try {
      setCheckingSession(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/test/validate_id/${id}`)
      
      if (!response.ok) {
        throw new Error("Failed to check test status")
      }
      
      const { active } = await response.json()
      
      if (active) {
        // Test is active, set test ID and fetch current problem
        setTestId(id)
        setTestActive(true)
        fetchCurrentProblem(id)
      } else {
        // Test is not active, clear stored test ID
        localStorage.removeItem('test_id')
        setTestId(null)
        setTestActive(false)
      }
    } catch (error) {
      console.error("Error checking test status:", error)
      // On error, assume test is not active
      localStorage.removeItem('test_id')
      setTestId(null)
      setTestActive(false)
    } finally {
      setCheckingSession(false)
    }
  }

  // Start a new test
  const startNewTest = async () => {
    try {
      setIsLoading(true)
      
      // Hit backend with GET request to get a new testId
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/test/start`, {
        method: 'GET',
      })
      
      if (!response.ok) {
        throw new Error("Failed to start new test")
      }

      const res = await response.json();
      
      // Store test ID in localStorage
      localStorage.setItem('test_id', res.testid)
      setTestId(res.testid)
      setTestActive(true)
      
      // Fetch first problem (timer will start when problem loads)
      fetchCurrentProblem(res.testid)
    } catch (error) {
      console.error("Error starting new test:", error)
      setTestId(null)
      setTestActive(false)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch current problem using test ID
  const fetchCurrentProblem = async (id: string) => {
    try {
      setIsLoading(true)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/test/${id}/problem`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch problem: ${response.statusText}`)
      }
      
      const problem = await response.json()
      setCurrentProblem(problem)
      setCurrentCode("")  // Clear the code editor
      setSubmissionResult(null)  // Reset submission status
      
      // Start timers only when the first problem appears
      if (!currentProblem) {
        startTimers()  // Start both global and per-problem timers
      } else {
        resetCurrentTimer()  // Reset only current timer for subsequent problems
      }
      
    } catch (error) {
      console.error("Error fetching problem:", error)
      setCurrentProblem(null)
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
    if (!currentCode.trim() || !currentProblem || !testId) {
      setSubmissionResult("error")
      return
    }

    try {
      // Show loading state
      setSubmissionResult("loading")
      
      // Send code to backend for evaluation with testId
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/test/${testId}/submission`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
          fetchCurrentProblem(testId)
        }, 2000)
      }
    } catch (error) {
      console.error('Error submitting solution:', error)
      setSubmissionResult("error")
    }
  }

  const endTest = () => {
    // Stop and reset all timers
    stopTimers()
    resetAllTimers()
    
    // Clear test session
    localStorage.removeItem('test_id')
    setTestId(null)
    setTestActive(false)
    setCurrentProblem(null)
  }

  const canViewAnalysis = solvedCount > 0
  return (
    <div className="min-h-screen bg-background relative">
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
            {testActive && (
              <>
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
                <div className="h-4 w-px bg-border" />
                <Button 
                  variant="ghost" 
                  onClick={endTest} 
                  size="sm" 
                  className="text-destructive"
                >
                  End Test
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Show loading state while checking session */}
      {checkingSession ? (
        <div className="flex flex-col h-[calc(100vh-73px)] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Checking test session...</p>
        </div>
      ) : testActive ? (
        // Active test UI - Similar to existing UI
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
                  {currentProblem.title}
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
      ) : (
      <div className="flex flex-col h-[calc(100vh-73px)] items-center justify-center bg-gradient-to-b from-background to-background/80 p-6">
        <div className="max-w-2xl w-full bg-card/80 backdrop-blur-sm rounded-xl border border-border/40 p-12 shadow-lg">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Play className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Welcome to CodePractice
            </h1>
            <p className="text-lg text-muted-foreground text-center max-w-md">
              Sharpen your programming skills by solving challenging algorithm problems
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-3 mb-8">
            <div className="flex items-center p-4 rounded-lg bg-primary/5 border border-primary/10">
              <div className="bg-primary/10 rounded-full p-2 mr-4">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <span>Solve algorithmic challenges with real-time feedback</span>
            </div>
            <div className="flex items-center p-4 rounded-lg bg-primary/5 border border-primary/10">
              <div className="bg-primary/10 rounded-full p-2 mr-4">
                <TimerIcon className="h-5 w-5 text-primary" />
              </div>
              <span>Track your problem-solving times and progress</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-5 mt-8">
            <Button 
              size="lg" 
              className="w-full py-6 text-lg rounded-lg shadow-md transition-all hover:shadow-lg hover:translate-y-[-2px]" 
              onClick={startNewTest}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-3 animate-spin" /> 
                  Starting your session...
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-3" /> 
                  Begin Coding Challenge
                </>
              )}
            </Button>
            
            {canViewAnalysis && (
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full py-5 text-lg rounded-lg border-primary/20 hover:bg-primary/5" 
                onClick={() => setCurrentView("analysis")}
              >
                <BarChart3 className="h-5 w-5 mr-3" /> 
                View Your Progress
              </Button>
            )}
          </div>
          
          <div className="mt-10 pt-6 border-t border-border/40 text-center text-sm text-muted-foreground">
            Ready to improve your coding skills? Start a new challenge now.
          </div>
        </div>
      </div>
    )}

    {/* Cookie Dialog Overlay - Always rendered when needed */}
    {(showCookieDialog || !cookiesValid) && <CookieDialog 
    cookieValues={cookieValues}
          setCookieValues={setCookieValues}
          validatingCookies={validatingCookies}
          cookieError={cookieError}
          onSubmit={handleCookieSubmit} />}
    </div>
  )
}
