---
layout: post
title: "EVPN-VXLAN Fabric 入門メモ"
date: 2026-06-22
category: auto
---

ContainerLab で EVPN-VXLAN を検証したときのメモ。

## ポイント
- BGP neighbor に `send-community extended` が必須
- これが無いと Type-3 ルートは届くが RT で import できず VTEP が張れない
  構成図
  ![Pasted image 20260622152356](/assets/images/Pasted%20image%2020260622152356.png)


（画像サンプル: Obsidian記法のまま書いてOK。Publish時に変換される）
