---
layout: post
title: "MistのSLEをMacbookのメニューバーAppで常に確認"
date: 2026-06-22
category: auto
repo: https://github.com/kshimonoj/mist-menubar-app
---
HPE Mist の便利な機能の1つがSLEによるWi-Fi品質の可視化です。（SLE = Service Levels Expectation）
Mist Dashboard で見るとこんな感じです。
![mist-sle](/assets/images/mist-sle.png)

Mistの大きな特徴の1つにAPIで全ての情報が取れる、といった点もあります。
だったら、このSLEをMist Dashboardにアクセスせずとも、常に見れる状態にしちゃえばいいなと。そこで色々試行錯誤した結果、Macbookのメニューバーで見せちゃえばいいなという結論に至りました。
作ってみると、かなり有益で、Dashboardにアクセスする機会が劇的に減ってしまいました。。。

![menubar-app-2-ezgif.com-gif-maker](/assets/images/menubar-app-2-ezgif.com-gif-maker.gif)

ソースはGithubをご覧ください。
そこにもありますが、以下から最新のdmgファイルをダウンロードして誰でも利用できます。
https://github.com/kshimonoj/mist-menubar-app/releases

一点注意が必要で、自作アプリで未登録なので、インストール後以下のコマンドを入力する必要があります。
あくまで個人的に作成したアプリなので、利用は自己責任で。

``` bash
xattr -dr com.apple.quarantine /Applications/Mist.app 
```
