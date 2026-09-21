"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadProgress } from "@/lib/progress";

export type TocItem = {
  slug: string;
  title: string;
  href: string;
  kind: string;
};

export type TocChapter = {
  id: string;
  title: string;
  lessons: TocItem[];
};

export function ProgressHome({ chapters }: { chapters: TocChapter[] }) {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setDone(loadProgress().completed);
    setReady(true);
  }, []);

  const allSlugs = chapters.flatMap((c) => c.lessons.map((l) => l.slug));
  const doneCount = allSlugs.filter((s) => done[s]).length;
  const total = allSlugs.length;
  const pct = total ? Math.round((doneCount / total) * 100) : 0;

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-500">학습 진행</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {ready ? `${doneCount} / ${total}` : `— / ${total}`}
            </p>
          </div>
          <p className="text-sm font-semibold text-emerald-700">
            {ready ? `${pct}%` : "…"}
          </p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-600 transition-all"
            style={{ width: `${ready ? pct : 0}%` }}
          />
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          브라우저에만 저장됩니다. 로그인 없이 이 기기에서 이어서 볼 수
          있어요.
        </p>
      </section>

      <nav className="space-y-6" aria-label="목차">
        {chapters.map((ch) => {
          const chDone = ch.lessons.filter((l) => done[l.slug]).length;
          return (
            <section
              key={ch.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
                <h2 className="text-base font-bold text-slate-900">
                  {ch.title}
                </h2>
                <span className="text-xs font-medium text-slate-500">
                  {ready ? `${chDone}/${ch.lessons.length}` : `—/${ch.lessons.length}`}
                </span>
              </div>
              <ul className="divide-y divide-slate-100">
                {ch.lessons.map((lesson) => {
                  const isDone = !!done[lesson.slug];
                  return (
                    <li key={lesson.slug}>
                      <Link
                        href={lesson.href}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-emerald-50/60"
                      >
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                            isDone
                              ? "bg-emerald-600 text-white"
                              : "border border-slate-300 text-slate-400"
                          }`}
                          aria-hidden
                        >
                          {isDone ? "✓" : ""}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-medium text-slate-900">
                            {lesson.title}
                          </span>
                          {lesson.kind === "chapter" ? (
                            <span className="text-xs text-slate-500">
                              장 소개
                            </span>
                          ) : lesson.kind === "appendix" ? (
                            <span className="text-xs text-slate-500">부록</span>
                          ) : null}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </nav>
    </div>
  );
}
