<p align="center">
  <img src="https://img.shields.io/badge/🚀-Social_Feed_Plus-blue?style=for-the-badge&logo=next.js&logoColor=white" alt="Social Feed Plus" />
  <img src="https://img.shields.io/badge/Frontend-Next.js_15-black?style=for-the-badge&logo=vercel&logoColor=white" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/Styling-TailwindCSS-38b2ac?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Test-Storybook_+_Jest-FF4785?style=for-the-badge&logo=storybook&logoColor=white" alt="Storybook & Jest" />
</p>

---

## 🎬 프로젝트 데모 영상

> 👉 아래 버튼을 클릭하면 **데모 영상을 다운로드**할 수 있습니다.  


<p align="center">
  <a href="https://github.com/woodoyeon/social-feed-frontend/raw/main/demo/social-feed-demo.mp4" download>
    <img src="https://img.shields.io/badge/🎥 Download-Demo_Video-2ea44f?style=for-the-badge&logo=github&logoColor=white" alt="Download Demo Video"/>
  </a>
</p>

---

# 예시: 10초 구간을 gif로 변환 (5~15초)
ffmpeg -ss 5 -t 10 -i demo/social-feed-demo.mp4 -vf "scale=800:-1:flags=lanczos,fps=15" demo/preview.gif


---

# Social Feed — Plus

Next.js 15 기반으로 구현한 **소셜 피드 클론 프로젝트**입니다.
Storybook 테스트, PWA, 다크/라이트 모드, Toaster 알림 등 다양한 기능을 포함합니다.

---

## 🚀 실행 방법

```bash
# 저장소 클론
git clone https://github.com/woodoyeon/social-feed-frontend.git

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# Storybook 실행
npm run storybook

# 프로덕션 빌드
npm run build
npm start

# 테스트 실행
npm test
```

---

## 🛠️ 기술 스택 및 선택 이유

* **Next.js 15 (App Router)**

  * 최신 App Router 구조: 서버/클라이언트 컴포넌트를 명확히 구분해 코드 가독성과 유지보수성 강화
  * SSR/SSG 지원: 초기 페이지 로딩 속도를 빠르게 하고 SEO에 유리하여 실제 서비스 품질을 높일 수 있음
  * PWA와 호환성 우수: App Router 기반에서 `next-pwa` 설정이 원활히 동작, 오프라인 환경에서도 안정적인 사용자 경험 제공
* **TypeScript**

  * 안정적인 타입 시스템: 런타임 오류를 사전에 방지하고, 대규모 코드베이스에서도 안전하게 협업 가능
  * 빌드 단계에서 버그 예방: IDE 자동완성과 타입 검사 덕분에 잘못된 props 전달, 잘못된 API 호출을 조기 탐지
* **Tailwind CSS**

  * 빠른 UI 개발: 미리 정의된 유틸리티 클래스를 사용해 스타일링 속도를 크게 단축
  * 다크/라이트 모드 대응: `dark:` 접두사만으로 손쉽게 두 가지 테마를 동시에 관리 가능
* **next-themes**

  * 사용자 OS 테마 연동: 시스템 기본 테마(light/dark)를 자동 감지해 초기 렌더링에서 UX 저하를 방지
  * 다크 모드 전환 지원: 유저가 직접 테마를 바꾸면 즉시 반영되며, 로컬 스토리지에 상태가 저장되어 재접속 시에도 유지
* **shadcn/ui + Radix UI**

  * 접근성 좋은 UI 컴포넌트: 키보드 내비게이션, ARIA 속성 지원 등 웹 접근성 표준을 기본 제공
  * Toaster 알림 구현: 간단한 API로 사용자 행동에 즉각적인 피드백 제공 가능
  * 이쁜 디자인: Tailwind 기반 스타일링이 적용된 컴포넌트라 일관성 있고 현대적인 UI/UX 확보
* **Storybook**

  * 컴포넌트 단위 개발/테스트 환경 제공: 디자이너와 개발자가 같은 URL에서 컴포넌트 상태를 확인, UI 피드백을 실시간으로 공유 가능
* **Jest + Testing Library**

  * 유닛/통합 테스트: 버튼 클릭, 글 작성 등 특정 동작을 시뮬레이션해 기능이 정상적으로 동작하는지 검증
  * 컴포넌트 렌더링 검증: 가상 DOM 환경에서 PostCard, Header 등이 올바르게 표시되는지 자동 테스트
* **PWA (next-pwa)**

  * 오프라인 캐시: 네트워크가 끊겨도 최근 본 게시물을 캐시에서 불러와 UX 유지
  * 모바일 홈 화면 설치 지원: 사용자가 앱처럼 홈 화면에 추가하여 실행할 수 있어 접근성 증대

---

## ✅ 구현한 기능 목록

### 1. 메인 피드 화면 구현

* 게시물 리스트 (/): 무한 스크롤(react-virtual) 적용, 모든 카드 요소 반영
* 게시물 작성 (/compose): 280자 제한 + 카운터, 이미지 미리보기, 작성 후 즉시 반영

### 2. 상호작용 기능

* 좋아요 시스템: 하트 애니메이션 + 카운트 업데이트 + 낙관적 UI 동작

