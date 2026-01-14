# Luckylotto Tracker アプリケーション：アーキテクチャと開発Tips

Luckylotto Trackerは、現代のWeb技術スタックを活用し、ユーザーフレンドリーなインタフェースと堅牢なバックエンドなしのデータ管理を実現しています。

## 1. アプリケーション・アーキテクチャ

Luckylotto Trackerは、シングルページアプリケーション（SPA）として設計されており、クライアントサイドですべての処理が完結するPWA (Progressive Web App) です。

### 1.1 技術スタック

- **フロントエンドフレームワーク:** Vue 3 (Composition API, `<script setup>`)
    - 宣言的なUI構築とリアクティブなデータ管理を実現。
- **ビルドツール:** Vite
    - 超高速な開発サーバーと最適化されたビルドプロセスを提供し、開発効率を向上。
- **言語:** TypeScript
    - 静的型付けにより、大規模開発におけるコードの品質と保守性を向上。バグの早期発見に貢献。
- **状態管理:** Pinia
    - Vue 3に最適化されたシンプルで直感的な状態管理ライブラリ。ストアのモジュール化が容易。
- **グラフ描画:** Chart.js（または類似のグラフライブラリ）
    - データの視覚化（収支推移など）に利用。
- **CSSフレームワーク/ユーティリティ:** (Tailwind CSS, SCSS, または素のCSS)
    - スタイリングを効率化。
- **永続化:** LocalStorage
    - サーバーレスで、ユーザーのブラウザ内にデータを永続的に保存。

### 1.2 データフロー（高レベル）

- **UI (Vue Components):** ユーザーからの入力（購入記録、シミュレーション設定、ボタンクリック）を受け取る。
- **State Management (Pinia Store):** 
    - UIからのアクションを受け取り、アプリケーションの状態（購入記録リスト、シミュレーション結果、現在の選択など）を更新。
    - 状態の変更はリアクティブにUIに反映。
    - LocalStorageとの読み書きを仲介し、データの永続化を管理。
- **Local Storage:**
    - Pinia Storeから渡されたデータをJSON形式で保存。
    - アプリ起動時やデータ読み込み要求時に、Pinia Storeへデータを供給。
- **Utility/Logic (Composables):**
    - シミュレーションロジック（Numbers4/Lotto6の抽選、当選判定）など、特定の機能や再利用可能なロジックをカプセル化し、StoreやComponentから呼び出す。
- **PWA Service Worker:**
    - アプリのリソースをキャッシュし、オフライン環境でもアプリが動作するようにする。

### 1.3 アプリケーション構造（概略）

```
luckylotto-tracker/
├── src/
│   ├── assets/        # 静的リソース (CSS, 画像など)
│   ├── components/    # 再利用可能なUI部品 (例: NumberInput, ChartDisplay)
│   ├── composables/   # 再利用可能なロジック (例: useLottoLogic.ts)
│   ├── stores/        # Piniaストア (例: recordsStore.ts, simulationStore.ts)
│   ├── types/         # TypeScriptの型定義 (例: lottoTypes.ts)
│   ├── views/         # ルーティングされるページコンポーネント (例: RecordInputPage.vue, SimulationPage.vue)
│   ├── App.vue        # アプリケーションのルート
│   ├── main.ts        # エントリーポイント (Vue, Pinia, Router初期化)
│   └── router.ts      # Vue Routerの設定
├── public/            # PWAマニフェスト, アイコンなど
├── vite.config.ts
├── package.json
└── ...
```

---

## 2. 開発上のTips

Luckylotto TrackerのようなWebアプリケーション開発で役立つTipsです。

### 2.1 Vue 3 / TypeScript / Pinia の活用

- **Composition API (`<script setup>`):** コンポーネントのロジックを整理し、再利用可能なcomposablesとして抽出することで、コードの可読性と保守性を高めます。
- **TypeScript:** 型を積極的に利用することで、開発中のエラーを減らし、リファクタリングを容易にします。特に複雑なデータ構造（Lottoの番号、記録など）に有用です。
- **Pinia:** シンプルなAPIと強力な型推論により、Vuexよりも直感的な状態管理が可能。ストアを細かく分割することで、アプリケーション全体の見通しが良くなります。

### 2.2 PWA / デプロイに関するTips

- **PWAの準備:**
    - vite-plugin-pwaなどのViteプラグインを利用すると、Service Workerの登録やマニフェストファイルの生成が自動化され、PWA化が容易になります。
    - オフラインで動くことを確認するため、開発者ツールの「Application」タブでService Workerの状態を確認しましょう。
- **ビルドとデプロイ:**
    - `npm run build` で本番環境用の最適化されたバンドルを生成。
    - `vite.config.ts` で base オプションを適切に設定することで、サブディレクトリへのデプロイ（例: GitHub Pages）に対応。
    - デプロイ先のホスティングサービス（Netlify, Vercel, GitHub Pagesなど）のCI/CD連携を活用すると、Gitプッシュで自動デプロイが可能。

### 2.3 状態管理と永続化に関するTips

- **LocalStorageの活用:**
    - サーバーがないアプリでは、LocalStorageが手軽な永続化手段。`JSON.stringify()` と `JSON.parse()` でオブジェクトを文字列に変換して保存します。
    - ただし、LocalStorageの容量制限（数MB）と同期APIである点に注意。大量のデータや複雑なクエリが必要な場合はIndexedDBを検討しましょう。
- **ストアの初期化:** アプリ起動時にLocalStorageからデータを読み込み、ストアの状態を初期化するロジックを `main.ts` やストア自身の `actions` に記述。

### 2.4 UI / UX / デバッグに関するTips

- **直感的なUI:** 宝くじのような数字を扱うアプリでは、数字選択UI（Lotto6 の数字パネルなど）や、結果表示（当選番号と一致数）を分かりやすくする工夫が大切。
- **フィードバックの提供:** シミュレーション実行中やデータ保存時など、ユーザーが待つ間にローディング表示や成功メッセージなどを表示し、体験を向上させましょう。
- **開発者ツールの活用:**
    - **Console:** エラーや警告の確認や、console.logで変数の中身や処理の実行パスを確認。
    - **Elements:** DOM構造やCSSプロパティをリアルタイムで確認し、レイアウトの問題を特定。
    - **Sources:** ブレークポイントを設定し、ステップ実行でコードの挙動を詳細に追跡。非同期処理のデバッグに有効。
    - **Application:** LocalStorageやService Workerの状態を確認し、PWAの動作やデータの永続化が意図通りかを確認。
- **段階的な開発:** 全ての機能を一度に作ろうとせず、核となる機能（例: 数字入力→抽選→結果表示）から実装し、段階的に拡張していくことで、安定した開発が可能。
- **Gitの活用:** 頻繁にコミットし、意味のある単位で変更を区切りましょう。機能ごとにブランチを切り、マージ前にテストすることで、バグの混入を防ぎます。

---

Luckylotto Trackerの開発で得られたこれらの学びは、今後のWebアプリケーション開発において非常に役立つでしょう。