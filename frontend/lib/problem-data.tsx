export interface Example {
  input: string
  output: string
  explanation?: string
}

export interface Problem {
  id: number
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  description: string
  examples: Example[]
  constraints: string[]
  topics: string[]
  companies: string[]
  hasHint: boolean
}

export const sampleProblems: Problem[] = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    description: `Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.<br><br>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the <em>same</em> element twice.<br><br>You can return the answer in any order.`,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
      },
    ],
    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "-10⁹ ≤ target ≤ 10⁹",
      "Only one valid answer exists.",
    ],
    topics: ["Array", "Hash Table"],
    companies: ["Amazon", "Apple", "Google"],
    hasHint: false,
  },
  {
    id: 2,
    title: "Add Two Numbers",
    difficulty: "Medium",
    description: `You are given two <strong>non-empty</strong> linked lists representing two non-negative integers. The digits are stored in <strong>reverse order</strong>, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.<br><br>You may assume the two numbers do not contain any leading zero, except the number 0 itself.`,
    examples: [
      {
        input: "l1 = [2,4,3], l2 = [5,6,4]",
        output: "[7,0,8]",
        explanation: "342 + 465 = 807.",
      },
      {
        input: "l1 = [0], l2 = [0]",
        output: "[0]",
      },
      {
        input: "l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]",
        output: "[8,9,9,9,0,0,0,1]",
      },
    ],
    constraints: [
      "The number of nodes in each linked list is in the range [1, 100].",
      "0 ≤ Node.val ≤ 9",
      "It is guaranteed that the list represents a number that does not have leading zeros.",
    ],
    topics: ["Linked List", "Math", "Recursion"],
    companies: ["Amazon", "Microsoft", "Adobe"],
    hasHint: true,
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    description: `Given a string <code>s</code>, find the length of the <strong>longest substring</strong> without repeating characters.`,
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation: 'The answer is "abc", with the length of 3.',
      },
      {
        input: 's = "bbbbb"',
        output: "1",
        explanation: 'The answer is "b", with the length of 1.',
      },
      {
        input: 's = "pwwkew"',
        output: "3",
        explanation: 'The answer is "wke", with the length of 3.',
      },
    ],
    constraints: ["0 ≤ s.length ≤ 5 * 10⁴", "s consists of English letters, digits, symbols and spaces."],
    topics: ["Hash Table", "String", "Sliding Window"],
    companies: ["Amazon", "Bloomberg", "Adobe"],
    hasHint: true,
  },
  {
    id: 76,
    title: "Minimum Window Substring",
    difficulty: "Hard",
    description: `Given two strings <code>s</code> and <code>t</code> of lengths <code>m</code> and <code>n</code> respectively, return the <strong>minimum window substring</strong> of <code>s</code> such that every character in <code>t</code> <strong>(including duplicates)</strong> is included in the window. If there is no such substring, return the empty string <code>""</code>.<br><br>The testcases will be generated such that the answer is <strong>unique</strong>.`,
    examples: [
      {
        input: 's = "ADOBECODEBANC", t = "ABC"',
        output: '"BANC"',
        explanation: "The minimum window substring \"BANC\" includes 'A', 'B', and 'C' from string t.",
      },
      {
        input: 's = "a", t = "a"',
        output: '"a"',
        explanation: "The entire string s is the minimum window.",
      },
      {
        input: 's = "a", t = "aa"',
        output: '""',
        explanation:
          "Both 'a's from t must be included in the window. Since the largest window of s only has one 'a', return empty string.",
      },
    ],
    constraints: [
      "m == s.length",
      "n == t.length",
      "1 ≤ m, n ≤ 10⁵",
      "s and t consist of uppercase and lowercase English letters.",
    ],
    topics: ["Hash Table", "String", "Sliding Window"],
    companies: ["Facebook", "Amazon", "Microsoft", "Google"],
    hasHint: true,
  },
  {
    id: 121,
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    description: `You are given an array <code>prices</code> where <code>prices[i]</code> is the price of a given stock on the <code>i<sup>th</sup></code> day.<br><br>You want to maximize your profit by choosing a <strong>single day</strong> to buy one stock and choosing a <strong>different day in the future</strong> to sell that stock.<br><br>Return <em>the maximum profit you can achieve from this transaction</em>. If you cannot achieve any profit, return <code>0</code>.`,
    examples: [
      {
        input: "prices = [7,1,5,3,6,4]",
        output: "5",
        explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.",
      },
      {
        input: "prices = [7,6,4,3,1]",
        output: "0",
        explanation: "In this case, no transactions are done and the max profit = 0.",
      },
    ],
    constraints: ["1 ≤ prices.length ≤ 10⁵", "0 ≤ prices[i] ≤ 10⁴"],
    topics: ["Array", "Dynamic Programming"],
    companies: ["Amazon", "Facebook", "Microsoft"],
    hasHint: false,
  },
]

export function getProblemById(id: number): Problem | undefined {
  return sampleProblems.find((problem) => problem.id === id)
}

export function getProblemsByDifficulty(difficulty: "Easy" | "Medium" | "Hard"): Problem[] {
  return sampleProblems.filter((problem) => problem.difficulty === difficulty)
}

export function getProblemsByTopic(topic: string): Problem[] {
  return sampleProblems.filter((problem) => problem.topics.includes(topic))
}
