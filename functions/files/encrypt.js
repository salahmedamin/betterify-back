const crypto = require('crypto')
const algorithm = 'aes-256-ctr';

module.exports = (text, key, iv) => {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()])
    return encrypted.toString('base64')
}