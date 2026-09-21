import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="min-w-0">
          <span className="block truncate text-sm font-bold text-slate-900 sm:text-base">
            왕초보를 위한 ChatGPT 사용 설명서
          </span>
          <span className="block truncate text-xs text-slate-500">
            더루멘 김선용 대표 with 그록봇
          </span>
        </Link>
        <a
          href="https://chatgpt.com"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-full bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800 sm:text-sm"
        >
          ChatGPT 열기
        </a>
      </div>
    </header>
  );
}
