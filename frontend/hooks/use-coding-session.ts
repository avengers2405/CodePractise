"use client"

import { useState, useCallback } from "react"
import { sampleProblems } from "@/lib/problem-data"

export interface ProblemAttempt {
  problemId: number
  code: string
  language: string
  attempts: number
  timeSpent: number
  status: "solved" | "attempted" | "current"
  submittedAt: string
  testCasesPassed?: number
  totalTestCases?: number
}

export interface SessionState {
  currentProblemId: number
  currentProblemIndex: number
  totalSessionTime: number
  problemAttempts: Record<number, ProblemAttempt>
  completedProblems: number[]
}

export function useCodingSession() {
  const [sessionState, setSessionState] = useState<SessionState>({
    currentProblemId: sampleProblems[0]?.id || 1,
    currentProblemIndex: 0,
    totalSessionTime: 0,
    problemAttempts: {},
    completedProblems: [],
  })

  const updateProblemAttempt = useCallback((problemId: number, updates: Partial<ProblemAttempt>) => {
    setSessionState((prev) => {
      const currentAttempt = prev.problemAttempts[problemId]
      const newAttempt = {
        problemId,
        code: "",
        language: "cpp",
        attempts: 0,
        timeSpent: 0,
        status: "current" as const,
        submittedAt: "",
        ...currentAttempt,
        ...updates,
      }

      return {
        ...prev,
        problemAttempts: {
          ...prev.problemAttempts,
          [problemId]: newAttempt,
        },
      }
    })
  }, [])

  const markProblemSolved = useCallback((problemId: number, timeSpent: number) => {
    setSessionState((prev) => ({
      ...prev,
      completedProblems: prev.completedProblems.includes(problemId)
        ? prev.completedProblems
        : [...prev.completedProblems, problemId],
      problemAttempts: {
        ...prev.problemAttempts,
        [problemId]: {
          ...prev.problemAttempts[problemId],
          status: "solved",
          timeSpent,
          submittedAt: new Date().toISOString(),
        },
      },
    }))
  }, [])

  const moveToNextProblem = useCallback(() => {
    const currentIndex = sampleProblems.findIndex((p) => p.id === sessionState.currentProblemId)
    const nextIndex = currentIndex + 1

    if (nextIndex < sampleProblems.length) {
      const nextProblem = sampleProblems[nextIndex]
      setSessionState((prev) => ({
        ...prev,
        currentProblemId: nextProblem.id,
        currentProblemIndex: nextIndex,
      }))
      return nextProblem.id
    }

    return null
  }, [sessionState.currentProblemId])

  const goToProblem = useCallback((problemId: number) => {
    const problemIndex = sampleProblems.findIndex((p) => p.id === problemId)
    if (problemIndex !== -1) {
      setSessionState((prev) => ({
        ...prev,
        currentProblemId: problemId,
        currentProblemIndex: problemIndex,
      }))
    }
  }, [])

  const updateSessionTime = useCallback((totalTime: number) => {
    setSessionState((prev) => ({
      ...prev,
      totalSessionTime: totalTime,
    }))
  }, [])

  const resetSession = useCallback(() => {
    setSessionState({
      currentProblemId: sampleProblems[0]?.id || 1,
      currentProblemIndex: 0,
      totalSessionTime: 0,
      problemAttempts: {},
      completedProblems: [],
    })
  }, [])

  const getAnalytics = useCallback(() => {
    const attempts = Object.values(sessionState.problemAttempts)
    const solved = attempts.filter((a) => a.status === "solved")
    const totalAttempts = attempts.reduce((sum, a) => sum + (a.attempts || 0), 0)
    const totalTimeSpent = solved.reduce((sum, a) => sum + (a.timeSpent || 0), 0)

    const languageCount = attempts.reduce(
      (acc, a) => {
        if (a.language) {
          acc[a.language] = (acc[a.language] || 0) + 1
        }
        return acc
      },
      {} as Record<string, number>,
    )

    const favoriteLanguage = Object.entries(languageCount).reduce(
      (a, b) => (languageCount[a[0]] > languageCount[b[0]] ? a : b),
      ["cpp", 0],
    )[0]

    return {
      totalProblems: sampleProblems.length,
      solvedProblems: solved.length,
      totalTime: totalTimeSpent,
      averageTime: solved.length > 0 ? Math.floor(totalTimeSpent / solved.length) : 0,
      totalAttempts,
      successRate: attempts.length > 0 ? Math.round((solved.length / attempts.length) * 100) : 0,
      favoriteLanguage,
      problemAttempts: sessionState.problemAttempts,
    }
  }, [sessionState.problemAttempts])

  return {
    sessionState,
    updateProblemAttempt,
    markProblemSolved,
    moveToNextProblem,
    goToProblem,
    updateSessionTime,
    resetSession,
    getAnalytics,
  }
}
