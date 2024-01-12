const crypto = require('crypto');

// ENC and IV are generated from https://www.random.org/strings/
const ENC = 'fc0hqDnTttvUsLZARlQg9BR7Yx9ewAry';
const IV = 'He5j3f47N8WYcb4D';

const ALGO = 'aes-256-cbc';

const encrypt = (text) => {
  let cipher = crypto.createCipheriv(ALGO, ENC, IV);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
};

const decrypt = (text) => {
  let decipher = crypto.createDecipheriv(ALGO, ENC, IV);
  let decrypted = decipher.update(text, 'base64', 'utf8');
  return decrypted + decipher.final('utf8');
};

module.exports = { encrypt, decrypt };
