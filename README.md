# 왕초보를 위한 ChatGPT 사용 설명서

읽기 + 연습 미니 사이트입니다.  
**더루멘 김선용 대표 with 그록봇**

Next.js(App Router) · TypeScript · Tailwind CSS · 진행 상태는 `localStorage`만 사용합니다.

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 엽니다.

프로덕션 빌드 확인:

```bash
npm run build
npm start
```

## 콘텐츠

레슨 마크다운은 `content/` 에 있습니다.  
원본 ebook에서 `NOTES*`, `_archive*` 를 제외하고 복사한 구조입니다. 목차·순서는 `content/00_toc.md` 와 폴더 구조를 따릅니다.

## Vercel 배포

1. 이 저장소를 GitHub에 푸시합니다.  
   (`https://github.com/kinddragon1224/chatgpt-beginner-guide`)
2. [Vercel](https://vercel.com)에서 **Add New Project** → 해당 저장소 import
3. Framework Preset: **Next.js** (기본값)
4. Build Command: `npm run build` / Output: 기본(`.next`)
5. Deploy

환경 변수·DB·인증은 필요 없습니다.

## 주요 경로

| 경로 | 설명 |
|------|------|
| `/` | 홈 · 목차 · 진행률 |
| `/lesson/prep` | 0장 준비 |
| `/lesson/ch1` … `/lesson/ch5` | 각 장 소개 |
| `/lesson/ch1/1-1` 등 | 개별 레슨 |
| `/lesson/appendix/stuck` | 부록 · 막히면 여기 |
| `/lesson/appendix/self-check` | 부록 · 스스로 점검 |
| `/lesson/appendix/for-instructor` | 부록 · 강사 노트 |

## 스크립트

- `npm run dev` — 개발 서버
- `npm run build` — 프로덕션 빌드
- `npm start` — 빌드 결과 실행
- `npm run lint` — ESLint
