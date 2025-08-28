export interface SubmissionResult {
  status: "correct" | "wrong" | "error"
  message: string
  testCasesPassed?: number
  totalTestCases?: number
  executionTime?: string
}

export interface TestCase {
  input: string
  expectedOutput: string
  description?: string
}

// Simple code evaluation for demo purposes
export function evaluateCode(code: string, language: string, problemId: number): Promise<SubmissionResult> {
  return new Promise((resolve) => {
    // Simulate processing time
    setTimeout(() => {
      // Basic validation
      if (!code.trim()) {
        resolve({
          status: "error",
          message: "Code cannot be empty",
        })
        return
      }

      // Simple heuristic-based evaluation for demo
      const codeLength = code.trim().length
      const hasReturnStatement = /return\s+/.test(code)
      const hasLoopOrCondition = /(for|while|if)\s*\(/.test(code)

      // Simulate different outcomes based on code characteristics
      let score = 0
      if (codeLength > 50) score += 1
      if (hasReturnStatement) score += 1
      if (hasLoopOrCondition) score += 1

      // Add some randomness for demo
      const randomFactor = Math.random()

      if (score >= 2 && randomFactor > 0.3) {
        const testCasesPassed = Math.floor(Math.random() * 3) + 8 // 8-10 passed
        resolve({
          status: "correct",
          message: "Accepted! All test cases passed.",
          testCasesPassed,
          totalTestCases: 10,
          executionTime: `${Math.floor(Math.random() * 50) + 10}ms`,
        })
      } else {
        const testCasesPassed = Math.floor(Math.random() * 5) + 3 // 3-7 passed
        const failureReasons = [
          "Wrong Answer - Expected different output for test case 3",
          "Time Limit Exceeded - Your solution is too slow",
          "Runtime Error - Index out of bounds",
          "Wrong Answer - Edge case not handled properly",
        ]

        resolve({
          status: "wrong",
          message: failureReasons[Math.floor(Math.random() * failureReasons.length)],
          testCasesPassed,
          totalTestCases: 10,
          executionTime: `${Math.floor(Math.random() * 100) + 20}ms`,
        })
      }
    }, 1500) // Simulate 1.5s processing time
  })
}

export function runCode(code: string, language: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simple code execution simulation
      if (!code.trim()) {
        resolve("Error: No code to run")
        return
      }

      // Simulate output based on language
      const outputs = {
        cpp: "Compiled successfully\nOutput: BANC",
        python: "Output: BANC",
        java: "Compiled successfully\nOutput: BANC",
        javascript: "Output: BANC",
      }

      resolve(outputs[language as keyof typeof outputs] || "Output: BANC")
    }, 800)
  })
}
