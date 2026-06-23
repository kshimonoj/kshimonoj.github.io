---
layout: post
title: ContainerLabとMCP ServerでClaudeからSwitch設定
date: 2026-06-22
category: auto
repo: https://github.com/kshimonoj/container-lab
---
## 目的
今回の目的は大きく2つ

1. 仮想環境でAOS CXとJunosを動かし、相互接続などの設定を確認
2. MCPサーバを構築し、Claude Chat から AOS-CXとJunos を操作する

1に関しては、この環境で実機に近いコマンド確認もできるので、ハンズオントレーニングの資料作成にも利用できる。
2に関してはデモ動画を撮ったので、まずはその紹介から。

## Claude x MCP x AOS-CX/vJunos 連携デモ
#### デモのトポロジー
Spine&Leaf で EVPN-VXLANのFabric構成を試してみた。
デフォルトの状態はUnderlayのOSPFの設定まで。
OverlayのBGP, VXLANの設定はMCP経由でClaudeが指示する想定
![evpn-vxlan-topology](/assets/images/evpn-vxlan-topology.png)

ContainerLab（以後CLAB）の構成、特にそれぞれのスイッチの管理IPは、流石に事前にClaudeに伝える必要があるので、CLABにはMCPに渡すためのファイルをダウンロードする仕組みも取り入れている。実際のファイル例は以下。デモを簡潔にするため詳細な情報が入ってるので若干チートっぽい。。
Fabric-Demo-mcp-export
#### デモの流れ
1. CLABでUnderlayだけ設定した環境をDeploy
2. CLABの構成ファイルをダウンロード、Claudeに添付
3. Claudeで自然言語で指示
   PC1とPC3が同一セグメントのはずだがPingが通らない、修正して？みたいな感じでOK。
   ただ、それだけだとつまらないので、設定変更後の各種ステータスの確認をレポートしてもらった。（このせいで、デモの時間が大幅に長くなってしまった）
4. Claudeが設定変更、PC1→PC2のPing成功
5. Claudeが設定変更、各種ステータスを確認しレポートにまとめる

実際のレポートはこちら。見てもらうと分かるが、設定コマンド、ステータス確認のコマンドとそのアウトプットなどかなり詳細な情報がまとまっている。実際には20分程度かかったが、全て自動なので、まぁいいかなと思う。
Fabric-Demo-PC1-PC3-疎通調査レポート

#### デモ動画
早送りしてるので、動画の時間は1:40程度。
<iframe width="560" height="315" src="https://www.youtube.com/embed/EZwtsWRHc7w?si=SAPsUhtlNdomQiGI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## 解説
以下がContainer Labのアーキテクチャ図。
vJunosの制約で、bare metalにLinuxサーバをインストールする必要があるのでその点だけ注意が必要。AOS-CXのSimulator (OVA) だけであれば、ESXi上のLinuxサーバでも問題ない。
![containerlab_architecture](/assets/images/containerlab_architecture.png)
次に、vrnetlab の仕組み——「なぜ OVA が Docker コンテナとして動くのか」の図解。
![vrnetlab_mechanism](/assets/images/vrnetlab_mechanism.png)

次に、ContainerLab がどうやってノード間を「配線」しているかの図解。
![containerlab_networking](/assets/images/containerlab_networking.png)

MCPサーバとClaudeとの接続全体像
![claude_mcp_lab_connection](/assets/images/claude_mcp_lab_connection.png)
最後がMCP-Switchのプロトコル。
今回は、FastMCP の MCP Server がベンダ差を吸収し、AOS-CX は REST、vJunos は NETCONF に変換して実行している。

![mcp-switch-protocol](/assets/images/mcp-switch-protocol.png)

### 補足
もっとシンプルな環境でも試しています。
AOS-CX, Junos Switchが１台ずつで、OSPFのルーティングをMCP経由でしています。
#### デモのトポロジ
![clab-mcp-ospf-demo-topology](/assets/images/clab-mcp-ospf-demo-topology.png)

#### デモ動画
<iframe width="560" height="315" src="https://www.youtube.com/embed/e3JAAyjVO2A?si=Spb6d1KrxGalLLv9" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