---

## 🧪 테스트 케이스 통과 현황

* **Easy Level (10개)** → ✅ 전부 통과 (10/10)
* **Hard Level (4개)** → ✅ 전부 통과 (4/4)

---

## ✨ 추가 개선 아이디어

> 💬 과제에서 제시한 선택적 아이디어 중 구현 완료한 항목

* 북마크 페이지 (/bookmarks)
* 알림 페이지 (/notifications)
* 검색 페이지 (/search)
* 다크/라이트 모드 전환 (`next-themes`)
* PWA (next-pwa) 오프라인 대응 및 홈화면 설치 지원
* 실시간 피드 업데이트 (LivePolling/MockSocket)
* 가상화 스크롤 (`@tanstack/react-virtual`)

**Storybook + Jest 테스트 실행 결과**

* ✅ **Jest (🧪 단위/통합 테스트)**: 총 10개 테스트 케이스 전부 PASS
* ✅ **Storybook (📖 컴포넌트 문서화)**: 총 4개 주요 컴포넌트 (Header, PostCard, Button, ComposeForm) 실행/렌더링 모두 정상 확인

---

## ✨ 추가 구현한 기능

* **메시지 (/messages)**: 더미 유저 데이터를 이용한 1:1 채팅 UI

---

## 🤔 기술적 고민과 해결 과정

1. **Next.js 15 `themeColor` 경고 문제**

   * 문제: metadata에 `themeColor`를 두니 빌드 경고 발생
   * 해결: `viewport.themeColor`로 이전하고 light/dark 모드별 색상 분리 적용
   * 느낀 점: 단순 경고를 무시하면 PWA 테마 색상이 꼬여 UX에 영향을 줌을 체감

2. **Suspense 경계 문제 (`useSearchParams` / `usePathname`)**

   * 문제: CSR 훅 사용 시 빌드 에러 → Suspense boundary 필요
   * 해결: 각 페이지를 `<Suspense fallback={...}>`로 감싸고 초기 로딩 UI 제공
   * 느낀 점: App Router 환경에서 CSR 훅은 무조건 Suspense와 짝을 이뤄야 안정적

3. **Toaster 알림 구조 재구성**

   * 문제: `<Toaster />` 단독 사용 불가 → 알림 표시 안 됨
   * 해결: Provider 패턴(`ToastProviderCustom`)으로 감싸고 children을 주입하는 방식으로 재구성
   * 느낀 점: 라이브러리 기본 코드를 프로젝트 환경에 맞게 해체·재조립할 줄 알아야 한다

4. **중복된 `layout.tsx` 통합 문제**

   * 문제: 레이아웃 파일이 두 개 존재 → 빌드 충돌 발생
   * 해결: PWA, 폰트, ThemeProvider, Toaster를 하나로 통합
   * 느낀 점: App Router는 `layout.tsx` 계층이 곧 아키텍처. 중복은 유지보수 지옥으로 이어짐

5. **가상화 스크롤 성능 최적화**

   * 문제: 1000개 이상 피드 렌더링 시 브라우저 성능 저하
   * 해결: `@tanstack/react-virtual`로 화면에 보이는 요소만 렌더링
   * 느낀 점: 단순 UI 최적화가 아니라 대규모 데이터 UX를 가능하게 하는 필수 기술

6. **실시간 업데이트 시 리소스 낭비 문제**

   * 문제: setInterval 기반 폴링이 비활성 탭에서도 계속 동작
   * 해결: `IntersectionObserver`와 연계하여 화면 비가시 상태에서는 폴링 중단
   * 느낀 점: 실시간성 기능도 리소스 관리까지 고려해야 진짜 서비스 수준

7. **테스트 안정화 (`repost` 함수 누락)**

   * 문제: `repost is not a function` 에러 발생
   * 해결: `usePosts`에 메서드 구현 후 Jest mock 처리
   * 느낀 점: 단위 테스트는 숨은 결합부 버그를 잡는 안전망

8. **다크/라이트 모드 전환에서 FOUC(Flash of Unstyled Content) 문제**

   * 문제: 초기 로딩 시 흰 화면이 번쩍임
   * 해결: `suppressHydrationWarning` + `next-themes` 초기화 옵션 적용
   * 느낀 점: 다크모드 UX는 작은 번쩍임도 사용자 만족도를 크게 깎는다

9. **Storybook과 App Router 경로 충돌**

   * 문제: Storybook에서 절대 경로 alias(`@/...`) 인식 오류
   * 해결: `tsconfig.json`과 `.storybook/tsconfig.json`을 통일, vite alias 설정
   * 느낀 점: 멀티 툴 환경에서는 alias 하나가 전체를 흔든다

10. **빌드/배포 최적화 (PWA + Next.js 동시 적용)**

    * 문제: `next-pwa` 적용 시 static 파일 누락 경고
    * 해결: `public/sw.js`, `manifest.webmanifest` 경로를 명확히 지정하고 `next.config.mjs`에 옵션 세밀 설정
    * 느낀 점: PWA는 옵션 하나만 빠져도 작동이 애매해지므로 세밀한 검증이 필수

---


