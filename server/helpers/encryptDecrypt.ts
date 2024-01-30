import crypto from 'crypto';

// ENC and IV are generated from https://www.random.org/strings/
const ENC: string = 'fc0hqDnTttvUsLZARlQg9BR7Yx9ewAry';
const IV: string = 'He5j3f47N8WYcb4D';

const ALGO = 'aes-256-cbc';

export const encrypt = (text: string): string => {
  let cipher = crypto.createCipheriv(ALGO, ENC, IV);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
};

export const decrypt = (text: string): string => {
  let decipher = crypto.createDecipheriv(ALGO, ENC, IV);
  let decrypted = decipher.update(text, 'base64', 'utf8');
  return decrypted + decipher.final('utf8');
};
