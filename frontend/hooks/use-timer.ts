"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface TimerState {
  currentTime: number
  totalTime: number
  isRunning: boolean
}

export function useTimer() {
  const [timerState, setTimerState] = useState<TimerState>({
    currentTime: 0,
    totalTime: 0,
    isRunning: true,
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(Date.now())
  const pausedTimeRef = useRef<number>(0)

  useEffect(() => {
    if (timerState.isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      startTimeRef.current = Date.now() - pausedTimeRef.current

      intervalRef.current = setInterval(() => {
        const now = Date.now()
        const elapsed = Math.floor((now - startTimeRef.current) / 1000)

        setTimerState((prev) => ({
          ...prev,
          currentTime: elapsed,
          totalTime: elapsed,
        }))
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      pausedTimeRef.current = timerState.currentTime * 1000
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [timerState.isRunning]) // Only depend on isRunning, not the entire state

  const resetCurrentTimer = useCallback(() => {
    startTimeRef.current = Date.now()
    pausedTimeRef.current = 0
    setTimerState((prev) => ({
      ...prev,
      currentTime: 0,
    }))
  }, [])

  const pauseTimer = useCallback(() => {
    setTimerState((prev) => ({
      ...prev,
      isRunning: false,
    }))
  }, [])

  const resumeTimer = useCallback(() => {
    setTimerState((prev) => ({
      ...prev,
      isRunning: true,
    }))
  }, [])

  const formatTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }, [])

  return {
    currentTime: timerState.currentTime,
    totalTime: timerState.totalTime,
    isRunning: timerState.isRunning,
    formatTime,
    resetCurrentTimer,
    pauseTimer,
    resumeTimer,
  }
}
