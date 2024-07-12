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

export function EncryptDataAES256GCM(text: string, key: string) {
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

export function EncryptEmailAES256GCMV1(text: string, key: string) {
    const keyHash = calculateSHA256(key)
    const iv = GetIV();
    const cipher = crypto.createCipheriv('aes-256-gcm', keyHash.slice(0, 32), iv);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag();

    return iv.toString('hex') + encrypted + tag.toString('hex');
}

export function DecryptEmailAES256GCMV1(encrypted: string, key: string) {
    try {
        const iv = encrypted.slice(0, 32);
        const tag = encrypted.slice(-32);
        const encryptedText = encrypted.slice(32, -32);
        const keyHash = calculateSHA256(key)
        const decipher = crypto.createDecipheriv('aes-256-gcm', keyHash.slice(0, 32), Buffer.from(iv, 'hex'));
        decipher.setAuthTag(Buffer.from(tag, 'hex'));
        let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
        decrypted += decipher.final('utf-8');
    
        return decrypted;
    }
    catch(error: any) {
        
        return ''
    }
}

export function EncryptEmailAddressAES256CBC(text: string, key: string) {
    const iv = Buffer.from(key.slice(0, 16), 'utf8');
    const cipher = crypto.createCipheriv('aes-256-cbc', key.slice(0, 32), iv);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    console.log("encrypted", encrypted)

    return encrypted;
}

export function DecryptEmailAddressAES256CBC(encrypted: string, key: string) {
    try {
        const iv = Buffer.from(encrypted.slice(0, 32), 'hex');
        const tag = encrypted.slice(-64);
        const encryptedText = encrypted.slice(32, -64);
    
        const hmac = crypto.createHmac('sha256', key.slice(32, 64));
        hmac.update(encryptedText);
        const calculatedTag = hmac.digest('hex');
    
        if (calculatedTag !== tag) {
            return ''
        }
    
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key.slice(0, 32), 'utf8'), iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
        decrypted += decipher.final('utf-8');
    
        return decrypted;
    }
    catch(error: any) {

        return ''
    }
}
