import crypto from 'crypto';
import authConfig from 'src/configs/auth'


// @ts-ignore
import { v4 } from 'uuid'

export function GetIV() {
    const iv = crypto.randomBytes(16);

    return iv;
}

export function calculateAES256GCMKey(iv: string, uuid: string) {
    const jwkString = "UUID";
    const key = calculateSHA256(iv + uuid + jwkString);

    return key;
}


export function EncryptDataWithKey(FileContent: string, FileName: string, walletKey: any) {
    const iv = GetIV();
    const uuid = v4() as string;
    const key = calculateSHA256(iv.toString('hex') + uuid + walletKey.d);
    const keyBuffer = Buffer.from(key, 'hex');
    const cipher = crypto.createCipheriv('aes-256-gcm', keyBuffer, iv);
    let encryptedContent = cipher.update(FileContent, 'utf-8', 'hex');
    encryptedContent += cipher.final('hex');
    const tag = cipher.getAuthTag();

    const FileEncryptKey = iv.toString('hex') + tag.toString('hex') + key;
    const iv2 = GetIV();
    const uuid2 = v4() as string;
    const key2 = calculateSHA256(iv2.toString('hex') + uuid2 + walletKey.d);
    const keyBuffer2 = Buffer.from(key2, 'hex');
    const cipher2 = crypto.createCipheriv('aes-256-gcm', keyBuffer2, iv2);
    let encryptedKey = cipher2.update(FileEncryptKey, 'utf-8', 'hex');
    encryptedKey += cipher2.final('hex');
    const tag2 = cipher2.getAuthTag();

    //FileName
    const cipherFileName = crypto.createCipheriv('aes-256-gcm', keyBuffer2, iv2);
    let encryptedFileName = cipherFileName.update(FileName, 'utf-8', 'hex');
    encryptedFileName += cipherFileName.final('hex');
    const tagFileName = cipherFileName.getAuthTag();

    const FileEncrypt: any = {};
    FileEncrypt['Cipher-ALG'] = "AES256-GCM";

    //FileEncrypt['Cipher-IV'] = iv.toString('hex');
    //FileEncrypt['Cipher-TAG'] = tag.toString('hex');
    //FileEncrypt['Cipher-UUID'] = uuid;
    //FileEncrypt['Cipher-key'] = keyBuffer.toString('hex');


    FileEncrypt['File-Name']   = encryptedFileName;
    FileEncrypt['File-Hash']   = calculateSHA256(encryptedContent);
    FileEncrypt['Cipher-IV']    = iv2.toString('hex');
    FileEncrypt['Cipher-TAG']   = tag2.toString('hex');
    FileEncrypt['Cipher-UUID']  = uuid2;
    FileEncrypt['Cipher-KEY']   = encryptedKey;
    FileEncrypt['Cipher-CONTENT'] = encryptedContent;
    FileEncrypt['Cipher-TAG-FileName']   = tagFileName.toString('hex');
    FileEncrypt['Content-Type'] = "<application/octet-stream>";
    FileEncrypt['Entity-Type']  = "File";
    FileEncrypt['Unix-Time']    = String(Date.now());
    FileEncrypt['App-Name']     = authConfig['App-Name'];
    FileEncrypt['App-Version']  = authConfig['App-Version'];

    return FileEncrypt;
}

export function EncryptDataAES256GCM(text: string, IV: Buffer, key: string) {
    const iv = GetIV();
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag();

    return { iv: iv.toString('hex'), encrypted, tag: tag.toString('hex') };
}

export function DecryptDataAES256GCM(encrypted: string, iv: string, tag: string, key: string) {
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'hex'));
    decipher.setAuthTag(Buffer.from(tag, 'hex'));
    let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');

    return decrypted;
}

export function calculateSHA256(input: string) {
  const hash = crypto.createHash('sha256');
  hash.update(input);
  
  return hash.digest('hex');
}

