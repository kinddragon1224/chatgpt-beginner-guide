import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type LessonMeta = {
  slug: string;
  title: string;
  chapterId: string;
  chapterTitle: string;
  kind: "prep" | "chapter" | "lesson" | "appendix";
  filePath: string;
  href: string;
};

export type ChapterGroup = {
  id: string;
  title: string;
  lessons: LessonMeta[];
};

function readFile(rel: string): string {
  return fs.readFileSync(path.join(CONTENT_DIR, rel), "utf8");
}

function firstHeading(md: string): string {
  const m = md.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : "레슨";
}

function lesson(
  partial: Omit<LessonMeta, "title">
): LessonMeta {
  const md = readFile(partial.filePath);
  return { ...partial, title: firstHeading(md) };
}

/** Canonical lesson order from TOC + folder structure */
export function getLessonOrder(): LessonMeta[] {
  return [
    lesson({
      slug: "prep",
      chapterId: "ch0",
      chapterTitle: "0장 · 준비",
      kind: "prep",
      filePath: "ch0_prep.md",
      href: "/lesson/prep",
    }),
    lesson({
      slug: "ch1",
      chapterId: "ch1",
      chapterTitle: "1장 · 빠르게 시작하기",
      kind: "chapter",
      filePath: "ch1/index.md",
      href: "/lesson/ch1",
    }),
    ...["1-1", "1-2", "1-3", "1-4", "1-5", "1-6"].map((id) =>
      lesson({
        slug: `ch1/${id}`,
        chapterId: "ch1",
        chapterTitle: "1장 · 빠르게 시작하기",
        kind: "lesson",
        filePath: `ch1/${id}.md`,
        href: `/lesson/ch1/${id}`,
      })
    ),
    lesson({
      slug: "ch2",
      chapterId: "ch2",
      chapterTitle: "2장 · Chat",
      kind: "chapter",
      filePath: "ch2/index.md",
      href: "/lesson/ch2",
    }),
    ...["2-1", "2-2", "2-3", "2-4", "2-5", "2-6", "2-7"].map((id) =>
      lesson({
        slug: `ch2/${id}`,
        chapterId: "ch2",
        chapterTitle: "2장 · Chat",
        kind: "lesson",
        filePath: `ch2/${id}.md`,
        href: `/lesson/ch2/${id}`,
      })
    ),
    lesson({
      slug: "ch3",
      chapterId: "ch3",
      chapterTitle: "3장 · Work",
      kind: "chapter",
      filePath: "ch3/index.md",
      href: "/lesson/ch3",
    }),
    ...["3-1", "3-2", "3-3", "3-4"].map((id) =>
      lesson({
        slug: `ch3/${id}`,
        chapterId: "ch3",
        chapterTitle: "3장 · Work",
        kind: "lesson",
        filePath: `ch3/${id}.md`,
        href: `/lesson/ch3/${id}`,
      })
    ),
    lesson({
      slug: "ch4",
      chapterId: "ch4",
      chapterTitle: "4장 · 플러그인·스킬 · 슬라이드와 문서",
      kind: "chapter",
      filePath: "ch4/index.md",
      href: "/lesson/ch4",
    }),
    ...["4-1", "4-2", "4-3"].map((id) =>
      lesson({
        slug: `ch4/${id}`,
        chapterId: "ch4",
        chapterTitle: "4장 · 플러그인·스킬 · 슬라이드와 문서",
        kind: "lesson",
        filePath: `ch4/${id}.md`,
        href: `/lesson/ch4/${id}`,
      })
    ),
    lesson({
      slug: "ch5",
      chapterId: "ch5",
      chapterTitle: "5장 · Codex · 회고",
      kind: "chapter",
      filePath: "ch5/index.md",
      href: "/lesson/ch5",
    }),
    ...["5-1", "5-2"].map((id) =>
      lesson({
        slug: `ch5/${id}`,
        chapterId: "ch5",
        chapterTitle: "5장 · Codex · 회고",
        kind: "lesson",
        filePath: `ch5/${id}.md`,
        href: `/lesson/ch5/${id}`,
      })
    ),
    lesson({
      slug: "appendix/stuck",
      chapterId: "appendix",
      chapterTitle: "부록",
      kind: "appendix",
      filePath: "appendix_stuck.md",
      href: "/lesson/appendix/stuck",
    }),
    lesson({
      slug: "appendix/self-check",
      chapterId: "appendix",
      chapterTitle: "부록",
      kind: "appendix",
      filePath: "appendix_self_check.md",
      href: "/lesson/appendix/self-check",
    }),
  ];
}

export function getChapterGroups(): ChapterGroup[] {
  const lessons = getLessonOrder();
  const map = new Map<string, ChapterGroup>();
  for (const item of lessons) {
    let g = map.get(item.chapterId);
    if (!g) {
      g = { id: item.chapterId, title: item.chapterTitle, lessons: [] };
      map.set(item.chapterId, g);
    }
    g.lessons.push(item);
  }
  return Array.from(map.values());
}

export function getLessonBySlug(slugParts: string[]): LessonMeta | undefined {
  const slug = slugParts.join("/");
  return getLessonOrder().find((l) => l.slug === slug);
}

export function getAdjacent(slug: string): {
  prev: LessonMeta | null;
  next: LessonMeta | null;
} {
  const order = getLessonOrder();
  const i = order.findIndex((l) => l.slug === slug);
  if (i < 0) return { prev: null, next: null };
  return {
    prev: i > 0 ? order[i - 1] : null,
    next: i < order.length - 1 ? order[i + 1] : null,
  };
}

export function getLessonContent(filePath: string): string {
  return readFile(filePath);
}

function cleanStepText(t: string): string {
  return t
    .replace(/\*\*/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/(^|\s)>\s?/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractNumberedFromSection(section: string): string[] {
  const items: string[] = [];
  const re = /^\d+\.\s+(.+(?:\n(?!\d+\.\s|#)[^\n]*)*)/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(section)) !== null) {
    const cleaned = cleanStepText(
      m[1]
        .split("\n")
        .filter((line) => {
          const t = line.trim();
          // Drop pure bold subheads like **웹**
          if (/^\*\*[^*]+\*\*$/.test(t)) return false;
          return true;
        })
        .join(" ")
    );
    if (cleaned) items.push(cleaned);
  }
  return items;
}

/** Extract checklist items from practice section */
export function extractPracticeSteps(md: string): string[] {
  const practiceHeading = /^##\s+(이렇게 해 보세요|따라 하기)\s*$/m;
  const match = md.match(practiceHeading);
  let section = md;
  if (match && match.index !== undefined) {
    const start = match.index + match[0].length;
    const rest = md.slice(start);
    const nextH2 = rest.search(/^##\s+/m);
    section = nextH2 >= 0 ? rest.slice(0, nextH2) : rest;
  }

  let items = extractNumberedFromSection(section);
  if (items.length === 0 && match) {
    // Fallback: first numbered list anywhere after the practice heading area
    items = extractNumberedFromSection(md.slice(match.index));
  }
  if (items.length === 0) {
    items = extractNumberedFromSection(md);
  }
  return items;
}

export function getAllSlugs(): string[][] {
  return getLessonOrder().map((l) => l.slug.split("/"));
}
