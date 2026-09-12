import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { DbShape, Course, Resource, Question, Answer, Role } from "./types";
import { seedData } from "./seed";

// A single JSON file on disk as the data store. Zero setup, works offline,
// easy to read and to explain line-by-line. See docs/decisions.md for why
// this was chosen over a database.

const DB_PATH = path.join(process.cwd(), "data", "db.json");

function ensureLocalFile(): void {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(seedData, null, 2));
  }
}

// Kept async even though the implementation underneath is now synchronous
// fs calls — every caller already does `await getCourses()` etc., so this
// keeps their signature and lets us swap the storage layer later without
// touching call sites.
async function readDb(): Promise<DbShape> {
  ensureLocalFile();
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw) as DbShape;
}

async function writeDb(db: DbShape): Promise<void> {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

// ---- courses ----

export async function getCourses(): Promise<Course[]> {
  return (await readDb()).courses;
}

export async function getCourse(code: string): Promise<Course | undefined> {
  return (await readDb()).courses.find((c) => c.code === code.toUpperCase());
}

// ---- resources ----

export async function listResources(courseCode?: string): Promise<Resource[]> {
  const { resources } = await readDb();
  const filtered = courseCode
    ? resources.filter((r) => r.courseCode === courseCode.toUpperCase())
    : resources;
  return [...filtered].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addResource(input: {
  courseCode: string;
  title: string;
  type: Resource["type"];
  url: string;
  addedBy: string;
}): Promise<Resource> {
  const db = await readDb();
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
  await writeDb(db);
  return resource;
}

// ---- questions + answers ----

export async function listQuestions(courseCode?: string): Promise<Question[]> {
  const { questions } = await readDb();
  const filtered = courseCode
    ? questions.filter((q) => q.courseCode === courseCode.toUpperCase())
    : questions;
  return [...filtered].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getQuestion(id: string): Promise<Question | undefined> {
  return (await readDb()).questions.find((q) => q.id === id);
}

export async function addQuestion(input: {
  courseCode: string;
  title: string;
  body: string;
  askedBy: string;
}): Promise<Question> {
  const db = await readDb();
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
  await writeDb(db);
  return question;
}

export async function addAnswer(
  questionId: string,
  input: { body: string; answeredBy: string; role: Role }
): Promise<Answer | undefined> {
  const db = await readDb();
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
  await writeDb(db);
  return answer;
}
