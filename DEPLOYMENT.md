# 곽혜인 AX · DX 포트폴리오

빌드 도구 없이 GitHub Pages에서 실행되는 반응형 정적 웹사이트입니다.

- `index.html`: 소개·프로젝트·경험·연락처
- `patent-claims.html`: 특허 출원 명세서 청구범위 보기
- `assets/styles.css`: 기본 스타일
- `assets/ax-dx.css`: AX·DX 반응형 레이아웃
- `assets/visual-stories.css`: 대표 이미지와 설명이 나란히 보이는 사례 레이아웃
- `assets/bookshelf.css`, `assets/bookshelf.js`: 책장형 프로젝트 목차, 슬라이드 보기, 등장 애니메이션
- `assets/page-transitions.js`: 본문 구간 이동 시 방향에 맞춘 페이드·슬라이드 전환
- `assets/main.js`: 메뉴, 분야 필터, 이미지 확대, 이메일 복사, 인쇄
- `개선방향.md`: 정보 구조와 지원 직무별 보강 방법
- `이미지-출처.md`: 발표자료에서 발췌한 이미지, 기사 연결, Figma 레이아웃 참고 내역

## 로컬에서 보기

`index.html`을 브라우저로 열거나, Node.js가 설치된 환경에서 이 폴더의 다음 명령을 실행한 뒤 `http://127.0.0.1:4174`로 접속합니다.

```sh
node serve.mjs
```

## 기존 GitHub Pages에 적용

1. `index.html`, `patent-claims.html`과 `assets` 폴더를 기존 `portfolio_Hyein` 저장소의 게시 소스 폴더에 함께 넣습니다. 기존 파일은 백업하거나 별도 브랜치에서 검토하세요.
2. 변경 내용을 커밋·푸시합니다.
3. 기존 Pages 배포가 완료되면 PC와 휴대폰에서 확인합니다.

HTML 단독 업로드 시 이미지와 스타일을 불러올 수 없습니다. `assets` 폴더를 함께 업로드하세요. 이 작업에서 원격 저장소 푸시나 공개 배포는 수행하지 않았습니다.
