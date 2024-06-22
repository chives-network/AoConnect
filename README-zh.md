# **AOConnect**

## 简介
AOConnect是一个基于AO Network的应用程序，旨在成为AO网络上的图形操作系统，为开发人员提供快速构建和迭代AO应用程序的能力。

AOConnect的设计目标是降低AO网络应用程序的开发复杂性，并为开发人员提供一些经典的应用场景供学习和参考。

目前处于开发阶段，主要关注于可视化和实例化AO的官方API调用，通过图形界面展示API调用。此外，还添加了更强大的聊天室和TOKEN功能，以及相应的图形界面。这些功能旨在为开发人员提供直观的学习体验，提高学习效率，降低学习曲线，并扩大AO社区的受众群体。

最终阶段将考虑开发一个基于AO网络的去中心化即时通讯工具，支持点对点加密、群组、TOKEN分发、交换、质押、奖励、空投等功能。参考目标将是DISCORD，同时结合AO网络的一些特性，创建一个基于AO和AR网络的即时加密通讯工具。这一阶段的参照目标为Discord, Matrix, SnapChat等.

最终的开发计划尚未最终确定。如果有更好的想法，我们可以一起讨论和合作。

## 要求
- [NodeJS](https://nodejs.org) 版本 18.17+

## 安装
```bash
开发:
git clone https://github.com/chives-network/AoConnect
cd AoConnect
npm run dev

构建:
npm run build
```

## 部署至 Vercel

[![][vercel-deploy-shield]][vercel-deploy-link]

## 演示视频 & 网站

[AOConnect 演示视频](https://www.youtube.com/watch?v=Qf-QkezSoVg)

[AOConnect 演示站点](https://ao-connect.vercel.app/)

## 对开发人员
  你需要提供以下项目的信息。

  - **AO开发手册**: [链接](https://cookbook_ao.g8way.io/)
  - **AO官方发布的基于命令行的AOS客户端工具**: [链接](https://github.com/permaweb/aos/)

#### 1 AOConnect 和 AOS 的区别
  - AOS是AO官方发布的基于命令行的客户端软件，主要功能包括发送和接收消息、加载LUA文件以及执行功能操作。

  - 受AOS设计启发，AOConnect放弃了命令行设计风格，转而采用图形用户界面。它还提供在线模拟调试和API调用功能，以及许多示例来简化开发人员的学习曲线。这是学习AO网络开发的重要工具。

  - 建议开发人员先学习AOS以获得基本概念和经验，然后深入研究AOConnect进行进一步探索。

#### 2 数据存储
  - 该项目是仅前端项目，不使用后端。项目中使用的存储功能是浏览器的LocalStorage。

#### 3 @permaweb/aoconnect (0.0.53)
  - 目前正在使用@permaweb/aoconnect的0.0.53版本。在系统中，需要使用@permaweb/aoconnect的Node版本，但出于某种原因，它总是加载浏览器版本的@permaweb/aoconnect。因此，我们将@permaweb/aoconnect文件保存为'scripts/@permaweb/aoconnect'并强制其使用Node模式。如果有人能解决这个问题，我将非常感激。

## AOConnect 主要功能
  1. **钱包**: 集成了简化版本的AR钱包。

  2. **学习**: 创建流程，发送消息，查看消息。加载LUA文件，将官方文档中所需的代码调用示例整合到页面中，允许开发人员直接在页面上模拟常见的消息功能调用。

  <img src="https://raw.githubusercontent.com/chives-network/AoConnect/main/public/screen/V0.1/Learn.png" width="600" />

  3. **工具**: 支持三个链上程序，包括官方演示版本的聊天室、TOKEN创建、铸造、转账和余额查询，以及支持频道、管理员、邀请和审核的改进版本的聊天室程序。
  请查看[AOConnect 应用程序模拟]部分。

  4. **聊天**: 一个去中心化即时通讯工具的原型，仍在开发中。
  [未准备就绪]

  5. **TOKEN**: 支持在线创建TOKEN、铸造、转账、余额查询、成员查询、计算总流通量等功能。

  <img src="https://raw.githubusercontent.com/chives-network/AoConnect/main/public/screen/Token/AllHolders.png" width="600" />

## AOConnect 应用程序模拟
#### 聊天室
- **功能**
  1. 注册
  2. 广播
  3. 注销

  模拟聊天室lua模块（这不是一个具体功能，而是模拟所有相关功能）：

  <img src="https://raw.githubusercontent.com/chives-network/AoConnect/main/public/screen/V0.1/SimulatedChatroom.png" width="600" />

#### Token
- **功能**
  1. Token余额
  2. 创建Token
  3. 铸造Token
  4. 转账Token
  
  模拟Token lua模块（这不是一个具体功能，而是模拟所有相关功能）：

  <img src="https://raw.githubusercontent.com/chives-network/AoConnect/main/public/screen/V0.1/SimulatedToken.png" width="600" />

#### ChivesChat
- **功能**
  1. 聊天室支持三种角色：所有者、管理员、成员。
  2. 所有者：可以添加或删除管理员、添加或删除频道、邀请成员（需要用户同意）、添加成员和删除成员。
  3. 管理员：加入应用程序的批准、邀请成员（需要用户同意）、添加成员和删除成员。
  4. 成员：申请加入聊天室，获得管理员批准后，发送消息，最后离开聊天室。
  5. 每个人都需要先申请加入聊天室。一旦获得批准，他们就可以发送消息。
  6. 任何人都可以获取频道信息。
  7. 只有成员可以获取所有成员的信息。
  8. 此版本的消息是公开的，不加密。
  模拟ChivesChat lua模块（这不是一个具体功能，而是模拟所有相关功能）：
  <img src="https://raw.githubusercontent.com/chives-network/AoConnect/main/public/screen/V0.1/SimulatedChivesChat.png" width="600" />

## 未来规划
最终阶段将考虑开发一个基于AO网络的去中心化即时通讯工具，支持点对点加密、群组、TOKEN分发、交换、质押、奖励、空投等功能。参考目标将是DISCORD，同时结合AO网络的一些特性，创建一个基于AO和AR网络的即时加密通讯工具。这一阶段的参照目标为Discord, Matrix, SnapChat等.

目前项目所涉及的功能比较繁杂一些，在启动即时通讯工具开发的时候，将会额外启动一个即时通讯项目，目前项目将会得到保留，以便于供开发人员学习AO网络使用。

## 联系方式

Discord：https://discord.gg/aAkMH9Q3AY

<!-- 链接组 -->
[vercel-deploy-link]: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fchives-network/%2FAoConnect&project-name=AoConnect&repository-name=AoConnect
[vercel-deploy-shield]: https://vercel.com/button