---
layout: post
title: Bring Your Own Dashboard (BYODB) — 自分の視点を持ち込むネットワーク運用
date: 2026-08-12
category: ai
repo: |
  https://github.com/kshimonoj/multi-network-dashboard
---

<!-- ============================================================
     BYODB HERO — この記事の一番上、front matterの直後に貼り付け
     クラス名は byodb- プレフィックスでスコープ済み。
     サイト全体のCSSと衝突する場合はプレフィックスを変更してください。
     ============================================================ -->
<style>
@import url('https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;500;700;900&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

.byodb-hero{
  background:#121c26;
  color:#fff;
  position:relative;
  overflow:hidden;
  font-family:"Zen Kaku Gothic New",sans-serif;
  /* 記事本文の幅制限を突き破ってフルブリードにする */
  width:100vw;
  margin-left:calc(50% - 50vw);
  margin-right:calc(50% - 50vw);
  margin-top:0;
  margin-bottom:2.5em;
}
.byodb-hero-inner{
  max-width:1060px;margin:0 auto;
  padding:80px 24px 72px;
  position:relative;z-index:2;
}
.byodb-hero-eyebrow{
  font-family:"IBM Plex Mono",monospace;
  color:#48cfad;
  font-size:13px;letter-spacing:.14em;
  margin-bottom:22px;
}
.byodb-hero h1{
  font-weight:900;
  font-size:clamp(30px,5.4vw,56px);
  line-height:1.22;
  letter-spacing:.01em;
  margin:0;
  color:#fff;
}
.byodb-hero h1 .byodb-accent{color:#48cfad}
.byodb-hero-sub{
  margin-top:24px;
  max-width:640px;
  color:#c3d2d5;
  font-size:16px;
  line-height:1.9;
}
.byodb-hero-pipeline{
  margin-top:40px;
  font-family:"IBM Plex Mono",monospace;
  font-size:clamp(12px,2.2vw,15px);
  display:flex;align-items:center;gap:14px;flex-wrap:wrap;
}
.byodb-hero-pipeline .byodb-node{
  border:1px solid rgba(72,207,173,.55);
  border-radius:8px;
  padding:8px 16px;
  background:rgba(72,207,173,.08);
  color:#e6f2ef;
}
.byodb-hero-pipeline .byodb-node.byodb-hot{background:#48cfad;color:#121c26;font-weight:600;border-color:#48cfad}
.byodb-hero-pipeline .byodb-arrow{color:#48cfad;opacity:.85}
.byodb-hero svg.byodb-mesh{
  position:absolute;inset:0;width:100%;height:100%;
  opacity:.5;z-index:1;
}
@media (prefers-reduced-motion:no-preference){
  .byodb-mesh .byodb-pulse{animation:byodb-pulse 5s ease-in-out infinite}
  .byodb-mesh .byodb-pulse:nth-child(2n){animation-delay:1.4s}
  .byodb-mesh .byodb-pulse:nth-child(3n){animation-delay:2.6s}
  @keyframes byodb-pulse{0%,100%{opacity:.25}50%{opacity:.9}}
}
</style>

<header class="byodb-hero">
  <svg class="byodb-mesh" viewBox="0 0 1200 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <g stroke="#48cfad" stroke-width="1" opacity=".35">
      <line x1="80" y1="120" x2="260" y2="60"/><line x1="260" y1="60" x2="420" y2="150"/>
      <line x1="80" y1="120" x2="200" y2="300"/><line x1="200" y1="300" x2="420" y2="150"/>
      <line x1="420" y1="150" x2="640" y2="90"/><line x1="640" y1="90" x2="860" y2="170"/>
      <line x1="860" y1="170" x2="1060" y2="80"/><line x1="860" y1="170" x2="1010" y2="330"/>
      <line x1="1010" y1="330" x2="1150" y2="450"/><line x1="200" y1="300" x2="380" y2="440"/>
      <line x1="380" y1="440" x2="640" y2="380"/><line x1="640" y1="380" x2="860" y2="170"/>
      <line x1="640" y1="380" x2="1010" y2="330"/><line x1="640" y1="90" x2="640" y2="380"/>
      <line x1="380" y1="440" x2="120" y2="500"/>
    </g>
    <g fill="#48cfad">
      <circle class="byodb-pulse" cx="80" cy="120" r="5"/><circle class="byodb-pulse" cx="260" cy="60" r="4"/>
      <circle class="byodb-pulse" cx="420" cy="150" r="6"/><circle class="byodb-pulse" cx="200" cy="300" r="4"/>
      <circle class="byodb-pulse" cx="640" cy="90" r="5"/><circle class="byodb-pulse" cx="860" cy="170" r="7"/>
      <circle class="byodb-pulse" cx="1060" cy="80" r="4"/><circle class="byodb-pulse" cx="1010" cy="330" r="5"/>
      <circle class="byodb-pulse" cx="380" cy="440" r="5"/><circle class="byodb-pulse" cx="640" cy="380" r="6"/>
      <circle class="byodb-pulse" cx="1150" cy="450" r="4"/><circle class="byodb-pulse" cx="120" cy="500" r="4"/>
    </g>
  </svg>
  <div class="byodb-hero-inner">
    <div class="byodb-hero-eyebrow">NETWORK OPERATIONS × AI</div>
    <h1>Bring Your Own <span class="byodb-accent">Dashboard</span></h1>
    <p class="byodb-hero-sub">ベンダーの画面を「探し回る」のをやめて、自分の見たいものだけを最短距離で見る。AIがある今、それは現実的なコストで手が届くようになりました。BYODBという考え方と、実際に作ってみた一例を7本の動画で紹介します。</p>
    <div class="byodb-hero-pipeline" aria-label="構成: Device から Vendor Cloud、そして BYODB へ">
      <span class="byodb-node">Device</span><span class="byodb-arrow">──▶</span>
      <span class="byodb-node">Vendor Cloud</span><span class="byodb-arrow">──▶</span>
      <span class="byodb-node byodb-hot">BYODB</span>
    </div>
  </div>
</header>


Network Device の Cloud Management Dashboard は、多くの場合「最大公約数」に向けて作られています。

もちろん、標準ダッシュボードは便利です。デバイスの状態、アラート、クライアント数、トラフィック、設定、ファームウェア、ログ。運用に必要な情報がひと通り揃っています。

一方で、実際の運用で「自分が本当に見たい情報」は、組織や担当者によって異なります。毎朝確認したいのは全体のヘルスではなく、特定拠点のWAN品質かもしれない。VIPユーザーの接続状況、特定SSIDの利用状況、特定モデルだけのファームウェア状態、過去24時間で増えたアラートだけを見たい、ということもあります。

目的が明確なら、ベンダーが用意した標準画面を探し回るよりも、**APIで必要な情報だけを取得して、自分専用のダッシュボードを作った方が運用効率は高くなります**。特に今は、AIを使えばダッシュボード作成のハードルは大きく下がりました。APIの仕様を読み、データを取得し、見やすい画面にまとめる作業は、以前よりずっと簡単です。

これを、自分の端末を持ち込むBYOD (Bring Your Own Device) になぞらえて、**Bring Your Own Dashboard — BYODB** と呼ぶことにします。ベンダーの画面だけを見るのではなく、自分たちの運用に合わせた「自分の視点」を持ち込む、という考え方です。

## **ベンダーのダッシュボードは不要になるのか**

答えは **No** です。若干のポジショントークもありますが、客観的に見ても同じ答えだと思います。むしろカスタムダッシュボードを作る時代だからこそ、ベンダー標準ダッシュボードの重要性は残ります。

理由はシンプルです。数百台、数千台のネットワーク機器を管理する場合、それぞれのデバイスへ個別にAPIで情報を取りに行くのは非効率だからです。デバイス側に負荷がかかり、認証、接続性、データ形式、取得タイミング、エラー処理も複雑になります。

ネットワーク機器の状態は、まず軽量な telemetry data として Device から Cloud に集約される方が自然です。そして Custom Dashboard は、各デバイスではなく **Vendor Cloud に対して** APIで問い合わせる。

```
Device > Vendor Cloud > Custom Dashboard
```

この構成の方が、圧倒的に効率的です。デバイス側の負荷を抑えつつ、正規化された情報をまとめて取得できます。履歴管理、アラート、権限、監査、サポート連携も Vendor Cloud 側に集約できます。

ベンダー標準ダッシュボードには、カスタムダッシュボードでは代替しにくい役割もあります。デバイス一覧のような網羅的な確認、APIの結果が正しいかを突き合わせる比較対象、設定変更、トラブルシュート、ファームウェア管理、サポート時の確認。これらは標準ダッシュボードがあるから成立します。

つまり両者は競合しません。土台として Vendor Cloud が telemetry を集約・正規化し、Vendor 独自の AI Agent が分析と最適化を行い、結果をAPIで外部に提供する。BYODBはその上に乗る、**運用者それぞれの「自分専用の視点」**です。

![byodb-two-tier](/assets/images/byodb-two-tier.png)

じゃあBYODBって実際どんな感じになるの? という疑問に答えるために、あくまで一例として作ってみました。以下、今回作成したBYODBのアーキテクチャと7本の動画で紹介します。

## **データの取得経路 — API と Webhook の2系統**

データの取得経路は、大きく **API** と **Webhook** の2系統に分かれます。(Streaming API はオプション)

### API — 状態を「取りに行く」経路

Global Overview やタグ付きビューのような一覧表示では、Central / Mist の REST API を直接呼び出しています。定期ポーリングで現在の状態を照会する用途なら、この方式で十分です。

AIエージェントによる調査も実体は同じAPIですが、アプリから直接呼ぶのではなく、**Central 用と Mist 用の MCP サーバーをツールとしてエージェントに渡し、どのAPIをどう組み合わせるかはエージェントに任せて**います。ここに後述のナレッジ注入やローカルモデル切替が乗ります。

### Webhook — 通知を「受け取る」経路

Central / Mist からのアラート通知は Webhook で受けます。受け口には Google Apps Script + Google Sheets を使い、通知内容を Sheets に書き溜め、ダッシュボードがそれを読む構成です。受け口を自前でホストしなくて済むため、この部分だけサーバーレスです。設定手順は[別リポジトリ](https://github.com/kshimonoj/central-mist-webhook-to-google-sheets)として公開しています。

### Streaming API — ログが「常に送られてくる」(オプション)

Central だけの機能です。APのステータスや Event、Audit Log などがリアルタイムに送られてきます。Webhook のようなイベントドリブンな通知というより、**Syslog が常に流れてくるイメージ**です。

![byodb-cloud-communication](/assets/images/byodb-cloud-communication.png)

## **BYODBの中身 — 3層構造 + ループ**

中の作りは、あくまで一例ですが3階層に分けました。

1. **観測層 (Observe)**: API / Webhook で取得した情報から、ネットワークの状態と出来事を集めて表示する層
2. **分析層 (Insight)**: 観測層の情報をインプットに AI Agent で分析する層
3. **活用層 (Action)**: 分析結果を人が使いやすい形に切り出す層

ポイントは一方通行ではないこと。活用層で得られた結果 (承認済みナレッジなど) が分析層にフィードバックされ、次の分析がより賢くなる**ループ構造**になっています。

![byodb-three-layers](/assets/images/byodb-three-layers.png)

## #1 全体像: Central と Mist を1つの画面で見る

{% include youtube.html id="9wM-8F4HBu8" %}

HPE Aruba Central と HPE Mist、2つのクラウド管理基盤の情報を1つの Global Overview に集約しています。サイト単位の健全性、デバイス状態、アラートを、2つの管理画面を行き来せずに一覧できます。

Central は OAuth2、Mist は Token と認証方式は異なりますが、どちらも Vendor Cloud の REST API を叩いているだけ。冒頭の「Device > Vendor Cloud > Custom Dashboard」の構成そのものです。

## #2 ネットワーク調査: AIエージェントがMCP経由で原因を追う

{% include youtube.html id="hKsGFGjJ-gc" %}

「このサイトで何が起きているか」を自然文で投げると、AIエージェントが MCP (Model Context Protocol) 経由で Central / Mist の API を必要な回数だけ叩き、根拠つきで原因の候補を返します。

ポイントは、人間が「どのAPIをどの順で叩くか」を設計しないことです。エージェントが状況に応じてツールを選び、足りなければ追加で叩く。Webhook で受けた重大アラートに対しては、**人が気づく前に事前調査を自動実行しておく**仕組みも入れています。

MCPサーバは Central / Mist ともコミュニティベースのものを利用していますが、MCPサーバ自体をLLMで作るのも今なら比較的容易です。実際、私も Central 側のMCPには少し修正を加えています。

## #3 モデル比較: クラウドLLMとローカルLLMを並べて比べる

{% include youtube.html id="pNyKr8Yg01c" %}

同じ調査を複数のモデルで実行して、回答内容と所要時間を並べて比較できます。クラウドのモデルに加えて、Ollama で動かすローカルモデルも選択肢に入れています。

「ネットワークの運用データを外部のAIに渡したくない」という組織は現実に多くあります。ローカルモデルは速度では大きく劣りますが (実測でクラウド28秒に対しローカル224秒)、**「データを一切外に出さずにAI調査ができるか」という問いには Yes と答えられる**ようになりました。

## #4 レポート: 日次/週次/月次サマリを自動生成する

{% include youtube.html id="0kUX7h9rGb4" %}

日次サマリは AI がその日のイベントを集約して生成します。週次・月次は日次レポートの機械集計で積み上げるため、LLM のコストは日次分だけです。

重大かつ新規の問題は、レポート生成のタイミングで MCP 込みの詳細調査まで自動実行されます。朝レポートを開いた時点で、問題の一覧だけでなく**「調査済みの見立て」まで揃っている**状態を目指しました。

## #5 ナレッジ: 調査で得た知見を次の調査に効かせる

{% include youtube.html id="8iUWltEskZM" %}

調査のたびに得られる知見を蓄積し、次の調査時に自動で参照させる仕組みです。「調査 → 知見の抽出 → 蓄積 → 次の調査に反映」というループを回します。

ただし、AIが抽出した知見をそのまま溜めると誤った知見も混ざります。そこで蓄積の前に**必ず人の承認を挟む**設計にしました。1クリック承認やマージ提案で、承認の手間は最小化しています。実際に rogue AP の調査で、過去の知見 (evil twin の疑い) が明示的に参照される動作を確認できています。

## #6 ベストプラクティス診断: 29ルールで設定を点検する

{% include youtube.html id="_qk5iRkDatk" %}

セキュリティと RF/無線チューニングを中心とした29項目のルールで、Central / Mist の設定が推奨構成から外れていないかを点検します。

ルールは公式ドキュメントを参照できる形で整備し、機械判定できるものは機械判定、構造的に設定が取得できないものは AI 所見として区別して表示します。rogue AP の封じ込めのような、法的な確認が必要な項目には専用の注意表示を入れています。

## #7 タグ付きClient/Device: 見たい対象だけに絞って見る

{% include youtube.html id="Cqj-3osg6P0" %}

VIPユーザーの端末や重要拠点のAPなど、注視したい対象にだけタグを付けて絞り込むビューです。タグはダッシュボード側のローカル管理で、**Central / Mist の設定には一切手を加えません**。

Client と Device では見たい観点が違うため、画面も分けています。Client は接続品質やアプリケーション別トラフィック、Device は CPU/メモリ、PoE、ポート状態といった具合です。

## **もうひとつのBYODB — ログの長期保存に振り切る**

ここまで紹介したBYODBは、AIエージェントによる調査やナレッジ蓄積が主役でした。ですが、BYODBの形は一つではありません。

もうひとつの実例が [Mist RF Dashboard](https://kshimonoj.github.io/blog/2026/07/17/mist-rf-dashboard/) です。こちらはAIをほとんど使わない代わりに、**ログをきっちり長期間保存できる仕組み**に振り切っています。トラブルが起きたときに、後から事象を時系列で追いかけやすくすることを重視した作りです。

![byodb-mist-rf-dashboard](/assets/images/byodb-mist-rf-dashboard.png)

> 同じ「BYODB」という考え方でも、AIによる分析に寄せるか、生データの保存・追跡性に寄せるかで、まったく違う形になる。どちらが正しいというより、**何を優先したいかで作りは変わる**、という一例です。

<!-- ============================================================
     BYODB OUTRO — 記事末尾の「## まとめ」セクションを丸ごと
     このブロックで置き換える(本文中のまとめ文言と重複するため)。
     ============================================================ -->
<style>
.byodb-outro{
  background:#121c26;color:#dfe9e6;
  font-family:"Zen Kaku Gothic New",sans-serif;
  width:100vw;
  margin-left:calc(50% - 50vw);
  margin-right:calc(50% - 50vw);
  margin-top:3.5em;
}
.byodb-outro-inner{max-width:760px;margin:0 auto;padding:64px 24px 56px}
.byodb-outro-eyebrow{
  font-family:"IBM Plex Mono",monospace;font-size:12px;letter-spacing:.16em;
  color:#48cfad;display:block;margin-bottom:8px;font-weight:600;
}
.byodb-outro h2{color:#fff;margin:0 0 .6em;font-size:26px;font-weight:900;line-height:1.4}
.byodb-outro p{margin:0 0 1.5em;line-height:1.95;font-size:16px}
.byodb-outro strong{font-weight:700}
.byodb-outro a{color:#48cfad}
.byodb-outro-links{display:flex;gap:14px;flex-wrap:wrap;margin:1.6em 0}
.byodb-outro-links a{
  font-family:"IBM Plex Mono",monospace;font-size:13.5px;
  border:1px solid rgba(72,207,173,.5);border-radius:10px;
  padding:12px 20px;text-decoration:none;color:#48cfad;
  transition:background .2s;display:inline-block;
}
.byodb-outro-links a:hover{background:rgba(72,207,173,.12)}
.byodb-outro-disclaimer{
  font-size:12.5px;color:#8fa1a8;border-top:1px solid #2a3947;
  padding-top:22px;margin-top:36px;line-height:1.8;
}
</style>

<footer class="byodb-outro">
  <div class="byodb-outro-inner">
    <span class="byodb-outro-eyebrow">CONCLUSION</span>
    <h2>2階建ての運用へ</h2>
    <p>Custom Dashboard は、ベンダー標準ダッシュボードの代替ではありません。その上に乗る「自分専用の視点」です。</p>
    <p>土台として Vendor Cloud が telemetry を集約・正規化し、Vendor 独自の AI Agent が分析と最適化を行い、その結果をAPIで外部に提供する。BYODBはその上に、運用者が自分の見たいものだけを最短距離で見る画面を作る。AI がある今、この2階建ての構成は現実的なコストで手が届くようになりました。</p>
    <p>あなたなら、まず何を見る画面から作りますか。</p>
    <div class="byodb-outro-links">
      <a href="https://www.youtube.com/playlist?list=PLQA3RWvztKO8">▶ YouTube 再生リスト (全7本)</a>
      <a href="https://github.com/kshimonoj/multi-network-dashboard">⌥ GitHub — multi-network-dashboard</a>
      <a href="https://github.com/kshimonoj/central-mist-webhook-to-google-sheets">⌥ GitHub — Webhook to Google Sheets</a>
      <a href="https://kshimonoj.github.io/blog/2026/07/17/mist-rf-dashboard/">◆ もうひとつのBYODB — Mist RF Dashboard</a>
    </div>
    <p class="byodb-outro-disclaimer">動画・記事内のサイト名、IPアドレス、MACアドレス等はすべてラボ/検証環境のものです。本記事は個人の技術検証であり、HPE社の公式見解や製品サポートを示すものではありません。</p>
  </div>
</footer>



