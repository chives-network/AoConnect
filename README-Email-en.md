# **AOConnect-Email**

## Introduction

AOConnect-Email is a tool developed based on AO for managing emails, with the following key features:

1. Send Email: Supports sending encrypted emails to any AR wallet address.
   
2. Email List: Supports pagination display of emails, moving to other folders, marking as read, starring, etc.
   
3. Read Emails: Mark emails as read, reply to and forward emails, move to other folders, mark as read, star, etc.
   
4. Reply and Forward: Supports replying to or forwarding emails.
   
5. Folder Support: Starred, Spam, Trash, and directories Important, Social, Updates, Forums, Promotions.

## Email Encryption

### Current Version V1 - Symmetric Encryption

Encryption Algorithm: Utilizes AES-256-GCM symmetric encryption to encrypt the subject and content of emails separately, then stores them on the AO network.
Encryption Steps: Uses the recipient and sender addresses as input, computes the SHA-256 hash to get a HASH value, takes the first 32 bits as the KEY for AES-256-GCM encryption algorithm, generates a random IV, and the TAG as the return value of the encryption algorithm. Concatenates the 32-bit IV, the email ciphertext, and the 32-bit TAG directly to obtain the final ciphertext used. 
Encryption Scope: The encryption algorithm encrypts the Subject and Content separately, resulting in two independent ciphertexts.
Additional Notes: Version number V1 is also stored on the AO network for selecting different decryption algorithms.
Security: Anyone can decrypt the email content following the encryption steps mentioned above, so use with caution.

### Improved Version V2 - Asymmetric Encryption - Under Development

Main Improvement: Building upon the V1 algorithm, V2 incorporates asymmetric encryption to encrypt the KEY used in AES-256-GCM. The sender uses the recipient's public key and their private key to encrypt the KEY, and the recipient uses their private key to decrypt it, then uses AES-256-GCM symmetric encryption to decrypt the email content.
Additional Steps: When setting up email, users automatically generate a public-private key pair, storing the derived public key on the AO network, enabling others to send encrypted emails using this public key.
Security: Encrypting the KEY with asymmetric encryption ensures only the sender and recipient can view the email content. Each email uses a different KEY. The current solution offers extremely high security, making it safe to use.
Public-Private Keys: The public key stored on the AO network is a derived public key, not the wallet's public key, so there are no concerns regarding the exposure of the wallet's public key.

## Screenshots

1. Send Email: Supports sending encrypted emails to any AO address

<img src="https://raw.githubusercontent.com/chives-network/AoConnect/main/public/screen/Email/Email-ComposeEmail.png" width="600" />

2. Email List: Supports pagination display of emails, moving to other folders

<img src="https://raw.githubusercontent.com/chives-network/AoConnect/main/public/screen/Email/Email-List-1.png" width="600" />

3. Read Emails: Mark emails as read, reply to and forward emails

<img src="https://raw.githubusercontent.com/chives-network/AoConnect/main/public/screen/Email/Email-ReadEmail.png" width="600" />

4. Reply and Forward: Supports replying to or forwarding emails

<img src="https://raw.githubusercontent.com/chives-network/AoConnect/main/public/screen/Email/Email-ReplyEmail.png" width="600" />

5. Other Language Testing

<img src="https://raw.githubusercontent.com/chives-network/AoConnect/main/public/screen/Email/Email-ChineseList.png" width="600" />
<img src="https://raw.githubusercontent.com/chives-network/AoConnect/main/public/screen/Email/Email-Chinese-ReadEMail.png" width="600" />