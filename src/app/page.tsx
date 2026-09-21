import Link from "next/link";
import { getChapterGroups, getLessonOrder } from "@/lib/lessons";
import { ProgressHome } from "@/components/ProgressHome";

export default function HomePage() {
  const chapters = getChapterGroups().map((ch) => ({
    id: ch.id,
    title: ch.title,
    lessons: ch.lessons.map((l) => ({
      slug: l.slug,
      title: l.title,
      href: l.href,
      kind: l.kind,
    })),
  }));

  const first = getLessonOrder()[0];

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold text-emerald-800">읽기 + 연습</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          왕초보를 위한 ChatGPT 사용 설명서
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          더루멘 김선용 대표 with 그록봇
        </p>
        <p className="mt-4 text-base leading-7 text-slate-700">
          ChatGPT를 「언젠가」가 아니라 「오늘」 씁니다. 각 레슨을 읽고,
          체크리스트로 따라 한 뒤, ChatGPT에서 바로 연습하세요. 진행 상황은
          이 기기 브라우저에만 저장됩니다.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={first.href}
            className="inline-flex rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-800"
          >
            처음부터 시작
          </Link>
          <a
            href="https://chatgpt.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            ChatGPT 열기
          </a>
        </div>
      </section>

      <ProgressHome chapters={chapters} />
    </div>
  );
}
