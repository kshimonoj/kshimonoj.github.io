---
layout: post
title: "Mist APIを使ったRF監視ダッシュボード"
date: 2026-07-17
category: wifi
repo: https://github.com/kshimonoj/mist-rf-dashboard
---
HPE Mist はシンプルにWi-Fi環境を構築できて、運用・監視もAIを使った可視化が可能です。
一方で、過去のログを長期的に保存したり、無線（RF:Radio Frequency）関連の細かなデータをDashboardで全て確認することには向いていないです。（全て表示するとダッシュボードの表示が煩雑になって、余計わかりにくくなってしまいます）
データが取れていないわけではなく、データはきちんと取っていて、AIを使った分析、最適化にはしっかり活用しています。さらに、それらのデータのほとんどはAPIで取得できるようにしています。

今回は、そのAPIを使って、RF関連のデータをできる限り細かく取得、時系列で長期間表示可能なダッシュボードを作ってみました。

---
## 全体像

```
サイト一覧
  └─ Site Detail（SLE + AP一覧 + Client一覧）
       └─ AP Detail（推移グラフ + Radio設定 + 接続クライアント + SLE）
       └─ Client Detail（推移グラフ + ローミング履歴）

+ Floor Map（フロアマップ上にAP配置・チャネル干渉表示）
+ Insights（自動問題検知・設定変更の効果測定・最適化提案）
+ Tags（AP/Clientへの自由なタグ付け・タグ別一覧）
+ History（スナップショット・CSVログ）
+ Settings（マルチ環境切り替え・各種設定）
```

## モニタリング機能

### サイト一覧・Site Detail

登録済みの全サイトを一覧表示し、AP稼働台数・オンライン率が一目でわかる。サイトを開くと、 そのサイトのSLE（後述）とAP一覧・クライアント一覧がタブで切り替えられる。
![01-home](/assets/images/01-home.png)

### AP Detail

1台のAPについて、以下を1画面で確認できる。

- **リアルタイム状態**: 接続クライアント数、バンドごとのチャネル・帯域幅・送信電力・利用率・ノイズフロア
- **推移グラフ**: 1h/6h/24h/72h（後述の30dも選択可）で、上記の値の時系列変化を表示
- **Radio設定**: Org / Site (RF Template) / Device Profile / Device のどの階層で設定されているかをバンドごとに判定して表示
- **設定変更履歴**: チャネル・帯域幅・送信電力の変更を自動検知して記録
- **接続中クライアント一覧**: このAPに今つながっている端末の一覧（RSSI・SNR・レート等）
![03-ap-detail](/assets/images/03-ap-detail.png)

### Client Detail

1台の端末について、RSSI/SNR・送受信レート・スループット・接続バンド/チャネルの推移をグラフ表示。 バンドやチャネルが変わったタイミングにはマーカーが付くので、ローミングの様子が視覚的にわかる。
![client-detail](/assets/images/client-detail.png)

### Floor Map

フロアマップ画像の上にAPを配置し、チャネルごとに色分け表示。同じチャネルのAPが近くにある場合は 干渉ペアとして一覧表示される。
![floormap](/assets/images/floormap.png)

## SLE（Service Level Experience）

Mist の SLE APIを使い、以下の6指標をサイト単位・AP単位の両方で表示する。

- Capacity（帯域に対する余裕度）
- Throughput（スループット体験）
- Coverage（電波カバレッジ）
- Time to Connect（接続にかかる時間）
- Roaming（ローミング品質）
- AP Availability（AP稼働率）

Capacityについては「なぜスコアが低いのか」を Wi-Fi干渉・非Wi-Fi干渉・クライアント数・クライアント 使用量の4つの要因に分解して表示する。これにより、単に「調子が悪い」ではなく「電波干渉が原因で調子が 悪い」まで踏み込んで判断できる。

## Insights ― 自動問題検知

蓄積したメトリクスを分析し、以下の問題を自動検知する。追加のAPI呼び出しは発生しない。

|検知項目|内容|
|---|---|
|Sticky Client|弱い電波のAPに居座り続けている端末|
|2.4GHz滞留|5GHz対応端末なのに2.4GHzに固定されている|
|High Retry|送信再送率が異常に高い端末|
|Co-channel干渉|同じチャネルを使うAP同士の相互干渉|
|Roaming Flapping|短時間にAPを何度も切り替えている端末|

検知結果は「Active」（現在発生中）と「History」（過去の発生・解消履歴)に分かれており、 「いつから発生していたか」を後から追える。

### 設定変更のBefore/After分析

Radio設定（チャネル・帯域幅・送信電力）を変更した前後で、SLEスコアやチャネル利用率がどう変わったかを 自動比較する。変更前後それぞれ6時間分の平均を比較し、「改善」「悪化」「変化なし」を自動判定する。 「このチャネル変更、本当に効果があったのか」を勘ではなく数値で確認できるのが一番のポイント。

### 最適化レコメンデーション

検知結果をAP単位に集約し、「空いているチャネルへの変更を検討」「Tx Powerの引き下げを検討」といった 具体的な次のアクションを提示する。

## Tags

AP・クライアントの両方に自由なタグを付けられる。専用のTagsページでタグを選ぶと、そのタグが付いた AP・クライアントだけが一覧表示される。タグはローカルDBにのみ保存され、Mist側には反映しない。

## Snapshot / CSV Export

- **Snapshot**: 直近72時間分のメトリクスをまるごと1つのファイルに固めて保存(最大2世代)。 ダウンロード・アップロードもできるので、別のPCで後日確認することも可能
![05-snapshots](/assets/images/05-snapshots.png)

