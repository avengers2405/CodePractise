"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CheckCircle, Timer, Clock, Target, TrendingUp, Code, Eye } from "lucide-react"
import { ProblemDisplay } from "@/components/problem-display"
import { getProblemById, sampleProblems } from "@/lib/problem-data"

interface AnalyticsData {
  totalProblems: number
  solvedProblems: number
  totalTime: number
  averageTime: number
  totalAttempts: number
  successRate: number
  favoriteLanguage: string
  problemAttempts: Record<number, any>
}

interface AnalysisDashboardProps {
  analytics: AnalyticsData
}

export function AnalysisDashboard({ analytics }: AnalysisDashboardProps) {
  const [selectedProblemId, setSelectedProblemId] = useState<number | null>(null)

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-primary/10 text-primary border-primary/20"
      case "Medium":
        return "bg-secondary/10 text-secondary-foreground border-secondary/20"
      case "Hard":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusIcon = (problemId: number) => {
    const attempt = analytics.problemAttempts[problemId]
    if (attempt?.status === "solved") {
      return <CheckCircle className="h-5 w-5 text-primary" />
    } else if (attempt?.status === "attempted") {
      return <Timer className="h-5 w-5 text-secondary" />
    }
    return <Clock className="h-5 w-5 text-muted-foreground" />
  }

  const selectedProblem = selectedProblemId ? getProblemById(selectedProblemId) : null
  const selectedAttempt = selectedProblemId ? analytics.problemAttempts[selectedProblemId] : null

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Performance Analysis</h2>
          <p className="text-muted-foreground">Track your progress and review your solutions</p>
        </div>

        {/* Analytics Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{analytics.solvedProblems}</div>
                <div className="text-sm text-muted-foreground">Problems Solved</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Clock className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{formatTime(analytics.averageTime)}</div>
                <div className="text-sm text-muted-foreground">Avg Time</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{analytics.successRate}%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <Code className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{analytics.favoriteLanguage.toUpperCase()}</div>
                <div className="text-sm text-muted-foreground">Favorite Lang</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Problems List */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Problem History</h3>
          <div className="space-y-3">
            {sampleProblems.map((problem) => {
              const attempt = analytics.problemAttempts[problem.id]
              return (
                <div
                  key={problem.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {getStatusIcon(problem.id)}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground">{problem.title}</span>
                        <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {attempt?.timeSpent && <span>Time: {formatTime(attempt.timeSpent)}</span>}
                        <span>Attempts: {attempt?.attempts || 0}</span>
                        {attempt?.language && <span>Language: {attempt.language.toUpperCase()}</span>}
                        {attempt?.testCasesPassed && (
                          <span>
                            Tests: {attempt.testCasesPassed}/{attempt.totalTestCases}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedProblemId(problem.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            {problem.id}. {problem.title}
                            <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
                          </DialogTitle>
                        </DialogHeader>

                        {selectedProblem && (
                          <Tabs defaultValue="problem" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                              <TabsTrigger value="problem">Problem</TabsTrigger>
                              <TabsTrigger value="solution">My Solution</TabsTrigger>
                              <TabsTrigger value="stats">Statistics</TabsTrigger>
                            </TabsList>

                            <TabsContent value="problem" className="mt-4">
                              <ProblemDisplay problem={selectedProblem} />
                            </TabsContent>

                            <TabsContent value="solution" className="mt-4">
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold text-foreground">Solution Code</h4>
                                  {selectedAttempt?.language && (
                                    <Badge variant="outline">{selectedAttempt.language.toUpperCase()}</Badge>
                                  )}
                                </div>
                                <Card className="p-4">
                                  <pre className="text-sm font-mono text-foreground whitespace-pre-wrap overflow-x-auto">
                                    {selectedAttempt?.code || "No code submitted yet"}
                                  </pre>
                                </Card>
                              </div>
                            </TabsContent>

                            <TabsContent value="stats" className="mt-4">
                              <div className="grid grid-cols-2 gap-4">
                                <Card className="p-4">
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Time Taken:</span>
                                      <span className="font-medium">
                                        {selectedAttempt?.timeSpent ? formatTime(selectedAttempt.timeSpent) : "N/A"}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Attempts:</span>
                                      <span className="font-medium">{selectedAttempt?.attempts || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Language:</span>
                                      <span className="font-medium">
                                        {selectedAttempt?.language?.toUpperCase() || "N/A"}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Status:</span>
                                      <Badge variant={selectedAttempt?.status === "solved" ? "default" : "secondary"}>
                                        {selectedAttempt?.status || "not attempted"}
                                      </Badge>
                                    </div>
                                  </div>
                                </Card>

                                <Card className="p-4">
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Test Cases:</span>
                                      <span className="font-medium">
                                        {selectedAttempt?.testCasesPassed
                                          ? `${selectedAttempt.testCasesPassed}/${selectedAttempt.totalTestCases}`
                                          : "N/A"}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Submitted:</span>
                                      <span className="font-medium">
                                        {selectedAttempt?.submittedAt
                                          ? new Date(selectedAttempt.submittedAt).toLocaleString()
                                          : "N/A"}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Difficulty:</span>
                                      <Badge className={getDifficultyColor(selectedProblem.difficulty)}>
                                        {selectedProblem.difficulty}
                                      </Badge>
                                    </div>
                                  </div>
                                </Card>
                              </div>
                            </TabsContent>
                          </Tabs>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}
