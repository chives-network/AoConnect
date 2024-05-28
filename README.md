# **AOConnect**

## Introduction
AOConnect is an application based on the AO Open Network, aiming to become a graphical operating system on the AO network, providing developers with the ability to build and iterate AO applications quickly. The design goal of AOConnect is to reduce the development complexity of AO network applications and provide some classic application scenarios for developers to learn and reference.

Currently in the development phase, the final stage will consider developing a decentralized instant messaging tool based on the AO network, supporting encrypted messages, groups, TOKEN distribution, exchange, staking, rewards, and more. The reference target will be DISCORD, while incorporating some features of the AO network to create an instant encrypted communication tool based on the AO and AR networks.

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

Package:
npm run export
```

## Deploy Vercel (Not Support)

[![][vercel-deploy-shield]][vercel-deploy-link]


## For Developers
You need to provide information about the following projects.

- **AO Developer's Handbook**: [Link](https://cookbook_ao.g8way.io/)
- **Command-line based client tool officially released by AO**: [Link](https://github.com/permaweb/aos/)

### The difference between AOConnect and AOS
AOS is a command-line based client software officially released by AO, with main functionalities including sending and receiving messages, loading LUA files, and executing function operations.

Inspired by the design of AOS, AOConnect abandons the command-line design style in favor of a graphical user interface. It also provides online simulation debugging and API invocation features, along with numerous examples to simplify the learning curve for developers. It is an essential tool for learning AO network development.

Developers are advised to first learn AOS to gain basic concepts and experience, and then delve into AOConnect for further exploration.

## AOConnect Main Functions
1. **Wallet**: Integrated a simplified version of an AR wallet.
2. **Learn**: Create processes, send messages, view messages. Load LUA files, integrate examples of code calls needed on the official documentation into the page, allowing developers to simulate common message function calls directly on the page.
3. **Tool**: Supports three on-chain programs, including the official demo version of a chat room, TOKEN creation, minting, transfers, and balance queries, as well as an improved version of a chat room program supporting channels, administrators, invitations, and reviews.
4. **Chat**: A decentralized prototype of an instant messaging tool, still under development.
5. **TOKEN**: Supports online creation of TOKENs, minting, transfers, balance queries, member queries, calculating total circulation, and other functions.

## AOConnect Typical Application Tools
### Chatroom
- **Function**
  1. Register
  2. Broadcast
  3. Unregister

### Token
- **Function**
  1. Create Token
  ![Create Token](https://raw.githubusercontent.com/chives-network/AoConnect/main/public/screen/TokenCreate.png)

  2. Mint Token
  3. Transfer Token
  4. Token Balances

### ChivesChat
- **Function**
  1. Chatroom support three roles: owner, admin, member.
  2. Owner: Can add or delete admins, add or delete channels, invite members (requiring user agreement), adding members, and deleting members.
  3. Admin: Approval for joining the application, inviting members (requiring user agreement), adding members, and deleting members.
  4. Member: Apply to join the chatroom, get approval from the admin, then send messages, and finally leave the chatroom.
  5. Everyone needs to apply to join the chatroom first. Once approved, they can send messages.
  6. Anyone can get channel information.
  7. Only members can get information on all members.
  8. This version of the message is public, not encrypted.

## Future Planning
Currently in the development phase, the final stage will consider developing a decentralized instant messaging tool based on the AO network, supporting encrypted messages, groups, TOKEN distribution, exchange, staking, rewards, and more. The reference target will be DISCORD, while incorporating some features of the AO network to create an instant encrypted communication tool based on the AO and AR networks.

## Contact
Email: chivescoin@gmail.com

AO Official Discord: https://discord.gg/YQXphqQnwK

<!-- LINK GROUP -->
[vercel-deploy-link]: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fchives-network/%2FAoConnect&project-name=AoConnect&repository-name=AoConnect
[vercel-deploy-shield]: https://vercel.com/button
