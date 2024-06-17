# **AOConnect**

## Introduction
AOConnect is an application based on the AO Open Network, aiming to become a graphical operating system on the AO network, providing developers with the ability to build and iterate AO applications quickly. The design goal of AOConnect is to reduce the development complexity of AO network applications and provide some classic application scenarios for developers to learn and reference.

Currently in the development stage, the main focus is on visualizing and instantiating AO's official API calls, showcasing the API calls through a graphical interface. Additionally, a more powerful chat room and TOKEN functionality have been added, along with corresponding graphical interfaces. These features aim to provide developers with an intuitive learning experience, improve learning efficiency, reduce learning curves, and expand the audience of the AO community.

The final stage will consider developing a decentralized instant messaging tool based on the AO network, supporting encrypted messages, groups, TOKEN distribution, exchange, staking, rewards, and more. The reference target will be DISCORD, while incorporating some features of the AO network to create an instant encrypted communication tool based on the AO and AR networks.

The final development plan is not yet set in stone. If anyone has better ideas, we can all discuss and collaborate together.

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

## Demo Video & Site

[AOConnect Demo Video](https://www.youtube.com/watch?v=Qf-QkezSoVg)

[AOConnect Demo Site](https://aoconnect.vercel.app/)

## For Developers
  You need to provide information about the following projects.

  - **AO Developer's Handbook**: [Link](https://cookbook_ao.g8way.io/)
  - **AOS Command-line based client tool officially released by AO**: [Link](https://github.com/permaweb/aos/)

#### 1 The difference between AOConnect and AOS
  - AOS is a command-line based client software officially released by AO, with main functionalities including sending and receiving messages, loading LUA files, and executing function operations.

  - Inspired by the design of AOS, AOConnect abandons the command-line design style in favor of a graphical user interface. It also provides online simulation debugging and API invocation features, along with numerous examples to simplify the learning curve for developers. It is an essential tool for learning AO network development.

  - Developers are advised to first learn AOS to gain basic concepts and experience, and then delve into AOConnect for further exploration.

#### 2 Data storage
  - This project is a frontend-only project without using a backend. The storage functionality utilized in the project is the browser's LocalStorage.

#### 3 @permaweb/aoconnect (0.0.53)
  - Currently, I am using version 0.0.53 of @permaweb/aoconnect. In the system, I need to use the Node version of @permaweb/aoconnect, but for some reason, it always loads the browser version of @permaweb/aoconnect. Therefore, I saved the @permaweb/aoconnect files saved as 'scripts/@permaweb/aoconnect' and forced it to use the Node mode. If anyone can solve this issue, I would be very grateful.

## AOConnect Main Functions
  1. **Wallet**: Integrated a simplified version of an AR wallet.

  2. **Learn**: Create processes, send messages, view messages. Load LUA files, integrate examples of code calls needed on the official documentation into the page, allowing developers to simulate common message function calls directly on the page.

  <img src="https://raw.githubusercontent.com/chives-network/AoConnect/main/public/screen/Learn.png" width="600" />

  3. **Tool**: Supports three on-chain programs, including the official demo version of a chat room, TOKEN creation, minting, transfers, and balance queries, as well as an improved version of a chat room program supporting channels, administrators, invitations, and reviews.
  please go to [AOConnect Application Simulation] section.

  4. **Chat**: A decentralized prototype of an instant messaging tool, still under development.
  [Not Ready]

  5. **TOKEN**: Supports online creation of TOKENs, minting, transfers, balance queries, member queries, calculating total circulation, and other functions.

  <img src="https://raw.githubusercontent.com/chives-network/AoConnect/main/public/screen/TokenList.png" width="600" />

## AOConnect Application Simulation
#### Chatroom
- **Function**
  1. Register
  2. Broadcast
  3. Unregister

  Simulate Chatroom lua module (This is not a specific function, but a simulator that simulates all relevant functions):

  <img src="https://raw.githubusercontent.com/chives-network/AoConnect/main/public/screen/SimulatedChatroom.png" width="600" />

#### Token
- **Function**
  1. Token Balances
  2. Create Token
  3. Mint Token
  4. Transfer Token
  
  Simulate Token lua module (This is not a specific function, but a simulator that simulates all relevant functions):

  <img src="https://raw.githubusercontent.com/chives-network/AoConnect/main/public/screen/SimulatedToken.png" width="600" />

#### ChivesChat
- **Function**
  1. Chatroom support three roles: owner, admin, member.
  2. Owner: Can add or delete admins, add or delete channels, invite members (requiring user agreement), adding members, and deleting members.
  3. Admin: Approval for joining the application, inviting members (requiring user agreement), adding members, and deleting members.
  4. Member: Apply to join the chatroom, get approval from the admin, then send messages, and finally leave the chatroom.
  5. Everyone needs to apply to join the chatroom first. Once approved, they can send messages.
  6. Anyone can get channel information.
  7. Only members can get information on all members.
  8. This version of the message is public, not encrypted.
  Simulate ChivesChat lua module (This is not a specific function, but a simulator that simulates all relevant functions):
  <img src="https://raw.githubusercontent.com/chives-network/AoConnect/main/public/screen/SimulatedChivesChat.png" width="600" />

## Future Planning
Currently in the development phase, the final stage will consider developing a decentralized instant messaging tool based on the AO network, supporting encrypted messages, groups, TOKEN distribution, exchange, staking, rewards, and more. The reference target will be DISCORD, while incorporating some features of the AO network to create an instant encrypted communication tool based on the AO and AR networks.

## Contact
Email: chivescoin@gmail.com

AO Official Discord: https://discord.gg/YQXphqQnwK

<!-- LINK GROUP -->
[vercel-deploy-link]: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fchives-network/%2FAoConnect&project-name=AoConnect&repository-name=AoConnect
[vercel-deploy-shield]: https://vercel.com/button
