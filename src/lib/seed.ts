import { DbShape } from "./types";

// Seed data exists for one reason: judges only see screenshots, not a live
// demo (house rule 5). An empty app screenshots badly. Swap these course
// codes for your own school's if you want the demo to feel local.

const now = new Date();
const daysAgo = (n: number) =>
  new Date(now.getTime() - n * 24 * 60 * 60 * 1000).toISOString();

export const seedData: DbShape = {
  courses: [
    { code: "CS101", name: "Intro to Programming" },
    { code: "CS201", name: "Data Structures" },
    { code: "CS210", name: "Discrete Mathematics" },
    { code: "CS330", name: "Operating Systems" },
  ],
  resources: [
    {
      id: "r1",
      courseCode: "CS101",
      title: "Week 1–4 lecture notes (annotated)",
      type: "notes",
      url: "https://example.com/cs101-notes",
      addedBy: "Wei Chen",
      createdAt: daysAgo(6),
    },
    {
      id: "r2",
      courseCode: "CS101",
      title: "2025 midterm, with worked solutions",
      type: "past-paper",
      url: "https://example.com/cs101-midterm-2025",
      addedBy: "Wei Chen",
      createdAt: daysAgo(5),
    },
    {
      id: "r3",
      courseCode: "CS201",
      title: "HITSZCS/data-structures-labs",
      type: "repo",
      url: "https://github.com/example/data-structures-labs",
      addedBy: "Priya N.",
      createdAt: daysAgo(3),
    },
    {
      id: "r4",
      courseCode: "CS210",
      title: "Proof techniques cheat sheet",
      type: "notes",
      url: "https://example.com/discrete-proofs",
      addedBy: "Marcus O.",
      createdAt: daysAgo(2),
    },
  ],
  questions: [
    {
      id: "q1",
      courseCode: "CS101",
      title: "When do I use a while loop vs a for loop?",
      body: "I get the syntax for both but I keep guessing wrong on which one 'fits' a problem. Is there an actual rule of thumb?",
      askedBy: "Alex T.",
      resolved: true,
      createdAt: daysAgo(4),
      answers: [
        {
          id: "a1",
          questionId: "q1",
          body: "Rule of thumb: if you know the number of iterations before the loop starts, use for. If you're looping until some condition becomes true and you don't know how many times that'll take, use while. Most textbook 'off by one' pain comes from forcing a for loop into a while-shaped problem.",
          answeredBy: "Wei Chen",
          role: "senior",
          createdAt: daysAgo(4),
        },
      ],
    },
    {
      id: "q2",
      courseCode: "CS201",
      title: "Is it normal to still not 'get' recursion in week 3?",
      body: "I can trace through simple examples on paper but writing my own recursive function from scratch feels impossible.",
      askedBy: "Jordan K.",
      resolved: false,
      createdAt: daysAgo(1),
      answers: [],
    },
  ],
};
