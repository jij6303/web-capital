# web-capital

## 📌 프로젝트 개요
- 목적: 세계 국가와 수도를 지역별로 학습하는 인터랙티브 웹 퀴즈 게임
- 시작일: 2026-04-05
- 기술 스택: HTML5, CSS3, Vanilla JavaScript, D3.js v7, TopoJSON, Python (GitHub 자동화)

---

## 🗂️ 코드 구조

```
web-capital/
├── index.html        # 진입점. 지역 선택/퀴즈/결과 3개 화면 구조 + D3 지도 초기화 인라인 스크립트
├── style.css         # 전체 스타일링 (다크 테마, 지역 카드 그리드, SVG 지도 스타일, 반응형)
├── app.js            # 초기 퀴즈 로직 — 현재 미사용 (index.html 인라인 스크립트로 통합됨)
├── data.js           # REGIONS 7개 + COUNTRIES 197개국 데이터 (한국어) + 중복 제거 로직
├── github_bot.json   # GitHub App 자격증명 설정 (버전 관리 제외)
├── .gitignore        # github_bot.json 제외 설정
├── CLAUDE.md         # Claude Code 규칙 파일 진입점
├── PROJECT_LOG.md    # 프로젝트 문서 (이 파일)
└── github/
    ├── auth.py          # GitHub App 인증 (JWT 생성, 설치 토큰 발급, git remote에서 owner/repo 파싱)
    ├── create_issue.py  # GitHub 이슈 생성 CLI 스크립트
    ├── create_branch.py # GitHub 브랜치 생성 CLI 스크립트
    ├── create_pr.py     # GitHub PR 생성 CLI 스크립트
    └── request_review.py # GitHub 리뷰 요청 CLI 스크립트
```

**주요 함수 목록**
| 함수 | 위치 | 한 줄 설명 |
|------|------|-----------|
| `highlightCountry(code)` | index.html (인라인 script) | ISO alpha-2 코드로 SVG 지도에서 해당 국가 하이라이트 |
| `shuffle(arr)` | index.html (인라인 script) | 배열을 무작위 순서로 섞어 새 배열 반환 |
| `startQuiz(region)` | index.html (인라인 script) | 선택한 지역으로 questionPool을 필터링하고 퀴즈 화면으로 전환 |
| `loadQuestion()` | index.html (인라인 script) | 미사용 국가 중 임의 선택 후 4지선다 보기 생성 및 화면 렌더링 |
| `handleAnswer(btn, selectedCountry)` | index.html (인라인 script) | 선택 답변의 정오 판별, 버튼 색상 피드백, 점수 업데이트 |
| `showResult()` | index.html (인라인 script) | 최종 점수와 등급 이모지(😢/👍/🏆) 결과 화면 출력 |
| `generate_jwt(app_id, private_key_path)` | github/auth.py | GitHub App 비공개키로 JWT 토큰 생성 (유효기간 600초) |
| `get_installation_token(jwt_token, installation_id)` | github/auth.py | JWT로 Installation Access Token 발급 |
| `get_owner_repo()` | github/auth.py | git remote origin URL에서 owner와 repo 이름 파싱 |
| `get_token()` | github/auth.py | config 로드 후 최종 Installation Token 반환 |
| `create_branch(token, owner, repo, branch_name, base_branch)` | github/create_branch.py | 지정한 base에서 새 브랜치 생성 |
| `create_issue(token, owner, repo, title, body)` | github/create_issue.py | 제목과 본문으로 GitHub 이슈 생성 |
| `create_pr(token, owner, repo, title, head, base, body)` | github/create_pr.py | head 브랜치에서 base로 PR 생성 |
| `request_review(token, owner, repo, pr_number, reviewers)` | github/request_review.py | PR에 리뷰어 요청 |

---

## ✅ 기능 목록

