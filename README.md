# **AOConnect**

## Introduction
AOConnect 是基于AO开放网络的一款应用,旨在成为AO网络上面一款图形化的操作系统,为开发人员提供构建和快速迭代AO应用的能力. AOConnect的设计目标是降低AO网络的开发难度,并且提供一些经典应用案例,用于开发者学习和参考.
目前还处于开发阶段,最终阶段会考虑开发一款基于AO网络的去中心化即时通讯工具,支持加密消息,群组,TOKEN分发,交换,质押和奖励等.参考的目标会以DISCORD为目标,同时加入一些AO网络的一些特性,形成基于AO和AR网络的一款去中心化即时通讯加密工具.


## Requirements

- [NodeJS](https://nodejs.org) version 18.17 +


## Install
```
Dev:

git clone https://github.com/chives-network/AoConnect
cd AoConnect
npm run dev

Build:
npm run build

Package:
npm run export
```

## For Developers

你需要提供了解以下项目

AO开发人员手册:
https://cookbook_ao.g8way.io/

基于命令行的客户端工具,AO官方发布:
https://github.com/permaweb/aos/

### AOConnect 和 AOS 的区别
AOS是AO官方发布的一款基于命令行的客户端软件,主要功能是收发消息,加载LUA文件,执行函数操作等.
AOConnect参考了AOS的设计, 放弃了命令行的设计风格, 转而采用图形化的操作界面, 同时提供了在线模拟调试和调用API的功能, 提供了很多例子, 简化了开发者的学习难度, 是你学习AO网络开发必不可少的一款工具.
建议开发者,先学习AOS,有了基本概念和经验之后,再来研究一下AOConnect


## AOConnect 的主要功能
1 钱包: 集成了一个简化版本的AR钱包
2 学习中心: 创建进程,发送消息,查看消息.加载LUA文件,把官方文档上面需要使用代码调用的示例集成到页面里面,让开发直接在页面里面就可以模拟常用消息函数调用.
3 模拟工具: 支持三个链上程序,分别是官方演示版本的聊天室, TOKEN的创建,铸造,转账和查询余额, 以及一个支持频道,管理员,邀请,审核的改进版本的聊天室程序.
4 聊天:一个去中心化的即时通讯工具的原型,还在开发当中.
5 TOKEN:支持在线创建TOKEN,铸造,转账,查询余额,查询成员,计算总流通量等功能.

## AOConnect 典型应用模拟器
### Chatroom
-- Function
-- 1. Register
-- 2. Broadcast
-- 3. Unregister

### Token
-- Function
-- 1. Create Token
-- 2. Mint Token
-- 3. Transfer Token
-- 4. Token Balances

### ChivesChat
-- Function
-- 1. Chatroom support three roles: owner, admin, member.
-- 2. Owner: Can add or delete admins, add or delete channels, invite members (requiring user agreement), adding members, and deleting members.
-- 3. Admin: Approval for joining the application, inviting members (requiring user agreement), adding members, and deleting members.
-- 4. Member: Apply to join the chatroom, get approval from the admin, then send messages, and finally leave the chatroom.
-- 5. Everyone needs to apply to join the chatroom first. Once approved, they can send messages.
-- 6. Anyone can get channel information.
-- 7. Only members can get information on all members.
-- 8. This version of the message is public, not encrypted.



