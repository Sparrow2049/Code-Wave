import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { DbShape, Course, Resource, Question, Answer, Role } from "./types";
import { seedData } from "./seed";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

function ensureDb(): void {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(seedData, null, 2));
  }
}

function readDb(): DbShape {
  ensureDb();
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw) as DbShape;
}

function writeDb(db: DbShape): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

// ---- courses ----

export function getCourses(): Course[] {
  return readDb().courses;
}

export function getCourse(code: string): Course | undefined {
  return readDb().courses.find((c) => c.code === code.toUpperCase());
}

// ---- resources ----

export function listResources(courseCode?: string): Resource[] {
  const { resources } = readDb();
  const filtered = courseCode
    ? resources.filter((r) => r.courseCode === courseCode.toUpperCase())
    : resources;
  return [...filtered].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function addResource(input: {
  courseCode: string;
  title: string;
  type: Resource["type"];
  url: string;
  addedBy: string;
}): Resource {
  const db = readDb();
  const resource: Resource = {
    id: randomUUID(),
    courseCode: input.courseCode.toUpperCase(),
    title: input.title.trim(),
    type: input.type,
    url: input.url.trim(),
    addedBy: input.addedBy.trim() || "Anonymous",
    createdAt: new Date().toISOString(),
  };
  db.resources.push(resource);
  writeDb(db);
  return resource;
}

// ---- questions + answers ----

export function listQuestions(courseCode?: string): Question[] {
  const { questions } = readDb();
  const filtered = courseCode
    ? questions.filter((q) => q.courseCode === courseCode.toUpperCase())
    : questions;
  return [...filtered].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getQuestion(id: string): Question | undefined {
  return readDb().questions.find((q) => q.id === id);
}

export function addQuestion(input: {
  courseCode: string;
  title: string;
  body: string;
  askedBy: string;
}): Question {
  const db = readDb();
  const question: Question = {
    id: randomUUID(),
    courseCode: input.courseCode.toUpperCase(),
    title: input.title.trim(),
    body: input.body.trim(),
    askedBy: input.askedBy.trim() || "Anonymous",
    resolved: false,
    createdAt: new Date().toISOString(),
    answers: [],
  };
  db.questions.push(question);
  writeDb(db);
  return question;
}

export function addAnswer(
  questionId: string,
  input: { body: string; answeredBy: string; role: Role }
): Answer | undefined {
  const db = readDb();
  const question = db.questions.find((q) => q.id === questionId);
  if (!question) return undefined;

  const answer: Answer = {
    id: randomUUID(),
    questionId,
    body: input.body.trim(),
    answeredBy: input.answeredBy.trim() || "Anonymous",
    role: input.role,
    createdAt: new Date().toISOString(),
  };
  question.answers.push(answer);
  // A senior answering marks the question resolved — that's the whole
  // point of the feature, so we treat it as a real state change, not a
  // manual checkbox someone forgets to tick.
  if (input.role === "senior") question.resolved = true;
  writeDb(db);
  return answer;
}
