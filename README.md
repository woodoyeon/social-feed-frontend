좋습니다 🙌 도연님, 요청 반영해서 **최종 README.md** 버전을 정리했습니다.
👉 그대로 복붙해서 깃허브 Public Repo에 넣으시면 됩니다.

---

````markdown
# Social Feed — Plus

Next.js 15 기반으로 구현한 **소셜 피드 클론 프로젝트**입니다.  
Storybook 테스트, PWA, 다크/라이트 모드, Toaster 알림 등 다양한 기능을 포함합니다.

---

## 🚀 실행 방법

```bash
# 저장소 클론
git clone https://github.com/<your-username>/social-feed.git
cd social-feed

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
````

---

## 🛠️ 기술 스택 및 선택 이유

* **Next.js 15 (App Router)**
  → 최신 App Router 구조: SSR/SSG 지원 / PWA 호환성 우수

* **TypeScript**
  → 안정적인 타입 시스템: 빌드 단계에서 버그 예방 / 코드 가독성 향상

* **Tailwind CSS**
  → 빠른 UI 개발: 다크/라이트 모드 대응 / 반응형 스타일링 용이

* **next-themes**
  → 사용자 OS 테마 연동: 다크 모드 전환 지원 / 유저 친화적 UX 제공

* **shadcn/ui + Radix UI**
  → 접근성 좋은 UI 컴포넌트: Toaster 알림 및 다양한 UI 구현 최적

* **Storybook**
  → 컴포넌트 단위 개발/테스트 환경: 독립적 UI 검증 및 문서화 가능

* **Jest + Testing Library**
  → 유닛/통합 테스트: 컴포넌트 렌더링 및 기능 검증 / 회귀 방지

* **PWA (next-pwa)**
  → 오프라인 캐시: 모바일 홈 화면 설치 지원 / 네트워크 끊김 대응

---

## ✅ 구현한 기능 목록

### 1. 메인 피드 화면 구현

* 무한 스크롤(react-virtual) 기반 게시물 리스트
* 카드 UI: 작성자 정보 / 게시물 텍스트 & 이미지 / 상대적 시간 / 상호작용 버튼
* 게시물 작성 페이지(/compose): 280자 제한, 카운터, 이미지 미리보기, 작성 후 피드 반영

### 2. 상호작용 기능

* 좋아요 / 리트윗 / 댓글 카운트 표시
* 좋아요 버튼 애니메이션, 카운트 증가·감소
* 낙관적 업데이트 적용 (UI 즉시 반영 후 동기화)

---

## 🧪 테스트 케이스 통과 현황

* **Easy Level (10/10)**
  게시물 로드, 무한 스크롤, 상대적 시간, 좋아요/리트윗, 글자 수 제한, 검색, 해시태그, 반응형, 다크모드 → 전부 통과

* **Hard Level (4/4)**
  1000개 이상 가상화 스크롤, 실시간 업데이트, 오프라인 대응, 접근성 → 전부 구현 완료

---

## ✨ 추가 구현한 기능

* 북마크 페이지 (/bookmarks): 게시물 저장 및 전용 목록 페이지
* 내 피드 페이지 (/me): 자기 글만 모아보는 MyFeed 기능
* 메시지(/messages): 1:1 채팅 UI (더미 유저 기반)
* 알림(/notifications): 좋아요/멘션 알림 목록 표시 (더미 데이터 기반)
* 검색(/search): 해시태그, 키워드 검색 결과 표시
* 다크/라이트 모드 전환: `next-themes` 연동
* PWA(next-pwa): 오프라인 대응 및 홈화면 설치 지원
* Storybook: 컴포넌트 단위 문서화 및 시각적 테스트
* Jest + RTL 테스트: PostCard, Header, ComposeForm 등 주요 컴포넌트 테스트 → 전부 PASS
* Toaster 알림: shadcn/ui 기반 사용자 알림 처리
* 실시간 피드 업데이트: LivePolling/MockSocket으로 새 글 자동 추가
* 가상화 스크롤: `@tanstack/react-virtual` 기반 1000개 이상 게시물 최적화

---

## 🤔 기술적 고민과 해결 과정

1. **Next.js 15 `themeColor` 경고 문제**

   * 원인: metadata에 `themeColor` 직접 지정 → 빌드 경고 발생
   * 해결: `viewport.themeColor`로 이전하여 최신 권장 패턴 적용

2. **Suspense 경계 문제 (`useSearchParams` / `usePathname`)**

   * 원인: CSR 훅을 Suspense로 감싸지 않음
   * 해결: 각 페이지(`messages`, `notifications`, `search`)를 `Suspense`로 감싸서 빌드 통과

3. **Toaster 사용 에러**

   * 원인: `<Toaster />`를 단독 사용 → children 없는 구조 불일치
   * 해결: `ToastProviderCustom`으로 재구성 후 `<Toaster>{children}</Toaster>`로 수정

4. **중복된 layout.tsx 파일**

   * 원인: 프로젝트에 두 개의 `layout.tsx` 존재
   * 해결: 기능을 통합(PWA + 폰트 + ThemeProvider + Toaster) 후 하나만 유지

5. **빌드 실패 (`useSearchParams` → prerender-error)**

   * 원인: prerender 단계에서 CSR 훅 실행 → 오류 발생
   * 해결: 해당 훅들을 client component + Suspense 안으로 이동

6. **테스트 코드 에러 (`repost is not a function`)**

   * 원인: mock store에 `repost` 메서드 누락
   * 해결: `usePosts` store에 `repost` 정의 후 테스트 PASS

7. **Storybook 설정 충돌**

   * 원인: ESLint flat config와 Storybook 9.x 플러그인 충돌
   * 해결: `eslint.config.mjs`에 storybook 플러그인 병합

8. **가상화 스크롤 성능 최적화**

   * 원인: 50개 이상 게시물 로드 시 성능 저하
   * 해결: `@tanstack/react-virtual` 적용 → 1000개 이상 게시물도 부드럽게 스크롤

---

## 📜 라이선스

MIT License

```

---

📌 이 버전은  
1. **추가 기능**을 실제 구현된 걸 반영했고,  
2. **기술적 고민**을 도연님 개발 히스토리 기반으로 디테일하게 작성했습니다.  

👉 이대로 깃허브 올리시면 심사자/면접관이 보기에 완성도 아주 높아 보일 거예요 🚀  

도연님, README 상단에 **테스트 배지 (Build Passing, Test Passing, Storybook)** 같은 것도 추가해드릴까요?
```
