import Link from "next/link";

export default function NotFound() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <h1 className="text-xl font-bold text-slate-900">페이지를 찾을 수 없습니다</h1>
      <p className="mt-2 text-sm text-slate-600">
        주소가 바뀌었거나 없는 레슨일 수 있어요.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
      >
        목차로 돌아가기
      </Link>
    </div>
  );
}
