---
category: wifi
layout: post
title: "Wi-Fiサーベイツールを自分で作った — Androidで測って、ブラウザで分析する"
date: 2026-09-27
categories: wifi
tags: [wi-fi, site-survey, android, hpe-mist, hpe-aruba-central]
repo: https://github.com/kshimonoj/wifi-analyzer-mist-central
---

専用のサイトサーベイツールがあればそれがベストだが、常に持ち歩くのは不便。
さらに、実はスマホを使って、スマホ視点でのサーベイが重要なことも多いので、
自分が欲しいサーベイツールをAndroidアプリとブラウザの分析ツールの2本立てで作ってみました。

{% include youtube.html id="gcfsJenr-p4" %}

## このアプリのポイント

現場でやりたいことは単純で、フロアを歩きながらRSSIを記録して、後からマップ上で「ここが弱い」を見たいだです。

ただ、既存ツールで面倒なのはフロアマップの準備です。図面を読み込んでAPを1台ずつ配置していく作業が毎回発生します。一方で、その情報はMistにもAruba Centralにも既に入っています。サイトを選べばフロアプランもAP位置も座標付きで返ってきて、そこに自分の位置をプロットするだけで良いので、サーベイがとても楽です。
さらにサーベイ結果をエクスポートして、それを分析するツールも作っています。

## 構成

測る側と分析する側を分けています。

- **Androidアプリ**（Kotlin）— スキャンとスナップショット取得、フロアマップへの配置、ZIPエクスポート
- **分析ツール**（Python / Streamlit）— エクスポートしたZIPを受け取ってグラフ化

間をZIPファイルで繋いでいます。分析処理をスマホに載せなかったのは、グラフの試行錯誤を手元のPCで速く回したかったから。

動画の前半がAndroidアプリ、後半（2:06以降）が分析ツールの紹介です。

## 測る側 — Androidアプリ

サイトを選ぶとMist / Aruba CentralのAPIからフロアプランとAP位置を取ってきます。あとはマップを見ながら現在地のスナップショットを撮り、マップ上に配置していくだけです。GPS座標も一緒に記録することもできるようにしています。

最後にサーベイ結果をZIPで書き出します。

## 分析する側 — ブラウザのツール

ZIPをアップロードするだけで、以下が出る。

- Survey Summary（測定全体の概要）
- フロアマップ上のRSSI表示
- カバレッジ品質
- 同一チャネル干渉（Co-Channel Interference per Point）
- 未管理AP干渉（Unmanaged AP Interference per Point）
- 最適AP選択チェック（Optimal AP Selection Check）
- RSSI推移と周辺AP RSSIマトリクス

グラフにはローミングのタイミングをオレンジの破線で入れています。X軸は `HH:MM:SS` とAP名の2段にした。RSSIが落ちた点を見たときに「それはローミング直前なのか、単に遠いのか」が一目で切り分けられるようになっています。

## ソース

Androidアプリと分析ツールの両方を置いています。セットアップ手順はREADMEを参照して下さい。
[日本語README](https://github.com/kshimonoj/wifi-analyzer-mist-central/blob/main/README.ja.md)
[Android App Release](https://github.com/kshimonoj/wifi-analyzer-mist-central/releases)