- **CSV Export**: AP メトリクス・SLEメトリクス・クライアントメトリクス・フロアマップの干渉サマリーを 1時間ごとに自動でCSV保存。History画面から種類・サイト・AP・クライアントで絞り込んでダウンロードできる
![05b-history-csv](/assets/images/05b-history-csv.png)

## 30日間メトリクス履歴（オプション機能）

通常、ローカルDBのメトリクスは7日で自動削除される(ディスク容量を抑えるため)。Settingsで 「30-Day Metrics History」を有効にすると、保持期間が30日に延び、推移グラフに`30d`ボタンが追加される。

30日分の生データをそのまま描画すると重くなるため、`30d`を選んだときだけバックエンド側で 1時間ごとの平均値に集計してから返す仕組みになっている。1h/6h/24h/72hは今まで通り生データのまま。

## マルチ環境対応

複数のMist Organization（顧客・拠点ごとなど）を登録しておき、Settings画面から切り替えられる。切り替えは コンテナの再起動不要。切り替え時に蓄積データをクリアするかどうかも選べる。

---


## 参考：使用したMist APIについて

## 組織・サイト情報系

| エンドポイント                             | 用途                                        |
| ----------------------------------- | ----------------------------------------- |
| `GET /orgs/{org_id}/sites`          | サイト一覧の取得                                  |
| `GET /orgs/{org_id}/rftemplates`    | RF Template一覧（Radio設定がどの階層で決まっているかの判定に使用） |
| `GET /orgs/{org_id}/deviceprofiles` | Device Profile一覧（同上）                      |
| `GET /sites/{site_id}/setting`      | サイト設定（RF Templateの紐付け確認）                  |

Radio設定（チャネル・帯域幅・送信電力）は、AP・Device Profile・RF Template・Orgのどこで設定されて いるかがバンドごとに異なる。この4つのAPIを組み合わせて突き合わせることで、「このAPのこのバンドは 今どの階層の設定が効いているか」を判定できる。

## AP関連

|エンドポイント|用途|
|---|---|
|`GET /sites/{site_id}/devices?type=ap&limit=1000`|AP設定情報の一括取得|
|`GET /sites/{site_id}/devices/{ap_id}`|AP1台分の設定詳細|
|`GET /sites/{site_id}/stats/devices?type=ap`|AP実測値（チャネル利用率・ノイズフロア・送信電力など）|
|`GET /sites/{site_id}/devices/events/search?duration=`|APイベント（再起動・DFS検知など）|

`devices` の一括取得は `limit=1000` を指定すると `X-Page-Total` ヘッダーでページネーションが 正常に機能する。250台規模のAP環境でも、AP1台ずつ個別にAPIを叩く必要がなく、数回のコールで全AP分の 情報を取得できた。

## クライアント関連

|エンドポイント|用途|
|---|---|
|`GET /sites/{site_id}/stats/clients`|現在接続中の全クライアント一覧（RSSI/SNR/レート等の実測値付き）|
|`GET /sites/{site_id}/clients/search`|クライアント接続履歴の検索|

ここが一番ハマったポイントで、`stats/clients` は公式ドキュメントに `limit` や `ap_mac` といった クエリパラメータが記載されているが、**私の環境ではうまく効かず、常にサイト全体の全クライアントが返ってきた**。 MACアドレスの表記(コロンあり/なし/ハイフン区切り/Cisco形式)をいろいろ試したが結果は同じだった。うまくfilterできた方は教えてほしいです。

一方 `clients/search` は `limit` も `ap_mac` フィルタも正常に機能する。ただしこちらはRSSI/SNRと いったリアルタイム実測値を含まない、過去の接続履歴を検索するためのAPIのようで、`total` が数万件に なることもあった。

用途としては、「今何が起きているか」を見たいなら `stats/clients`、「いつ・どのAPに接続していたか」 を検索したいなら `clients/search`、という使い分けになる。

## SLE（Service Level Experience）

|エンドポイント|用途|
|---|---|
|`GET /sites/{site_id}/sle/site/{site_id}/metric/{metric}/summary?duration=`|サイト単位のSLE|
|`GET /sites/{site_id}/sle/ap/{ap_id}/metric/{metric}/summary?duration=`|AP単位のSLE|
|`GET /sites/{site_id}/sle/site/{site_id}/metric/{metric}/classifier/{classifier}/summary?duration=`|classifier単位の内訳詳細|

`metric` には `capacity` / `throughput` / `coverage` / `time-to-connect` / `roaming` / `ap-availability` の6種類が指定できる。全てサイト単位・AP単位の両方で取得可能。

`capacity` メトリクスは `classifiers` という配下に、スコアが低い要因を `wifi-interference`（Wi-Fi干渉）・`non-wifi-interference`（非Wi-Fi干渉）・`client-count` （クライアント過多）・`client-usage`（通信量過多）の4つに分解した内訳が入っている。 「スコアが低い」だけでなく「なぜ低いか」まで機械的に判定できるので、自動問題検知の実装に非常に 役立った。

`duration` パラメータは `1h` のような短い単位だけでなく `30d` のような長期間もそのまま受け付けて くれる。ただし `interval` は常に固定（1時間粒度など）で、データが存在しない区間は `null` になる。

## まとめ

Mist Portal を置き換えるものではなく、「後から振り返りたい」「変更の効果を数値で見たい」 「複数拠点を行き来しながら使いたい」といった、自分の使い方に合わせて育ててきたツールです。 Mist APIを使って似たようなものを作りたい人の参考になれば幸いです。
