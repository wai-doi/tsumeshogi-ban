# Repository Guidelines

## プロジェクト構成

アプリ本体は `src/` 配下です。UI は `src/components/`、駒画像コンポーネントは `src/components/pieces/`、状態管理ロジックは `src/hooks/`、移動判定などのルールは `src/utils/moveValidator.ts` に配置します。モード関連のコンテキストは `src/contexts/`、画像アセットは `src/images/` を使用します。
ユニットテストは `src/tests/`、E2E テストは `tests/e2e/` に置きます。`public/` は静的ファイル、`dist/` はビルド成果物です（手動編集しないこと）。

## ビルド・テスト・開発コマンド

パッケージマネージャは `npm` を前提にします（`package-lock.json` を使用）。

- `npm run dev`: Vite の開発サーバーを起動
- `npm run build`: `tsc -b` 実行後に本番ビルドを作成
- `npm run preview`: `dist/` のビルド結果をローカル確認
- `npm run test`: `src/tests` の Jest テストを実行
- `npm run e2e`: `tests/e2e` の Playwright テストを実行
- `npm run lint:eslint`: TypeScript/React コードを静的解析
- `npm run lint:stylelint`: CSS と styled-components を検証
- `npm run format`: Prettier で整形

## コーディング規約と命名

TypeScript の型（`type` / `interface`）を明示し、React は関数コンポーネントで実装します。アプリコードは named export を基本とします。import はグループ化し、アルファベット順を維持してください。
整形は Prettier（`singleQuote: true`, `semi: false`）、規約チェックは ESLint / Stylelint を使います。

- コンポーネント: `PascalCase`（例: `PieceStand.tsx`）
- フック・ユーティリティ: `camelCase`（例: `useMovePiece.ts`）
- テストファイル: `*.test.ts` / `*.spec.ts`

## テスト方針

ロジック変更時は Jest のユニットテストを追加し、ユーザー操作（ドラッグ&ドロップ、モード切替、保存復元）の変更時は Playwright の E2E テストを追加します。既存の `beforeEach` や振る舞いベースのテスト名に合わせてください。
PR 前の推奨実行:

`npm run lint:eslint && npm run lint:stylelint && npm run test && npm run e2e`

## コミットとプルリクエスト

コミットメッセージは、履歴に合わせて短い命令形の英語サマリーを推奨します（例: `Add lint job to CI workflow`）。1コミット1目的を守ってください。
`pre-commit` では Husky 経由で `lint-staged` が動作します。PR には目的、変更範囲、ローカル検証結果を記載し、UI 変更時はスクリーンショットまたは GIF を添付してください。
