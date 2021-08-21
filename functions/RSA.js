const crypto = require("crypto")
const _private = require("../keys/private")
const _public = require("../keys/public")

module.exports = {
    encrypt: data => {
        return crypto.publicEncrypt(
            {
                key: _public,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: "sha256",
            },
            Buffer.from(JSON.stringify(data))
        )
    },
    decrypt: data => JSON.parse(crypto.privateDecrypt(
        {
            key: _private,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        },
        data
    )
    )
}