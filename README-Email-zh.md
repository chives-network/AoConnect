# **AOConnect-Email**

## 简介

AOConnect-Email是基于AO开发的一款管理Email的工具,主要功能有:

1 发送Email, 支持给任何AO地址发送加密邮件

2 邮件列表, 支持邮件分页显示, 移动到其它文件夹, 标记为已读, 加星等

3 阅读邮件, 标记邮件为已读状态, 回复和转发邮件, 移动到其它文件夹, 标记为已读, 加星等

4 回复和转发, 支持对邮件进行回复或转发操作

5 支持文件夹: Starred, Spam, Trash, 和目录Important, Socail, Updates, Forums, Promotions

## 邮件加密

### 当前版本V1-对称加密

加密算法: 采用AES-256-GCM对称加密方法,对邮件的主题和内容进行分别加密,然后存储到AO网络.
加密步骤: 使用收件人和发送人地址做为输入值,然后进行SHA-256得到HASH值,然后取前32位做为AES-256-GCM加密算法的KEY,IV为随机生成,TAG为加密算法返回值.把32位的IV,邮件密文和32位的TAG进行直接拼接,得到最后使用的密文. 
加密范围: 加密算法会对Subject和Content进行分别加密,所以会有两个独立的密文.
额外说明: 版本号V1也会存储在AO网络,用于选择不同的解密算法.
安全性: 任何人可以按上述加密步骤进行解密出邮件内容,谨慎使用.

### 改进版本V2-非对称加密-正在开发中
主要改进: 在V1算法的基础上面,采用非对称加密算法加密AES-256-GCM中使用的KEY, 发送人使用收件人的公钥和发送人的私钥来加密KEY, 然后收件人使用自己的私钥进行解密,然后得到KEY,再使用AES-256-GCM对称加密方法去解密邮件内容.
增加步骤: 用户在开通邮件的时候,会自动派生出一对公私钥,然后把这个派生出来的公钥存储在AO网络,这样就允许其它人可以使用这个公钥进行发送加密邮件.
安全性: 使用非对称加密算法加密KEY,仅发送人和收件人可以看到邮件内容. 每一封邮件都会使用不同的KEY. 目前方案安全性极高, 可以放心使用.
公钥私钥: 存储在AO网络上面的公钥是派生公钥,并不是钱包的公钥,所以不用担心钱包公钥公开的问题.

## 截屏说明

1 发送Email, 支持给任何AO地址发送加密邮件

<img src="https://raw.githubusercontent.com/chives-network/AoConnect/main/public/screen/Email/Email-ComposeEmail.png" width="600" />

2 邮件列表, 支持邮件分页显示, 移动到其它文件夹

<img src="https://raw.githubusercontent.com/chives-network/AoConnect/main/public/screen/Email/Email-List-1.png" width="600" />

3 阅读邮件, 标记邮件为已读状态, 回复和转发邮件

<img src="https://raw.githubusercontent.com/chives-network/AoConnect/main/public/screen/Email/Email-ReadEmail.png" width="600" />

4 回复和转发, 支持对邮件进行回复或转发操作

<img src="https://raw.githubusercontent.com/chives-network/AoConnect/main/public/screen/Email/Email-ReplyEmail.png" width="600" />

5 其它语言测试

<img src="https://raw.githubusercontent.com/chives-network/AoConnect/main/public/screen/Email/Email-ChineseList.png" width="600" />
<img src="https://raw.githubusercontent.com/chives-network/AoConnect/main/public/screen/Email/Email-Chinese-ReadEMail.png" width="600" />
