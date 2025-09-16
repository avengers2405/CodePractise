"use client"

import { useState, useEffect, useRef, useCallback } from "react"

export function useTimer() {
  const [currentTime, setCurrentTime] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const currentIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const totalIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Start timers
  const startTimers = useCallback(() => {
    if (isRunning) return

    setIsRunning(true)

    // Start current problem timer
    currentIntervalRef.current = setInterval(() => {
      setCurrentTime((prev) => prev + 1)
    }, 1000)

    // Start total time timer
    totalIntervalRef.current = setInterval(() => {
      setTotalTime((prev) => prev + 1)
    }, 1000)
  }, [isRunning])

  // Stop timers
  const stopTimers = useCallback(() => {
    setIsRunning(false)

    if (currentIntervalRef.current) {
      clearInterval(currentIntervalRef.current)
      currentIntervalRef.current = null
    }

    if (totalIntervalRef.current) {
      clearInterval(totalIntervalRef.current)
      totalIntervalRef.current = null
    }
  }, [])

  // Reset current timer only (for new problems)
  const resetCurrentTimer = useCallback(() => {
    setCurrentTime(0)
  }, [])

  // Reset all timers
  const resetAllTimers = useCallback(() => {
    stopTimers()
    setCurrentTime(0)
    setTotalTime(0)
  }, [stopTimers])

  // Format time as MM:SS
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimers()
    }
  }, [stopTimers])

  return {
    currentTime,
    totalTime,
    isRunning,
    startTimers,
    stopTimers,
    resetCurrentTimer,
    resetAllTimers,
    formatTime,
  }
}
