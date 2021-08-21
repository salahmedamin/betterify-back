const crypto = require('crypto')
const algorithm = 'aes-256-ctr';

module.exports = (text, key, iv) => {
    try {
        const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
        const decrpyted = Buffer.concat([decipher.update(Buffer.from(text, 'base64')), decipher.final()]);
        return decrpyted.toString();

    }
    catch (e) {
        console.log(e.message)
        return { error: true,message: e.message }
    }
}