"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useCallback, useState, type ReactNode } from "react";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  }, [text]);

  return (
    <button
      type="button"
      onClick={onCopy}
      className="absolute right-2 top-2 rounded-md border border-emerald-700/30 bg-white/90 px-2 py-1 text-xs font-medium text-emerald-800 shadow-sm hover:bg-emerald-50"
      aria-label="예시 문장 복사"
    >
      {copied ? "복사됨" : "복사"}
    </button>
  );
}

function getText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getText).join("");
  if (typeof node === "object" && "props" in node) {
    const el = node as { props?: { children?: ReactNode } };
    return getText(el.props?.children);
  }
  return "";
}

export function Markdown({ content }: { content: string }) {
  return (
    <div className="prose-lesson">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-8 border-b border-slate-200 pb-2 text-xl font-bold text-slate-900">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-6 text-lg font-semibold text-slate-800">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="my-3 leading-7 text-slate-700">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="my-3 list-disc space-y-1 pl-5 text-slate-700">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-3 list-decimal space-y-2 pl-5 text-slate-700">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-7">{children}</li>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="font-medium text-emerald-700 underline decoration-emerald-300 underline-offset-2 hover:text-emerald-900"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => {
            const text = getText(children).trim();
            return (
              <blockquote className="relative my-4 rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 pr-16 text-slate-800 shadow-sm">
                <div className="space-y-1 leading-7">{children}</div>
                {text ? <CopyButton text={text} /> : null}
              </blockquote>
            );
          },
          code: ({ className, children }) => {
            const isBlock = Boolean(className?.includes("language-")) ||
              String(children).includes("\n");
            if (!isBlock && !className) {
              return (
                <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.9em] text-rose-700">
                  {children}
                </code>
              );
            }
            return (
              <code className="font-mono text-sm text-slate-100">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="my-4 overflow-x-auto rounded-xl bg-slate-900 p-4 text-sm leading-6 text-slate-100 shadow-inner">
              {children}
            </pre>
          ),
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto rounded-xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-50">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 text-left font-semibold text-slate-800">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-t border-slate-100 px-3 py-2 text-slate-700">
              {children}
            </td>
          ),
          hr: () => <hr className="my-8 border-slate-200" />,
          strong: ({ children }) => (
            <strong className="font-semibold text-slate-900">{children}</strong>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
