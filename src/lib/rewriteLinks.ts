/**
 * Rewrite relative .md links in lesson markdown to app routes.
 * Examples:
 *   1-2.md          → /lesson/ch1/1-2   (when current chapter is ch1)
 *   ../ch2/2-1.md   → /lesson/ch2/2-1
 *   appendix_stuck.md → /lesson/appendix/stuck
 */
export function rewriteMarkdownLinks(
  md: string,
  currentSlug: string
): string {
  const chapter =
    currentSlug.startsWith("ch") && currentSlug.includes("/")
      ? currentSlug.split("/")[0]
      : currentSlug.startsWith("ch")
        ? currentSlug
        : null;

  return md.replace(
    /\[([^\]]+)\]\(([^)]+\.md)\)/g,
    (full, label: string, href: string) => {
      const route = mdHrefToRoute(href, chapter);
      if (!route) return full;
      return `[${label}](${route})`;
    }
  );
}

function mdHrefToRoute(
  href: string,
  currentChapter: string | null
): string | null {
  let h = href.trim().replace(/^\.\//, "");

  // appendix_*.md at content root
  const appendix = h.match(/(?:^|\/)appendix_([a-z0-9_]+)\.md$/i);
  if (appendix) {
    const key = appendix[1].replace(/_/g, "-");
    // self_check → self-check already; for_instructor → for-instructor
    const map: Record<string, string> = {
      stuck: "stuck",
      "self-check": "self-check",
      self_check: "self-check",
      "for-instructor": "for-instructor",
      for_instructor: "for-instructor",
    };
    const id = map[appendix[1]] ?? map[key] ?? key;
    return `/lesson/appendix/${id}`;
  }

  if (h === "ch0_prep.md" || h.endsWith("/ch0_prep.md")) {
    return "/lesson/prep";
  }

  // chN/index.md or index.md
  const chIndex = h.match(/(?:^|\/)(ch[1-5])\/index\.md$/i);
  if (chIndex) return `/lesson/${chIndex[1]}`;
  if (h === "index.md" && currentChapter) {
    return `/lesson/${currentChapter}`;
  }

  // chN/x-y.md
  const nested = h.match(/(?:^|\/)(ch[1-5])\/(\d+-\d+)\.md$/i);
  if (nested) return `/lesson/${nested[1]}/${nested[2]}`;

  // same-folder 1-2.md
  const local = h.match(/^(\d+-\d+)\.md$/i);
  if (local && currentChapter) {
    return `/lesson/${currentChapter}/${local[1]}`;
  }

  return null;
}
