# Luckylotto Tracker アプリケーション 操作手引き

**最終更新日：2025年7月5日**

## はじめに

Luckylotto Trackerは、Numbers4とLotto6の購入記録やシミュレーション結果を管理し、視覚的に分析するためのPWA（Progressive Web App）アプリケーションです。

---

## 1. アプリケーションの概要とインストール

### 1.1 Luckylotto Trackerとは？

- Numbers4とLotto6の購入記録を時系列で管理・可視化します。
- Numbers4とLotto6の仮想購入シミュレーションを行い、その結果も記録・可視化できます。
- PWA対応により、インストール不要でブラウザから利用でき、オフラインでの利用やホーム画面への追加が可能です。

### 1.2 アプリケーションの起動

WebブラウザでアプリケーションのURLにアクセスしてください。

### 1.3 PWAとしてのインストール（ホーム画面への追加）

- スマートフォンやタブレットの場合：ブラウザのメニューから「ホーム画面に追加」や「アプリをインストール」を選択してください。
- PCの場合：URLバーの右端に表示されるインストールアイコン（またはブラウザのメニュー）から「Luckylotto Trackerをインストール」を選択してください。

インストール後は、アプリのように直接起動できるようになります。

---

## 2. メインメニューの操作

Luckylotto Trackerには、大きく分けて以下の2つのメインメニューがあります。

### 2.1 実際の記録

- 実際に購入したNumbers4やLotto6の記録を時系列で入力・管理する機能です。
- 記録されたデータはグラフで可視化され、収支や当選傾向を分析できます。

### 2.2 シミュレーション

- Numbers4とLotto6を仮想で購入し、その結果をシミュレーションする機能です。
- シミュレーション結果も記録・グラフ化でき、様々な購入戦略を試すことができます。

---

## 3. 実際の記録：購入記録の入力と管理

### 3.1 購入記録の入力画面

左側のメニューから「実際の記録」を展開し、「購入記録入力」を選択してください。

（スクリーンショット：image_484d27.png）

- **日付**: 購入した日付をカレンダーから選択
- **種別**: 「ナンバーズ4」または「ロト6」から選択
- **番号**: 購入した番号を入力（例：ナンバーズ4の場合「1234」または「1-2-3-4-5-6」）
- **購入枚数**: 購入した枚数を指定。－ ＋ ボタンで数量調整
- **金額(円)**: 購入にかかった合計金額が表示（購入枚数×単価（1枚200円）から自動計算）。－ ＋ ボタンで金額調整も可能
- **当選額(円)**: 当選した場合の当選金額を入力。初期値は0円。－ ＋ ボタンで調整可能
- **コメント**: 任意のコメントを入力可能（例:「誕生日記念」「クイックピック」など）
- **記録ボタン**: 入力した内容を保存

### 3.2 記録されたデータの確認とグラフ化

- 「実際の記録」メニューの「一覧」を選択すると、記録された購入履歴を一覧で確認できます。
- 「実際の記録」メニューの「統計」を選択すると、記録されたデータが自動的に集計され、収支の推移や当選状況などがグラフで表示されます。

---

## 4. シミュレーション：仮想購入の体験と分析

### 4.1 ナンバーズ4 シミュレーションの実行

左側のメニューから「シミュレーション」を展開し、「ナンバーズ4」を選択してください。

（スクリーンショット：image_483ef7.png）

- **お任せで選択**: 自動で番号を生成
- **買い方**: ストレート、ボックス、セット、ミニなど
- **予想番号**: 任意の4桁の数字を入力（例: 1234）
- **枚数**: シミュレーションする購入枚数
- **追加ボタン**: 設定内容を「エントリー一覧」に追加

#### エントリー一覧

- **#**: エントリー番号
- **買い方**, **予想**, **枚数**, **コスト**（1枚¥200）, **✕ボタン**（削除）

- **抽選実行ボタン**: エントリー一覧内容で抽選シミュレーションを実行
- **当選番号**: シミュレーションで決定された当選番号が表示（例: 8239）

#### 当選結果

- **A (完全一致)**: 抽選番号と完全一致した数字数
- **B (数字のみ一致)**: 抽選番号に含まれる数字が並び順問わず一致した数
- **当選合計**, **投入合計**, **収支**: それぞれの合計金額と差額

### 4.2 ロト6 シミュレーションの実行

左側のメニューから「シミュレーション」を展開し、「ロト6」を選択してください。

（スクリーンショット：image_483e82.png）

- **数字選択パネル (1～43)**: 1～43から6個選択。選択された数字は青色でハイライト
- **お任せで選ぶ**: 残りの必要な数字を自動生成
- **枚数**: シミュレーションする購入枚数
- **追加ボタン**: 選択内容を「エントリー一覧」に追加

#### エントリー一覧

- ナンバーズ4シミュレーションと同様に、予想、枚数、コストが表示

- **抽選実行ボタン**: エントリー一覧内容で抽選シミュレーションを実行
- **当選番号**: 当選番号とボーナス数字が表示（例: 8-14-19-23-33-35 ボーナス: 28）

#### 当選結果

- **#**: エントリー番号
- **予想**, **枚数**, **一致数**, **当選合計**, **投入合計**, **当選合計**, **収支**

### 4.3 シミュレーション結果の確認とグラフ化

（スクリーンショット：image_483e5e.png, image_483e26.png）

- 「シミュレーション」メニューの「一覧」を選択すると、実行されたシミュレーションセッションの履歴が確認可能
- 削除ボタンで特定のセッション削除可能
- ページネーション機能で多数のセッションも管理可能
- 「統計」を選択すると、全セッションの結果が集計され、投入額・当選額・収支などがグラフ表示されます

---

## 5. よくある質問 (Q&A)

**Q: アプリが動作しない、または画面が真っ白になった場合。**  
A: ブラウザのキャッシュをクリアするか、アプリを再インストールしてみてください。

**Q: 記録したデータやシミュレーション結果はどこに保存されますか？**  
A: お使いのブラウザのローカルストレージに保存されます。ブラウザの履歴やデータをクリアすると消去される場合があるのでご注意ください。

**Q: ROIとは何ですか？**  
A: ROI（Return On Investment）は投資収益率。このアプリでは、投入額に対してどれだけ当選額が得られたかの割合です。

---

## 6. 注意事項

- 本アプリケーションは、宝くじの購入記録やシミュレーション結果を分析するためのツールであり、当選を保証するものではありません。
- 記録されたデータはブラウザのローカルストレージに保存されるため、別のデバイスやブラウザでは参照できません。

---

これでLuckylotto Trackerのユーザー操作手引きの加筆修正版が完成です。不足点や修正があればご連絡ください。

---

※スクリーンショット画像は対応する箇所に挿入してください。