| 기능 | 설명 | 상태 |
|------|------|------|
| 지역 챕터 선택 화면 | 전체/아시아/유럽/아메리카/아프리카/중동/오세아니아 7개 카드 | ✅ 완료 |
| 핵심 퀴즈 게임 | 10문제 4지선다 수도 맞히기, 즉시 정오 피드백 | ✅ 완료 |
| D3.js 인터랙티브 세계 지도 | TopoJSON 기반 SVG 지도에서 현재 문제 국가 하이라이트 | ✅ 완료 |
| 한국어 전체 로컬라이제이션 | 국가명, 수도명, UI 전체 한국어 표시 | ✅ 완료 |
| 점수 계산 및 결과 화면 | 정답률 + 이모지 등급(😢/👍/🏆) + 재도전/지역 선택 버튼 | ✅ 완료 |
| 반응형 다크 테마 | Slate 컬러 기반 다크 모드, 모바일 대응 그리드 | ✅ 완료 |
| 수도 데이터셋 | 197개국 7개 지역 분류 + 중복 제거 | ✅ 완료 |
| GitHub App 자동화 | 이슈/브랜치/PR/리뷰 GitHub API 자동 처리 | ✅ 완료 |

---

## 📋 개발 일지

### #0 — 초기 프로젝트 설정 (2026-04-05)

**왜 이 작업을 했나**
> 본격 개발 전 GitHub 워크플로우 자동화 도구와 Claude Code 규칙을 먼저 세팅하기 위해

**뭘 했나**
> `.claude/rules/rules.md` 생성 — Claude Code 작업 규칙 정의
> `github/` 모듈 5개 생성 (auth, create_issue, create_branch, create_pr, request_review)
> `.gitignore`, `CLAUDE.md` 초기화

**어떤 구조를 선택했고 왜**
> 각 GitHub 작업을 독립 CLI 스크립트로 분리 — 단독 실행과 모듈 import 양립 가능.
> 공통 인증 로직을 `auth.py`에 집중해 DRY 원칙 유지.
> `get_owner_repo()`로 git remote에서 owner/repo 자동 파싱 — 수동 설정 불필요.

**왜 이 방법을 선택했나 (다른 방법은 없었나)**
> GitHub CLI(`gh`)를 쓸 수도 있었지만 Python 스크립트로 작성 — 실행 환경에 `gh` 설치 불필요, 코드에서 직접 import 가능, 에러 핸들링 커스텀 용이.

**배운 것 / 몰랐던 것**
> GitHub App 인증은 OAuth App과 달리 JWT → Installation Access Token 2단계 필요.
> JWT 유효기간이 600초(10분)로 짧아 매 작업마다 새로 발급해야 함.

**에러 & 해결**
> 에러: 없음
> 원인: -
> 해결: -

---

### #1 — 세계 수도 퀴즈 게임 구현 + 한국어 번역 (2026-04-05)

**왜 이 작업을 했나**
> 프로젝트의 핵심 기능인 수도 퀴즈 게임과 한국어 사용자 대상 로컬라이제이션을 구현하기 위해

