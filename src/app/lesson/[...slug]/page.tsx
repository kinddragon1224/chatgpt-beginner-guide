import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  extractPracticeSteps,
  getAdjacent,
  getAllSlugs,
  getLessonBySlug,
  getLessonContent,
} from "@/lib/lessons";
import { rewriteMarkdownLinks } from "@/lib/rewriteLinks";
import { Markdown } from "@/components/Markdown";
import { PracticePanel } from "@/components/PracticePanel";
import { LessonNav } from "@/components/LessonNav";

type Props = { params: Promise<{ slug: string[] }> };

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);
  if (!lesson) return { title: "레슨" };
  return { title: lesson.title };
}

export default async function LessonPage({ params }: Props) {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);
  if (!lesson) notFound();

  const raw = getLessonContent(lesson.filePath);
  const content = rewriteMarkdownLinks(raw, lesson.slug);
  const steps = extractPracticeSteps(raw);
  const { prev, next } = getAdjacent(lesson.slug);

  const practiceSteps = lesson.kind === "chapter" ? [] : steps;

  return (
    <article>
      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <Link href="/" className="hover:text-emerald-700">
          목차
        </Link>
        <span aria-hidden>/</span>
        <span className="text-slate-700">{lesson.chapterTitle}</span>
      </div>

      <Markdown content={content} />

      <PracticePanel
        slug={lesson.slug}
        steps={practiceSteps}
        nextHref={next?.href ?? null}
        nextTitle={next?.title ?? null}
      />

      <LessonNav
        prev={prev ? { href: prev.href, title: prev.title } : null}
        next={next ? { href: next.href, title: next.title } : null}
      />
    </article>
  );
}
