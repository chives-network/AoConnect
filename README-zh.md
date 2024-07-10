# **AOConnect**

## 简介
AOConnect是基于AO Open Network的应用程序，旨在成为AO网络上的图形操作系统，为开发人员提供快速构建和迭代AO应用程序的能力。AOConnect的设计目标是降低AO网络应用程序的开发复杂性，并为开发人员提供一些经典的应用场景以供学习和参考。

## **邮件**

邮件是基于AO开发的管理电子邮件的工具，具有以下关键功能：

1. 发送邮件：支持向任何AO地址发送加密邮件。
   
2. 邮件列表：支持对邮件进行分页显示，移动到其他文件夹，标记为已读，加星标等。
   
3. 阅读邮件：标记邮件为已读，回复和转发邮件，移动到其他文件夹，标记为已读，加星标等。
   
4. 回复和转发：支持回复或转发邮件。
   
5. 文件夹支持：星标、垃圾邮件、回收站以及目录重要、社交、更新、论坛、促销。

<img src="https://raw.githubusercontent.com/chives-network/AoConnect/main/public/screen/Email/Email-List-1.png" width="600" />

## **Token**

Token是基于AO开发的管理TOKEN的工具，具有以下主要功能：

1. 发行TOKEN：支持设置TOKEN的标志、名称、总量等信息。
   
2. 铸造TOKEN：为现有TOKEN铸造一定数量的TOKEN。
   
3. 空投TOKEN：支持一次性向多个地址和金额发送TOKEN。
   
4. 所有TOKEN交易记录：查看整个TOKEN的所有发送和接收记录。
   
5. 我的交易记录：当前用户的所有交易记录。
   
6. 发送记录。
   
7. 接收记录。
   
8. 所有持有者：列出所有持有当前TOKEN的地址和金额。
   
9. 发送TOKEN：将TOKEN发送到外部。
   
10. 支持在AO链上添加所有TOKEN。
   
11. 支持将外部TOKEN加入书签。

<img src="https://raw.githubusercontent.com/chives-network/AoConnect/main/public/screen/Token/TokenSummary.png" width="600" />

<img src="https://raw.githubusercontent.com/chives-network/AoConnect/main/public/screen/Token/AllHolders.png" width="600" />

## **聊天**

Chat是基于AO构建的聊天工具，具有以下主要功能：

1. 创建聊天服务器
2. 管理频道，包括添加频道、编辑频道、删除频道。
3. 管理用户，包括邀请、批准。
4. 参与聊天
5. 设置管理员，包括添加管理员、删除管理员。

<img src="https://raw.githubusercontent.com/chives-network/AoConnect/main/public/screen/Chat/ChatList.png" width="600" />

<img src="https://raw.githubusercontent.com/chives-network/AoConnect/main/public/screen/Chat/ChatSummary.png" width="600" />

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

## 部署到Vercel

[![][vercel-deploy-shield]][vercel-deploy-link]

## 联系方式

Discord：https://discord.gg/aAkMH9Q3AY

<!-- LINK GROUP -->
[vercel-deploy-link]: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fchives-network/%2FAoConnect&project-name=AoConnect&repository-name=AoConnect
[vercel-deploy-shield]: https://vercel.com/button