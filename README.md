# **AOConnect**

## Introduction
AOConnect is an application based on the AO Open Network, aiming to become a graphical operating system on the AO network, providing developers with the ability to build and iterate AO applications quickly. The design goal of AOConnect is to reduce the development complexity of AO network applications and provide some classic application scenarios for developers to learn and reference.


## **Email**

Email is a tool developed based on AO for managing emails, with the following key features:

1. Send Email: Supports sending encrypted emails to any AO address.
   
2. Email List: Supports pagination display of emails, moving to other folders, marking as read, starring, etc.
   
3. Read Emails: Mark emails as read, reply to and forward emails, move to other folders, mark as read, star, etc.
   
4. Reply and Forward: Supports replying to or forwarding emails.
   
5. Folder Support: Starred, Spam, Trash, and directories Important, Social, Updates, Forums, Promotions.

<img src="https://raw.githubusercontent.com/chives-network/AoConnect/main/public/screen/Email/Email-List-1.png" width="600" />


## **Token**

Token is a tool developed based on AO for managing TOKENs, with the following main functionalities:

1. Issue TOKEN: Support setting logo, name, total amount, and other information for the TOKEN.
   
2. Mint TOKEN: Mint a certain quantity of TOKENs for existing TOKENs.
   
3. Airdrop TOKEN: Support sending TOKENs to multiple addresses and amounts at once.
   
4. All TOKEN transaction records: View all send and receive records of the entire TOKEN.
   
5. My transaction records: All transaction records of the current user.
   
6. Send records.
   
7. Receive records.
   
8. All holders: List all addresses and amounts holding the current TOKEN.
   
9. Send TOKEN: Send TOKEN externally.
   
10. Support adding all TOKENs on the AO chain.
   
11. Support bookmarking external TOKENs.

<img src="https://raw.githubusercontent.com/chives-network/AoConnect/main/public/screen/Token/TokenSummary.png" width="600" />

<img src="https://raw.githubusercontent.com/chives-network/AoConnect/main/public/screen/Token/AllHolders.png" width="600" />


## **Chat**

Chat is a tool for Chat built on AO, with the following main functions:

1. Create a Chat Server
2. Manage Channels, including add channel, edit channel, delete channel.
3. Manage Users, including invite, approval.
4. Engage in Chatting
5. Set Administrators, including add admin, del admin.

<img src="https://raw.githubusercontent.com/chives-network/AoConnect/main/public/screen/Chat/ChatList.png" width="600" />

<img src="https://raw.githubusercontent.com/chives-network/AoConnect/main/public/screen/Chat/ChatSummary.png" width="600" />


## Requirements
- [NodeJS](https://nodejs.org) version 18.17 +

## Install
```bash
Dev:
git clone https://github.com/chives-network/AoConnect
cd AoConnect
npm run dev

Build:
npm run build
```

## Deploy Vercel

[![][vercel-deploy-shield]][vercel-deploy-link]


## Contact

Discord：https://discord.gg/aAkMH9Q3AY

<!-- LINK GROUP -->
[vercel-deploy-link]: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fchives-network/%2FAoConnect&project-name=AoConnect&repository-name=AoConnect
[vercel-deploy-shield]: https://vercel.com/button
