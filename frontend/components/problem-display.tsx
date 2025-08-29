import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Lightbulb } from "lucide-react"

interface Example {
  input: string
  output: string
  explanation?: string
}

interface Problem {
  id: number
  title: string
  description: string
  examples: Example[]
  constraints: string[]
  topics: string[]
  companies: string[]
  hasHint: boolean
}

interface ProblemDisplayProps {
  problem: Problem
}

export function ProblemDisplay({ problem }: ProblemDisplayProps) {
  const topics = problem.topics ?? []
  const companies = problem.companies ?? []
  const hasHint = problem.hasHint ?? false

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Problem Header */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            
            {topics.length > 0 && (
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                Topics
              </Badge>
            )}

            {companies.length > 0 && (
              <Badge variant="outline" className="gap-1">
                <Users className="h-3 w-3" />
                Companies
              </Badge>
            )}

            {hasHint && (
              <Badge variant="outline" className="gap-1">
                <Lightbulb className="h-3 w-3" />
                Hint
              </Badge>
            )}
          </div>

          {/* Problem Description */}
          <div className="prose prose-sm max-w-none text-foreground">
            <div className="leading-relaxed" dangerouslySetInnerHTML={{ __html: problem.description }} />
          </div>
        </div>

        {/* Examples */}
        <div className="space-y-4">
          {problem.examples.map((example, index) => (
            <div key={index}>
              <h3 className="font-semibold text-foreground mb-3">Example {index + 1}:</h3>
              <Card className="p-4 bg-muted/30 border-l-4 border-l-primary">
                <div className="space-y-3 text-sm font-mono">
                  <div className="space-y-1">
                    <div className="text-foreground">
                      <span className="font-semibold text-primary">Input:</span> {example.input}
                    </div>
                    <div className="text-foreground">
                      <span className="font-semibold text-primary">Output:</span> {example.output}
                    </div>
                  </div>

                  {example.explanation && (
                    <div className="pt-2 border-t border-border">
                      <div className="text-muted-foreground font-sans">
                        <span className="font-semibold text-foreground">Explanation:</span> {example.explanation}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Constraints */}
        {problem.constraints.length > 0 && (
          <div>
            <h3 className="font-semibold text-foreground mb-3">Constraints:</h3>
            <Card className="p-4 bg-card border-l-4 border-l-secondary">
              <ul className="text-sm text-muted-foreground space-y-2">
                {problem.constraints.map((constraint, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <code className="bg-muted px-2 py-1 rounded text-xs font-mono text-foreground">{constraint}</code>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        )}

        {/* Follow-up */}
        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Follow-up:</span> Could you solve it in O(m + n) time complexity?
          </p>
        </div>
      </div>
    </div>
  )
}
