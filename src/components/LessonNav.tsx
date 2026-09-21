import Link from "next/link";

type NavItem = { href: string; title: string } | null;

export function LessonNav({
  prev,
  next,
}: {
  prev: NavItem;
  next: NavItem;
}) {
  return (
    <nav
      className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-between"
      aria-label="이전·다음 레슨"
    >
      {prev ? (
        <Link
          href={prev.href}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 hover:border-emerald-300 hover:bg-emerald-50"
        >
          <span className="block text-xs text-slate-500">이전</span>
          <span className="font-medium">← {prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={next.href}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-right text-sm text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 sm:ml-auto"
        >
          <span className="block text-xs text-slate-500">다음</span>
          <span className="font-medium">{next.title} →</span>
        </Link>
      ) : (
        <Link
          href="/"
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-right text-sm text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 sm:ml-auto"
        >
          <span className="block text-xs text-slate-500">완료</span>
          <span className="font-medium">목차로 →</span>
        </Link>
      )}
    </nav>
  );
}
