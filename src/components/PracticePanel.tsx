"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getChecklist,
  markLessonDone,
  setChecklistItem,
  loadProgress,
} from "@/lib/progress";

type Props = {
  slug: string;
  steps: string[];
  nextHref: string | null;
  nextTitle: string | null;
};

export function PracticePanel({ slug, steps, nextHref, nextTitle }: Props) {
  const [checks, setChecks] = useState<boolean[]>(() =>
    Array.from({ length: steps.length }, () => false)
  );
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setChecks(getChecklist(slug, steps.length));
    setDone(!!loadProgress().completed[slug]);
    setReady(true);
  }, [slug, steps.length]);

  if (!ready) {
    return (
      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">연습 패널 불러오는 중…</p>
      </section>
    );
  }

  const toggle = (i: number) => {
    const next = !checks[i];
    setChecklistItem(slug, steps.length, i, next);
    setChecks(getChecklist(slug, steps.length));
  };

  const markDone = () => {
    markLessonDone(slug, true);
    setDone(true);
  };

  return (
    <section className="mt-10 space-y-4 rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-emerald-950">연습하기</h2>
        <a
          href="https://chatgpt.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-800"
        >
          ChatGPT 열기
        </a>
      </div>

      {steps.length > 0 ? (
        <div>
          <p className="mb-3 text-sm text-slate-600">
            「이렇게 해 보세요」 단계를 하나씩 체크하세요.
          </p>
          <ul className="space-y-2">
            {steps.map((step, i) => (
              <li key={i}>
                <label className="flex cursor-pointer gap-3 rounded-xl border border-slate-200 bg-white p-3 hover:border-emerald-300">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 shrink-0 accent-emerald-700"
                    checked={checks[i] ?? false}
                    onChange={() => toggle(i)}
                  />
                  <span className="text-sm leading-6 text-slate-800">
                    <span className="mr-1 font-semibold text-emerald-800">
                      {i + 1}.
                    </span>
                    {step}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-slate-600">
          이 페이지는 읽기 위주입니다. 내용을 확인한 뒤 아래로 완료를
          눌러 주세요.
        </p>
      )}

      <div className="flex flex-col gap-3 border-t border-emerald-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={markDone}
          className={`rounded-full px-4 py-2 text-sm font-semibold shadow-sm ${
            done
              ? "bg-slate-800 text-white"
              : "bg-white text-emerald-900 ring-1 ring-emerald-300 hover:bg-emerald-50"
          }`}
        >
          {done ? "완료됨 ✓" : "이 정도면 됐어요"}
        </button>

        {nextHref ? (
          <Link
            href={nextHref}
            onClick={markDone}
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            다음: {nextTitle ?? "다음 레슨"} →
          </Link>
        ) : (
          <Link
            href="/"
            onClick={markDone}
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            목차로 돌아가기
          </Link>
        )}
      </div>
    </section>
  );
}