**뭘 했나**
> `index.html`: 퀴즈 화면 마크업 (국가명 표시, 4지선다 버튼, 결과 화면)
> `app.js`: 퀴즈 로직 초기 버전 (loadQuestion, handleAnswer, shuffle, showResult)
> `data.js`: 195개국 데이터 + 전체 한국어 번역 (국가명, 수도명)
> `style.css`: 다크 테마(#0f172a, #1e293b), 버튼 상태 스타일, D3 지도 SVG 스타일

**어떤 구조를 선택했고 왜**
> SPA(Single Page Application) — 화면 전환 시 페이지 리로드 없이 상태 유지.
> 데이터(data.js), 로직(app.js), 마크업(index.html), 스타일(style.css) 역할 분리.
> 4지선다 오답은 같은 지역 국가 우선 풀에서 추출 — 지역 연관성으로 학습 효과 향상.

**왜 이 방법을 선택했나 (다른 방법은 없었나)**
> 지도 시각화로 정적 PNG 이미지도 가능했지만 **D3.js SVG** 선택 — 국가별 클릭/하이라이트 인터랙션 필요, 반응형 대응 용이, 벡터 기반이라 확대 시 무손실.
> 데이터 저장 방식으로 외부 JSON 파일도 가능했지만 **JS 배열 하드코딩** 선택 — 197개 규모에서 HTTP 요청 불필요, 로드 속도 우수.

**배운 것 / 몰랐던 것**
> TopoJSON 파일은 GeoJSON보다 약 30% 용량 감소. world-atlas는 ISO numeric 코드를 사용해 alpha-2 코드로 변환하는 `NUM_TO_A2` 매핑 테이블 필요.
> `shuffle()` 구현에서 `sort(() => Math.random() - 0.5)` 방식은 Fisher-Yates와 다르게 분포가 완벽하지 않지만 퀴즈 용도로는 충분.

**에러 & 해결**
> 에러: 지도 렌더링 완료 전에 `highlightCountry()` 호출 시 SVG 요소를 찾지 못함
> 원인: `fetch()`로 TopoJSON 비동기 로드 중 `loadQuestion()` 실행
> 해결: `mapReady` 플래그와 `pendingHighlight` 변수로 로딩 순서 제어

---

### #3 — 지역 챕터 선택 화면 추가 (2026-04-05)

**왜 이 작업을 했나**
> 전체 197개국 랜덤 퀴즈는 학습 방향이 없어 지역별로 집중 학습할 수 있도록 개선하기 위해

**뭘 했나**
> `index.html`: `#select-screen` 지역 카드 그리드 추가, 3개 화면(선택/퀴즈/결과) 구조로 재편, 퀴즈 로직을 app.js에서 인라인 script로 이전, D3.js + TopoJSON CDN 연동
> `data.js`: `REGIONS` 배열 7개 정의, 국가 수 197개로 확장, Set 기반 중복 제거 로직 추가
> `style.css`: `.region-card` 그리드 스타일, hover 애니메이션(3px 위로 이동), 모바일 미디어 쿼리

**어떤 구조를 선택했고 왜**
> 퀴즈 로직을 `app.js`에서 `index.html` 인라인 script로 이전 — 지역 선택 상태(`questionPool`)를 단일 스코프에서 관리하기 위해.
> 화면 전환을 `display: none / block` 토글로 구현 — React/Vue 없이 상태 복잡도가 낮은 3개 화면 관리에 충분.
> `NUM_TO_A2` 매핑 테이블로 TopoJSON numeric 코드 → ISO alpha-2 변환 — world-atlas 데이터 포맷에 맞춤.

**왜 이 방법을 선택했나 (다른 방법은 없었나)**
> 지역 필터링에 URL 파라미터(`?region=asia`) 방식도 가능했지만 **JS 변수(`questionPool`)** 방식 선택 — 단일 파일 SPA 구조에서 상태 공유가 간단하고, 새로고침 없는 전환 가능.
> SPA 프레임워크(React/Vue)를 쓸 수도 있었지만 **Vanilla JS** 유지 — 외부 의존성 없음, 번들 빌드 불필요, 현재 규모에 충분.

**배운 것 / 몰랐던 것**
> `grid-template-columns: repeat(auto-fill, minmax(160px, 1fr))` 패턴으로 반응형 카드 그리드 구현 가능.
> `questionPool`과 `usedCountries` Set을 분리해야 지역 재시작 시 중복 없이 재설정 가능.

**에러 & 해결**
> 에러: 같은 지역으로 재시작 시 이전 점수가 유지됨
> 원인: `startQuiz()`에서 `score`, `questionIndex`, `usedCountries` 초기화 누락
> 해결: `startQuiz()` 시작 시 3개 변수 명시적 초기화
>
> 에러: 코모로(KM) 국가가 data.js에 중복 존재
> 원인: 데이터 입력 실수로 africa 섹션에 동일 항목 2개
> 해결: 파일 끝부분에서 `seen` Set으로 중복 제거 후 `COUNTRIES_UNIQUE` 재할당

---

## 🐛 에러 모음

| 에러 | 원인 | 해결 |
|------|------|------|
| 지도 렌더링 전 `highlightCountry()` 호출 실패 | `fetch()` 비동기 완료 전 퀴즈 시작 | `mapReady` 플래그 + `pendingHighlight` 변수로 순서 제어 |
| 코모로(KM) 중복 항목 | data.js에 동일 항목 2개 존재 | 파일 끝에서 Set 기반 중복 제거 로직으로 해결 |
| 지역 재시작 시 점수 유지 | `startQuiz()` 내 변수 초기화 누락 | `score`, `questionIndex`, `usedCountries` 명시 초기화 |
| app.js 레거시 코드 잔존 | #3 작업 시 로직을 인라인으로 이전했으나 app.js 미삭제 | app.js 삭제 필요 (현재 미사용) |
